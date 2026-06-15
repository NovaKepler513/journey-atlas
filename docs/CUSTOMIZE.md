# Customize · 定制指南

Everything lives in three files: `index.html`, `app.js`, `app.css`. No build step.

## 1. Title & owner name

Top of `app.js`:

```js
const APP_NAME = "Mapsake";        // project name on the loading screen
const SITE_TITLE = {
  eyebrow: "MAPSAKE",         // small line above the title; "" hides it
  title:   "Nova",           // \n breaks the line (single line here)
  docTitle:"Nova · Mapsake",  // browser tab
};
const OWNER_NAME = "Nova Kepler";  // default traveler; the "self" option in the traveler filter
const HOME_CITY  = "上海";          // home city — used for the "nights at home" estimate
```

You can also edit the masthead **at runtime**: `···` menu → “自定义标题”. That override saves to `localStorage` and wins over `SITE_TITLE` until you hit “恢复默认”.

The static fallback in `index.html` (`<title>`, `.eyebrow`, `<h1>`) only shows for a split second before `app.js` applies `SITE_TITLE`; update it too if you care about the no-JS view.

## 2. Add a city

`app.js` → `CITY` map (decimal degrees):

```js
const CITY = {
  // …
  "大理": { lat: 25.6065, lng: 100.2676 },
};
```

For the poster's latin name and country/continent stats, also add:

```js
const CITY_EN  = { /* … */ "大理": "DALI" };
const CITY_META = { /* … */ "大理": { country: "中国", continent: "亚洲" } }; // omit if mainland China
```

Cities not in `CITY` simply won't be plotted.

## 3. Real rail tracks (optional)

By default rail legs are smooth arcs. To draw real geometry:

```bash
python3 data/build-real-paths.py
```

It reads your `travel-log.json`, finds `rail` legs, fetches tracks from the public BRouter service, simplifies them, and writes `data/rail-paths.json` + `data/rail-paths-data.js`. Legs it can't route fall back to arcs automatically. International high-speed rail often won't route — that's fine.

## 4. Color skins

23 palettes ship in `data/poster-themes-data.js` and the map skins in `app.css` (`:root[data-skin="…"]`). Switch live from `···` → 配色. The choice persists per browser.

## 5. Dashboard metrics & show mode

- `···` → 看板指标: toggle which numbers show under the map.
- `展示` (nav bar): "show mode" hides pending/confidence/import affordances and blanks "待补" fields — good for sharing or screenshots.

## 6. Clear the demo / start fresh

- `···` → **清空全部数据 (Clear all data)**: wipes every record from your browser so you can start entering your own. It persists (a reload stays empty).
- **重载资料 (Reload)**: brings the bundled demo back.
- To make the **deployed** site start empty for every visitor (not just your browser), set `"records": []` in `data/travel-log.json` (and the matching `data/travel-log-data.js`).

## 7. Deploy

Any static host. For GitHub Pages: push to a repo, then Settings → Pages → deploy from branch (root). Done.

## Project layout

```
index.html        markup + script tags
app.js            all logic (map, playback, stats, posters, search)
app.css           all styles + 23 skins
data/
  travel-log.json / .js     ← your trips (the only file most people edit)
  rail-paths.json / .js     ← precomputed train tracks
  china-100000-full.json / china-map-data.js   province GeoJSON
  world-110m.json / world-map-data.js          world TopoJSON
  water-china.json / water-china-data.js        rivers/lakes
  poster-themes-data.js                         color palettes
  build-real-paths.py / audit.py / merge-records.py   dev tools
docs/             these guides
```
