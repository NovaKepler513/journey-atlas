# Roamap · 旅行地图

> Turn your trips into an editorial-grade interactive atlas — runs entirely in the browser, no backend, your data stays with you.
>
> 把你走过的路变成一张可交互的、编辑感十足的旅行地图 —— 纯前端、无后端、数据完全留在你自己手里。

### ▶ [Live demo / 在线演示 →](https://novakepler513.github.io/journey-atlas/)

The demo ships with **two fictional travelers** so you can see the per-traveler filter at work: **Nova Kepler** (Shanghai-based — lots of flights plus a dense domestic high-speed-rail web) and **林叙 / Lin Xu** (flies to Japan & Europe, then rides trains everywhere abroad). Switch the **旅客 (traveler)** filter and the whole map changes shape. All trips are made up — replace `data/travel-log.json` with your own.

演示内置**两位虚构旅客**，方便你看「按旅客筛选」的效果：**Nova Kepler**（常居上海，大量航班 + 密集的国内高铁/城际）与 **林叙**（飞到日本、欧洲后，在当地大量坐火车）。切换上方的**旅客**筛选，整张地图的形状都会变。所有行程均为虚构，把 `data/travel-log.json` 换成你自己的即可。

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
   const APP_NAME   = "Roamap";       // project name shown on the loading screen
   const SITE_TITLE = { eyebrow: "ROAMAP", title: "Nova\n行旅地图", docTitle: "Nova · 行旅地图" };
   const OWNER_NAME = "Nova Kepler";   // your name / default traveler
   const HOME_CITY  = "上海";           // your home city (for the "nights at home" estimate)
   ```
   (You can also rename the masthead live from the `···` → “自定义标题” menu — it saves to your browser.)
3. **Any place, just type it** → the entry form geocodes unknown places live via OpenStreetMap (Photon) and remembers their coordinates — Chinese towns, overseas cities, anything real. (You can still hardcode coordinates in the `CITY` map in `app.js` if you prefer.)
4. **Real rail tracks** → China's rail geometry is **bundled** (precomputed from public OpenStreetMap data via BRouter). Rail legs you add are routed **live against BRouter** for a real track and cached in your browser; genuinely un-routable legs (cross-ocean, or networks BRouter can't trace) fall back to a smooth great-circle arc. To bake more tracks into the repo itself, run `python3 data/build-real-paths.py`.

Full guide: [`docs/CUSTOMIZE.md`](docs/CUSTOMIZE.md).

## Notes · 说明

- **Ticket OCR is currently disabled.** Reading trips automatically from ticket photos/screenshots needs a recognition backend (OCR/AI), which a pure static site can't bundle. The entry form is manual for now; we may add OCR later if there's demand — open an issue. · **票据 OCR 暂时关闭**：从车票截图自动识别行程需要一个识别后端，纯静态站点无法内置，目前请手动录入；后续若有需要可能补上，欢迎提 issue。
- **Rail tracks:** China is covered by a built-in template + live routing; some overseas networks and any cross-ocean "rail" leg can't be traced and show a smooth arc instead. · **铁路轨迹**：中国已内置模板并支持在线补轨；部分境外线网与跨洋"铁路"段无法描出真实轨道，会以平滑弧线表示。

- **Place names & language:** search results are ranked admin-first (city / county / town before landmarks) and shown in a script you can read — Chinese for Chinese places, the local name when it's Latin/Chinese/Japanese, otherwise English (so Arabic / Cyrillic / Thai names don't show as unreadable glyphs). This build is **Chinese-user-first**; a fuller multilingual experience (per-user language, keeping every place's native name) is future work. · **地名与语言**：候选按行政级别排序（市/县/镇在前，景点靠后），并以你能读的文字显示（中国地点中文；当地名是拉丁/中日文就保留，否则回退英文）。**当前以中文用户为主**；更完整的多语言（按用户语言、保留各地母语名）是未来方向。

Full list of current limitations and what could fix them: **[docs/ROADMAP.md](docs/ROADMAP.md)**. Release notes: **[CHANGELOG.md](CHANGELOG.md)**.
完整的已知限制与未来解法见 **[docs/ROADMAP.md](docs/ROADMAP.md)**；更新记录见 **[CHANGELOG.md](CHANGELOG.md)**。

## Privacy · 隐私

Everything runs client-side. There is no server, no analytics, no account. Your `travel-log.json` lives in your repo / your browser only. When self-hosting publicly, remember the data file is public — keep out anything you don't want shared.

全程在你的浏览器里运行：没有服务器、没有埋点、没有账号。注意：公开部署时 `travel-log.json` 是公开可见的，别把不想分享的信息放进去。

## Tech · 技术栈

Vanilla JS + Canvas + [MapLibre GL JS](https://maplibre.org/). No framework, no build step, no backend.

## Dev tools · 开发脚本 (`data/`)

- `audit.py` — pre-commit self-check on your records (date order, schema, suspicious states).
- `build-real-paths.py` — precompute real rail tracks for your train legs (via BRouter).
- `merge-records.py` — dedupe & merge new records into the log.

## Credits & acknowledgements · 致谢

This project stands on a lot of generous open-source work and open data. Heartfelt thanks to all of them — please go visit and use them too.
本项目站在许多慷慨的开源项目与开放数据之上，在此一并致谢，也欢迎大家去使用它们：

- **[maptoposter](https://maptoposter.0v0.one/)** — the **「街道海报 ↗」** button hands off to this lovely project; its street-grid posters are genuinely beautiful, so rather than reinvent it I link straight to it. Go make a poster there! · 「街道海报」按钮直接跳转到它——它生成的街道路网海报太好看了，与其重造不如把你交接过去，强烈推荐。
- **[MapLibre GL JS](https://maplibre.org/)** (BSD-3) — the interactive vector map engine. · 交互矢量地图引擎。
- **[OpenFreeMap](https://openfreemap.org/)** + **[OpenMapTiles](https://openmaptiles.org/)** — free vector base-map tiles & styles. · 免费矢量底图瓦片与样式。
- **[OpenStreetMap](https://www.openstreetmap.org/copyright)** (© OSM contributors, ODbL) — the open geodata under the base map, the geocoder, and the rail routing. · 底图、地理编码与铁路路由背后的开放地理数据。
- **[BRouter](https://brouter.de/)** — open routing engine; we use its public server (with a rail-only profile) to trace real railway geometry, both offline and live in-browser. · 开源路由引擎；用其公共服务器（rail-only profile）描出真实铁轨，离线预算与浏览器在线补轨都靠它。
- **[Photon](https://photon.komoot.io/) by Komoot** — open geocoder (on OSM data) that powers the "type any place" search. · 基于 OSM 的开源地理编码，支撑「任意地点检索」。
- **[DataV.GeoAtlas](https://datav.aliyun.com/portal/school/atlas/area_selector)** (Aliyun) — public China province GeoJSON (`data/china-100000-full.json`). · 中国省级行政区 GeoJSON。
- **[world-atlas](https://github.com/topojson/world-atlas)** / **[Natural Earth](https://www.naturalearthdata.com/)** (public domain) — world country topology (`data/world-110m.json`). · 世界国家边界拓扑。
- **[jsDelivr](https://www.jsdelivr.com/)** — CDN serving the MapLibre library. · 提供 MapLibre 的 CDN。

## License

[MIT](LICENSE) © Nova Kepler. Demo data and the two demo travelers are fictional. Bundled map tiles, geo datasets, and the linked projects above retain their own respective licenses.
