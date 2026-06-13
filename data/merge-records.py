#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
旅行地图 · 记录合并回写工具 (merge-records.py)
================================================
把"新记录"合并进 data/travel-log.json,做去重 / 校验 / 补默认值 / 坐标守卫,
并同步重建 data/travel-log-data.js。新记录来源有两种:

  1. AI(Claude/ChatGPT 等)按 AI行程录入协议 输出的 records JSON。
  2. 页面"导出 JSON"按钮从浏览器 localStorage 导出的临时记录。

—— 为什么需要它 ——
页面里新增/导入的记录只活在浏览器 localStorage,关掉就可能丢,不是长期数据源。
长期数据源永远是 data/travel-log.json。这个脚本就是 localStorage → travel-log.json 的回写闸门:
只有过了这道闸,记录才算真正入库。

用法:
  python3 merge-records.py incoming.json              # 合并并写回 + 重建 data.js
  python3 merge-records.py incoming.json --dry-run    # 只预览,不写任何文件(强烈建议先跑这个)
  python3 merge-records.py incoming.json --date 2026-06-01   # 指定 metadata.lastUpdated

incoming.json 支持两种顶层格式,都能吃:
  {"records": [ {...}, {...} ]}     ← AI 协议 / 页面导出
  [ {...}, {...} ]                  ← 裸数组

去重指纹: (startDate, kind, origin, destination, 车次/航班号大写)。
  车次/航班号在场时几乎唯一;缺失时退化用 城市对+金额 兜底。
  同一张票导入两次不会变成两条路线。

