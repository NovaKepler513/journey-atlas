# Journey Atlas · 旅行地图

> Turn your trips into an editorial-grade interactive atlas — runs entirely in the browser, no backend, your data stays with you.
>
> 把你走过的路变成一张可交互的、编辑感十足的旅行地图 —— 纯前端、无后端、数据完全留在你自己手里。

### ▶ [Live demo / 在线演示 →](https://novakepler513.github.io/journey-atlas/)

The demo is populated with a **fictional traveler "Nova Kepler" and entirely made-up trips** — replace `data/travel-log.json` with your own and it becomes yours.

演示里的人物「Nova Kepler」和所有行程都是**虚构示例**，把 `data/travel-log.json` 换成你自己的就好。

---

## Features · 功能

- **Two-system map** — a China view (province-level GeoJSON) and a World view, one-tap toggle. Routes drawn as great-circle arcs (flights) or real rail tracks (trains).
- **Animated playback (`播放旅程`)** — replays your journeys in time order, the camera following each leg like a film; comet trail colored by transport type, leaving an ink-trail behind.
- **Year growth (`岁月`)** — watch the map light up year by year.
- **Travel archive (`旅行档案`)** — auto-computed stats: total distance, nights away, cities lit, countries/continents, most-stayed cities, busiest routes, by-year and by-transport breakdowns. Hover any rank to spotlight related boards.
- **Searchable ledger (`资料明细`)** — every record in a table; search by train no. / flight / city / project and jump-and-highlight the row.
- **Posters** — export an A4 "journey poster" or a stylized street-grid poster of any focused city.
- **Show mode (`展示`)** — hide work-in-progress fields for a clean screenshot or sharing.
- **Custom title, in-app** — rename the masthead from the `···` menu; persists in your browser.
- **23 color skins**, full keyboard/mobile support, and a confidence model (confirmed / partial / inferred / gap-to-fill) so you can ship an honest map even while data is incomplete.

## Quick start · 快速开始

It's a static site — no build step.

```bash
# clone, then serve the folder over http (file:// won't load the JSON)
python3 -m http.server 8000
# open http://localhost:8000
```

Or drop the folder on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages…).

> Opening `index.html` directly via `file://` won't work because browsers block `fetch()` of local JSON. Use any local server (the one-liner above is enough). The bundled `data/*-data.js` mirrors are loaded via `<script>` so most things still render from `file://`, but a server is the reliable path.

## Make it yours · 改成你自己的

0. **Start from a blank map** → `···` menu → **清空全部数据 (Clear all data)** wipes the demo from your browser so you can enter your own. (To make the *deployed* site start empty for everyone, set `records: []` in `data/travel-log.json`.) Get the demo back anytime with **重载资料 (Reload)**.
1. **Your trips** → edit `data/travel-log.json` (schema: [`docs/DATA_SCHEMA.md`](docs/DATA_SCHEMA.md)). Keep `data/travel-log-data.js` in sync (it's the same JSON wrapped as `window.TRAVEL_LOG_DATA = …;`).
2. **Your name / title** → top of `app.js`:
   ```js
   const SITE_TITLE = { eyebrow: "JOURNEY ATLAS", title: "Nova", docTitle: "Nova · Journey Atlas" };
   const OWNER_NAME = "Nova Kepler";   // your name / default traveler
   ```
   (You can also rename the masthead live from the `···` → “自定义标题” menu — it saves to your browser.)
3. **New cities** → add coordinates to the `CITY` map in `app.js` (plus `CITY_EN` / `CITY_META` for the poster latin name & country).
4. **Real rail tracks** (optional) → run `python3 data/build-real-paths.py` to fetch train geometry; otherwise rail legs draw as smooth arcs.

Full guide: [`docs/CUSTOMIZE.md`](docs/CUSTOMIZE.md).

## Privacy · 隐私

Everything runs client-side. There is no server, no analytics, no account. Your `travel-log.json` lives in your repo / your browser only. When self-hosting publicly, remember the data file is public — keep out anything you don't want shared.

全程在你的浏览器里运行：没有服务器、没有埋点、没有账号。注意：公开部署时 `travel-log.json` 是公开可见的，别把不想分享的信息放进去。

## Tech · 技术栈

Vanilla JS + [MapLibre GL JS](https://maplibre.org/) + Canvas. No framework, no build. Base map by [OpenFreeMap](https://openfreemap.org/) / [OpenMapTiles](https://openmaptiles.org/) / [OpenStreetMap](https://www.openstreetmap.org/copyright). China boundaries & world topology from public GeoJSON/TopoJSON datasets (see `data/`). Rail geometry via the public [BRouter](https://brouter.de/) routing service.

## Dev tools · 开发脚本 (`data/`)

- `audit.py` — pre-commit self-check on your records (date order, schema, suspicious states).
- `build-real-paths.py` — precompute real rail tracks for your train legs.
- `merge-records.py` — dedupe & merge new records into the log.

## License

[MIT](LICENSE) © Nova Kepler. Demo data is fictional. Base-map and geo datasets retain their respective licenses.
