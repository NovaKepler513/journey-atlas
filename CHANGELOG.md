# Changelog · 更新记录

All notable changes to Roamap. Dates are when the change landed in the public repo.

## v1.1 · 2025-12

Geocoding & data-entry overhaul.

- **Add any real place** with a proper labeled autocomplete (replaces the old `<datalist>`): each candidate shows `省·市` (China) or `region · country` (overseas) plus a **中国 / continent-colored** tag — pick the exact one (e.g. the 湖北·恩施 茅田, not Guangzhou's). Picking locks that place's real coordinates.
- **Admin-first ranking** — cities / counties / towns rank above landmarks, streets, stations (search a POI by its own name instead).
- **Readable names** — a place's local name is shown when it's Latin or Chinese/Japanese; otherwise it falls back to English (so قطر shows as "Qatar", Москва as "Moscow"), while 五台县 stays Chinese and 東京都 stays Japanese. This build is Chinese-user-first (see [ROADMAP](docs/ROADMAP.md)).
- Re-focus a filled place field to re-pick without deleting; keyboard nav in the dropdown.

## v1.0 · 2025-12

First public release.

- **Map** — China + World views (one-tap toggle); flights as great-circle arcs, trains along **real OSM rail tracks** (bundled for China + fetched live via BRouter for routes you add; un-routable legs fall back to a smooth arc).
- **Add any place** — the entry form geocodes arbitrary real places (Chinese towns, overseas cities) live via Photon/OpenStreetMap and remembers their coordinates; no longer limited to a fixed city list.
- **Animated playback** (`播放旅程`), **year-growth** (`岁月`), **travel archive** with auto stats + hover spotlight, **searchable ledger** (jump-and-highlight), **23 color skins**, **journey poster** export, and a **street-poster** hand-off to [maptoposter](https://maptoposter.0v0.one/).
- **Two fictional demo travelers** — *Nova Kepler* (Shanghai-based, flights + domestic high-speed rail) and *林叙* (overseas rail loops) — switch the 旅客 filter to see two very different maps.
- **Customizable** — `APP_NAME` / `SITE_TITLE` / `OWNER_NAME` / `HOME_CITY` config at the top of `app.js`; rename the masthead live from the `···` menu; **清空全部数据** to start from a blank map.
- **Loading screen**, submit feedback toasts, in-app notes where features are limited.
- Ticket **OCR is intentionally disabled** in this static build (needs a recognition backend) — see [ROADMAP](docs/ROADMAP.md).

See [docs/ROADMAP.md](docs/ROADMAP.md) for known limitations and what's next.
