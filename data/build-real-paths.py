#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Journey Atlas · 真实铁路轨迹预计算（离线 build 脚本）

对 travel-log.json 里每条 kind=='rail' 的行程，用 BRouter 公共路由服务器
(brouter.de) + 自定义 "rail-only" profile（只允许走 railway=rail / light_rail /
narrow_gauge，禁地铁/有轨电车/公路），路由出**真实 OSM 铁轨折线**，
Douglas-Peucker 简化后写入：
  - data/rail-paths.json       （权威数据）
  - data/rail-paths-data.js    （window.RAIL_PATHS，给 file:// 直接打开 index.html 用）

设计要点：
  - 城市坐标复用 app.js 的 CITY 表（同一真源，不另立坐标），作为路由起讫种子；
    rail-only profile 会把种子吸附到最近的干线铁轨上（已验证 北京↔上海≈1327km，
    与京沪高铁实际 1318km 几乎一致）。
  - 按**无向城市对**存储（北京→上海 与 上海→北京 共用一条），运行时按 sorted 取键、
    必要时反转方向。
  - 路由失败的段记录在 "failed"，运行时回退为大圆弧（绝不静默伪造）。

依赖：联网访问免费的 brouter.de。幂等，可重复运行。
用法：  python3 data/build-real-paths.py
"""
import json, re, os, sys, math, time, urllib.request, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
APP_JS = os.path.join(HERE, "..", "app.js")
LOG = os.path.join(HERE, "travel-log.json")
OUT_JSON = os.path.join(HERE, "rail-paths.json")
OUT_JS = os.path.join(HERE, "rail-paths-data.js")
BROUTER = "https://brouter.de/brouter"
RDP_EPS = 0.002          # 简化容差(度)，约 220m，国家级缩放下保形且大幅减点
SLEEP = 2.5              # 每次请求间隔，对公共服务器友好
RETRY = 2

RAIL_PROFILE = """---context:global
assign downhillcost 0
assign downhillcutoff 1.5
assign uphillcost 0
assign uphillcutoff 1.5
---context:way
assign turncost 0
assign initialcost 0
assign costfactor
  switch railway=rail|light_rail|narrow_gauge 1
  100000
---context:node
assign initialcost 0
"""


def load_city():
    """从 app.js 解析 CITY 表 -> {name: (lon, lat)}（同一真源）。"""
    txt = open(APP_JS, encoding="utf-8").read()
    m = re.search(r"const CITY\s*=\s*\{(.*?)\n\};", txt, re.S)
    if not m:
        sys.exit("无法在 app.js 找到 CITY 表")
    city = {}
    for name, lat, lng in re.findall(
        r'"([^"]+)":\s*\{\s*lat:\s*(-?[\d.]+),\s*lng:\s*(-?[\d.]+)\s*\}', m.group(1)
    ):
        city[name] = (float(lng), float(lat))
    return city


def rail_pairs():
    """travel-log.json 里所有 rail 段，去重成无向城市对。"""
    d = json.load(open(LOG, encoding="utf-8"))
    recs = d if isinstance(d, list) else d.get("records", d)
    pairs = set()
    for r in recs:
        if r.get("kind") == "rail":
            o, dd = r.get("origin"), r.get("destination")
            if o and dd and o != dd:
                pairs.add(tuple(sorted((o, dd))))
    return sorted(pairs)


def upload_profile():
    req = urllib.request.Request(
        BROUTER + "/profile", data=RAIL_PROFILE.encode("utf-8"), method="POST"
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)["profileid"]


def route(pid, a, b):
    ll = f"{a[0]},{a[1]}|{b[0]},{b[1]}"
    url = f"{BROUTER}?lonlats={urllib.parse.quote(ll)}&profile={pid}&alternativeidx=0&format=geojson"
    with urllib.request.urlopen(url, timeout=120) as r:
        raw = r.read().decode("utf-8")
    if not raw.lstrip().startswith("{"):
        raise RuntimeError(raw.strip()[:100])          # e.g. "no track found at pass=0"
    d = json.loads(raw)
    if "features" not in d or not d["features"]:
        raise RuntimeError(str(d)[:100])
    f = d["features"][0]
    coords = [[round(c[0], 5), round(c[1], 5)] for c in f["geometry"]["coordinates"]]
    km = round(int(f["properties"]["track-length"]) / 1000, 1)
    return coords, km


# ---- Douglas-Peucker 简化（经纬度平面近似，可视化足够） ----
def _perp(p, a, b):
    (px, py), (ax, ay), (bx, by) = p, a, b
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return math.hypot(px - ax, py - ay)
    return abs(dy * px - dx * py + bx * ay - by * ax) / math.hypot(dx, dy)


def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    a, b = pts[0], pts[-1]
    dmax, idx = 0.0, 0
    for i in range(1, len(pts) - 1):
        d = _perp(pts[i], a, b)
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        return rdp(pts[: idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [a, b]


def main():
    sys.setrecursionlimit(20000)
    city = load_city()
    pairs = rail_pairs()
    print(f"待路由无向铁路段：{len(pairs)} 条")
    pid = upload_profile()
    print(f"BRouter profile = {pid}")

    out = {
        "source": "brouter.de + 自定义 rail-only profile (railway=rail|light_rail|narrow_gauge)",
        "note": "真实 OSM 铁轨折线；坐标 [lon,lat]；无向城市对为键(sorted)，运行时按需反向；RDP eps≈220m",
        "legs": {},
        "failed": [],
    }
    for a, b in pairs:
        key = "→".join((a, b))
        if a not in city or b not in city:
            out["failed"].append({"pair": [a, b], "reason": "缺城市坐标"})
            print(f"SKIP {key}: 缺城市坐标", file=sys.stderr)
            continue
        ok = False
        for attempt in range(RETRY + 1):
            try:
                coords, km = route(pid, city[a], city[b])
                coords = rdp(coords, RDP_EPS)
                out["legs"][key] = {"length_km": km, "pts": len(coords), "coords": coords}
                print(f"OK   {key}: {km}km, {len(coords)}pts")
                ok = True
                break
            except Exception as e:
                if attempt < RETRY:
                    time.sleep(SLEEP * 2)
                else:
                    out["failed"].append({"pair": [a, b], "reason": str(e)})
                    print(f"FAIL {key}: {e}", file=sys.stderr)
        time.sleep(SLEEP)

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    with open(OUT_JS, "w", encoding="utf-8") as f:
        f.write("// 自动生成：data/build-real-paths.py。真实铁路轨迹，供 file:// 直接打开时用。\n")
        f.write("window.RAIL_PATHS = ")
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")

    total_pts = sum(v["pts"] for v in out["legs"].values())
    print(f"\n写出 {OUT_JSON} 与 {OUT_JS}")
    print(f"成功 {len(out['legs'])} 段 / 失败 {len(out['failed'])} 段 / 共 {total_pts} 个点")
    if out["failed"]:
        print("失败段（运行时回退大圆弧）：", [f["pair"] for f in out["failed"]])


if __name__ == "__main__":
    main()
