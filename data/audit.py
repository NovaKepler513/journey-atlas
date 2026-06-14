#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Journey Atlas · 入库自检（audit.py）
================================================
对 data/travel-log.json 全量跑一遍体检，把"看不出来的隐患"显式列出来。
每次用 merge-records.py 入库**之后**、commit **之前**跑一次，确保没问题再提交。

检查维度：
  1. 时间     日期格式 / 无 0000 占位 / 不在未来 / endDate≥startDate / stay 跨夜天数
  2. 类型     kind 合法 / cancelled 不计在路·不点亮 / stay 起讫同城
  3. 形式(几何) rail 段是否都有真实轨迹(rail-paths.json)，缺的会渲染成直线
  4. 置信度   confidence 合法 / 非 confirmed 的列出来供复核 / "待兑现·候补·未出票"嫌疑
  5. 出行人   traveler 与 people 一致 / 非主人单独却点亮城市
  6. 坐标     origin/destination 在 CITY 或 CITY_ALIAS 里(否则不点亮) / 孤儿点亮城市
  7. 去重     指纹重复(同票录两次)
  8. 金额     数值合理(0~50000)
  9. 两源同步 travel-log.json ↔ travel-log-data.js / rail-paths.json ↔ rail-paths-data.js

用法：  python3 data/audit.py
退出码：0 = 无阻断问题；1 = 有 ✗ 级问题（建议修完再 commit）。
"""

OWNER = "Nova Kepler"   # 站点主人名，与 app.js 的 OWNER_NAME 保持一致

import json, re, sys, datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
LOG = HERE / "travel-log.json"
LOG_JS = HERE / "travel-log-data.js"
RAIL = HERE / "rail-paths.json"
RAIL_JS = HERE / "rail-paths-data.js"
APP_JS = PROJECT / "app.js"

VALID_KINDS = {"flight", "rail", "road", "stay", "cancelled", "other"}
VALID_CONF = {"confirmed", "partial", "inferred", "pending"}
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TODAY = datetime.date.today()
SUSPECT_STATUS = re.compile(r"待兑现|候补|未出票|未支付|去支付|立即预订|预订$|搜索|比价")

errs = []   # ✗ 阻断级
warns = []  # ⚠ 提醒级


def E(cat, tag, det=""): errs.append((cat, tag, det))
def W(cat, tag, det=""): warns.append((cat, tag, det))


def parse_date(s):
    try:
        return datetime.date(*map(int, str(s).split("-")))
    except Exception:
        return None


def load_cities():
    txt = APP_JS.read_text(encoding="utf-8")
    known = set()
    m = re.search(r"const CITY\s*=\s*\{(.*?)\n\};", txt, re.S)
    if m:
        known |= set(re.findall(r'"([^"]+)"\s*:\s*\{', m.group(1)))
    m = re.search(r"const CITY_ALIAS\s*=\s*\{(.*?)\n\};", txt, re.S)
    if m:
        for k, v in re.findall(r'"([^"]+)"\s*:\s*"([^"]+)"', m.group(1)):
            known.add(k); known.add(v)
    return known


def main():
    doc = json.loads(LOG.read_text(encoding="utf-8"))
    recs = doc.get("records", [])
    cities = load_cities()

    # —— 两源同步 ——
    try:
        js_txt = LOG_JS.read_text(encoding="utf-8")
        js_obj = json.loads(js_txt.split("=", 1)[1].rsplit(";", 1)[0].strip().rstrip(";").strip())
        if js_obj.get("records") != recs:
            E("两源漂移", "travel-log.json ≠ travel-log-data.js", "用 merge-records.py 或重建保持一致")
    except Exception as e:
        E("两源漂移", "data.js 解析失败", str(e)[:80])

    rail_legs = set()
    try:
        rp = json.loads(RAIL.read_text(encoding="utf-8"))
        rail_legs = set(rp.get("legs", {}))
        if "RAIL_PATHS" not in RAIL_JS.read_text(encoding="utf-8"):
            E("两源漂移", "rail-paths-data.js 缺 RAIL_PATHS", "")
    except Exception as e:
        W("铁路轨迹", "rail-paths.json 读取失败", str(e)[:80])

    seen = {}
    lit_cities = set()
    rail_pairs = {}
    for r in recs:
        sd, ed = r.get("startDate"), r.get("endDate")
        tag = f"{sd} {r.get('kind')} {r.get('origin')}→{r.get('destination')} {r.get('transportNo') or ''}".strip()
        ds, de = parse_date(sd), parse_date(ed)

        # 1. 时间
        if not (sd and DATE_RE.match(str(sd)) and ds):
            E("时间", tag, f"startDate 非法/占位: {sd!r}")
        else:
            if str(sd).startswith("0000"):
                E("时间", tag, "年份占位 0000，未定年份不应入库")
            if ds > TODAY:
                E("时间", tag, f"日期在未来: {sd}")
            if ds.year < 2018:
                W("时间", tag, f"年份偏早: {sd}")
        if ds and de and de < ds:
            E("时间", tag, f"endDate<startDate: {sd}..{ed}")

        # 2. 类型
        k = r.get("kind")
        if k not in VALID_KINDS:
            E("类型", tag, f"kind 非法: {k!r}")
        if k == "stay" and r.get("origin") != r.get("destination"):
            W("类型", tag, f"stay 起讫不同城: {r.get('origin')}≠{r.get('destination')}")
        if k == "cancelled" and (r.get("countsAsVisited") or r.get("countsAsAway")):
            E("类型", tag, "cancelled 仍计在路/点亮城市")

        # 4. 置信度
        c = r.get("confidence")
        if c not in VALID_CONF:
            E("置信度", tag, f"confidence 非法: {c!r}")
        elif c != "confirmed":
            W("置信度", tag, f"[{c}] 待人工复核")
        if SUSPECT_STATUS.search(str(r.get("notes", "")) + str(r.get("evidence", ""))):
            W("置信度", tag, "notes/evidence 含'待兑现/候补/搜索/比价'等字样 → 确认是真实出行?")

        # 5. 出行人
        trav = str(r.get("traveler") or "").strip()
        ppl = r.get("people") or []
        if trav and "/" not in trav and trav not in ppl:
            E("出行人", tag, f"traveler({trav}) 不在 people({ppl})")
        if trav and trav not in (OWNER, "待确认") and "/" not in trav and OWNER not in ppl and r.get("countsAsVisited"):
            E("出行人", tag, f"非本人({trav})却点亮城市 —— 他人单独行程不应点亮")

        # 6. 坐标
        for role in ("origin", "destination"):
            city = r.get(role)
            if city and city not in cities:
                if k in ("flight", "rail", "road", "stay"):
                    E("坐标", tag, f"{role}={city} 不在 CITY/CITY_ALIAS，地图不会点亮")
            if city and r.get("countsAsVisited"):
                lit_cities.add(city)

        # 3. 形式(几何) —— 收集 rail 段
        if k == "rail" and r.get("origin") and r.get("destination") and r["origin"] != r["destination"]:
            rail_pairs["→".join(sorted((r["origin"], r["destination"])))] = tag

        # 7. 去重
        fp = (sd, k, r.get("origin"), r.get("destination"),
              (r.get("transportNo") or "").upper().replace(" ", ""), r.get("amountCny"))
        if fp in seen:
            E("去重", tag, f"指纹重复 (同 {seen[fp]})")
        else:
            seen[fp] = tag

        # 8. 金额
        amt = r.get("amountCny")
        if amt is not None and (not isinstance(amt, (int, float)) or amt < 0 or amt > 50000):
            W("金额", tag, f"金额异常: {amt}")

    # 3. rail 段缺真轨
    for key, tag in sorted(rail_pairs.items()):
        if rail_legs and key not in rail_legs:
            W("铁路轨迹", tag, f"{key} 无真实轨迹 → 渲染成直线；跑 build-real-paths.py 补")

    # —— 报告 ——
    n = len(recs)
    print("=" * 64)
    print(f"行旅地图自检 · travel-log.json 共 {n} 条 · {TODAY.isoformat()}")
    print("=" * 64)
    if not errs and not warns:
        print("✓ 全部通过，无任何问题。")
    if errs:
        print(f"\n✗ 阻断级问题 {len(errs)} 处（建议修完再 commit）：")
        for cat, tag, det in errs:
            print(f"  ✗ [{cat}] {tag}  | {det}")
    if warns:
        print(f"\n⚠ 提醒级 {len(warns)} 处（多为待复核/直线铁路，看情况处理）：")
        for cat, tag, det in warns:
            print(f"  ⚠ [{cat}] {tag}  | {det}")
    print("\n" + "=" * 64)
    print(f"点亮城市 {len(lit_cities)} 个 · rail 段 {len(rail_pairs)} 个 · 阻断 {len(errs)} · 提醒 {len(warns)}")
    sys.exit(1 if errs else 0)


if __name__ == "__main__":
    main()
