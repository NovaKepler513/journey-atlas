# Data schema · 数据格式

Your trips live in **`data/travel-log.json`**. Keep **`data/travel-log-data.js`** in sync — it's the exact same JSON wrapped as `window.TRAVEL_LOG_DATA = … ;` (loaded via `<script>` so the page also works from `file://`).

```jsonc
{
  "metadata": {
    "title": "Nova · Roamap",
    "version": "1.0.0",
    "lastUpdated": "2025-12-01",
    "owner": "Nova Kepler",
    "notes": ["free-form notes"]
  },
  "records": [ /* one object per leg / stay / spot */ ]
}
```

## A record · 单条记录

| field | type | required | meaning |
|---|---|---|---|
| `id` | string | ✓ (unique) | stable key, e.g. `2025-11-07-flight-001` |
| `kind` | enum | ✓ | `flight` · `rail` · `road` · `stay` · `other` |
| `startDate` | `YYYY-MM-DD` | ✓ | date of the leg / check-in |
| `endDate` | `YYYY-MM-DD` | ✓ | same as start for a move; check-out for a `stay` |
| `title` | string | ✓ | e.g. `北京 → 桂林`, `桂林停留`, `桂林·漓江` |
| `origin` | city | ✓ | must exist in the `CITY` map in `app.js` |
| `destination` | city | ✓ | for `stay`/`other`, equal to `origin` |
| `transportNo` | string | – | train/flight number (`G507`, `CA933`) |
| `departTime` / `arriveTime` | `HH:MM` | – | leave blank if unknown |
| `durationMinutes` | number\|null | – | travel minutes |
| `amountCny` | number\|null | – | actual paid amount |
| `invoiceAmountCny` | number\|null | – | only if invoice differs |
| `traveler` | string | ✓ | usually `OWNER_NAME` |
| `people` | string[] | ✓ | everyone on the leg |
| `confidence` | enum | ✓ | `confirmed` · `partial` · `inferred` · `pending` |
| `countsAsAway` | bool | ✓ | counts toward "nights away" (false for in-city tickets) |
| `countsAsVisited` | bool | ✓ | lights up the city |
| `showInTimeline` | bool | ✓ | show in the timeline/ledger |
| `displayLayer` | string | ✓ | `journey` |
| `evidence` | string | – | source label, e.g. `电子客票` (no personal paths!) |
| `notes` | string | – | free text |

### `kind`
- `flight` → drawn as a great-circle arc.
- `rail` → drawn along a real track if precomputed (see `build-real-paths.py`), else an arc.
- `road` → ground/ferry; arc.
- `stay` → a stop; `origin === destination`; spans `startDate`→`endDate`.
- `other` → ticket / sightseeing in a city; usually `countsAsAway: false`.

### `confidence`
- `confirmed` 已确认 — you have the ticket/record.
- `partial` 部分确认 — method known, some detail missing.
- `inferred` 推定 — reconstructed from context.
- `pending` 缺口·待补段 — a known gap; render lighter, exclude from "away" counts until filled.

## Don't leak yourself · 别把自己写进去

`evidence` should be a **generic label** (`电子客票`, `在线预订`, `门票预订`) — never a local file path, invoice number, ID number, phone, or bank detail. The data file is public when you deploy.

## Regenerating the `.js` mirror

```bash
python3 - <<'PY'
import json
d = json.load(open("data/travel-log.json"))
open("data/travel-log-data.js","w").write("window.TRAVEL_LOG_DATA = " + json.dumps(d, ensure_ascii=False, indent=2) + ";\n")
PY
```