退出码: 0 正常; 2 输入文件问题; 3 校验发现阻断性问题(无 startDate 等)。
"""

import argparse
import datetime
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent          # .../.../journey-atlas/data
PROJECT = HERE.parent                            # .../journey-atlas
TRAVEL_LOG = HERE / "travel-log.json"
TRAVEL_LOG_JS = HERE / "travel-log-data.js"
APP_JS = PROJECT / "app.js"

VALID_KINDS = {"flight", "rail", "stay", "road", "cancelled", "other"}
VALID_CONFIDENCE = {"confirmed", "partial", "inferred", "pending"}
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


# ----------------------------------------------------------------------------
# 读取页面已知城市(CITY + CITY_ALIAS),用于坐标守卫
# ----------------------------------------------------------------------------
def load_known_cities():
    """从 app.js 正则抽出 CITY 与 CITY_ALIAS 的城市名,作为'地图认识的城市'集合。"""
    if not APP_JS.exists():
        return set(), "app.js 不存在,跳过坐标守卫"
    text = APP_JS.read_text(encoding="utf-8")
    known = set()
    # const CITY = { "北京": {...}, ... };
    m = re.search(r"const CITY\s*=\s*\{(.*?)\n\};", text, re.S)
    if m:
        known |= set(re.findall(r'"([^"]+)"\s*:\s*\{', m.group(1)))
    # const CITY_ALIAS = { "北京南站": "北京", ... };  —— 别名的 key 与 value 都算认识
    m = re.search(r"const CITY_ALIAS\s*=\s*\{(.*?)\n\};", text, re.S)
    if m:
        for k, v in re.findall(r'"([^"]+)"\s*:\s*"([^"]+)"', m.group(1)):
            known.add(k)
            known.add(v)
    return known, None


# ----------------------------------------------------------------------------
# 工具
# ----------------------------------------------------------------------------
def as_number_or_none(value):
    if value in ("", None):
        return None
    try:
        n = float(value)
    except (TypeError, ValueError):
        return None
    return int(n) if n.is_integer() else n


def as_bool(value, default=True):
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() not in ("false", "0", "no", "")


def as_people(record):
    p = record.get("people")
    if isinstance(p, list):
        return [str(x).strip() for x in p if str(x).strip()]
    raw = str(p or record.get("traveler") or "").strip()
    return [s.strip() for s in re.split(r"[、,，/]", raw) if s.strip()]


def slugify_id(rec, seq):
    """生成稳定 id;车次/航班号在场时用它,否则用 日期+类型+序号。"""
    base = rec.get("startDate") or "date"
    tail = (rec.get("transportNo") or rec.get("kind") or "rec").strip()
    tail = re.sub(r"\s+", "", tail).lower() or "rec"
    return f"{base}-{tail}-{seq}"


def fingerprint(rec):
    """去重指纹。"""
    return (
        str(rec.get("startDate") or "").strip(),
        str(rec.get("kind") or "").strip(),
        str(rec.get("origin") or "").strip(),
        str(rec.get("destination") or "").strip(),
        str(rec.get("transportNo") or "").strip().upper(),
        rec.get("amountCny"),
    )


def normalize(rec, seq):
    """补默认值 + 收口字段口径,镜像 app.js 的 normalize() 与 AI行程录入协议。返回 (record, problems)。"""
    problems = []
    out = dict(rec)  # 保留 evidence/purpose/project/reimbursement 等额外字段原样

    start = str(rec.get("startDate") or "").strip()
    if not DATE_RE.match(start):
        problems.append(f"startDate 缺失或非法: {start!r}")
    out["startDate"] = start
    out["endDate"] = str(rec.get("endDate") or start).strip()

    kind = str(rec.get("kind") or "").strip()
    if kind not in VALID_KINDS:
        problems.append(f"kind 非法({kind!r}),已降级为 other")
        kind = "other"
    out["kind"] = kind

    out["origin"] = str(rec.get("origin") or "").strip()
    out["destination"] = str(rec.get("destination") or "").strip()
    out["title"] = (
        str(rec.get("title") or "").strip()
        or " → ".join([c for c in (out["origin"], out["destination"]) if c])
        or "未命名行程"
    )

    out["departTime"] = str(rec.get("departTime") or "").strip()
    out["arriveTime"] = str(rec.get("arriveTime") or "").strip()
    out["durationMinutes"] = as_number_or_none(rec.get("durationMinutes"))
    out["amountCny"] = as_number_or_none(rec.get("amountCny"))
    out["invoiceAmountCny"] = as_number_or_none(rec.get("invoiceAmountCny"))

    people = as_people(rec)
    out["people"] = people
    out["traveler"] = str(rec.get("traveler") or " / ".join(people) or "待确认").strip()

    conf = str(rec.get("confidence") or "pending").strip()
    if conf not in VALID_CONFIDENCE:
        problems.append(f"confidence 非法({conf!r}),已降级为 pending")
        conf = "pending"
    out["confidence"] = conf

    cancelled = kind == "cancelled"
    # 退改默认不计在路天数、不点亮城市;其余默认 true(除非显式 false)
    out["countsAsAway"] = False if cancelled else as_bool(rec.get("countsAsAway"), True)
    out["countsAsVisited"] = False if cancelled else as_bool(rec.get("countsAsVisited"), True)
    out["showInTimeline"] = as_bool(rec.get("showInTimeline"), True)
    out["displayLayer"] = str(rec.get("displayLayer") or "journey").strip()
    out["id"] = str(rec.get("id") or "").strip() or slugify_id(out, seq)

    # 非 stay 行程缺城市 → 提醒(不阻断)
    if kind not in ("stay", "cancelled", "other") and not (out["origin"] and out["destination"]):
        problems.append("缺出发地或到达地")

    return out, problems


def read_incoming(path):
    raw = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(raw, list):
        return raw
    if isinstance(raw, dict):
        if isinstance(raw.get("records"), list):
            return raw["records"]
        # 单条记录
        if raw.get("startDate") or raw.get("origin"):
            return [raw]
    raise ValueError("无法识别的输入格式:需要 {\"records\":[...]} 或 [...]。")


def write_js(doc):
    """重建 travel-log-data.js,严格匹配现有格式: window.TRAVEL_LOG_DATA = {...}\\n;\\n"""
    body = json.dumps(doc, ensure_ascii=False, indent=2)
    TRAVEL_LOG_JS.write_text(f"window.TRAVEL_LOG_DATA = {body}\n;\n", encoding="utf-8")


# ----------------------------------------------------------------------------
# 主流程
# ----------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description="把新记录合并回 travel-log.json 并重建 data.js")
    ap.add_argument("incoming", help="新记录文件 (JSON: {records:[...]} 或 [...])")
    ap.add_argument("--dry-run", action="store_true", help="只预览,不写任何文件")
    ap.add_argument("--date", default=datetime.date.today().isoformat(),
                    help="写入 metadata.lastUpdated 的日期 (默认今天)")
    args = ap.parse_args()

    incoming_path = Path(args.incoming)
    if not incoming_path.exists():
        print(f"✗ 找不到输入文件: {incoming_path}", file=sys.stderr)
        sys.exit(2)
    if not TRAVEL_LOG.exists():
        print(f"✗ 找不到数据源: {TRAVEL_LOG}", file=sys.stderr)
        sys.exit(2)

    try:
        incoming = read_incoming(incoming_path)
    except (json.JSONDecodeError, ValueError) as e:
        print(f"✗ 输入文件解析失败: {e}", file=sys.stderr)
        sys.exit(2)

    doc = json.loads(TRAVEL_LOG.read_text(encoding="utf-8"))
    existing = doc.get("records", [])
    known_cities, city_warn = load_known_cities()
    existing_keys = {fingerprint(r) for r in existing}

    added, skipped, blocking, unknown_cities = [], [], [], {}
    review_needed = []
    new_records = []

    base_seq = len(existing)
    for i, raw in enumerate(incoming):
        rec, problems = normalize(raw, base_seq + i)
        label = f"{rec['startDate'] or '????'} {rec['title']}"

        # 阻断性问题: 没有合法 startDate
        if not DATE_RE.match(rec["startDate"]):
            blocking.append((label, problems))
            continue

        key = fingerprint(rec)
        if key in existing_keys:
            skipped.append(label)
            continue
        existing_keys.add(key)
        new_records.append(rec)
        added.append(label)

        # 坐标守卫
        for city in (rec["origin"], rec["destination"]):
            if city and known_cities and city not in known_cities:
                unknown_cities.setdefault(city, []).append(label)

        # 需人工复核
        if rec["confidence"] != "confirmed" or problems:
            review_needed.append((label, rec["confidence"], problems))

    # 合并 + 排序
    merged = existing + new_records
    merged.sort(key=lambda r: str(r.get("startDate") or ""))
    doc["records"] = merged
    doc.setdefault("metadata", {})["lastUpdated"] = args.date

    # -------- 报告 --------
    print("=" * 60)
    print(f"数据源: {TRAVEL_LOG.name}  现有 {len(existing)} 条")
    print(f"输入:   {incoming_path.name}  待并 {len(incoming)} 条")
    print("=" * 60)
    print(f"✓ 新增 {len(added)} 条")
    for x in added:
        print(f"    + {x}")
    if skipped:
        print(f"↻ 跳过重复 {len(skipped)} 条")
        for x in skipped:
            print(f"    = {x}")
    if blocking:
        print(f"✗ 阻断(无合法 startDate,未并入) {len(blocking)} 条")
        for label, probs in blocking:
            print(f"    ! {label}  | {'; '.join(probs)}")
    if unknown_cities:
        print(f"⚠ 地图未收录坐标的城市 {len(unknown_cities)} 个 —— 需在 app.js 的 CITY 补坐标,否则不会点亮:")
        for city, labels in unknown_cities.items():
            print(f"    ? {city}  (出现在: {', '.join(labels)})")
    if review_needed:
        print(f"☐ 建议人工复核 {len(review_needed)} 条(非 confirmed 或有字段提醒):")
        for label, conf, probs in review_needed:
            tail = f"  | {'; '.join(probs)}" if probs else ""
            print(f"    · [{conf}] {label}{tail}")
    if city_warn:
        print(f"⚠ {city_warn}")
    print("=" * 60)
    print(f"合并后总计: {len(merged)} 条  | metadata.lastUpdated = {args.date}")

    if args.dry_run:
        print("\n[dry-run] 未写入任何文件。确认无误后去掉 --dry-run 再跑一次。")
        return

    if not added:
        print("\n没有新记录可写,文件未改动。")
        return

    TRAVEL_LOG.write_text(
        json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    write_js(doc)
    print(f"\n✓ 已写回 {TRAVEL_LOG.name} 并重建 {TRAVEL_LOG_JS.name}")
    print("  下一步: 直接打开 index.html 验证 → 再 git add/commit/push。")


if __name__ == "__main__":
    main()
