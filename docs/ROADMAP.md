# Known limitations & roadmap · 已知限制与路线图

Honest list of what's rough or missing today, and how a future update could fix each. Contributions / issues welcome.
诚实记录当前的不足与未来可能的解法，欢迎 issue / PR。

## Data entry · 录入

- **Ticket OCR is disabled.** Reading trips from ticket photos needs a recognition backend (OCR/AI); a pure static site can't bundle one. → *Future:* in-browser OCR (e.g. Tesseract.js), a "paste a screenshot to your own LLM → paste JSON back" flow, or an optional user-supplied API key. · 票据 OCR 暂关；未来可考虑浏览器内 OCR、或"截图丢给 LLM→贴回 JSON"、或用户自带 API key。
- **No in-UI edit / delete of existing records yet** — you can add, import, and clear-all, but not edit one row. → *Future:* row-level edit & delete. · 暂不能在界面里改/删单条记录（可新增、导入、清空）；未来加行级编辑。

## Places & geocoding · 地点与地理编码

- **Foreign places typed with a Chinese exonym may not be found** (the geocoder, Photon/OSM, indexes mostly local/English names — e.g. `Reykjavik` works, `雷克雅未克` may not). → *Future:* bundle a Chinese↔local alias table for common world cities, or a multilingual geocoder. · 外国地名用中文译名可能查不到（用当地名/英文名最稳）；未来内置中英对照表。
- **Same-named places** (two "Reykjavik") can resolve to the wrong one on free-typed submit. The autocomplete dropdown shows `name · region · country` to disambiguate — pick from it. → *Future:* a small map-pin confirmation, or store the picked coordinate explicitly. · 同名地点可能选错；下拉有"地区·国家"标注可区分，未来加地图点选确认。
- **Geocoded coordinates live in your browser (localStorage), not inside each record.** If you export the JSON and load it on a *different* machine, custom-place coords won't travel with it (built-in cities are fine). → *Future:* optionally write `lat`/`lng` into the record on add. · 新查到的坐标存在浏览器里、不写进记录；换设备导入时自定义地点可能缺坐标；未来可把坐标写进记录。
- **Chinese-user-first language.** Results rank admin places first (city/county/town before POIs) and display in a readable script — Chinese for CN, local name if Latin/CJK, else English. There's no per-user language switch or guaranteed native-name display yet. → *Future:* multilingual UI + an option to keep every place's native name (or show native on the map, English in search). · 当前以中文用户为主（行政地名优先、看不懂的字回退英文）；尚无按用户语言切换/保证显示母语名；未来做多语言 + 保留母语名的选项。

## Routes & rail tracks · 路线与铁轨

- **Real rail tracks cover China (bundled) + anything BRouter can route live.** Cross-ocean "rail", and a few overseas networks BRouter can't trace, fall back to a smooth great-circle arc. → *Future:* more routing profiles / bundled regional templates. · 中国已内置 + 在线可路由的都给真轨；跨洋及个别境外线网回退弧线；未来补更多模板/profile。
- **Live rail routing leans on the public BRouter server** (rate limits, uptime, a little latency on first fetch). Results are cached per browser. → *Future:* self-host BRouter, or precompute & bundle more tracks via `data/build-real-paths.py`. · 在线补轨依赖公共 BRouter 服务器；未来可自建或预算更多内置。
- **Road / ferry legs draw arcs** (no real routing for driving/boats). → *Future:* car / ferry routing profiles. · 地面/水路段画弧线；未来加驾车/轮渡路由。

## Map & display · 地图与显示

- **Label crowding at the world zoom** — dense clusters (e.g. lots of European cities) overlap their names until you zoom in. → *Future:* better label collision / level-of-detail. · 世界视图最大范围时密集城市标签会叠；放大即散；未来优化标签避让。
- **Mobile** works and is full-featured but can feel dense on small screens. → *Future:* more small-screen polish. · 移动端可用但偏密；未来再打磨。

## Data & sync · 数据与同步

- **Local-only, no multi-device sync** — your data lives in `travel-log.json` (the file) and your browser's localStorage. → *Future:* optional export/import helpers or opt-in cloud sync. · 仅本地、无多设备同步；未来加可选同步。
- **Public when deployed** — a self-hosted `travel-log.json` is publicly readable. Keep private details out, or keep your real-data copy in a private repo. · 公开部署时数据文件可见；真实数据建议放私有仓库。
