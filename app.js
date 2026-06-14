/* ============================================================
 *  自定义标题报头 —— 开源后改这一处，就能换成你自己的名字
 *  eyebrow : 左上小字（英文台头），留空则不显示
 *  title   : 主标题，用 \n 换行（默认两行）
 *  docTitle: 浏览器标签页标题
 * ============================================================ */
const SITE_TITLE = {
  eyebrow: "JOURNEY ATLAS",
  title: "Nova",
  docTitle: "Nova · Journey Atlas",
};

// 站点主人 / 默认旅客名 —— 开源后改成你自己的；示例为虚构人物「Nova Kepler」。
const OWNER_NAME = "Nova Kepler";

const STORAGE_KEY = "journeyatlas_records_v1";
const DATA_URL = "./data/travel-log.json";
const CHINA_MAP_URL = "./data/china-100000-full.json";
const WORLD_MAP_URL = "./data/world-110m.json";
const WATER_CHINA_URL = "./data/water-china.json";
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
];

const CHINA_BOUNDS = {
  minLng: 73.4,
  maxLng: 135.2,
  minLat: 17.3,
  maxLat: 53.7
};

// 世界视图用的经纬度范围（等距矩形）。覆盖中国 + 主要海外区域；裁掉南极。
const WORLD_BOUNDS = {
  minLng: -180,
  maxLng: 180,
  minLat: -60,
  maxLat: 85
};

// 当前视图，setMapView 时切换。
let mapView = "china";


const CITY = {
  "北京": { lat: 39.9042, lng: 116.4074 },
  "上海": { lat: 31.2304, lng: 121.4737 },
  "天津": { lat: 39.3434, lng: 117.3616 },
  "重庆": { lat: 29.563, lng: 106.5516 },
  "杭州": { lat: 30.2741, lng: 120.1551 },
  "南京": { lat: 32.0603, lng: 118.7969 },
  "苏州": { lat: 31.2989, lng: 120.5853 },
  "无锡": { lat: 31.4912, lng: 120.3119 },
  "宁波": { lat: 29.8683, lng: 121.544 },
  "合肥": { lat: 31.8206, lng: 117.2272 },
  "武汉": { lat: 30.5928, lng: 114.3055 },
  "长沙": { lat: 28.2282, lng: 112.9388 },
  "张家界": { lat: 29.117, lng: 110.4793 },
  "南昌": { lat: 28.682, lng: 115.8579 },
  "广州": { lat: 23.1291, lng: 113.2644 },
  "深圳": { lat: 22.5431, lng: 114.0579 },
  "珠海": { lat: 22.271, lng: 113.5767 },
  "东莞": { lat: 23.0207, lng: 113.7518 },
  "佛山": { lat: 23.0218, lng: 113.1219 },
  "桂林": { lat: 25.2736, lng: 110.29 },
  "南宁": { lat: 22.817, lng: 108.3665 },
  "海口": { lat: 20.044, lng: 110.1999 },
  "三亚": { lat: 18.2528, lng: 109.5119 },
  "厦门": { lat: 24.4798, lng: 118.0894 },
  "福州": { lat: 26.0745, lng: 119.2965 },
  "郑州": { lat: 34.7466, lng: 113.6254 },
  "济南": { lat: 36.6512, lng: 117.1201 },
  "青岛": { lat: 36.0671, lng: 120.3826 },
  "石家庄": { lat: 38.0428, lng: 114.5149 },
  "西安": { lat: 34.3416, lng: 108.9398 },
  "成都": { lat: 30.5728, lng: 104.0668 },
  "昆明": { lat: 24.8801, lng: 102.8329 },
  "兰州": { lat: 36.0611, lng: 103.8343 },
  "西宁": { lat: 36.6171, lng: 101.7782 },
  "银川": { lat: 38.4872, lng: 106.2309 },
  "呼和浩特": { lat: 40.8424, lng: 111.749 },
  "乌鲁木齐": { lat: 43.8256, lng: 87.6168 },
  "拉萨": { lat: 29.652, lng: 91.1721 },
  "哈尔滨": { lat: 45.8038, lng: 126.535 },
  "长春": { lat: 43.8171, lng: 125.3235 },
  "沈阳": { lat: 41.8057, lng: 123.4315 },
  "大连": { lat: 38.914, lng: 121.6147 },
  "香港": { lat: 22.3193, lng: 114.1694 },
  "澳门": { lat: 22.1987, lng: 113.5439 },
  "巴黎": { lat: 48.8566, lng: 2.3522 },
  "威尼斯": { lat: 45.4408, lng: 12.3155 },
  "维也纳": { lat: 48.2082, lng: 16.3738 },
  "曼谷": { lat: 13.7563, lng: 100.5018 },
  "新加坡": { lat: 1.3521, lng: 103.8198 },
};

// 城市 → 国家/地区 + 大洲。未列出的默认中国大陆 / 亚洲。用于「旅行档案」统计的国家、大洲计数。
const CITY_META = {
  "香港": { country: "中国香港", continent: "亚洲" },
  "澳门": { country: "中国澳门", continent: "亚洲" },
  "巴黎": { country: "法国", continent: "欧洲" },
  "威尼斯": { country: "意大利", continent: "欧洲" },
  "维也纳": { country: "奥地利", continent: "欧洲" },
  "曼谷": { country: "泰国", continent: "亚洲" },
  "新加坡": { country: "新加坡", continent: "亚洲" },
};

function cityMeta(city) {
  return CITY_META[city] || { country: "中国", continent: "亚洲" };
}

// 海报落款用：城市拉丁名 + 国家英文名。没收录的回退到中文名。
const CITY_EN = {
  "北京": "BEIJING", "上海": "SHANGHAI", "天津": "TIANJIN", "重庆": "CHONGQING", "杭州": "HANGZHOU", "南京": "NANJING", "苏州": "SUZHOU", "无锡": "WUXI", "宁波": "NINGBO", "合肥": "HEFEI", "武汉": "WUHAN", "长沙": "CHANGSHA", "张家界": "ZHANGJIAJIE", "南昌": "NANCHANG", "广州": "GUANGZHOU", "深圳": "SHENZHEN", "珠海": "ZHUHAI", "东莞": "DONGGUAN", "佛山": "FOSHAN", "桂林": "GUILIN", "南宁": "NANNING", "海口": "HAIKOU", "三亚": "SANYA", "厦门": "XIAMEN", "福州": "FUZHOU", "郑州": "ZHENGZHOU", "济南": "JINAN", "青岛": "QINGDAO", "石家庄": "SHIJIAZHUANG", "西安": "XI'AN", "成都": "CHENGDU", "昆明": "KUNMING", "兰州": "LANZHOU", "西宁": "XINING", "银川": "YINCHUAN", "呼和浩特": "HOHHOT", "乌鲁木齐": "ÜRÜMQI", "拉萨": "LHASA", "哈尔滨": "HARBIN", "长春": "CHANGCHUN", "沈阳": "SHENYANG", "大连": "DALIAN", "香港": "HONG KONG", "澳门": "MACAU", "巴黎": "PARIS", "威尼斯": "VENICE", "维也纳": "VIENNA", "曼谷": "BANGKOK", "新加坡": "SINGAPORE"
};
const COUNTRY_EN = {
  "中国": "CHINA", "中国香港": "CHINA", "中国澳门": "CHINA",
  "法国": "FRANCE", "意大利": "ITALY", "奥地利": "AUSTRIA", "泰国": "THAILAND", "新加坡": "SINGAPORE"
};
function cityLatin(city) { return CITY_EN[city] || city || ""; }
// 地图标签用 Title Case（"LANZHOU"→"Lanzhou"），跟底图自带地名一致；海报落款仍用全大写的 cityLatin。
function titleCase(s) { return String(s).toLowerCase().replace(/(^|[\s-])([a-z])/g, (_, sep, c) => sep + c.toUpperCase()); }
function countryLatin(city) { return COUNTRY_EN[cityMeta(city).country] || "CHINA"; }

// 两城大圆距离（公里），用于累计里程。任一城市无坐标则返回 0。
function greatCircleKm(a, b) {
  const pa = CITY[a];
  const pb = CITY[b];
  if (!pa || !pb) return 0;
  const R = 6371;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(pb.lat - pa.lat);
  const dLng = toRad(pb.lng - pa.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(pa.lat)) * Math.cos(toRad(pb.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(s))));
}

const KIND = {
  flight: { label: "航班", color: "var(--flight)" },
  rail: { label: "铁路", color: "var(--rail)" },
  road: { label: "地面/水路", color: "var(--road)" },
  stay: { label: "停留", color: "var(--stay)" },
  cancelled: { label: "退改", color: "rgba(248, 242, 230, .48)" },
  other: { label: "门票/其他", color: "var(--other)" }
};

const CONFIDENCE = {
  confirmed: "已确认",
  partial: "部分确认",
  inferred: "推定",
  pending: "缺口·待补段"
};

const AI_RECORD_PROMPT = `请从我上传的车票、机票、行程单、订单截图或报销票据中抽取个人行旅行程。

只输出 JSON，不要输出解释。格式如下：
{
  "records": [
    {
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "kind": "flight | rail | road | stay | cancelled | other",
      "title": "城市A → 城市B",
      "origin": "城市A",
      "destination": "城市B",
      "departTime": "HH:mm",
      "arriveTime": "HH:mm",
      "durationMinutes": 0,
      "transportNo": "车次或航班号",
      "amountCny": 0,
      "traveler": "Nova Kepler",
      "people": ["Nova Kepler"],
      "project": "",
      "confidence": "confirmed | partial | inferred | pending",
      "countsAsAway": true,
      "countsAsVisited": true,
      "showInTimeline": true,
      "displayLayer": "journey",
      "evidence": "票据文件名或来源",
      "notes": "缺失字段或判断依据"
    }
  ]
}

规则：只填票据上能确认的信息；不能确认的字段留空或写 null；退票/改签用 cancelled，且 countsAsAway/countsAsVisited 为 false；城市名写城市，不写具体车站；金额用实际支付金额，发票金额不同则另写 invoiceAmountCny。`;


const CITY_ALIAS = {
  "北京南": "北京",
  "北京西": "北京",
  "北京北": "北京",
  "北京东": "北京",
  "北京站": "北京",
  "大兴机场": "北京",
  "首都机场": "北京",
  "上海虹桥": "上海",
  "上海南": "上海",
  "上海西": "上海",
  "上海浦东": "上海",
  "虹桥机场": "上海",
  "浦东机场": "上海",
  "杭州东": "杭州",
  "杭州西": "杭州",
  "萧山机场": "杭州",
  "合肥南": "合肥",
  "长沙南": "长沙",
  "深圳北": "深圳",
  "深圳东": "深圳",
  "深圳宝安": "深圳",
  "宝安机场": "深圳",
  "香港西九龙": "香港",
  "广州南": "广州",
  "广州东": "广州",
  "白云机场": "广州",
  "福田": "深圳",
  "南沙": "广州",
  "南沙北": "广州",
  "天津西": "天津",
  "天津南": "天津",
  "成都东": "成都",
  "天府机场": "成都",
  "双流机场": "成都",
};

const els = {
  year: document.getElementById("yearFilter"),
  traveler: document.getElementById("travelerFilter"),
  kind: document.getElementById("kindFilter"),
  confidence: document.getElementById("confidenceFilter"),
  search: document.getElementById("searchInput"),
  searchSuggest: document.getElementById("searchSuggest"),
  timeline: document.getElementById("timeline"),
  posterCity: document.getElementById("posterCity"),
  posterCoord: document.getElementById("posterCoord"),
  posterCountry: document.getElementById("posterCountry"),
  playCaption: document.getElementById("playCaption"),
  posterBtn: document.getElementById("posterBtn"),
  posterBtnTop: document.getElementById("posterBtnTop"),
  posterModal: document.getElementById("posterModal"),
  pmTitle: document.getElementById("pmTitle"),
  pmClose: document.getElementById("pmClose"),
  posterCanvas: document.getElementById("posterCanvas"),
  pmStatus: document.getElementById("pmStatus"),
  pmRadius: document.getElementById("pmRadius"),
  pmRadiusVal: document.getElementById("pmRadiusVal"),
  pmTheme: document.getElementById("pmTheme"),
  pmSize: document.getElementById("pmSize"),
  pmPoi: document.getElementById("pmPoi"),
  pmTitleInput: document.getElementById("pmTitleInput"),
  pmColorGrid: document.getElementById("pmColorGrid"),
  pmFont: document.getElementById("pmFont"),
  pmGenerate: document.getElementById("pmGenerate"),
  pmDownload: document.getElementById("pmDownload"),
  ledgerBody: document.getElementById("ledgerBody"),
  recordCount: document.getElementById("recordCount"),
  ledgerCount: document.getElementById("ledgerCount"),
  ledgerSearch: document.getElementById("ledgerSearchInput"),
  ledgerSearchSuggest: document.getElementById("ledgerSearchSuggest"),
  detailTitle: document.getElementById("detailTitle"),
  detailText: document.getElementById("detailText"),
  detailDate: document.getElementById("detailDate"),
  detailDuration: document.getElementById("detailDuration"),
  detailCost: document.getElementById("detailCost"),
  detailConfidence: document.getElementById("detailConfidence"),
  status: document.getElementById("dataStatus"),
  fileInput: document.getElementById("fileInput"),
  form: document.getElementById("recordForm"),
  cityList: document.getElementById("cityList"),
  playBtn: document.getElementById("playBtn"),
  playResetBtn: document.getElementById("playResetBtn"),
  playStopBtn: document.getElementById("playStopBtn"),
  posterCaption: document.querySelector(".poster-caption"),
  ticketFileInput: document.getElementById("ticketFileInput"),
  ticketFileName: document.getElementById("ticketFileName"),
  ocrText: document.getElementById("ocrText"),
  intakeStatus: document.getElementById("intakeStatus"),
  intakePreview: document.getElementById("intakePreview"),
  parseOcrBtn: document.getElementById("parseOcrBtn"),
  importAiBtn: document.getElementById("importAiBtn"),
  copyPromptBtn: document.getElementById("copyPromptBtn"),
  statsScope: document.getElementById("statsScope"),
  statKm: document.getElementById("statKm"),
  statKmSub: document.getElementById("statKmSub"),
  statTrips: document.getElementById("statTrips"),
  statTripsSub: document.getElementById("statTripsSub"),
  statCities: document.getElementById("statCities"),
  statCitiesSub: document.getElementById("statCitiesSub"),
  statCountries: document.getElementById("statCountries"),
  statCountriesSub: document.getElementById("statCountriesSub"),
  statContinents: document.getElementById("statContinents"),
  statContinentsSub: document.getElementById("statContinentsSub"),
  cityRank: document.getElementById("cityRank"),
  routeRank: document.getElementById("routeRank"),
  countryList: document.getElementById("countryList"),
  yearRank: document.getElementById("yearRank"),
  kindRank: document.getElementById("kindRank")
};

let records = [];
let selectedId = "";
let playTimer = null;          // requestAnimationFrame 句柄（播放中非 null）
let play = null;               // 播放状态 { segs, i, grow, lastTs, holdUntil, fitKey }
let playSpeed = "normal";      // 播放速度：slow / normal / fast
const PLAY_GROW_MS = { slow: 2200, normal: 1100, fast: 520 };   // 每段"生长"时长(ms)
let focusCity = ""; // 当前聚焦城市（中文名），供"城市街道海报"跳转用

async function fetchJsonWithFallback(url, fallback, label) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${label}读取失败：${res.status}`);
    return { data: await res.json(), source: "json" };
  } catch (error) {
    if (fallback) return { data: fallback, source: "inline" };
    throw error;
  }
}

async function loadData({ preferLocal = true } = {}) {
  if (preferLocal) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      records = normalize(JSON.parse(saved));
      els.status.textContent = `本机版本，${records.length} 条行程`;
      return;
    }
  }

  const { data, source } = await fetchJsonWithFallback(DATA_URL, window.TRAVEL_LOG_DATA, "资料");
  records = normalize(data.records || []);
  els.status.textContent = source === "inline"
    ? `本地文件版本，${records.length} 条行程`
    : `${data.metadata?.lastUpdated || "当前"} 资料，${records.length} 条行程`;
}




// 把一组行程的所有城市框进画面
function fitToRecords(list) {
  if (!glMap || !list.length) return;
  let minLng = 999, minLat = 999, maxLng = -999, maxLat = -999, any = false;
  list.forEach(r => [r.origin, r.destination].forEach(c => {
    const ll = cityLngLat(c);
    if (ll) { any = true; minLng = Math.min(minLng, ll[0]); maxLng = Math.max(maxLng, ll[0]); minLat = Math.min(minLat, ll[1]); maxLat = Math.max(maxLat, ll[1]); }
  }));
  if (any) glMap.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 90, duration: 900, maxZoom: 6 });
}

// 按"实际去过的地方"算取景框：中国视图只框境内点（不再为没去过的中亚留半屏空白），
// 世界视图框全部点。补一点最小跨度，免得数据全挤在一两座城时镜头怼脸。
function dataBounds(scope) {
  const inChina = (lng, lat) => lng >= 73 && lng <= 135.2 && lat >= 17.5 && lat <= 54.5;
  let minLng = 999, minLat = 999, maxLng = -999, maxLat = -999, any = false;
  filteredRecords().forEach(r => {
    if (r.countsAsVisited === false) return;
    [r.origin, r.destination].forEach(c => {
      const ll = cityLngLat(c);
      if (!ll) return;
      if (scope === "china" && !inChina(ll[0], ll[1])) return;
      any = true;
      minLng = Math.min(minLng, ll[0]); maxLng = Math.max(maxLng, ll[0]);
      minLat = Math.min(minLat, ll[1]); maxLat = Math.max(maxLat, ll[1]);
    });
  });
  if (!any) {
    const b = scope === "world" ? WORLD_BOUNDS : CHINA_BOUNDS;
    return [[b.minLng, b.minLat], [b.maxLng, b.maxLat]];
  }
  const padLng = Math.max(1.2, (maxLng - minLng) * 0.06);
  const padLat = Math.max(1.0, (maxLat - minLat) * 0.06);
  return [[minLng - padLng, minLat - padLat], [maxLng + padLng, maxLat + padLat]];
}

// 中国 / 世界视图：平滑飞到「数据本身」的范围（MapLibre 可自由拖动缩放，这里只给一个落点）。
function setMapView(view) {
  mapView = view;
  if (glMap) {
    glMap.fitBounds(dataBounds(view), { padding: { top: 90, bottom: 110, left: 70, right: 70 }, duration: 800 });
  }
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
}

function normalize(list) {
  return list.map((item, index) => {
    const amount = parseOptionalNumber(item.amountCny);
    const invoiceAmount = parseOptionalNumber(item.invoiceAmountCny);
    const durationMinutes = parseOptionalNumber(item.durationMinutes);
    const people = Array.isArray(item.people)
      ? item.people
      : String(item.people || item.traveler || "")
        .split(/[、,，/]/)
        .map(value => value.trim())
        .filter(Boolean);

    return {
      ...item,
      id: item.id || `${item.startDate || "date"}-${index}`,
      endDate: item.endDate || item.startDate,
      kind: KIND[item.kind] ? item.kind : "other",
      title: item.title || [item.origin, item.destination].filter(Boolean).join(" → ") || "未命名行程",
      amountCny: amount,
      invoiceAmountCny: invoiceAmount,
      durationMinutes,
      confidence: item.confidence || "pending",
      traveler: item.traveler || people.join(" / ") || "待确认",
      people,
      countsAsAway: item.countsAsAway !== false && item.countsAsAway !== "false",
      countsAsVisited: item.countsAsVisited !== false && item.countsAsVisited !== "false",
      showInTimeline: item.showInTimeline !== false && item.showInTimeline !== "false",
      displayLayer: item.displayLayer || "journey"
    };
  }).sort((a, b) => String(a.startDate || "").localeCompare(String(b.startDate || "")));
}

function parseOptionalNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function setupFilters() {
  // 重建 select 前先记住当前选值——表单提交/导入会再次走到这里，不该把用户筛着的条件静默吹掉
  const keep = {
    year: els.year.value || "all",
    traveler: els.traveler.value || "self",
    kind: els.kind.value || "all",
    confidence: els.confidence.value || "all"
  };
  const restore = (sel, value, fallback) => {
    sel.value = value;
    if (sel.value !== value) sel.value = fallback;   // 选项已不存在（如该年份被删空）才回退
  };

  const years = Array.from(new Set(records.map(record => String(record.startDate || "").slice(0, 4)).filter(Boolean))).sort();
  els.year.innerHTML = `<option value="all">全部年份</option>${years.map(year => `<option value="${year}">${year}</option>`).join("")}`;
  restore(els.year, keep.year, "all");

  const travelers = Array.from(new Set(records.flatMap(record => [record.traveler, ...(record.people || [])]).filter(Boolean))).sort((a, b) => a.localeCompare(b, "zh-CN"));
  els.traveler.innerHTML = [
    `<option value="self">${OWNER_NAME}</option>`,
    `<option value="all">全部旅客</option>`,
    ...travelers
      .filter(name => name && !name.includes(OWNER_NAME))
      .map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`)
  ].join("");
  restore(els.traveler, keep.traveler, "self");

  // 类型筛选不列"退改"(它是状态不是出行方式，且仅个别退票费记录；数据里仍保留该 kind)
  els.kind.innerHTML = `<option value="all">全部类型</option>${Object.entries(KIND).filter(([key]) => key !== "cancelled").map(([key, value]) => `<option value="${key}">${value.label}</option>`).join("")}`;
  restore(els.kind, keep.kind, "all");
  els.confidence.innerHTML = [
    `<option value="all">全部证据</option>`,
    ...Object.entries(CONFIDENCE).map(([key, label]) => `<option value="${key}">${label}</option>`)
  ].join("");
  restore(els.confidence, keep.confidence, "all");
  els.cityList.innerHTML = Object.keys(CITY).sort((a, b) => a.localeCompare(b, "zh-CN")).map(city => `<option value="${city}"></option>`).join("");
}

function filters() {
  return {
    year: els.year.value,
    traveler: els.traveler.value,
    kind: els.kind.value,
    confidence: els.confidence.value
  };
}

function includesTraveler(record, traveler) {
  if (traveler === "all") return true;
  if (traveler === "self") return record.traveler.includes(OWNER_NAME) || (record.people || []).includes(OWNER_NAME);
  return record.traveler.includes(traveler) || (record.people || []).includes(traveler);
}

// 同日链式贪心排序：先按日期+时刻排，再对"同一天内无时刻"的段，把能接上前一段到达城的排前面。
// 修掉 同日"A→B(航班)"+"B→C(自驾)" 因无时刻而排反、平白制造断点/丢夜数的问题。
function chainSortSegs(segs) {
  const nc = c => { const s = stripShi(String(c || "").trim()); return CITY_ALIAS[s] || s; };
  const sorted = [...segs].sort((a, b) => String(a.startDate || "").localeCompare(String(b.startDate || "")) || String(a.departTime || "").localeCompare(String(b.departTime || "")));
  const out = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].startDate === sorted[i].startDate) j += 1;
    const day = sorted.slice(i, j);
    if (day.length > 1 && day.some(s => !s.departTime)) {
      let cur = out.length ? nc(out[out.length - 1].destination) : null;
      const pool = [...day];
      while (pool.length) {
        const idx = cur ? pool.findIndex(s => nc(s.origin) === cur) : -1;
        const next = idx >= 0 ? pool.splice(idx, 1)[0] : pool.shift();
        out.push(next);
        cur = nc(next.destination);
      }
    } else {
      out.push(...day);
    }
    i = j;
  }
  return out;
}

// 行程连续性缺口（断点）：把已录行程按时间排序，"到达地 ≠ 下一段出发地"即缺一段连接。
// 动态算出，做成 confidence=pending 的"待补"占位条目——只在筛「待补证据」时注入，
// 不写进数据、不画线(countsAsVisited:false)、不进统计/播放；补齐某段后此缺口自动消失。
function computeContinuityGaps() {
  const norm = c => { const s = stripShi(String(c || "").trim()); return CITY_ALIAS[s] || s; };
  const segs = chainSortSegs(records
    .filter(r => ["flight", "rail", "road"].includes(r.kind) && r.countsAsVisited !== false && r.origin && r.destination && norm(r.origin) !== norm(r.destination)));
  const gaps = [];
  // 已凭国家移民局出入境记录完整录入的相邻口岸往返(深圳↔香港、珠海↔澳门)：
  // 所有过境都在库，残留"断点"只是无时刻记录排不出顺序的假象，不是真缺段，整对跳过。
  const BORDER = new Set(["深圳|香港", "香港|深圳", "珠海|澳门", "澳门|珠海"]);
  for (let i = 0; i < segs.length - 1; i++) {
    const a = segs[i], b = segs[i + 1], da = norm(a.destination), ob = norm(b.origin);
    if (BORDER.has(`${da}|${ob}`)) continue;
    // 同一天的"断点"多是无时刻过境记录的排序假象(零天里塞不下一段真行程)，跳过
    if (da !== ob && b.startDate && b.startDate !== (a.endDate || a.startDate)) {
      gaps.push({
        id: `gap-${da}-${ob}-${i}`, _gap: true, kind: "other", confidence: "pending",
        title: `${da} → ${ob}`, origin: da, destination: ob,
        startDate: a.endDate || a.startDate || "", endDate: b.startDate || "",
        departTime: "", arriveTime: "", durationMinutes: null, transportNo: "", amountCny: null, invoiceAmountCny: null,
        traveler: OWNER_NAME, people: [OWNER_NAME], project: "",
        countsAsAway: false, countsAsVisited: false, showInTimeline: true, displayLayer: "journey",
        evidence: "", notes: `待补连接段：${a.endDate || a.startDate} 到「${da}」… ${b.startDate} 从「${ob}」出发；找到这段票截图发我即可。`
      });
    }
  }
  return gaps;
}

function filteredRecords() {
  const active = filters();
  // 只有筛「待补证据」时，才把动态算出的断点占位条目并进来（其余视图保持干净，不受影响）。
  const pool = active.confidence === "pending" ? records.concat(computeContinuityGaps()) : records;
  return pool.filter(record => {
    if (active.year !== "all" && !String(record.startDate || "").startsWith(active.year)) return false;
    if (active.kind !== "all" && record.kind !== active.kind) return false;
    if (active.confidence !== "all" && record.confidence !== active.confidence) return false;
    if (!includesTraveler(record, active.traveler)) return false;
    return true;
  });
}

function render() {
  const list = filteredRecords();
  if (!selectedId || !list.some(record => record.id === selectedId)) {
    selectedId = list.find(record => record.showInTimeline !== false)?.id || list[0]?.id || "";
  }
  renderStats(list);
  renderStatsPanel(list);
  renderMap(list);
  renderTimeline(list);
  renderLedger(list);
  renderDetail(list.find(record => record.id === selectedId) || list[0], list);
}

// 「旅行档案」统计：总里程、出行次数、国家/大洲、城市与航线排行。跟随当前筛选实时计算。
function renderStatsPanel(list) {
  if (!els.statKm) return;
  const moves = list.filter(r => ["flight", "rail", "road"].includes(r.kind));
  let km = 0;
  const kmByKind = { flight: 0, rail: 0, road: 0 };
  moves.forEach(r => {
    const d = greatCircleKm(r.origin, r.destination);
    km += d;
    kmByKind[r.kind] += d;
  });

  const cityVisits = new Map();
  const routeCount = new Map();
  const countries = new Map();
  const continents = new Map();
  list.forEach(r => {
    if (!r.countsAsVisited) return;
    // 用 Set 去重两端：stay/门票记录 origin===destination，不去重会把同一城 +2，到访/国家/大洲全部虚高
    new Set([r.origin, r.destination].filter(Boolean)).forEach(c => {
      cityVisits.set(c, (cityVisits.get(c) || 0) + 1);
      const m = cityMeta(c);
      countries.set(m.country, (countries.get(m.country) || 0) + 1);
      continents.set(m.continent, (continents.get(m.continent) || 0) + 1);
    });
    if (r.origin && r.destination && r.origin !== r.destination) {
      // 高频路线按"双向合并"计数：北京↔深圳算一条走廊——有向拆分会把直觉里的次数稀释一半
      const pair = [stripShi(r.origin), stripShi(r.destination)].sort();
      const key = `${pair[0]} ⇌ ${pair[1]}`;
      routeCount.set(key, (routeCount.get(key) || 0) + 1);
    }
  });

  // 每座城市"待过多久"：把行程按时间排序，到达某城(到达日) → 下次从该城出发(出发日) 的间隔即停留夜数，
  // 沿连续行程链累加。同日多段无时刻时用"链式贪心"排序（能接上前段到达城的排前面）——
  // 否则 同日"A→B"+"B→C" 可能排反，平白制造断点。
  const normCity = c => { const s = stripShi(String(c || "").trim()); return CITY_ALIAS[s] || s; };
  const cityNights = new Map();
  const dwellSegs = chainSortSegs(list
    .filter(r => ["flight", "rail", "road"].includes(r.kind) && r.countsAsVisited !== false && r.origin && r.destination && normCity(r.origin) !== normCity(r.destination)));
  for (let i = 0; i < dwellSegs.length - 1; i++) {
    const a = dwellSegs[i], b = dwellSegs[i + 1];
    if (normCity(a.destination) === normCity(b.origin)) {
      const nights = Math.max(0, daysBetween(a.endDate || a.startDate, b.startDate).length - 1);
      if (nights > 0) { const c = normCity(a.destination); cityNights.set(c, (cityNights.get(c) || 0) + nights); }
    }
  }
  // 主城（home）：默认"不在外地的时间都在主城"。链式夜数对主城是严重低估
  // （链一断北京段就丢），改用互补口径：数据总跨度 − 在外地的夜数 − 在途夜数(粗略)。
  if (dwellSegs.length > 1) {
    const first = dwellSegs[0].startDate, last = dwellSegs[dwellSegs.length - 1].startDate;
    const totalNights = Math.max(0, daysBetween(first, last).length - 1);
    let awayNights = 0;
    cityNights.forEach((n, c) => { if (c !== "北京") awayNights += n; });
    const bjHome = Math.max(cityNights.get("北京") || 0, totalNights - awayNights - Math.round(dwellSegs.length * 0.25));
    cityNights.set("北京", bjHome);
  }

  const fmt = n => n.toLocaleString("en-US");
  els.statKm.textContent = km >= 10000 ? `${(km / 10000).toFixed(1)}万` : fmt(km);
  els.statKmSub.textContent = `飞行约${fmt(kmByKind.flight)} · 铁路约${fmt(kmByKind.rail)}`;
  els.statTrips.textContent = moves.length;
  const flights = moves.filter(r => r.kind === "flight").length;
  const rails = moves.filter(r => r.kind === "rail").length;
  els.statTripsSub.textContent = `航班${flights} · 铁路${rails} · 地面/水路${moves.length - flights - rails}`;

  const cities = [...cityVisits.keys()];
  els.statCities.textContent = cities.length;
  els.statCitiesSub.textContent = cities.slice(0, 3).join(" / ") || "—";
  els.statCountries.textContent = countries.size;
  els.statCountriesSub.textContent = [...countries.keys()].slice(0, 4).join(" / ") || "—";
  els.statContinents.textContent = continents.size;
  els.statContinentsSub.textContent = [...continents.keys()].join(" / ") || "—";

  // 四个榜各用各的语义色与形态（此前全是同款红绿渐变条——信息层级杂糅，分不清谁是谁）
  const bars = (entries, max, color, attrFn) => entries.map(([name, n]) =>
    `<li${attrFn ? ` ${attrFn(name)}` : ""}><span class="rk-name">${escapeHtml(name)}</span><span class="rk-bar" style="--w:${Math.max(4, (n / max) * 100).toFixed(1)}%"><i${color ? ` style="background:${color}"` : ""}></i></span><span class="rk-num">${n}</span></li>`
  ).join("");

  // 城市排行：改为「待得最久」——按累计停留夜数排序，数字显示「X晚 · Y次」(几晚+到访几次)。
  // 条宽用 sqrt 缩放，免得北京(在家)夜数过大把其它城压成细条；无夜数(纯过境/断点)的城退回按到访次数。
  const cityAgg = [...cityVisits.entries()].map(([name, visits]) => ({ name, visits, nights: cityNights.get(normCity(name)) || 0 }));
  cityAgg.sort((a, b) => (b.nights - a.nights) || (b.visits - a.visits));
  const cityTopN = cityAgg.slice(0, 10);
  const anyNights = cityTopN.some(c => c.nights > 0);
  const maxNights = Math.max(1, ...cityTopN.map(c => c.nights));
  const maxVisits = Math.max(1, ...cityTopN.map(c => c.visits));
  els.cityRank.innerHTML = cityTopN.length ? cityTopN.map(c => {
    const w = (anyNights && c.nights > 0) ? Math.max(8, Math.sqrt(c.nights / maxNights) * 100) : Math.max(6, (c.visits / maxVisits) * 100);
    const num = c.nights > 0 ? `${c.nights}晚·${c.visits}次` : `${c.visits}次`;
    return `<li data-city="${escapeHtml(stripShi(c.name))}" data-country="${escapeHtml(cityMeta(c.name).country)}"><span class="rk-name">${escapeHtml(c.name)}</span><span class="rk-bar" style="--w:${w.toFixed(1)}%"><i style="background:var(--rail)"></i></span><span class="rk-num">${num}</span></li>`;
  }).join("") : "<li class=\"rk-empty\">暂无</li>";   // 城市=停留 → 青瓷绿粗条
  // 高频路线：纯文字榜 + 旧体序号——与条形榜形态彻底区分
  const routeTop = [...routeCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  els.routeRank.innerHTML = routeTop.length ? routeTop.map(([name, n], i) =>
    `<li data-cities="${escapeHtml(name.split(" ⇌ ").map(stripShi).join(","))}"><span class="rk-idx">${String(i + 1).padStart(2, "0")}</span><span class="rk-name">${escapeHtml(name)}</span><span class="rk-dots"></span><span class="rk-num">${n}</span></li>`
  ).join("") : "<li class=\"rk-empty\">暂无</li>";
  const countryTop = [...countries.entries()].sort((a, b) => b[1] - a[1]);
  els.countryList.innerHTML = countryTop.length ? bars(countryTop, countryTop[0][1], "var(--gold)", name => `data-country="${escapeHtml(name)}"`) : "<li class=\"rk-empty\">暂无</li>";   // 国家=赭金细线

  // 年度足迹：每年出行次数（含里程提示）
  if (els.yearRank) {
    const yearAgg = new Map();
    moves.forEach(r => {
      const y = String(r.startDate || "").slice(0, 4);
      if (!y) return;
      const e = yearAgg.get(y) || { n: 0, km: 0 };
      e.n += 1;
      e.km += greatCircleKm(r.origin, r.destination);
      yearAgg.set(y, e);
    });
    const yearRows = [...yearAgg.entries()].sort((a, b) => b[0].localeCompare(a[0]));
    const yearMax = Math.max(1, ...yearRows.map(e => e[1].n));
    els.yearRank.innerHTML = yearRows.length ? yearRows.map(([y, e]) =>
      `<li><span class="rk-name">${y}</span><span class="rk-bar" style="--w:${Math.max(4, (e.n / yearMax) * 100).toFixed(1)}%"><i style="background:var(--red)"></i></span><span class="rk-num">${e.n}次</span></li>`
    ).join("") : "<li class=\"rk-empty\">暂无</li>";   // 年度=时间轴 → 赭红
  }

  // 出行方式：按交通工具分（航班/铁路/地面/停留）
  if (els.kindRank) {
    const kindAgg = new Map();
    list.forEach(r => kindAgg.set(r.kind, (kindAgg.get(r.kind) || 0) + 1));
    const kindRows = [...kindAgg.entries()].filter(([k]) => k !== "cancelled").sort((a, b) => b[1] - a[1]);
    const kindMax = Math.max(1, ...kindRows.map(e => e[1]));
    els.kindRank.innerHTML = kindRows.length ? kindRows.map(([k, n]) =>
      `<li><span class="rk-name">${escapeHtml(KIND[k] ? KIND[k].label : k)}</span><span class="rk-bar" style="--w:${Math.max(4, (n / kindMax) * 100).toFixed(1)}%"><i style="background:${KIND[k] ? KIND[k].color : "var(--other)"}"></i></span><span class="rk-num">${n}</span></li>`
    ).join("") : "<li class=\"rk-empty\">暂无</li>";   // 出行方式=各自语义色，与地图图例呼应
  }

  wireStatsHover();   // 跨榜悬停联动（幂等，只绑一次）

  if (els.statsScope) {
    // 右上角口径标签：反映「年份 · 旅客 · 类型 · 证据」完整筛选组合，避免只显示年份时的歧义。
    const f = filters();
    const parts = [f.year && f.year !== "all" ? `${f.year} 年` : "全部年份"];
    parts.push(f.traveler === "self" ? OWNER_NAME : f.traveler === "all" ? "全部旅客" : f.traveler);
    if (f.kind && f.kind !== "all") parts.push(KIND[f.kind] ? KIND[f.kind].label : f.kind);
    if (f.confidence && f.confidence !== "all") parts.push(CONFIDENCE[f.confidence] || f.confidence);
    els.statsScope.textContent = parts.join(" · ");
  }
}

function renderStats(list) {
  const daySet = new Set();
  const citySet = new Set();
  let durationMinutes = 0;
  let knownDurationCount = 0;
  let movableCount = 0;
  let amount = 0;
  let missing = 0;

  list.forEach(record => {
    if (record.countsAsAway) daysBetween(record.startDate, record.endDate).forEach(day => daySet.add(day));
    if (["flight", "rail", "road"].includes(record.kind)) movableCount += 1;
    if (record.durationMinutes !== null) {
      durationMinutes += record.durationMinutes;
      knownDurationCount += 1;
    } else if (["flight", "rail", "road"].includes(record.kind)) {
      missing += 1;
    }
    if (record.amountCny !== null) amount += record.amountCny;
    else missing += 1;
    if (record.confidence !== "confirmed") missing += 1;
    if (record.countsAsVisited) [record.origin, record.destination].filter(Boolean).forEach(city => citySet.add(city));
  });

  document.getElementById("metricDays").textContent = daySet.size;
  document.getElementById("metricDaysSub").textContent = list.length ? `${dateRange(list[0])} 起` : "无记录";
  document.getElementById("metricCost").textContent = money(amount);
  document.getElementById("metricCostSub").textContent = "当前筛选可见金额";
  document.getElementById("metricHours").textContent = (durationMinutes / 60).toFixed(1);
  document.getElementById("metricHoursSub").textContent = `${knownDurationCount}/${movableCount} 段有时长`;
  document.getElementById("metricCities").textContent = citySet.size;
  document.getElementById("metricCitiesSub").textContent = Array.from(citySet).slice(0, 4).join(" / ") || "待点亮";
  document.getElementById("metricMissing").textContent = missing;
  document.getElementById("metricMissingSub").textContent = "证据、时长或金额";
}











// ——— MapLibre 滑动底图（可拖动/缩放，矢量瓦片来自 openfreemap）———
const MAP_STYLES = {
  warm: "https://tiles.openfreemap.org/styles/positron",
  slate: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  night: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
};
const ROUTE_COLORS = { flight: "#b84232", rail: "#52786d", road: "#9b7832", stay: "#7f8f5a", other: "#6e6578" };
const ROUTE_COLORS_NIGHT = { flight: "#ff6a5a", rail: "#4fd1c5", road: "#f2b84a", stay: "#9ae6b4", other: "#c7d3e6" };
// 选中(高亮)用更鲜明的配色，尤其铁路绿要更跳出来。
const ROUTE_COLORS_HI = { flight: "#c0392b", rail: "#2f8567", road: "#b5862c", stay: "#8aa64f", other: "#6e6578" };
const ROUTE_COLORS_NIGHT_HI = { flight: "#ff7a6a", rail: "#4ab892", road: "#ffc95a", stay: "#b6f5c8", other: "#d7e1f0" };
function currentSkin() { return document.documentElement.dataset.skin || "warm"; }
function routeColorExpr(hi) {
  const night = currentSkin() === "night";
  const c = hi ? (night ? ROUTE_COLORS_NIGHT_HI : ROUTE_COLORS_HI) : (night ? ROUTE_COLORS_NIGHT : ROUTE_COLORS);
  return ["match", ["get", "kind"], "flight", c.flight, "rail", c.rail, "road", c.road, "stay", c.stay, c.other];
}
let glMap = null;
let glReady = false;
let offlineMode = false;   // 断网/瓦片拉不到时退回本地简版底图（同一 MapLibre 投影，位置不变）
let glWired = false;       // 交互只挂一次（换底图后路线层会重建，但 layer 监听按 id 复用）
const glCityMarkers = new Map();

function stripShi(name) { return String(name || "").replace(/市$/, ""); }

function cityLngLat(name) {
  if (!name) return null;
  const clean = String(name).replace(/市$/, "");
  const p = CITY[clean] || CITY[clean.replace(/[南北东西站]/g, "")];
  return p ? [p.lng, p.lat] : null;
}

// 两城大圆弧插值，给航线一点弧度
function geoArc(a, b, n = 48) {
  const toRad = d => d * Math.PI / 180, toDeg = r => r * 180 / Math.PI;
  const lon1 = toRad(a[0]), lat1 = toRad(a[1]), lon2 = toRad(b[0]), lat2 = toRad(b[1]);
  const hav = Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2;
  const d = 2 * Math.asin(Math.min(1, Math.sqrt(hav)));
  if (!d || !isFinite(d)) return [a, b];
  const out = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    out.push([toDeg(Math.atan2(y, x)), toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)))]);
  }
  return out;
}

// 真实铁路轨迹：data/build-real-paths.py 用 BRouter(只走 railway=rail) 预计算的 OSM 铁轨折线，
// 按无向城市对存储（键＝sorted(城市).join("→")）。运行时按行程方向取出、必要时反向，
// 两端用城市中心点收尾，让轨迹贴到地图上的城市圆点。查不到的段返回 null → 回退大圆弧。
const RAIL_PATHS = (typeof window !== "undefined" && window.RAIL_PATHS && window.RAIL_PATHS.legs) || {};
function railPolyline(origin, destination) {
  if (!origin || !destination) return null;
  const o = String(origin).replace(/市$/, ""), d = String(destination).replace(/市$/, "");
  const sorted = [o, d].sort();                 // 与 Python sorted 一致（CJK 均 BMP，码点序相同）
  const leg = RAIL_PATHS[sorted.join("→")];
  if (!leg || !Array.isArray(leg.coords) || leg.coords.length < 2) return null;
  let coords = leg.coords.slice();
  if (sorted[0] !== o) coords.reverse();         // 存储是 first→second，行程反向则翻转
  const a = cityLngLat(origin), b = cityLngLat(destination);
  if (a) coords.unshift(a);                      // 起点城市圆点 → 最近车站的短接线
  if (b) coords.push(b);                          // 终点同理
  return coords;
}

const ROUTE_WIDTH = 1.6;     // 选中与未选中统一粗细——细一点更干净
// 按交通方式给固定横移，使重合走廊上的不同线错开成平行线，不再相互盖住
const KIND_OFFSET = ["match", ["get", "kind"], "flight", 2, "rail", -2, "road", 0.8, "stay", -0.8, 0];
// 彗星按交通方式取色（与图例同源）：航班赭红 / 铁路青瓷绿 / 地面赭金 / 停留橄榄 / 其他紫灰
const COMET_RGB = { flight: "184,66,50", rail: "82,120,109", road: "155,120,50", stay: "127,143,90", other: "110,101,120" };
function cometPaint(kind) {
  const rgb = COMET_RGB[kind] || COMET_RGB.flight;
  return ["interpolate", ["linear"], ["line-progress"],
    0, `rgba(${rgb},0)`, 0.55, `rgba(${rgb},.42)`, 0.92, `rgba(${rgb},.92)`, 1, `rgba(${rgb},1)`];
}

// 线网层级（艺术层核心）：走过次数 → 线宽与墨色深浅。
// 高频走廊（京深/深港这类走了十几次的）自然浮现为视觉主干，只走过一次的线退成极淡墨纹——
// 地图本身开始"讲哪里是你的生活动脉"。播放时已走段带 trodden=1，沉淀为更深的墨迹。
function routeWidthExpr() {
  return ["interpolate", ["linear"], ["coalesce", ["get", "count"], 1],
    1, 1.1, 3, 1.7, 8, 2.5, 16, 3.4];
}
function routeOpacityExpr(night) {
  const base = night
    ? [1, 0.42, 3, 0.55, 8, 0.68, 16, 0.8]
    : [1, 0.18, 3, 0.30, 8, 0.44, 16, 0.56];
  return ["case", ["==", ["coalesce", ["get", "trodden"], 0], 1], night ? 0.85 : 0.6,
    ["interpolate", ["linear"], ["coalesce", ["get", "count"], 1], ...base]];
}

function addRoutesLayer() {
  if (!glMap.getSource("routes")) glMap.addSource("routes", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
  // 彗星层：播放时"当前生长段"单独的源（lineMetrics 开启才能沿线渐变出尾淡头浓的拖尾）
  if (!glMap.getSource("comet")) glMap.addSource("comet", { type: "geojson", lineMetrics: true, data: { type: "FeatureCollection", features: [] } });
  const night = currentSkin() === "night";
  if (!glMap.getLayer("routes-line")) {
    // 未选中：细虚线，宽度/深浅随走过次数分级
    glMap.addLayer({
      id: "routes-line", type: "line", source: "routes",
      filter: ["!=", ["get", "sel"], 1],
      layout: { "line-cap": "butt", "line-join": "round" },
      paint: { "line-color": routeColorExpr(), "line-width": routeWidthExpr(), "line-opacity": routeOpacityExpr(night), "line-dasharray": [2.6, 1.3], "line-offset": KIND_OFFSET }
    });
    // 选中：深、且流动（呼吸透明度），宽度同样分级（高频选中线更有分量）
    glMap.addLayer({
      id: "routes-flow", type: "line", source: "routes",
      filter: ["==", ["get", "sel"], 1],
      layout: { "line-cap": "butt", "line-join": "round" },
      paint: { "line-color": routeColorExpr(true), "line-width": routeWidthExpr(), "line-opacity": 1, "line-dasharray": [2.6, 1.3], "line-offset": KIND_OFFSET }
    });
    // 彗星拖尾：尾部渐隐 → 头部浓亮，圆头；播放时当前段走这里。
    // line-gradient 不能按 feature 取色，但彗星一次只有一条线——drawPlayback 在段类型变化时
    // 用 cometPaint(kind) 整层换色（铁路青瓷绿/航班赭红/地面赭金，与图例一致）。
    glMap.addLayer({
      id: "routes-comet", type: "line", source: "comet",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-width": 3, "line-gradient": cometPaint("flight"), "line-opacity": 1, "line-opacity-transition": { duration: 450 } }
    });
    // 彗星头：一颗发亮的小核（颜色同样随段类型切换）
    glMap.addLayer({
      id: "comet-head", type: "circle", source: "comet",
      filter: ["==", ["geometry-type"], "Point"],
      paint: { "circle-radius": 4.2, "circle-color": "rgb(184,66,50)", "circle-blur": 0.35, "circle-opacity": 0.95, "circle-opacity-transition": { duration: 450 } }
    });
    // 透明加宽命中层：观感不变，但把点选/悬停触发范围放宽到约 18px，细线也容易点中。
    glMap.addLayer({
      id: "routes-hit", type: "line", source: "routes",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#000000", "line-opacity": 0, "line-width": 18 }
    });
  } else {
    glMap.setPaintProperty("routes-line", "line-color", routeColorExpr());
    glMap.setPaintProperty("routes-line", "line-opacity", routeOpacityExpr(night));
    glMap.setPaintProperty("routes-line", "line-width", routeWidthExpr());
    if (glMap.getLayer("routes-flow")) {
      glMap.setPaintProperty("routes-flow", "line-color", routeColorExpr(true));
      glMap.setPaintProperty("routes-flow", "line-width", routeWidthExpr());
    }
  }
  dimBaseLabels();
}

// 压淡底图自带的地名注记，让我们的标题/指标/航线浮上来（换肤后也要重跑）。
function dimBaseLabels() {
  if (!glMap || !glMap.getStyle) return;
  // 我去过的城市中文名集合（含"市"变体）。openfreemap 地名用 name / name:nonlatin（中文），
  // 隐藏底图里这些重复地名——只留我们深色的那份；没去过的城市底图灰名照常显示。
  const visited = [];
  const seen = new Set();
  const add = n => { if (n && !seen.has(n)) { seen.add(n); visited.push(n); } };
  records.forEach(r => [r.origin, r.destination].forEach(c => {
    if (!c) return;
    const k = String(c).replace(/市$/, "");
    add(k); add(k + "市");
    const en = titleCase(cityLatin(k));     // 国外城市的英文名（藏在底图 name:latin/name:en），用来连同隐藏
    if (en && en !== k) add(en);
  }));
  (glMap.getStyle().layers || []).forEach(l => {
    if (l.type !== "symbol" || l.id === "routes-line" || l.id === "routes-flow") return;
    try {
      glMap.setPaintProperty(l.id, "text-opacity", 0.36);   // 底图地名整体再压淡，减少视觉干扰，让去过的城市跳出来
      glMap.setPaintProperty(l.id, "icon-opacity", 0.4);
      if (l["source-layer"] === "place" && visited.length) {
        const inSet = field => ["in", ["coalesce", ["get", field], ""], ["literal", visited]];
        // 中英文、多字段全比对：国内靠中文(name:nonlatin/name/name:zh)、国外靠英文(name:latin/name:en/name_int)命中隐藏，
        // 覆盖 openfreemap 与 CARTO 等不同底图的字段差异，杜绝重复。
        const excl = ["all"].concat(["name:nonlatin", "name", "name:latin", "name:en", "name:zh", "name_int"].map(f => ["!", inSet(f)]));
        const cur = glMap.getFilter(l.id);
        glMap.setFilter(l.id, cur ? ["all", cur, excl] : excl);
      }
    } catch (e) { /* 该层无此属性，忽略 */ }
  });
}

// 选中段的"活"：轻柔呼吸（脉动透明度），不改粗细/虚线密度，保持与其他线一致。
// 门控：无选中线且不在播放时不碰 GPU（此前无条件每秒强制重绘 12-25 次，常驻耗电）。
let lastBreathe = -1;
let flowHasSelection = false;   // renderMap / refreshSelection 维护：当前有没有 sel=1 的线
function animateFlow(ts) {
  requestAnimationFrame(animateFlow);
  if (!glMap || !glMap.getLayer || !glMap.getLayer("routes-flow")) return;
  if (!flowHasSelection && !play) {
    if (lastBreathe !== 1) { lastBreathe = 1; glMap.setPaintProperty("routes-flow", "line-opacity", 1); }  // 复位一次后闲置
    return;
  }
  const o = Math.round((0.88 + 0.12 * Math.sin(ts / 620)) * 100) / 100; // 0.76‒1.0（高亮不至于太淡）
  if (o !== lastBreathe) { lastBreathe = o; glMap.setPaintProperty("routes-flow", "line-opacity", o); }
}

// 同一段去过多次只画一条线；点选该线时弹一张「跟着地图走」的小卡，列出去过几次、各次日期/方向。
let routeGroupsByKey = new Map();  // key -> { kind, a, b, origin, destination, trips:[record] }
let routePopup = null;
// 关掉两张地图弹卡：筛选/数据变更后旧弹卡内容已陈旧，由变更路径调用（不能放 render()——点路线开卡也走 render）
function closeMapPopups() {
  if (routePopup) { routePopup.remove(); routePopup = null; }
  if (cityPopup) { cityPopup.remove(); cityPopup = null; }
}
function showRoutePopup(lngLat, g) {
  if (!window.maplibregl || !glMap) return;
  const pair = [stripShi(g.origin), stripShi(g.destination)].sort();
  const kindLabel = (KIND[g.kind] && KIND[g.kind].label) || g.kind;
  const trips = [...g.trips].sort((p, q) => String(p.startDate || "").localeCompare(String(q.startDate || "")));
  const rows = trips.map(t => {
    const d = dateRange(t) || "日期待补";
    const dir = `${stripShi(t.origin)}→${stripShi(t.destination)}`;
    const extra = [t.transportNo, tripTimeText(t)].filter(Boolean).join(" · ");
    return `<li><span class="rp-d">${escapeHtml(d)}</span><span class="rp-r">${escapeHtml(dir)}${extra ? ` <i>${escapeHtml(extra)}</i>` : ""}</span></li>`;
  }).join("");
  const html = `<div class="route-pop"><div class="rp-h">${escapeHtml(pair[0])}<em>⇌</em>${escapeHtml(pair[1])}</div>`
    + `<div class="rp-sub">${escapeHtml(kindLabel)} · 去过 ${trips.length} 次</div>`
    + `<ul class="rp-list">${rows}</ul></div>`;
  if (routePopup) routePopup.remove();
  if (cityPopup) { cityPopup.remove(); cityPopup = null; }
  routePopup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, className: "route-popup", maxWidth: "280px", offset: 10 })
    .setLngLat(lngLat).setHTML(html).addTo(glMap);
}

// 点城市弹卡：聚合这座城的「住宿停留」(酒店·起讫·几晚) 与「门票/景点/场地」，跟随当前筛选。
let cityPopup = null;
function showCityPopup(city) {
  if (!window.maplibregl || !glMap) return;
  const c = stripShi(city);
  const ll = cityLngLat(c);
  if (!ll) return;
  const list = filteredRecords().filter(r => !r._gap);
  const at = r => stripShi(r.origin) === c;
  const stays = list.filter(r => r.kind === "stay" && at(r) && stripShi(r.destination) === c)
    .sort((a, b) => String(a.startDate || "").localeCompare(String(b.startDate || "")));
  const places = list.filter(r => r.kind === "other" && at(r))
    .sort((a, b) => String(a.startDate || "").localeCompare(String(b.startDate || "")));
  if (!stays.length && !places.length) { if (cityPopup) { cityPopup.remove(); cityPopup = null; } return; }  // 纯中转城：不弹卡，只聚焦
  const nightsOf = r => Math.max(0, daysBetween(r.startDate, r.endDate).length - 1);
  const totalNights = stays.reduce((s, r) => s + nightsOf(r), 0);
  const clean = s => {                                  // 留住宿名：去渠道前缀(携程·/智行·)、去状态词(已成交)、残留路径/文件名不显示
    s = String(s || "");
    if (/^[\/\[]|\/Users\/|[A-Za-z]:\\|\.(pdf|xlsx?|txt|png|jpe?g|md|zip|csv)\b/i.test(s)) return "";
    return s.replace(/^[^·]*·\s*/, "").replace(/\s*(已成交|已完成|已入住|已使用|已支付|待成交)\s*$/, "").replace(/\s*已付[¥￥]?[\d.]+\s*$/, "").trim();
  };
  const stayRows = stays.map(r => {
    const n = nightsOf(r);
    const where = clean(r.evidence) || String(r.notes || "").split(/[;；]/)[0] || "住宿待补";
    return `<li><span class="rp-d">${escapeHtml(dateRange(r))}</span><span class="rp-r">${n ? `<b>${n}晚</b> · ` : ""}${escapeHtml(where)}</span></li>`;
  }).join("");
  const placeRows = places.map(r => {
    const amt = r.amountCny ? ` <i>¥${Math.round(r.amountCny)}</i>` : "";
    return `<li><span class="rp-d">${escapeHtml(r.startDate || "日期待补")}</span><span class="rp-r">${escapeHtml(displayTitle(r))}${amt}</span></li>`;
  }).join("");
  const latin = titleCase(cityLatin(c));
  const sub = [stays.length ? `共 ${totalNights} 晚 · ${stays.length} 段停留` : "", places.length ? `${places.length} 处门票/场地` : ""].filter(Boolean).join(" · ");
  const sec = (t, rows) => rows ? `<div class="cp-sec">${t}</div><ul class="rp-list">${rows}</ul>` : "";
  const html = `<div class="route-pop city-pop"><div class="rp-h">${escapeHtml(c)}${latin && latin !== c ? `<em>·</em><span class="cp-latin">${escapeHtml(latin)}</span>` : ""}</div>`
    + (sub ? `<div class="rp-sub">${escapeHtml(sub)}</div>` : "")
    + sec("住宿停留", stayRows) + sec("门票 · 景点 · 场地", placeRows) + `</div>`;
  if (cityPopup) cityPopup.remove();
  if (routePopup) { routePopup.remove(); routePopup = null; }
  cityPopup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, className: "route-popup", maxWidth: "300px", offset: 14 })
    .setLngLat(ll).setHTML(html).addTo(glMap);
}

// 本地简版底图（离线兜底）：用仓库已打包的世界/中国/水系 GeoJSON，在**同一 MapLibre 投影**里画出
// 纯色轮廓底图。位置与在线图完全一致（圆点/航线/铁路/卡片本就不依赖底图层），只是没有街道与在线地名。
// 无 symbol 层 → 不需要 glyphs 字体，完全离线可渲染。
function buildLocalStyle(skin) {
  const night = skin === "night";
  const C = night
    ? { bg: "#0a1422", land: "#0e2034", border: "rgba(214,230,251,.16)", prov: "rgba(214,230,251,.09)", lake: "#11314c", river: "#143a55" }
    : { bg: "#e7e1d4", land: "#fcfbf6", border: "rgba(60,55,48,.22)", prov: "rgba(60,55,48,.12)", lake: "#c3d2d7", river: "#bccdd2" };
  const w = window.WATER_CHINA_DATA || { rivers: [], lakes: [] };
  const fc = features => ({ type: "FeatureCollection", features });
  const rivers = fc((w.rivers || []).map(line => ({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: line } })));
  const lakes = fc((w.lakes || []).map(ring => ({ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } })));
  return {
    version: 8,
    sources: {
      world: { type: "geojson", data: window.WORLD_MAP_DATA || fc([]) },
      china: { type: "geojson", data: window.CHINA_MAP_DATA || fc([]) },
      rivers: { type: "geojson", data: rivers },
      lakes: { type: "geojson", data: lakes }
    },
    layers: [
      { id: "bg", type: "background", paint: { "background-color": C.bg } },
      { id: "world-fill", type: "fill", source: "world", paint: { "fill-color": C.land } },
      { id: "china-fill", type: "fill", source: "china", paint: { "fill-color": C.land } },
      { id: "lakes-fill", type: "fill", source: "lakes", paint: { "fill-color": C.lake } },
      { id: "rivers-line", type: "line", source: "rivers", paint: { "line-color": C.river, "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.4, 7, 1.2] } },
      { id: "world-line", type: "line", source: "world", paint: { "line-color": C.border, "line-width": 0.7 } },
      { id: "china-line", type: "line", source: "china", paint: { "line-color": C.prov, "line-width": 0.6 } }
    ]
  };
}

// 底图就绪后的统一收尾：重建路线层、一次性挂交互、首帧渲染。在线 load 与离线/换肤 setStyle 都走这里。
function onGlStyleReady() {
  glReady = true;
  addRoutesLayer();
  if (mapTheme && !offlineMode) applyMapTheme(mapTheme);   // 选了 maptoposter 主题 → 给在线底图图层重上色（保留街道）；离线简版底图不重上色
  if (!glWired) {
    glWired = true;
    // 开页首帧：按"实际去过的范围"取景（替代写死的 center/zoom——路线网不再挤在右 1/3）
    glMap.fitBounds(dataBounds(mapView), { padding: { top: 90, bottom: 110, left: 70, right: 70 }, duration: 0 });
    const onRouteClick = e => {
      const f = e.features && e.features[0];
      const g = f && routeGroupsByKey.get(f.properties.key);
      if (!g) return;
      stopPlayback();
      showRoutePopup(e.lngLat, g);                                  // 跟着地图走的小卡，列出各次行程
      const rep = [...g.trips].sort((p, q) => String(q.startDate || "").localeCompare(String(p.startDate || "")))[0];
      if (rep) selectRecord(rep.id);                                // 高亮这条段（联动详情卡），不滚动页面/时间线
    };
    // 绑在透明加宽的命中层上：触发范围更大、细线也好点；观感仍由 routes-line/flow 决定。
    glMap.on("click", "routes-hit", onRouteClick);
    glMap.on("mouseenter", "routes-hit", () => { glMap.getCanvas().style.cursor = "pointer"; });
    glMap.on("mouseleave", "routes-hit", () => { glMap.getCanvas().style.cursor = ""; });
    requestAnimationFrame(animateFlow);
  }
  render();
}

// 离线/在线切换：换底图但保持同一投影与镜头，行程层由 onGlStyleReady 重建，位置一像素不动。
function setOfflineMode(on) {
  if (on === offlineMode || !glMap) return;
  offlineMode = on;
  updateOfflineHint();
  applyMapStyle(currentSkin());
}

function updateOfflineHint() {
  let el = document.getElementById("offlineHint");
  if (!el) {
    el = document.createElement("div");
    el.id = "offlineHint";
    el.className = "offline-hint";
    el.textContent = "离线 · 简版底图（行程数据照常）";
    (document.querySelector(".map-surface") || document.body).appendChild(el);
  }
  el.style.display = offlineMode ? "" : "none";
}

function initGlMap() {
  if (!window.maplibregl || !document.getElementById("map")) {
    if (els.status) els.status.textContent = "地图组件未加载（地图需联网，资料仍在）";
    return;
  }
  glMap = new maplibregl.Map({
    container: "map",
    style: MAP_STYLES[currentSkin()] || MAP_STYLES.warm,
    center: [108, 34],
    zoom: 3.1,
    attributionControl: { compact: true },
    dragRotate: false,
    pitchWithRotate: false,
    renderWorldCopies: false,     // 世界视图禁止平铺复制——否则中国会在画面两侧出现两份
    preserveDrawingBuffer: true   // 允许把实时地图画布截进"当前可见范围"海报
  });
  glMap.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
  if (glMap.touchZoomRotate) glMap.touchZoomRotate.disableRotation();
  // 断网兜底：网络掉线、或开页时远程底图迟迟拉不到 → 切本地简版底图；网络恢复再切回在线精致图。
  glMap.on("error", () => { if (!offlineMode && !navigator.onLine) setOfflineMode(true); });
  window.addEventListener("offline", () => setOfflineMode(true));
  window.addEventListener("online", () => setOfflineMode(false));
  window.setTimeout(() => { if (!glReady && !navigator.onLine) setOfflineMode(true); }, 3000);
  glMap.on("load", onGlStyleReady);
  // 常驻自愈：任何 setStyle(换肤/离线兜底)后，等地图彻底就绪(idle)、若路线层被清掉就重建。
  // 用 idle 而非中途的 styledata——避免"加得太早被新样式提交时冲掉、又无后续事件补救"的竞态。
  glMap.on("idle", () => { if (glReady && !glMap.getLayer("routes-line")) onGlStyleReady(); });
  // 缩放时按层级显隐城市名（rAF 防抖，一帧最多一次）
  glMap.on("zoom", () => { if (!lodTick) lodTick = requestAnimationFrame(() => { lodTick = null; applyLabelLOD(); }); });
}

// 换肤＝换底图风格（暖纸/夜蓝/板岩）；setStyle 会清掉自定义层，style 就绪后重建路线层。
// 用 styledata 轮询 isStyleLoaded（比 once('style.load') 在 setStyle 后更可靠）。
function applyMapStyle(skin) {
  if (!glMap) return;
  // diff:false 强制整样式重载——否则换"同底图的不同主题"(都用 positron)时 MapLibre 会因差异为空而跳过，
  // 导致 style.load 不触发、重上色不重跑(看起来没换色)；且换回基础皮肤时也能复位为原色。
  glMap.setStyle(offlineMode ? buildLocalStyle(skin) : (MAP_STYLES[skin] || MAP_STYLES.warm), { diff: false });
  // style.load 在新样式"提交完成后"触发一次，快速重建路线层；万一没触发，initGlMap 里常驻的 idle 自愈兜底。
  glMap.once("style.load", onGlStyleReady);
}

// 主图换"很多配色"：把当前矢量底图图层按 maptoposter 主题色实时重上色(背景/水/陆/路/楼)，保留街道细节。
// 启发式：按图层类型 + source-layer/id 关键词匹配该上什么色；漏掉的少数图层保持原色，不会崩。
let mapTheme = null;
// hex 亮度抬升（保色相/饱和）：深色主题在国家级缩放下都黑成一团彼此难分，给底/水/地被抬一点亮度让色相看得出。
function _hex2rgb(h) { h = String(h || "").replace("#", ""); if (h.length === 3) h = h.split("").map(c => c + c).join(""); const n = parseInt(h || "0", 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function _rgb2hex(r, g, b) { const f = x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0"); return "#" + f(r) + f(g) + f(b); }
function liftLightness(hex, addL, minL) {
  let [r, g, b] = _hex2rgb(hex); r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0, l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? ((b - r) / d + 2) : ((r - g) / d + 4); h /= 6; }
  l = Math.min(1, Math.max((minL || 0), l + (addL || 0)));
  const f = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
  let R, G, B; if (s === 0) { R = G = B = l; } else { const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; R = f(p, q, h + 1 / 3); G = f(p, q, h); B = f(p, q, h - 1 / 3); }
  return _rgb2hex(R * 255, G * 255, B * 255);
}
function applyMapTheme(c) {
  if (!glMap || !glMap.getStyle || !c) return;
  const dark = posterIsDark(c.bg);
  // 深色主题：底/水/地被抬亮度(保色相)，否则各套都黑成一团分不出；底比水略亮一点拉出陆/海对比；浅色保持原样。
  const BG = dark ? liftLightness(c.bg, 0.085, 0.135) : c.bg;
  const WATER = dark ? liftLightness(c.water, 0.05, 0.085) : c.water;
  const PARKS = dark ? liftLightness(c.parks || c.bg, 0.085, 0.135) : (c.parks || c.bg);
  const roadColor = id =>
    /motorway|trunk|highway/.test(id) ? (c.road_motorway || c.road_default) :
    /primary/.test(id) ? (c.road_primary || c.road_default) :
    /secondary|tertiary/.test(id) ? (c.road_secondary || c.road_tertiary || c.road_default) :
    (c.road_residential || c.road_default);
  (glMap.getStyle().layers || []).forEach(l => {
    const id = (l.id || "").toLowerCase(), sl = (l["source-layer"] || "").toLowerCase(), key = sl + " " + id;
    try {
      if (l.type === "background") glMap.setPaintProperty(l.id, "background-color", BG);
      else if (l.type === "fill") {
        if (key.includes("water")) glMap.setPaintProperty(l.id, "fill-color", WATER);
        else if (id.includes("building")) glMap.setPaintProperty(l.id, "fill-color", PARKS);
        else if (/(landcover|landuse|park|wood|grass|forest|wetland|sand|cemetery|pitch|golf|farmland|land)/.test(key)) glMap.setPaintProperty(l.id, "fill-color", PARKS);
        else glMap.setPaintProperty(l.id, "fill-color", BG);
      }
      else if (l.type === "line") {
        if (/(water|river|canal|waterway)/.test(key)) glMap.setPaintProperty(l.id, "line-color", WATER);
        else if (/(admin|boundary)/.test(id)) glMap.setPaintProperty(l.id, "line-color", c.road_tertiary || c.text);
        else if (/(road|street|highway|bridge|tunnel|transit|rail|motorway|path|track|aeroway)/.test(id)) glMap.setPaintProperty(l.id, "line-color", roadColor(id));
      }
      else if (l.type === "symbol") {            // 地名文字也跟主题走（浅色主题靠它才"看得出"是哪套色），晕色用(抬亮后的)底色保证可读
        if (c.text) glMap.setPaintProperty(l.id, "text-color", c.text);
        glMap.setPaintProperty(l.id, "text-halo-color", BG);
      }
    } catch (e) { /* 该层不支持该属性，跳过 */ }
  });
}

// MapLibre 版渲染：行程路线写进 GeoJSON 线层，城市做成 DOM 标记。
function renderMap(list) {
  if (!glReady || !glMap) return;
  if (play) { drawPlayback(); return; }   // 播放中由 drawPlayback 逐帧接管地图

  // 按「无向城市对 + 方式」聚合：同一段去过多次只画一条线（不再错位叠画），点选时弹卡列出各次。
  const groups = new Map();
  list.forEach(record => {
    if (!record.countsAsVisited || !record.origin || !record.destination || record.origin === record.destination) return;
    const a = cityLngLat(record.origin), b = cityLngLat(record.destination);
    if (!a || !b) return;
    const key = record.kind + "|" + [stripShi(record.origin), stripShi(record.destination)].sort().join("~");
    let g = groups.get(key);
    if (!g) { g = { key, kind: record.kind, a, b, origin: record.origin, destination: record.destination, trips: [] }; groups.set(key, g); }
    g.trips.push(record);
  });
  routeGroupsByKey = groups;   // 供地图点选弹卡查询

  // 路径＝真实物理走向：铁路用 OSM 铁轨实测折线(railPolyline)，飞机走大圆弧(真实巡航航迹)。铁路查不到的段回退大圆弧。
  // 聚焦了某城 → 高亮与该城相关的全部线（往返、各次）；否则只高亮选中那一段。
  const focusCity = focusedCity || "";
  const KIND_Z = { flight: 0, road: 1, stay: 2, rail: 3 };
  const features = [];
  groups.forEach(g => {
    const sel = focusCity
      ? ((stripShi(g.origin) === focusCity || stripShi(g.destination) === focusCity) ? 1 : 0)
      : (g.trips.some(t => t.id === selectedId) ? 1 : 0);
    const coordinates = (g.kind === "rail" && railPolyline(g.origin, g.destination)) || geoArc(g.a, g.b);
    features.push({ type: "Feature", properties: { key: g.key, kind: g.kind, sel, count: g.trips.length }, geometry: { type: "LineString", coordinates } });
  });
  features.sort((x, y) => (KIND_Z[x.properties.kind] ?? 0) - (KIND_Z[y.properties.kind] ?? 0));
  const src = glMap.getSource("routes");
  if (src) src.setData({ type: "FeatureCollection", features });

  const usage = new Map();
  list.forEach(record => {
    if (!record.countsAsVisited) return;
    // Set 去重两端：stay/门票 origin===destination 不应给同城 +2（与档案统计同口径）
    new Set([record.origin, record.destination].filter(Boolean).map(stripShi)).forEach(key => usage.set(key, (usage.get(key) || 0) + 1));
  });
  updateCityMarkers(usage);

  // 缓存给"仅选中态刷新"的轻路径用（点选不再全量重建）；同时告诉呼吸动画有没有活干
  lastRouteFeatures = features;
  lastUsage = usage;
  flowHasSelection = features.some(f => f.properties.sel === 1);
}

// —— 旅行档案 · 跨榜悬停联动 ——
// 悬停任意一行：本榜其余行温柔退灰（聚光灯）；同时把"数据上相关"的行跨榜点亮——
// hover 城市「北京」→ 路线榜所有含北京的走廊、国家榜「中国」保持全亮；hover 一条路线 → 两端城市与所属国家亮。
// 只有亮度层级变化，无位移无弹跳；事件委托一次绑定，250ms ease 呼吸。
let statsHoverWired = false;
function wireStatsHover() {
  if (statsHoverWired) return;
  const host = document.querySelector(".stats-cols")?.parentElement;
  if (!host) return;
  statsHoverWired = true;
  const lists = () => [...host.querySelectorAll(".rank-list")];
  const clear = () => lists().forEach(l => { l.classList.remove("dim"); l.querySelectorAll("li.lit").forEach(n => n.classList.remove("lit")); });
  host.addEventListener("mouseover", e => {
    const li = e.target.closest(".rank-list li");
    if (!li || li.classList.contains("rk-empty")) { return; }
    clear();
    const cities = new Set();
    const countries = new Set();
    if (li.dataset.city) { cities.add(li.dataset.city); if (li.dataset.country) countries.add(li.dataset.country); }
    if (li.dataset.cities) { li.dataset.cities.split(",").forEach(c => { cities.add(c); countries.add(cityMeta(c).country); }); }
    if (li.dataset.country && !li.dataset.city) {   // 国家行：反查该国全部城市
      countries.add(li.dataset.country);
      host.querySelectorAll("#cityRank li[data-country]").forEach(n => { if (n.dataset.country === li.dataset.country) cities.add(n.dataset.city); });
    }
    // 联动只在「城市/路线/国家」三榜间发生；年度/方式榜与城市无数据关系，
    // 被拉灰反而像"坏了"——hover 它们时只在自家榜内聚光
    const LINKED = ["cityRank", "routeRank", "countryList"];
    const ownList = li.closest(".rank-list");
    const inLinked = LINKED.includes(ownList?.id);
    lists().forEach(l => { if (inLinked ? LINKED.includes(l.id) : l === ownList) l.classList.add("dim"); });
    li.classList.add("lit");
    if (cities.size || countries.size) {
      host.querySelectorAll(".rank-list li").forEach(n => {
        if (n === li) return;
        const hitCity = n.dataset.city && cities.has(n.dataset.city);
        const hitRoute = n.dataset.cities && n.dataset.cities.split(",").some(c => cities.has(c));
        const hitCountry = n.dataset.country && !n.dataset.city && countries.has(n.dataset.country);
        if (hitCity || hitRoute || hitCountry) n.classList.add("lit");
      });
    }
  });
  host.addEventListener("mouseleave", clear);
}

// 仅刷新"选中态"：点选一条行程/一座城时走这条轻路径——更新线高亮、城市点、时间线 active、详情卡，
// 不重建 183 张时间线卡、不重排大表、不重算统计（那是 render() 全管线的事，hover 过渡被打断的根因）。
let lastRouteFeatures = [];
let lastUsage = new Map();
function refreshSelection() {
  const focusCity = focusedCity || "";
  let any = false;
  lastRouteFeatures.forEach(f => {
    const g = routeGroupsByKey.get(f.properties.key);
    if (!g) return;
    const sel = focusCity
      ? ((stripShi(g.origin) === focusCity || stripShi(g.destination) === focusCity) ? 1 : 0)
      : (g.trips.some(t => t.id === selectedId) ? 1 : 0);
    f.properties.sel = sel;
    if (sel) any = true;
  });
  flowHasSelection = any;
  const src = glMap && glMap.getSource && glMap.getSource("routes");
  if (src && lastRouteFeatures.length) src.setData({ type: "FeatureCollection", features: lastRouteFeatures });
  updateCityMarkers(lastUsage);
  markTimelineActive(selectedId);
  renderDetail(records.find(r => r.id === selectedId) || null);
}

function updateCityMarkers(usage) {
  if (!glMap) return;
  const selCity = selectedCity();
  const want = new Set();
  usage.forEach((count, city) => {
    const ll = cityLngLat(city);
    if (!ll) return;
    want.add(city);
    let m = glCityMarkers.get(city);
    if (!m) {
      const el = document.createElement("div");
      el.className = "gl-city";
      const label = document.createElement("span");
      label.className = "gl-label";
      // 去重底图重名后，自带的拉丁/英文名也一并没了——这里把拉丁名补回我们的标签（上拉丁、下中文）。
      const meta = CITY_META[city];
      const foreign = !!(meta && meta.country && meta.country !== "中国");   // 大陆城市不在 CITY_META 里
      const latinName = titleCase(cityLatin(city));
      const hasLatin = latinName && latinName !== city;
      // 拉丁名始终在上、中文在下（跟底图自带地名同一种堆叠，避免排版混乱）；强调靠字重/深浅：
      // 国内中文为主(加粗深)、拼音为辅(细淡)；国外英文为主、中文为辅。
      const zhEl = `<span class="gl-zh ${foreign ? "gl-secondary" : "gl-primary"}">${escapeHtml(city)}</span>`;
      const latinEl = hasLatin ? `<i class="gl-latin ${foreign ? "gl-primary" : "gl-secondary"}">${escapeHtml(latinName)}</i>` : "";
      label.innerHTML = latinEl + zhEl;
      el.appendChild(label);
      el.addEventListener("click", event => { event.stopPropagation(); stopPlayback(); selectCity(city); });
      el.addEventListener("contextmenu", event => { event.preventDefault(); event.stopPropagation(); stopPlayback(); openStreetPosterSite(city); });
      el.title = `${city}：左键看行程，右键去 maptoposter 做街道海报`;
      m = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat(ll).addTo(glMap);
      glCityMarkers.set(city, m);
    }
    const el = m.getElement();
    const isSel = city === selCity;
    const base = Math.max(8, Math.min(24, 6 + count * 1.7));      // 灰点大小只跟到访次数相关
    const size = isSel ? Math.max(7, Math.round(base * 0.8)) : base;  // 选中时高亮红核缩小一点点，外圈涟漪照旧
    const sig = `${size}|${isSel ? 1 : 0}`;
    if (el.dataset.sig !== sig) {        // 播放时每帧都会走到这里：值没变就不碰 style，避免无谓的布局/重绘
      el.dataset.sig = sig;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.classList.toggle("sel", isSel);   // 选中靠涟漪动效突出，不靠强行放大
    }
  });
  glCityMarkers.forEach((m, city) => { if (!want.has(city)) { m.remove(); glCityMarkers.delete(city); } });
  lastUsage = usage;        // LOD 用最新口径（播放时也按"已揭示"的次数判断主次）
  applyLabelLOD();
}

// 城市标签分级（LOD）：拉远时只留"主节点"（到访≥4次 或 海外城市）的名字，
// 其余只剩小点——解决世界/大区缩放下密集城市圈的叠字灾难；拉近渐次浮现。
let lodTick = null;
function applyLabelLOD() {
  if (!glMap) return;
  const z = glMap.getZoom();
  const selCity = selectedCity();
  glCityMarkers.forEach((m, city) => {
    const el = m.getElement();
    const visits = lastUsage.get(city) || 0;
    const foreign = !!(CITY_META[city] && CITY_META[city].country && CITY_META[city].country !== "中国");
    const major = visits >= 4 || foreign;
    let hide;
    if (z >= 4.6) hide = false;                   // 省级及更近：全显
    else if (z >= 3.4) hide = visits < 2 && !foreign;   // 国家级：藏只去过一次的小城
    else hide = !major;                           // 大洲/世界级：只留主节点
    if (city === selCity || city === focusedCity) hide = false;   // 当前主角永远有名字
    el.classList.toggle("lod-hide", !!hide);
  });
}

// ——— 行旅海报工作台：把行旅地图导成可配置的高清编辑风矢量海报（独立 2D 画布，离线、不糊）———
// 用已有数据(世界/中国/水系 GeoJSON + 航线铁路 + 城市点 + 指标)按 Web Mercator 重绘，不截 WebGL 瓦片。
// 可选尺寸(竖A4/横A4/方形)、范围(全图/当前可见视口)、可编辑标题副标题落款(+模板)、可勾选指标、地名自动避让。
function mercatorXY(lng, lat) {
  const x = (lng + 180) / 360;
  const s = Math.max(-0.9999, Math.min(0.9999, Math.sin(lat * Math.PI / 180)));
  const y = 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI);
  return [x, y];
}

const POSTER_CANVAS = {
  a4p: { w: 2480, h: 3508, label: "竖版 A4" },
  a4l: { w: 3508, h: 2480, label: "横版 A4" },
  square: { w: 2480, h: 2480, label: "方形" }
};
function posterMetric(id) { const el = document.getElementById(id); return el ? el.textContent : "—"; }
function posterCountryCount() {
  const set = new Set();
  filteredRecords().forEach(r => { if (!r.countsAsVisited) return; [r.origin, r.destination].filter(Boolean).forEach(c => { const m = CITY_META[stripShi(c)]; set.add(m && m.country ? m.country : "中国"); }); });
  return set.size;
}
const POSTER_STATS = [
  { key: "days", label: "在路天数", get: () => posterMetric("metricDays") },
  { key: "hours", label: "移动小时", get: () => posterMetric("metricHours") },
  { key: "cities", label: "点亮城市", get: () => posterMetric("metricCities") },
  { key: "trips", label: "出行段数", get: () => String(filteredRecords().length) },
  { key: "countries", label: "国家地区", get: () => String(posterCountryCount()) },
  { key: "cost", label: "可见花销", get: () => posterMetric("metricCost") }
];
const POSTER_TEMPLATES = [
  { id: "journey", name: "行旅地图（默认）", title: "Nova · Journey Atlas", subtitle: "", signature: "JOURNEY ATLAS" },
  { id: "footprint", name: "我的足迹", title: "我的足迹", subtitle: "用脚步丈量的山河", signature: "" },
  { id: "share", name: "分享留念", title: "这些年走过的地方", subtitle: "", signature: "" }
];
const posterOpts = { size: "a4p", region: "viewport", skin: "warm", title: "Nova · Journey Atlas", subtitle: "", signature: "JOURNEY ATLAS", stats: ["days", "hours", "cities"] };
// 海报配色：前 3 套与地图皮肤同名(暖宋纸/板岩灰/深海夜蓝)，其后从开源 maptoposter 的 20 套主题抄入——
// 底图(纸/陆/水/界)取主题色承载气质，航线/铁路配色按主题明暗自动取常规/夜间套以保持可读。共 23 套。
// 当前可见范围(实时截图)跟随地图当前皮肤；中国/世界(矢量重绘)用所选配色。
function posterIsDark(hex) {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(String(hex || "")); if (!m) return false;
  const n = parseInt(m[1], 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) < 112;
}
// maptoposter 主题的统一中文名(四字)，下拉里更整齐、不超宽。
const POSTER_THEME_CN = {
  "Nordic-Frost": "北欧霜白", "Desert-Rose": "沙漠玫瑰", "Cyberpunk-Neon": "赛博霓虹",
  "Sulfur-Slate": "硫磺岩灰", "Vintage-Nautical": "复古航海", "Lavender-Mist": "薰衣草雾",
  "Carbon-Fiber": "碳纤暗黑", "Mediterranean-Summer": "地中海夏", "Royal-Velvet": "皇家丝绒",
  "Forest-Moss": "森林苔藓", "Cotton-Candy": "棉花糖粉", "Brutalist-Concrete": "清水混凝",
  "Solarized-Dark": "日光暗调", "Matcha-Latte": "抹茶拿铁", "Red-Alert": "赤红警戒",
  "Gilded-Noir": "鎏金暗夜", "Ocean-Abyss": "深海渊蓝", "Sakura-Branch": "樱枝粉白",
  "Terra-Clay": "赤陶黏土", "Glitch-Purple": "故障紫调"
};
function posterPaletteFromTheme(t) {
  const c = t.colors || {}, dark = posterIsDark(c.bg);
  return {
    label: POSTER_THEME_CN[t.id] || t.name || t.id, night: dark,
    paper: c.bg, ink: c.text, inkSoft: c.road_secondary || c.road_primary || c.text,
    red: c.poi_color || (dark ? "#ff6a5a" : "#b84232"),
    land: c.parks || c.bg, border: c.road_tertiary || c.road_default || c.text,
    prov: c.road_residential || c.road_default || c.water, water: c.water,
    road: c.road_motorway || c.road_primary || c.road_default || c.text
  };
}
const POSTER_PALETTES = (() => {
  const base = {
    warm:  { label: "暖宋纸",   paper: "#fbfaf4", ink: "#2b2823", inkSoft: "#5b554c", red: "#b84232", land: "#f1ece1", border: "#d8d0c0", prov: "#e3ddce", water: "#bcccd0", road: "#c4b79f", night: false },
    slate: { label: "板岩灰",   paper: "#f4f5f6", ink: "#2a2d30", inkSoft: "#5c6166", red: "#b84232", land: "#e9ebed", border: "#d3d7da", prov: "#dee1e4", water: "#cfd6db", road: "#bfc4c9", night: false },
    night: { label: "深海夜蓝", paper: "#0c1a30", ink: "#eef4ff", inkSoft: "#9fb6d6", red: "#ff6a5a", land: "#13273f", border: "#2c4259", prov: "#203850", water: "#0f2236", road: "#3a4f6a", night: true }
  };
  const themes = (typeof window !== "undefined" && window.POSTER_THEMES) || [];
  themes.forEach(t => { if (t && t.id && t.colors) base[t.id] = posterPaletteFromTheme(t); });
  return base;
})();

function renderTravelPoster(canvas, opts) {
  opts = opts || posterOpts;
  const size = POSTER_CANVAS[opts.size] || POSTER_CANVAS.a4p;
  const W = size.w, H = size.h;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const skinForPoster = (opts.region === "viewport" ? currentSkin() : opts.skin) || "warm";  // 局部截图跟随地图配色，整图用所选
  const P = POSTER_PALETTES[skinForPoster] || POSTER_PALETTES.warm;
  const RC = P.night ? ROUTE_COLORS_NIGHT : ROUTE_COLORS;
  const PAPER = P.paper, INK = P.ink, INK_SOFT = P.inkSoft, RED = P.red;
  let LAND = P.land, BORDER = P.border, PROV = P.prov, WATER = P.water;
  if (P.night) {
    // 深色海报：陆地略抬亮度、国界/省界轮廓强制提亮，否则整张近黑、除亮点外看不到国家轮廓。
    LAND = liftLightness(P.land, 0.05, 0.13);
    WATER = liftLightness(P.water, 0.03, 0.07);
    BORDER = liftLightness(P.border, 0, 0.46);
    PROV = liftLightness(P.prov, 0, 0.30);
  }
  const u = Math.min(W, H) / 100;             // 基准单位：三种尺寸短边都≈2480，字号统一
  const M = Math.round(7 * u);
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);

  // —— 版面（按 W/H 等比推导，竖/横/方都适配）——
  const eyebrowY = Math.round(M + 3 * u), titleY = Math.round(M + 10.6 * u), subY = Math.round(M + 14 * u);
  const footDivY = Math.round(H - M - 13.5 * u), statNumY = Math.round(H - M - 8.4 * u), statLabY = Math.round(H - M - 5.2 * u), legendY = Math.round(H - M - 1.4 * u);
  const band = { x: M, y: Math.round(subY + 5 * u) };
  band.w = W - 2 * M; band.h = (footDivY - Math.round(2 * u)) - band.y;

  // —— 投影范围：中国框 / 世界框 / 当前可见(地图视口)，三种各不相同 ——
  let b;
  if (opts.region === "viewport" && glMap && glMap.getBounds) {
    try { const gb = glMap.getBounds(); b = { minLng: gb.getWest(), maxLng: gb.getEast(), minLat: gb.getSouth(), maxLat: gb.getNorth() }; }
    catch (e) { b = CHINA_BOUNDS; }
  } else if (opts.region === "world") { b = WORLD_BOUNDS; }
  else { b = CHINA_BOUNDS; }
  const [bx0, by0] = mercatorXY(b.minLng, b.maxLat);
  const [bx1, by1] = mercatorXY(b.maxLng, b.minLat);
  const gW = (bx1 - bx0) || 1e-6, gH = (by1 - by0) || 1e-6;
  const scale = Math.min(band.w / gW, band.h / gH);
  const ox = band.x + (band.w - gW * scale) / 2, oy = band.y + (band.h - gH * scale) / 2;
  const project = (lng, lat) => { const [mx, my] = mercatorXY(lng, lat); return [ox + (mx - bx0) * scale, oy + (my - by0) * scale]; };

  const tracePolys = geom => {
    const polys = geom.type === "MultiPolygon" ? geom.coordinates : geom.type === "Polygon" ? [geom.coordinates] : [];
    polys.forEach(rings => rings.forEach(ring => { ring.forEach((pt, i) => { const [x, y] = project(pt[0], pt[1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); }));
  };

  // —— 地图带：当前可见范围＝直接截取实时地图(真街道底图，所见即所得)；中国/世界＝用打包的矢量轮廓重绘 ——
  let useCapture = opts.region === "viewport" && glMap && typeof glMap.getCanvas === "function";
  ctx.save();
  ctx.beginPath(); ctx.rect(band.x, band.y, band.w, band.h); ctx.clip();
  if (useCapture) {
    try { ctx.drawImage(glMap.getCanvas(), ox, oy, gW * scale, gH * scale); }   // 截图与 getBounds 同范围、等比放入
    catch (e) { useCapture = false; }
  }
  if (!useCapture) {
    const world = (window.WORLD_MAP_DATA && window.WORLD_MAP_DATA.features) || [];
    ctx.beginPath(); world.forEach(f => f.geometry && tracePolys(f.geometry)); ctx.fillStyle = LAND; ctx.fill("evenodd");
    // 国界/省界线宽：深色海报里 1px 在高清画布上是发丝级、看不见 → 按分辨率加粗
    ctx.lineWidth = P.night ? Math.max(1.1, u * 0.13) : 1.1; ctx.strokeStyle = BORDER; ctx.stroke();
    const china = (window.CHINA_MAP_DATA && window.CHINA_MAP_DATA.features) || [];
    ctx.beginPath(); china.forEach(f => f.geometry && tracePolys(f.geometry)); ctx.lineWidth = P.night ? Math.max(0.8, u * 0.07) : 0.8; ctx.strokeStyle = PROV; ctx.stroke();
    const water = window.WATER_CHINA_DATA || { rivers: [], lakes: [] };
    ctx.beginPath(); (water.lakes || []).forEach(ring => { ring.forEach((pt, i) => { const [x, y] = project(pt[0], pt[1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); }); ctx.fillStyle = WATER; ctx.fill();
    ctx.beginPath(); (water.rivers || []).forEach(line => line.forEach((pt, i) => { const [x, y] = project(pt[0], pt[1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); })); ctx.lineWidth = 1; ctx.strokeStyle = WATER; ctx.stroke();
    // 航线/铁路（截图模式下已含在实时地图里，无需再画）
    const seenR = new Set();
    filteredRecords().forEach(r => {
      if (!r.countsAsVisited || !r.origin || !r.destination || r.origin === r.destination) return;
      const a = cityLngLat(r.origin), c = cityLngLat(r.destination); if (!a || !c) return;
      const key = r.kind + "|" + [stripShi(r.origin), stripShi(r.destination)].sort().join("~");
      if (seenR.has(key)) return; seenR.add(key);
      const coords = (r.kind === "rail" && railPolyline(r.origin, r.destination)) || geoArc(a, c);
      if (!coords || coords.length < 2) return;
      ctx.beginPath(); coords.forEach((pt, i) => { const [x, y] = project(pt[0], pt[1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.strokeStyle = RC[r.kind] || RC.other; ctx.lineWidth = 2.2; ctx.globalAlpha = 0.5; ctx.setLineDash([7, 4]); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    });
  }

  // —— 城市点 + 名称（到访次数定优先级；标签四向避让，挤不下的只留圆点）——
  const usage = new Map();
  filteredRecords().forEach(r => { if (!r.countsAsVisited) return; [r.origin, r.destination].filter(Boolean).forEach(c => { const k = stripShi(c); usage.set(k, (usage.get(k) || 0) + 1); }); });
  const items = [];
  usage.forEach((count, city) => {
    const ll = cityLngLat(city); if (!ll) return;
    const [x, y] = project(ll[0], ll[1]);
    if (x < band.x || x > band.x + band.w || y < band.y || y > band.y + band.h) return;
    items.push({ city, x, y, count, r: Math.max(4, Math.min(13, 3 + count * 1.1)) });
  });
  items.sort((p, q) => q.count - p.count);
  items.forEach(it => { ctx.beginPath(); ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2); ctx.fillStyle = RED; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = PAPER; ctx.stroke(); });
  const LS = Math.round(1.06 * u);
  ctx.font = `600 ${LS}px "PingFang SC", -apple-system, sans-serif`; ctx.fillStyle = INK; ctx.textBaseline = "top"; ctx.textAlign = "left";
  const placed = [];
  const overlap = (a, c) => !(a.l + a.w < c.l || c.l + c.w < a.l || a.t + a.h < c.t || c.t + c.h < a.t);
  items.forEach(it => {
    const w = ctx.measureText(it.city).width, h = LS, g = it.r + 5;
    const cands = [{ l: it.x - w / 2, t: it.y - g - h }, { l: it.x - w / 2, t: it.y + g }, { l: it.x + g, t: it.y - h / 2 }, { l: it.x - g - w, t: it.y - h / 2 }];
    for (const cd of cands) {
      if (cd.l < band.x || cd.l + w > band.x + band.w || cd.t < band.y || cd.t + h > band.y + band.h) continue;
      const box = { l: cd.l, t: cd.t, w, h };
      if (placed.some(p => overlap(box, p))) continue;
      ctx.fillText(it.city, cd.l, cd.t); placed.push({ l: cd.l - 3, t: cd.t - 2, w: w + 6, h: h + 4 });
      break;
    }
  });
  ctx.restore();

  // —— 页眉 ——
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.fillStyle = RED; ctx.font = `600 ${Math.round(1.2 * u)}px -apple-system, "Helvetica Neue", sans-serif`;
  ctx.fillText("Y I W E I   J O U R N E Y   M A P", M, eyebrowY);
  ctx.fillStyle = INK; ctx.font = `700 ${Math.round(6 * u)}px "Songti SC", "STSong", serif`;
  ctx.fillText(opts.title || SITE_TITLE.docTitle, M, titleY);
  const list = filteredRecords();
  const years = list.map(r => String(r.startDate || "").slice(0, 4)).filter(s => /^\d{4}$/.test(s)).map(Number);
  const yr = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : "";
  const regionLabel = opts.region === "viewport" ? "局部" : (opts.region === "world" ? "世界视图" : "中国视图");
  const subtitle = (opts.subtitle && opts.subtitle.trim()) ? opts.subtitle : `共 ${list.length} 段行程${yr ? " · " + yr : ""} · ${regionLabel}`;
  ctx.fillStyle = INK_SOFT; ctx.font = `400 ${Math.round(1.6 * u)}px "PingFang SC", -apple-system, sans-serif`;
  ctx.fillText(subtitle, M, subY);

  // —— 页脚：分隔线 + 统计 + 图例 + 落款 ——
  ctx.strokeStyle = "rgba(43,40,35,.16)"; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(M, footDivY); ctx.lineTo(W - M, footDivY); ctx.stroke();
  const chosen = POSTER_STATS.filter(s => (opts.stats || []).includes(s.key));
  const colW = (W - M * 2) / Math.max(1, chosen.length);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  chosen.forEach((s, i) => {
    const cx = M + colW * i;
    ctx.fillStyle = INK; ctx.font = `500 ${Math.round(3.5 * u)}px "Hoefler Text", Palatino, Georgia, serif`; ctx.fillText(s.get(), cx, statNumY);
    ctx.fillStyle = INK_SOFT; ctx.font = `400 ${Math.round(1.3 * u)}px "PingFang SC", sans-serif`; ctx.fillText(s.label, cx, statLabY);
  });
  const legend = [["航线", RC.flight], ["铁路", RC.rail], ["停留", RC.stay], ["地面/水路", RC.road]];
  let lx = M; const sw = 2.5 * u;
  ctx.font = `400 ${Math.round(1.4 * u)}px "PingFang SC", sans-serif`; ctx.textBaseline = "middle";
  legend.forEach(([label, color]) => {
    ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.setLineDash([11, 6]);
    ctx.beginPath(); ctx.moveTo(lx, legendY); ctx.lineTo(lx + sw, legendY); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = INK_SOFT; ctx.fillText(label, lx + sw + 12, legendY);
    lx += sw + 12 + ctx.measureText(label).width + 3.5 * u;
  });
  if (opts.signature && opts.signature.trim()) {
    ctx.fillStyle = "rgba(43,40,35,.5)"; ctx.textAlign = "right"; ctx.font = `400 ${Math.round(1.15 * u)}px "PingFang SC", sans-serif`;
    ctx.fillText(opts.signature, W - M, legendY);
  }
  ctx.textBaseline = "alphabetic";
}

// 全屏沉浸：地图铺满视口、隐去下方面板与控制台，专注地图与行程；再点/按 Esc 退出。
const ICON_FS = {
  enter: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5 M20 9V4h-5 M4 15v5h5 M20 15v5h-5"/></svg>',
  exit: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5v4H5 M15 5v4h4 M9 19v-4H5 M15 19v-4h4"/></svg>'
};
function toggleImmersive() {
  const on = !document.body.classList.contains("immersive");
  document.body.classList.toggle("immersive", on);
  const btn = document.getElementById("immersiveBtn");
  if (btn) { btn.innerHTML = on ? ICON_FS.exit : ICON_FS.enter; btn.title = on ? "退出全屏" : "全屏沉浸"; }
  try {
    if (on && !document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    else if (!on && document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  } catch (e) {}
  if (glMap) setTimeout(() => glMap.resize(), 80);
}
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && document.body.classList.contains("immersive")) {
    document.body.classList.remove("immersive");
    const btn = document.getElementById("immersiveBtn"); if (btn) { btn.innerHTML = ICON_FS.enter; btn.title = "全屏沉浸"; }
    if (glMap) setTimeout(() => glMap.resize(), 80);
  }
});

// 底部看板指标可选显示（··· 菜单勾选，持久化到 localStorage）。
const METRIC_KEYS = ["days", "cost", "hours", "cities", "missing"];
let metricVis = (() => {
  const def = { days: true, cost: true, hours: true, cities: true, missing: true };
  try { const s = JSON.parse(localStorage.getItem("journeyatlas-metric-vis")); if (s && typeof s === "object") return Object.assign(def, s); } catch (e) {}
  return def;
})();
function applyMetricVis() {
  METRIC_KEYS.forEach(k => { const el = document.querySelector('.metric[data-metric="' + k + '"]'); if (el) el.style.display = metricVis[k] === false ? "none" : ""; });
}

let mapPosterEl = null;
// 配色下拉做成可视化：名称 + 4 个并列小圆圈(纸/陆/水/点睛色)。原生 select 不能放色板，故自建轻量下拉。
// 色板小圆点：预览地图上**真实出现**的四色（纸/地、水、主路、地名文字色），不再用海报专属的 poi 高亮色，避免"色板看着花、地图没那么花"的不对应。
function posterSwatchDots(p) { return [p.paper, p.water, p.road || p.border, p.ink].map(c => `<i style="background:${c}"></i>`).join(""); }
function posterSkinHtml() {
  const cur = POSTER_PALETTES[posterOpts.skin] || POSTER_PALETTES.warm;
  const opts = swatchOptionsHtml(posterOpts.skin);
  return `<div class="mp-field"><span>配色（共 ${Object.keys(POSTER_PALETTES).length} 套）</span>`
    + `<div class="mp-swatch"><button type="button" class="mp-sw-trigger"><span class="mp-sw-dots">${posterSwatchDots(cur)}</span><span class="mp-sw-name">${escapeHtml(cur.label || posterOpts.skin)}</span><em>⌄</em></button>`
    + `<div class="mp-sw-list" hidden>${opts}</div></div></div>`;
}
function posterControlsHtml() {
  const tpl = POSTER_TEMPLATES.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join("");
  const sizes = Object.entries(POSTER_CANVAS).map(([k, v]) => `<option value="${k}">${escapeHtml(v.label)}</option>`).join("");
  const stats = POSTER_STATS.map(s => `<label class="mp-chk"><input type="checkbox" data-stat="${s.key}"${posterOpts.stats.includes(s.key) ? " checked" : ""}><span>${escapeHtml(s.label)}</span></label>`).join("");
  return '<div class="mp-controls">'
    + `<label class="mp-field"><span>模板</span><select class="mp-template">${tpl}</select></label>`
    + `<label class="mp-field"><span>标题</span><input class="mp-f-title" type="text" value="${escapeHtml(posterOpts.title)}"></label>`
    + `<label class="mp-field"><span>副标题</span><input class="mp-f-sub" type="text" placeholder="留空＝自动生成" value="${escapeHtml(posterOpts.subtitle)}"></label>`
    + `<label class="mp-field"><span>落款</span><input class="mp-f-sig" type="text" placeholder="留空＝不显示" value="${escapeHtml(posterOpts.signature)}"></label>`
    + `<label class="mp-field"><span>尺寸</span><select class="mp-size">${sizes}</select></label>`
    + `<label class="mp-field"><span>范围</span><select class="mp-region"><option value="china">中国</option><option value="world">世界</option><option value="viewport">当前可见范围</option></select></label>`
    + posterSkinHtml()   // 配色放在范围之后：先选范围，再展开配色慢慢调（配色下拉只会盖住下面的"指标"，不再挡住范围）
    + `<div class="mp-field"><span>指标（可多选）</span><div class="mp-checks">${stats}</div></div>`
    + '</div>';
}
function openTravelPoster() {
  if (!mapPosterEl) {
    mapPosterEl = document.createElement("div");
    mapPosterEl.className = "mp-overlay"; mapPosterEl.hidden = true;
    mapPosterEl.innerHTML = '<div class="mp-dialog mp-studio" role="dialog" aria-label="行旅海报">'
      + '<div class="mp-head"><span class="mp-title">行旅海报</span><button type="button" class="mp-close" aria-label="关闭">×</button></div>'
      + '<div class="mp-body">' + posterControlsHtml() + '<div class="mp-stage"><canvas id="mapPosterCanvas"></canvas></div></div>'
      + '<div class="mp-bar"><span class="mp-note">编辑风矢量 · 高清可打印 · 跟随当前筛选 · 「当前可见范围」配色跟随地图</span><button type="button" class="mp-dl">下载 PNG</button></div></div>';
    document.body.appendChild(mapPosterEl);
    const canvas = mapPosterEl.querySelector("#mapPosterCanvas");
    const rerender = () => { try { renderTravelPoster(canvas, posterOpts); } catch (e) { console.error("海报渲染失败", e); } };
    const close = () => { mapPosterEl.hidden = true; };
    mapPosterEl.querySelector(".mp-close").addEventListener("click", close);
    mapPosterEl.addEventListener("mousedown", e => { if (e.target === mapPosterEl) close(); });
    document.addEventListener("keydown", e => { if (mapPosterEl && !mapPosterEl.hidden && e.key === "Escape") close(); });
    mapPosterEl.querySelector(".mp-dl").addEventListener("click", downloadTravelPoster);
    const titleEl = mapPosterEl.querySelector(".mp-f-title"), subEl = mapPosterEl.querySelector(".mp-f-sub"), sigEl = mapPosterEl.querySelector(".mp-f-sig");
    mapPosterEl.querySelector(".mp-template").addEventListener("change", e => {
      const t = POSTER_TEMPLATES.find(x => x.id === e.target.value); if (!t) return;
      posterOpts.title = t.title; posterOpts.subtitle = t.subtitle; posterOpts.signature = t.signature;
      titleEl.value = t.title; subEl.value = t.subtitle; sigEl.value = t.signature; rerender();
    });
    titleEl.addEventListener("input", () => { posterOpts.title = titleEl.value; rerender(); });
    subEl.addEventListener("input", () => { posterOpts.subtitle = subEl.value; rerender(); });
    sigEl.addEventListener("input", () => { posterOpts.signature = sigEl.value; rerender(); });
    const swatch = mapPosterEl.querySelector(".mp-swatch");
    if (swatch) {
      const trigger = swatch.querySelector(".mp-sw-trigger"), list = swatch.querySelector(".mp-sw-list");
      trigger.addEventListener("click", e => { e.stopPropagation(); list.hidden = !list.hidden; });
      list.addEventListener("click", e => {
        e.stopPropagation();   // 列表内点击不冒泡→不收起，方便连续试色；点面板外才收
        const opt = e.target.closest("[data-skin]"); if (!opt) return;
        posterOpts.skin = opt.dataset.skin;
        list.querySelectorAll(".mp-sw-opt").forEach(o => o.classList.toggle("on", o.dataset.skin === posterOpts.skin));
        const p = POSTER_PALETTES[posterOpts.skin] || POSTER_PALETTES.warm;
        trigger.querySelector(".mp-sw-dots").innerHTML = posterSwatchDots(p);
        trigger.querySelector(".mp-sw-name").textContent = p.label || posterOpts.skin;
        rerender();
      });
      document.addEventListener("click", () => { if (!list.hidden) list.hidden = true; });
    }
    const sizeSel = mapPosterEl.querySelector(".mp-size"); sizeSel.value = posterOpts.size;
    sizeSel.addEventListener("change", () => { posterOpts.size = sizeSel.value; rerender(); });
    const regionSel = mapPosterEl.querySelector(".mp-region"); regionSel.value = posterOpts.region;
    regionSel.addEventListener("change", () => { posterOpts.region = regionSel.value; rerender(); });
    mapPosterEl.querySelectorAll("[data-stat]").forEach(cb => cb.addEventListener("change", () => {
      const key = cb.dataset.stat;
      if (cb.checked) { if (!posterOpts.stats.includes(key)) posterOpts.stats.push(key); }
      else posterOpts.stats = posterOpts.stats.filter(k => k !== key);
      rerender();
    }));
  }
  mapPosterEl.hidden = false;
  const canvas = mapPosterEl.querySelector("#mapPosterCanvas");
  requestAnimationFrame(() => { try { renderTravelPoster(canvas, posterOpts); } catch (e) { console.error("海报渲染失败", e); } });
}
function downloadTravelPoster() {
  const canvas = mapPosterEl && mapPosterEl.querySelector("#mapPosterCanvas");
  if (!canvas) return;
  const finish = blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `journey-poster_${(POSTER_CANVAS[posterOpts.size] || {}).label || ""}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };
  // 截取实时地图时，若底图瓦片不允许跨域读取，导出会因画布被"污染"而抛错——给出友好提示。
  try { canvas.toBlob(finish, "image/png"); }
  catch (e) {
    const note = mapPosterEl && mapPosterEl.querySelector(".mp-note");
    if (note) { note.textContent = "「当前可见范围」截图受底图跨域限制无法导出，请改用 中国/世界 范围。"; note.style.color = "#b84232"; }
  }
}








// 被点选聚焦的城市（显式记录，而非从某条行程的终点反推——否则点"只作为出发地的城市"如天津会跳到北京）。
let focusedCity = "";
function selectedCity() {
  if (focusedCity) return focusedCity;
  const record = records.find(item => item.id === selectedId);
  return stripShi(record?.destination || record?.origin || "");
}

function selectCity(city) {
  // 点城市 = 聚焦这座城：红点落在它身上，且它**相关的所有**航线/铁路(往返、各次)一起亮起。
  focusedCity = stripShi(city);
  const list = [...filteredRecords()].reverse();
  const hit = list.find(record => record.destination === city) || list.find(record => record.origin === city);
  if (hit) selectRecord(hit.id, { scrollTimeline: true, keepFocus: true });   // 选一段代表行程喂详情卡，但保持城市聚焦
  else render();
  showCityPopup(city);   // 弹卡：这座城的住宿停留 + 门票/景点
}

// ——— 搜索联想：输入车次/航班号或地点即给出候选清单，点选直达该段行程 ———
let suggestActiveIndex = -1;

// 按相关度给每条记录打分：车次/航班号前缀最高，其次城市、标题、项目。
function buildSuggestions(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  const scored = [];
  records.forEach(record => {
    const no = String(record.transportNo || "").toLowerCase();
    const origin = String(record.origin || "").toLowerCase();
    const destination = String(record.destination || "").toLowerCase();
    const title = String(record.title || "").toLowerCase();
    const project = String(record.project || record.purpose || "").toLowerCase();
    let score = 0;
    if (no && no.startsWith(q)) score = 100;
    else if (no && no.includes(q)) score = 80;
    else if (origin.startsWith(q) || destination.startsWith(q)) score = 70;
    else if (origin.includes(q) || destination.includes(q)) score = 60;
    else if (title.includes(q)) score = 40;
    else if (project.includes(q)) score = 30;
    if (score) scored.push({ record, score });
  });
  scored.sort((a, b) =>
    b.score - a.score ||
    String(a.record.transportNo || "").localeCompare(String(b.record.transportNo || ""), "en") ||
    String(b.record.startDate || "").localeCompare(String(a.record.startDate || ""))
  );
  return scored.slice(0, 8).map(item => item.record);
}

function suggestionRowHtml(record, index) {
  const no = record.transportNo || KIND[record.kind]?.label || "行程";
  const route = displayTitle(record) || [record.origin, record.destination].filter(Boolean).join(" → ") || "未命名";
  const meta = [dateRange(record), KIND[record.kind]?.label].filter(Boolean).join(" · ");
  return `<li role="option" data-id="${escapeHtml(record.id)}" data-index="${index}">
    <span class="sg-no">${escapeHtml(no)}</span>
    <span class="sg-route">${escapeHtml(route)}</span>
    <span class="sg-meta">${escapeHtml(meta)}</span>
  </li>`;
}

function renderSuggestions() {
  if (!els.searchSuggest) return;
  const query = els.search.value;
  suggestActiveIndex = -1;
  if (!query.trim()) {
    closeSuggestions();
    return;
  }
  const list = buildSuggestions(query);
  els.searchSuggest.innerHTML = list.length
    ? list.map((record, index) => suggestionRowHtml(record, index)).join("")
    : `<li class="sg-empty">没有匹配「${escapeHtml(query.trim())}」的车次或地点</li>`;
  els.searchSuggest.hidden = false;
  els.search.setAttribute("aria-expanded", "true");
}

function closeSuggestions() {
  if (!els.searchSuggest) return;
  els.searchSuggest.hidden = true;
  els.searchSuggest.innerHTML = "";
  suggestActiveIndex = -1;
  els.search.setAttribute("aria-expanded", "false");
}

// 跳转到具体行程：清掉会挡住它的筛选（含旅客——建议列表是全量的，否则会静默落到另一条可见记录），
// 切到地图视图，选中并滚动到该段。
function chooseSuggestion(id) {
  if (!id) return;
  stopPlayback();
  if (els.year) els.year.value = "all";
  if (els.kind) els.kind.value = "all";
  if (els.confidence) els.confidence.value = "all";
  const target = records.find(r => r.id === id);
  if (els.traveler && target && !includesTraveler(target, els.traveler.value)) els.traveler.value = "all";
  closeSuggestions();
  setActiveView("map");
  selectRecord(id, { scrollTimeline: true, full: true });   // 刚改了筛选，必须全量重建
}

function moveSuggestion(step) {
  const items = [...els.searchSuggest.querySelectorAll("li[data-id]")];
  if (!items.length) return;
  suggestActiveIndex = (suggestActiveIndex + step + items.length) % items.length;
  items.forEach((node, index) => node.classList.toggle("active", index === suggestActiveIndex));
  const active = items[suggestActiveIndex];
  if (active) active.scrollIntoView({ block: "nearest" });
}

function bindSearch() {
  els.search.addEventListener("input", renderSuggestions);
  els.search.addEventListener("focus", () => {
    if (els.search.value.trim()) renderSuggestions();
  });
  els.search.addEventListener("keydown", event => {
    if (els.searchSuggest.hidden && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      renderSuggestions();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSuggestion(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSuggestion(-1);
    } else if (event.key === "Enter") {
      const items = [...els.searchSuggest.querySelectorAll("li[data-id]")];
      const target = items[suggestActiveIndex] || items[0];
      if (target) {
        event.preventDefault();
        chooseSuggestion(target.dataset.id);
      }
    } else if (event.key === "Escape") {
      closeSuggestions();
    }
  });
  // 用 mousedown 抢在 input 失焦之前选中，避免点击还没生效面板就关了。
  els.searchSuggest.addEventListener("mousedown", event => {
    const li = event.target.closest("li[data-id]");
    if (!li) return;
    event.preventDefault();
    chooseSuggestion(li.dataset.id);
  });
  document.addEventListener("mousedown", event => {
    if (!event.target.closest(".search-field")) closeSuggestions();
  });
}

// ——— 资料明细内搜索：搜车次/地点 → 下拉候选 → 选中后滚到该行并高亮一次 ———
let ledgerSuggestActiveIndex = -1;

function renderLedgerSuggestions() {
  if (!els.ledgerSearchSuggest) return;
  const query = els.ledgerSearch.value;
  ledgerSuggestActiveIndex = -1;
  if (!query.trim()) { closeLedgerSuggestions(); return; }
  const list = buildSuggestions(query);
  els.ledgerSearchSuggest.innerHTML = list.length
    ? list.map((record, index) => suggestionRowHtml(record, index)).join("")
    : `<li class="sg-empty">没有匹配「${escapeHtml(query.trim())}」的车次或地点</li>`;
  els.ledgerSearchSuggest.hidden = false;
  els.ledgerSearch.setAttribute("aria-expanded", "true");
}

function closeLedgerSuggestions() {
  if (!els.ledgerSearchSuggest) return;
  els.ledgerSearchSuggest.hidden = true;
  els.ledgerSearchSuggest.innerHTML = "";
  ledgerSuggestActiveIndex = -1;
  els.ledgerSearch.setAttribute("aria-expanded", "false");
}

// 在明细表里定位某条记录的行，滚动到视野中央并高亮闪一次。
// 若该记录被当前筛选挡住（表里找不到行），先清掉筛选并重渲染再定位。
function jumpToLedgerRow(id) {
  if (!id) return;
  closeLedgerSuggestions();
  let row = els.ledgerBody.querySelector(`tr[data-id="${cssEscape(id)}"]`);
  if (!row) {
    if (els.year) els.year.value = "all";
    if (els.kind) els.kind.value = "all";
    if (els.confidence) els.confidence.value = "all";
    const target = records.find(r => r.id === id);
    if (els.traveler && target && !includesTraveler(target, els.traveler.value)) els.traveler.value = "all";
    render();
    row = els.ledgerBody.querySelector(`tr[data-id="${cssEscape(id)}"]`);
  }
  if (!row) return;
  row.scrollIntoView({ behavior: "smooth", block: "center" });
  els.ledgerBody.querySelectorAll("tr.ld-hit").forEach(r => r.classList.remove("ld-hit"));
  // 重新触发动画：先去类，强制回流，再加
  void row.offsetWidth;
  row.classList.add("ld-hit");
  row.addEventListener("animationend", () => row.classList.remove("ld-hit"), { once: true });
}

// CSS.escape 兜底（个别老内核没有），id 里只有字母数字和-，简单转义即可。
function cssEscape(s) {
  return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/["\\\]]/g, "\\$&");
}

function moveLedgerSuggestion(step) {
  const items = [...els.ledgerSearchSuggest.querySelectorAll("li[data-id]")];
  if (!items.length) return;
  ledgerSuggestActiveIndex = (ledgerSuggestActiveIndex + step + items.length) % items.length;
  items.forEach((node, index) => node.classList.toggle("active", index === ledgerSuggestActiveIndex));
  const active = items[ledgerSuggestActiveIndex];
  if (active) active.scrollIntoView({ block: "nearest" });
}

function bindLedgerSearch() {
  if (!els.ledgerSearch) return;
  els.ledgerSearch.addEventListener("input", renderLedgerSuggestions);
  els.ledgerSearch.addEventListener("focus", () => { if (els.ledgerSearch.value.trim()) renderLedgerSuggestions(); });
  els.ledgerSearch.addEventListener("keydown", event => {
    if (els.ledgerSearchSuggest.hidden && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      renderLedgerSuggestions(); return;
    }
    if (event.key === "ArrowDown") { event.preventDefault(); moveLedgerSuggestion(1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); moveLedgerSuggestion(-1); }
    else if (event.key === "Enter") {
      const items = [...els.ledgerSearchSuggest.querySelectorAll("li[data-id]")];
      const target = items[ledgerSuggestActiveIndex] || items[0];
      if (target) { event.preventDefault(); jumpToLedgerRow(target.dataset.id); }
    } else if (event.key === "Escape") { closeLedgerSuggestions(); }
  });
  els.ledgerSearchSuggest.addEventListener("mousedown", event => {
    const li = event.target.closest("li[data-id]");
    if (!li) return;
    event.preventDefault();
    jumpToLedgerRow(li.dataset.id);
  });
  document.addEventListener("mousedown", event => {
    if (!event.target.closest(".ledger-search-field")) closeLedgerSuggestions();
  });
}

function renderTimeline(list) {
  const timelineList = list.filter(record => record.showInTimeline !== false);
  els.recordCount.textContent = `${timelineList.length} 段`;
  els.timeline.innerHTML = timelineList.map((record, index) => {
    const meta = [
      KIND[record.kind]?.label || record.kind,
      record.transportNo,
      duration(record.durationMinutes),
      money(record.amountCny)
    ].filter(Boolean).join(" · ");
    return `<button class="journey ${record.id === selectedId ? "active" : ""}" data-id="${escapeHtml(record.id)}" style="--kind-color:${KIND[record.kind]?.color || "var(--other)"}">
      <span class="date">${String(index + 1).padStart(2, "0")} / ${escapeHtml(dateRange(record))}</span>
      <strong class="name">${escapeHtml(displayTitle(record))}</strong>
      <span class="route-line"></span>
      <span class="meta">${escapeHtml(meta)}</span>
      <span class="meta">${escapeHtml(record.project || record.purpose || "")}</span>
    </button>`;
  }).join("");

  els.timeline.querySelectorAll("[data-id]").forEach(node => {
    node.addEventListener("click", () => {
      stopPlayback();
      selectRecord(node.dataset.id);
    });
  });
}

function renderLedger(list) {
  els.ledgerCount.textContent = `${list.length} 条`;
  els.ledgerBody.innerHTML = list.map(record => {
    // 标题与"起→讫"相同（绝大多数移动段）就不重复印两行——避免"广州 → 广州"叠两遍
    const sameCity = record.origin && record.origin === record.destination;   // 门票/停留：副行"北京 → 北京"无信息量
    const route = sameCity ? "" : [record.origin, record.destination].filter(Boolean).join(" → ");
    const title = displayTitle(record);
    const sub = route && route !== title ? `<br><span class="ld-sub">${escapeHtml(route)}</span>` : "";
    return `
    <tr data-id="${escapeHtml(record.id)}">
      <td>${escapeHtml(dateRange(record))}</td>
      <td><strong>${escapeHtml(title)}</strong>${sub}</td>
      <td>${escapeHtml(KIND[record.kind]?.label || record.kind)}</td>
      <td>${escapeHtml(record.traveler)}</td>
      <td>${escapeHtml(record.project || record.purpose || "")}</td>
      <td class="money">${money(record.amountCny)}</td>
      <td><span class="status-pill ${escapeHtml(record.confidence)}">${escapeHtml(confidenceLabel(record.confidence))}</span></td>
      <td>${escapeHtml(record.notes || "")}</td>
    </tr>`;
  }).join("");
}

// 海报落款：随选中行程聚焦的城市，显示 城市拉丁名 / 坐标 / 国家。
function setPosterCaption(record) {
  if (!els.posterCity) return;
  // 优先用当前聚焦的城市（点了"仅作为出发地"的城时，落款/街道海报按钮才不会错显成该行程的目的地）
  const city = focusedCity ? String(focusedCity).replace(/市$/, "")
    : (record ? String(record.destination || record.origin || "").replace(/市$/, "") : "");
  const known = city && (CITY[city] || CITY[city.replace(/[南北东西站]/g, "")]);
  const point = known || null;
  els.posterCity.textContent = city ? cityLatin(city) : "中国行旅";
  if (point) {
    const ns = point.lat >= 0 ? "N" : "S";
    const ew = point.lng >= 0 ? "E" : "W";
    els.posterCoord.textContent = `${Math.abs(point.lat).toFixed(2)}°${ns} / ${Math.abs(point.lng).toFixed(2)}°${ew}`;
  } else {
    els.posterCoord.textContent = "—";
  }
  els.posterCountry.textContent = city ? countryLatin(city) : "CHINA";

  // 街道海报入口：只对有坐标的城市开放
  focusCity = known ? city : "";
  if (els.posterBtn) {
    els.posterBtn.hidden = !focusCity;
    if (focusCity) els.posterBtn.textContent = `${focusCity} · 街道海报 ↗`;
  }
  if (els.posterBtnTop) els.posterBtnTop.hidden = !focusCity;
}

/* =====================================================================
   城市街道海报生成器（应用内自建）
   设计/配色/尺寸/渲染参数 lift 自开源 maptoposter-online (MIT)：
   - 20 套主题 + 6 种尺寸 + 12 类配色（window.POSTER_THEMES / POSTER_SIZES）
   - 道路按等级分宽（motorway 1.2 → default 0.4，主干道叠在上层）
   - 落款在 88% 高度处：坐标 / 国家 / 城市（大）
   - 顶/底渐变遮罩用 gradient_color，提升留白与可读性
   数据走 OpenStreetMap Overpass（out geom），canvas 渲染、导出 PNG。
   ===================================================================== */
const POSTER_THEMES = window.POSTER_THEMES || [];
const POSTER_SIZES = window.POSTER_SIZES || [];
const overpassCache = new Map();      // key `${lat},${lng},${r}` -> 分类后的几何
let posterState = { city: "", radius: 6000, themeId: (POSTER_THEMES[0] || {}).id, sizeId: (POSTER_SIZES[0] || {}).id, poi: "none", title: "", colors: null, fontFamily: "" };

// OSM highway → {class, width 比例}；不在表内的（footway/path/track/cycleway/steps）跳过。
function roadSpec(hw) {
  switch (hw) {
    case "motorway": case "motorway_link": return { cls: "road_motorway", w: 1.2 };
    case "trunk": case "trunk_link": return { cls: "road_primary", w: 1.0 };
    case "primary": case "primary_link": return { cls: "road_primary", w: 1.0 };
    case "secondary": case "secondary_link": return { cls: "road_secondary", w: 0.8 };
    case "tertiary": case "tertiary_link": return { cls: "road_tertiary", w: 0.6 };
    case "residential": case "living_street": return { cls: "road_residential", w: 0.4 };
    case "unclassified": case "service": case "road": case "pedestrian": return { cls: "road_default", w: 0.4 };
    default: return null;
  }
}

function buildOverpassQuery(lat, lng, r, poi) {
  const parts = [
    `way["highway"~"motorway|trunk|primary|secondary|tertiary|residential|unclassified|living_street|service|pedestrian"](around:${r},${lat},${lng});`,
    `way["waterway"~"river|canal|stream|riverbank"](around:${r},${lat},${lng});`,
    `way["natural"="water"](around:${r},${lat},${lng});`,
    `relation["natural"="water"](around:${r},${lat},${lng});`,
    `way["natural"="coastline"](around:${r},${lat},${lng});`,
    `way["leisure"~"park|garden|nature_reserve"](around:${r},${lat},${lng});`,
    `way["landuse"~"forest|grass|meadow|recreation_ground|village_green|cemetery"](around:${r},${lat},${lng});`
  ];
  if (poi && poi !== "none") {
    const cap = poi === "sparse" ? 60 : 180;
    parts.push(`node["amenity"](around:${r},${lat},${lng});`);
    void cap;
  }
  return `[out:json][timeout:60];(${parts.join("")});out geom ${poi && poi !== "none" ? "" : ""};`;
}

async function fetchOverpass(query) {
  let lastErr = null;
  for (const url of OVERPASS_ENDPOINTS) {
    try {
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), 75000);
      const res = await fetch(url, { method: "POST", body: "data=" + encodeURIComponent(query), signal: ctrl.signal });
      window.clearTimeout(timer);
      if (!res.ok) throw new Error(`Overpass ${res.status}`);
      return await res.json();
    } catch (err) { lastErr = err; }
  }
  throw lastErr || new Error("Overpass 不可用");
}

// 把 Overpass 元素按图层分类：道路（按等级）/水填充/水线/公园/POI 点。
function classifyOsm(json) {
  const roads = [];     // {cls, w, geom:[[lon,lat],...]}
  const waterFill = [], waterLine = [], parks = [], poi = [], coastlines = [];
  (json.elements || []).forEach(el => {
    const t = el.tags || {};
    if (el.type === "node") { if (t.amenity) poi.push([el.lon, el.lat]); return; }
    const geom = el.geometry;
    if (!geom || geom.length < 2) return;
    const pts = geom.map(g => [g.lon, g.lat]);
    if (t.natural === "coastline") { coastlines.push(pts); return; }
    if (t.highway) {
      const spec = roadSpec(t.highway);
      if (spec) roads.push({ cls: spec.cls, w: spec.w, geom: pts });
    } else if (t.natural === "water" || t.waterway === "riverbank" || t.water) {
      waterFill.push(pts);
    } else if (t.waterway) {
      waterLine.push(pts);
    } else if (t.leisure || t.landuse) {
      parks.push(pts);
    }
  });
  // 主干道画在上层：default→residential→tertiary→secondary→primary→motorway
  const order = ["road_default", "road_residential", "road_tertiary", "road_secondary", "road_primary", "road_motorway"];
  roads.sort((a, b) => order.indexOf(a.cls) - order.indexOf(b.cls));
  return { roads, waterFill, waterLine, parks, poi, coastlines };
}

// ——— 海报海面填充（沿海城市）———
function pointInPoly(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi || 1e-9) + xi)) inside = !inside;
  }
  return inside;
}
// 把相连（端点重合）的海岸线段并成长链
function mergeChains(chains) {
  const eps = 2, same = (a, b) => Math.abs(a[0] - b[0]) < eps && Math.abs(a[1] - b[1]) < eps;
  const arr = chains.map(c => c.slice());
  let merged = true, guard = 0;
  while (merged && guard++ < 2000) {
    merged = false;
    for (let i = 0; i < arr.length && !merged; i++) for (let j = 0; j < arr.length; j++) {
      if (i === j) continue;
      const a = arr[i], b = arr[j];
      if (same(a[a.length - 1], b[0])) { arr[i] = a.concat(b.slice(1)); arr.splice(j, 1); merged = true; break; }
      if (same(a[a.length - 1], b[b.length - 1])) { arr[i] = a.concat(b.slice(0, -1).reverse()); arr.splice(j, 1); merged = true; break; }
      if (same(a[0], b[b.length - 1])) { arr[i] = b.concat(a.slice(1)); arr.splice(j, 1); merged = true; break; }
      if (same(a[0], b[0])) { arr[i] = a.slice().reverse().concat(b.slice(1)); arr.splice(j, 1); merged = true; break; }
    }
  }
  return arr;
}
// 折线裁到 [0,0,W,H]，返回若干子段（端点落在边界上）
function clipToRect(pts, W, H) {
  const inside = p => p[0] >= 0 && p[0] <= W && p[1] >= 0 && p[1] <= H;
  const cross = (a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], hits = [];
    const add = (t, x, y) => { if (t > 0 && t < 1) hits.push([t, [x, y]]); };
    if (dx) { let t = (0 - a[0]) / dx, y = a[1] + t * dy; if (y >= 0 && y <= H) add(t, 0, y); t = (W - a[0]) / dx; y = a[1] + t * dy; if (y >= 0 && y <= H) add(t, W, y); }
    if (dy) { let t = (0 - a[1]) / dy, x = a[0] + t * dx; if (x >= 0 && x <= W) add(t, x, 0); t = (H - a[1]) / dy; x = a[0] + t * dx; if (x >= 0 && x <= W) add(t, x, H); }
    return hits.sort((p, q) => p[0] - q[0]).map(h => h[1]);
  };
  const subs = []; let cur = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], pin = inside(p);
    if (i === 0) { if (pin) cur.push(p); continue; }
    const prev = pts[i - 1], prevIn = inside(prev), xs = cross(prev, p);
    if (prevIn && pin) cur.push(p);
    else if (prevIn && !pin) { if (xs[0]) cur.push(xs[0]); if (cur.length > 1) subs.push(cur); cur = []; }
    else if (!prevIn && pin) { cur = xs.length ? [xs[xs.length - 1], p] : [p]; }
    else if (xs.length >= 2) subs.push([xs[0], xs[1]]);
  }
  if (cur.length > 1) subs.push(cur);
  return subs;
}
// 点在矩形边界上的周长参数 [0,4)
function rectParam(p, W, H) {
  if (p[1] <= 0.6) return p[0] / W;
  if (p[0] >= W - 0.6) return 1 + p[1] / H;
  if (p[1] >= H - 0.6) return 2 + (W - p[0]) / W;
  return 3 + (H - p[1]) / H;
}
// 沿矩形边界从 from 走到 to（dir=+1 周长增大方向），返回经过的角点
function boundaryWalk(from, to, dir, W, H) {
  const corners = [[0, 0], [W, 0], [W, H], [0, H]];
  const pa = rectParam(from, W, H), pb = rectParam(to, W, H), out = [];
  if (dir > 0) {
    const span = ((pb - pa) % 4 + 4) % 4;
    for (let k = Math.ceil(pa + 1e-6), g = 0; g < 8; k++, g++) { if ((k - pa) >= span) break; out.push(corners[((k % 4) + 4) % 4]); }
  } else {
    const span = ((pa - pb) % 4 + 4) % 4;
    for (let k = Math.floor(pa - 1e-6), g = 0; g < 8; k--, g++) { if ((pa - k) >= span) break; out.push(corners[((k % 4) + 4) % 4]); }
  }
  return out;
}
function fillSea(ctx, coastlines, W, H, P, waterColor) {
  let chains = mergeChains(coastlines.map(line => line.map(ll => P(ll[0], ll[1]))));
  const center = [W / 2, H * 0.46]; // 与 drawPoster cy 一致：城市中心=陆地
  const onB = p => p[0] <= 0.6 || p[0] >= W - 0.6 || p[1] <= 0.6 || p[1] >= H - 0.6;
  ctx.save();
  ctx.fillStyle = waterColor;
  chains.forEach(chain => {
    clipToRect(chain, W, H).forEach(sub => {
      if (sub.length < 2) return;
      const E = sub[0], X = sub[sub.length - 1];
      if (!onB(E) || !onB(X)) return;
      for (const dir of [1, -1]) {
        const poly = sub.concat(boundaryWalk(X, E, dir, W, H));
        if (poly.length < 3) continue;
        if (!pointInPoly(center, poly)) {
          ctx.beginPath();
          poly.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
          ctx.closePath(); ctx.fill();
          break;
        }
      }
    });
  });
  ctx.restore();
}

function currentTheme() {
  const t = POSTER_THEMES.find(x => x.id === posterState.themeId) || POSTER_THEMES[0];
  return posterState.colors || (t && t.colors) || {};
}
function currentSize() {
  return POSTER_SIZES.find(x => x.id === posterState.sizeId) || POSTER_SIZES[0] || { width: 1200, height: 1680 };
}

// 在给定 canvas 上画一张海报（预览与导出共用）。
function drawPoster(canvas, data, center) {
  const c = currentTheme();
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = c.bg || "#fbfaf4";
  ctx.fillRect(0, 0, W, H);
  if (!data) return;

  const lat0 = center.lat, lng0 = center.lng;
  const mPerLng = 111320 * Math.cos(lat0 * Math.PI / 180), mPerLat = 110540;
  const scale = W / (2 * posterState.radius);   // 半径铺满宽度
  const cx = W / 2, cy = H * 0.46;
  const P = (lon, lat) => [cx + (lon - lng0) * mPerLng * scale, cy - (lat - lat0) * mPerLat * scale];
  const trace = pts => { ctx.beginPath(); for (let i = 0; i < pts.length; i++) { const p = P(pts[i][0], pts[i][1]); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } };
  ctx.lineCap = "round"; ctx.lineJoin = "round";

  if (data.coastlines && data.coastlines.length) fillSea(ctx, data.coastlines, W, H, P, c.water);
  data.parks.forEach(pts => { trace(pts); ctx.closePath(); ctx.fillStyle = c.parks; ctx.fill(); });
  data.waterFill.forEach(pts => { trace(pts); ctx.closePath(); ctx.fillStyle = c.water; ctx.fill(); });
  ctx.strokeStyle = c.water; ctx.lineWidth = Math.max(1, 1.2 * (W / 1200));
  data.waterLine.forEach(pts => { trace(pts); ctx.stroke(); });

  const mult = 2.4 * (W / 1200);   // 道路总体粗细
  data.roads.forEach(r => { ctx.strokeStyle = c[r.cls] || c.road_default; ctx.lineWidth = Math.max(0.5, r.w * mult); trace(r.geom); ctx.stroke(); });

  if (data.poi.length && posterState.poi !== "none") {
    ctx.fillStyle = c.poi_color || c.road_default;
    const rad = Math.max(1.5, 2.4 * (W / 1200));
    data.poi.forEach(([lon, lat]) => { const p = P(lon, lat); ctx.beginPath(); ctx.arc(p[0], p[1], rad, 0, Math.PI * 2); ctx.fill(); });
  }

  // 顶/底渐变遮罩（gradient_color），让边缘退晕、落款更清晰
  const gc = c.gradient_color || c.bg;
  const topG = ctx.createLinearGradient(0, 0, 0, H * 0.2);
  topG.addColorStop(0, hexA(gc, 1)); topG.addColorStop(1, hexA(gc, 0));
  ctx.fillStyle = topG; ctx.fillRect(0, 0, W, H * 0.2);
  const botG = ctx.createLinearGradient(0, H * 0.62, 0, H);
  botG.addColorStop(0, hexA(gc, 0)); botG.addColorStop(1, hexA(gc, 1));
  ctx.fillStyle = botG; ctx.fillRect(0, H * 0.62, W, H * 0.38);

  // 落款：坐标（上）/ 国家（中）/ 城市（大，下），锚点 88% 高
  const sf = Math.min(W / 1200, (H / 1200) * 1.1);
  const anchorY = 0.88 * H;
  const titleFont = posterState.fontFamily || '"Hoefler Text", "Songti SC", Palatino, serif';
  const sansFont = '"PingFang SC", "Helvetica Neue", -apple-system, sans-serif';
  ctx.textAlign = "center"; ctx.fillStyle = c.text;
  ctx.textBaseline = "alphabetic";

  const cityLabel = (posterState.title || cityLatin(posterState.city) || "").toUpperCase();
  const country = countryLatin(posterState.city);
  const coords = `${Math.abs(center.lat).toFixed(4)}° ${center.lat >= 0 ? "N" : "S"} / ${Math.abs(center.lng).toFixed(4)}° ${center.lng >= 0 ? "E" : "W"}`;

  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.font = `400 ${18 * sf}px ${sansFont}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${2 * sf}px`;
  ctx.fillText(coords, cx, anchorY - 40 * sf);
  ctx.restore();

  ctx.save();
  ctx.font = `500 ${26 * sf}px ${sansFont}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${6 * sf}px`;
  ctx.fillText(country, cx, anchorY);
  ctx.restore();

  ctx.save();
  let citySize = 80 * sf;
  ctx.font = `500 ${citySize}px ${titleFont}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${10 * sf}px`;
  while (citySize > 24 && ctx.measureText(cityLabel).width > W * 0.86) { citySize -= 2; ctx.font = `500 ${citySize}px ${titleFont}`; }
  ctx.fillText(cityLabel, cx, anchorY + 56 * sf);
  ctx.restore();
}

// "#rrggbb" + alpha → rgba()
function hexA(hex, a) {
  const h = String(hex || "").replace("#", "");
  if (h.length < 6) return `rgba(0,0,0,${a})`;
  const n = parseInt(h.slice(0, 6), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function setPmStatus(msg) {
  if (!els.pmStatus) return;
  els.pmStatus.textContent = msg || "";
  els.pmStatus.hidden = !msg;
}

// 重画预览（不重新取数据）。
function renderPosterPreview() {
  const key = posterCacheKey();
  const data = overpassCache.get(key);
  const center = CITY[posterState.city] || CITY[posterState.city.replace(/[南北东西站]/g, "")];
  if (!center) return;
  const size = currentSize();
  // 预览画布按尺寸比例，最长边封顶 1600，导出时再用全分辨率。
  const cap = 1600, ratio = size.width / size.height;
  let pw = size.width, ph = size.height;
  if (Math.max(pw, ph) > cap) { if (pw >= ph) { pw = cap; ph = Math.round(cap / ratio); } else { ph = cap; pw = Math.round(cap * ratio); } }
  els.posterCanvas.width = pw; els.posterCanvas.height = ph;
  drawPoster(els.posterCanvas, data || null, center);
}

function posterCacheKey() {
  const center = CITY[posterState.city] || CITY[posterState.city.replace(/[南北东西站]/g, "")] || { lat: 0, lng: 0 };
  return `${center.lat},${center.lng},${posterState.radius},${posterState.poi}`;
}

async function generatePoster() {
  const center = CITY[posterState.city] || CITY[posterState.city.replace(/[南北东西站]/g, "")];
  if (!center) { setPmStatus("这座城市没有坐标"); return; }
  const key = posterCacheKey();
  if (!overpassCache.has(key)) {
    els.pmGenerate.disabled = true;
    let secs = 0;
    setPmStatus(`正在向 OpenStreetMap 取「${posterState.city}」街道数据…`);
    const timer = window.setInterval(() => { secs += 1; setPmStatus(`正在取「${posterState.city}」街道数据… ${secs}s\n（大城市约 10–30 秒，请稍候）`); }, 1000);
    try {
      const json = await fetchOverpass(buildOverpassQuery(center.lat, center.lng, posterState.radius, posterState.poi));
      overpassCache.set(key, classifyOsm(json));
    } catch (err) {
      window.clearInterval(timer);
      setPmStatus("取数据失败：" + (err.message || "请稍后重试") + "\n（Overpass 偶尔限流，换小半径或稍后再试）");
      els.pmGenerate.disabled = false;
      return;
    }
    window.clearInterval(timer);
    els.pmGenerate.disabled = false;
  }
  setPmStatus("");
  renderPosterPreview();
}

function downloadPoster() {
  const center = CITY[posterState.city] || CITY[posterState.city.replace(/[南北东西站]/g, "")];
  const data = overpassCache.get(posterCacheKey());
  if (!center || !data) { setPmStatus("请先生成"); return; }
  setPmStatus("正在导出高清 PNG…");
  els.pmDownload.disabled = true;
  // 先让"导出中"提示绘出，再做重活（全分辨率绘制 + PNG 编码约 1–2 秒）
  window.setTimeout(() => {
    const size = currentSize();
    const out = document.createElement("canvas");
    out.width = size.width; out.height = size.height;
    drawPoster(out, data, center);
    out.toBlob(blob => {
      const name = `${(posterState.title || cityLatin(posterState.city) || "map").replace(/\s+/g, "-")}-${size.id}.png`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = name;
      document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      setPmStatus(""); els.pmDownload.disabled = false;
    }, "image/png");
  }, 40);
}

// 12 类自定义配色输入（实时重绘）。
function buildColorGrid() {
  if (!els.pmColorGrid) return;
  const labels = {
    bg: "背景", text: "文字", gradient_color: "渐变遮罩", poi_color: "兴趣点", water: "水体", parks: "公园绿地",
    road_motorway: "高速", road_primary: "主要道路", road_secondary: "次要道路", road_tertiary: "三级道路",
    road_residential: "居住区道路", road_default: "其他街道"
  };
  const c = currentTheme();
  els.pmColorGrid.innerHTML = Object.keys(labels).map(k =>
    `<label class="pm-color"><input type="color" data-key="${k}" value="${(c[k] || "#000000").slice(0, 7)}"><span>${labels[k]}</span></label>`
  ).join("");
  els.pmColorGrid.querySelectorAll("input[type=color]").forEach(inp => {
    inp.addEventListener("input", () => {
      const base = { ...currentTheme() };
      base[inp.dataset.key] = inp.value;
      posterState.colors = base;
      renderPosterPreview();
    });
  });
}

// 城市街道海报：跳转到开源项目 maptoposter（街景海报用它原版生成，不再内置渲染）。
// 站点未公开 city 参数，故打开首页、并把聚焦城市的英文名复制到剪贴板，方便到那边粘贴。
function openStreetPosterSite(city) {
  const latin = city ? titleCase(cityLatin(stripShi(city))) : "";
  if (latin && navigator.clipboard) navigator.clipboard.writeText(latin).catch(() => {});
  window.open("https://maptoposter.0v0.one/", "_blank", "noopener");
}

// 可传城市名（右键城市点时）；不传则用当前聚焦城市（按钮）。事件对象不算城市名。
function openCityPoster(cityArg) {
  const raw = (typeof cityArg === "string" && cityArg) ? cityArg : focusCity;
  const city = String(raw || "").replace(/市$/, "");
  const center = city && (CITY[city] || CITY[city.replace(/[南北东西站]/g, "")]);
  if (!center || !els.posterModal) return;
  posterState.city = city;
  posterState.title = "";
  posterState.colors = null;
  posterState.radius = Number(els.pmRadius.value) || 6000;
  posterState.poi = els.pmPoi.value || "none";
  posterState.themeId = els.pmTheme.value || (POSTER_THEMES[0] || {}).id;
  posterState.sizeId = els.pmSize.value || (POSTER_SIZES[0] || {}).id;
  els.pmTitle.textContent = cityLatin(city);
  els.pmTitleInput.value = "";
  buildColorGrid();
  els.posterModal.hidden = false;
  generatePoster();
}

function closePosterModal() {
  if (els.posterModal) els.posterModal.hidden = true;
}

function bindPosterModal() {
  if (!els.posterModal) return;
  // 主题/尺寸下拉填充
  els.pmTheme.innerHTML = POSTER_THEMES.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join("");
  els.pmSize.innerHTML = POSTER_SIZES.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("");

  els.pmClose.addEventListener("click", closePosterModal);
  els.posterModal.addEventListener("mousedown", e => { if (e.target === els.posterModal) closePosterModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !els.posterModal.hidden) closePosterModal(); });

  els.pmRadius.addEventListener("input", () => { els.pmRadiusVal.textContent = `${(els.pmRadius.value / 1000).toFixed(1)} km`; });
  els.pmRadius.addEventListener("change", () => { posterState.radius = Number(els.pmRadius.value); generatePoster(); });
  els.pmPoi.addEventListener("change", () => { posterState.poi = els.pmPoi.value; generatePoster(); });
  els.pmTheme.addEventListener("change", () => { posterState.themeId = els.pmTheme.value; posterState.colors = null; buildColorGrid(); renderPosterPreview(); });
  els.pmSize.addEventListener("change", () => { posterState.sizeId = els.pmSize.value; renderPosterPreview(); });
  els.pmTitleInput.addEventListener("input", () => { posterState.title = els.pmTitleInput.value.trim(); els.pmTitle.textContent = posterState.title || cityLatin(posterState.city); renderPosterPreview(); });
  els.pmGenerate.addEventListener("click", generatePoster);
  els.pmDownload.addEventListener("click", downloadPoster);
  els.pmFont.addEventListener("change", async () => {
    const file = els.pmFont.files && els.pmFont.files[0];
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const fam = "PosterCustomFont";
      const face = new FontFace(fam, buf);
      await face.load();
      document.fonts.add(face);
      posterState.fontFamily = `"${fam}"`;
      renderPosterPreview();
    } catch (err) { setPmStatus("字体加载失败"); }
  });
}

function renderDetail(record, list) {
  if (!record) {
    els.detailTitle.textContent = "没有匹配记录";
    els.detailText.textContent = "调整筛选条件后再看。";
    els.detailDate.textContent = "-";
    els.detailDuration.textContent = "-";
    els.detailCost.textContent = "-";
    els.detailConfidence.textContent = "-";
    setPosterCaption(null);
    return;
  }

  const meta = [record.transportNo, KIND[record.kind]?.label || record.kind, record.traveler].filter(Boolean).join(" · ");
  els.detailTitle.textContent = displayTitle(record);
  els.detailText.textContent = `${meta}。${record.notes || record.project || record.purpose || ""}`;
  els.detailDate.textContent = dateRange(record);
  const stayNights = Math.max(0, daysBetween(record.startDate, record.endDate).length - 1);
  // 移动段在"时长"里带上起降时刻（含 +1天/当地）——此前全站只有弹卡能看到这条信息
  const tt = record.kind === "stay" ? "" : tripTimeText(record);
  const dur = record.kind === "stay" ? (stayNights > 0 ? `${stayNights} 晚` : "当天") : duration(record.durationMinutes);
  els.detailDuration.textContent = [tt, dur === "待补" && tt ? "" : dur].filter(Boolean).join(" · ") || dur;
  els.detailCost.textContent = money(record.amountCny);
  els.detailConfidence.textContent = confidenceLabel(record.confidence);
  setPosterCaption(record);
}

// 选中的行程若在视口外，把镜头带过去——否则"点了像没点"（高亮发生在画面外）。
function ensureSelectionVisible(rec) {
  if (!glMap || !rec) return;
  const pts = [cityLngLat(rec.origin), cityLngLat(rec.destination)].filter(Boolean);
  if (!pts.length) return;
  try { if (pts.every(ll => glMap.getBounds().contains(ll))) return; } catch (e) { return; }
  let minLng = 999, minLat = 999, maxLng = -999, maxLat = -999;
  pts.forEach(ll => { minLng = Math.min(minLng, ll[0]); maxLng = Math.max(maxLng, ll[0]); minLat = Math.min(minLat, ll[1]); maxLat = Math.max(maxLat, ll[1]); });
  glMap.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: { top: 140, bottom: 170, left: 110, right: 110 }, duration: 750, maxZoom: 6 });
}

function selectRecord(id, { scrollTimeline = false, keepFocus = false, full = false } = {}) {
  selectedId = id;
  if (!keepFocus) focusedCity = "";   // 从时间线/搜索选具体一段时，回到"单段高亮"，不做整城聚焦
  if (full) render();                 // 筛选条件刚被改过（如搜索跳转）→ 必须全管线重建
  else refreshSelection();            // 普通点选 → 轻路径：只动高亮/详情卡，不重建卡列表与统计
  if (!play) ensureSelectionVisible(records.find(r => r.id === id));   // 播放有自己的镜头，不抢
  if (scrollTimeline) requestAnimationFrame(scrollActiveTimeline);
}

function scrollActiveTimeline() {
  const container = els.timeline;
  const active = container.querySelector(".journey.active");
  if (!active) return;
  // 只在时间线容器内横向滚动到当前卡片，绝不带动整页——否则播放或在地图上点选时
  // 会把页面从地图猛地拽到下面的卡片。scrollIntoView 会滚动所有可滚祖先（含 window），
  // 这里改成只动容器自身的横向 scroll。
  const cRect = container.getBoundingClientRect();
  const aRect = active.getBoundingClientRect();
  const delta = (aRect.left - cRect.left) - (container.clientWidth - aRect.width) / 2;
  container.scrollBy({ left: delta, behavior: "smooth" });
}

function timelineRecords() {
  return filteredRecords().filter(record => record.showInTimeline !== false);
}

// 把（当前筛选的）行程聚合成"段"，按最早一次行程的时间从旧到新排序；每段记起讫方向与真实折线，供生长动画用。
// 播放＝逐条行程(不去重)按时间从旧到新依次生长，方向就是真实的出发→到达，故往返/重复各算一段，
// 能看到去与回。若某段回程没出现，是该回程尚未录入数据(不臆造)。
function buildPlaySegments(list) {
  const segs = [];
  [...list]
    .filter(r => r.countsAsVisited && r.origin && r.destination && r.origin !== r.destination)
    .sort((p, q) => String(p.startDate || "").localeCompare(String(q.startDate || "")))
    .forEach(r => {
      const a = cityLngLat(r.origin), b = cityLngLat(r.destination); if (!a || !b) return;
      segs.push({ key: r.id, kind: r.kind, from: r.origin, to: r.destination, fromLL: a, toLL: b, repId: r.id });
    });
  segs.forEach(s => { s.coords = (s.kind === "rail" && railPolyline(s.from, s.to)) || geoArc(s.fromLL, s.toLL); });
  return segs;
}

// 沿折线按比例 t(0..1) 截取，末端插值——线"长"出来的关键。
function sliceLine(coords, t) {
  if (!coords || coords.length < 2 || t >= 1) return coords;
  if (t <= 0) return [coords[0]];
  let total = 0; const seg = [];
  for (let i = 1; i < coords.length; i++) { const d = Math.hypot(coords[i][0] - coords[i - 1][0], coords[i][1] - coords[i - 1][1]); seg.push(d); total += d; }
  const target = total * t; const out = [coords[0]]; let acc = 0;
  for (let i = 1; i < coords.length; i++) {
    if (acc + seg[i - 1] >= target) { const f = (target - acc) / (seg[i - 1] || 1); out.push([coords[i - 1][0] + (coords[i][0] - coords[i - 1][0]) * f, coords[i - 1][1] + (coords[i][1] - coords[i - 1][1]) * f]); break; }
    acc += seg[i - 1]; out.push(coords[i]);
  }
  return out;
}

// 逐帧画播放：已走过的段为淡色轨迹，当前段满色生长；圆点先出发地、到终点时再亮终点。
function drawPlayback() {
  if (!play || !glMap) return;
  const src = glMap.getSource("routes"); if (!src) return;
  // 静态缓存：已走完的段每帧不再重建（播放后期一帧 ~180 条线全量重算的根治）；
  // 推进到新段时增量补一条进缓存（带 trodden=1 沉淀为更深的墨迹——越走地图越"写满"），
  // 当前生长段走独立的彗星层（尾淡头浓 + 发亮头部），不和墨迹混在一起。
  if (play.cacheI === undefined) { play.cacheI = -1; play.staticFeatures = []; play.staticUsage = new Map(); }
  const bump = (m, c) => { const k = stripShi(c); m.set(k, (m.get(k) || 0) + 1); };
  while (play.cacheI < play.i - 1) {
    play.cacheI += 1;
    const done = play.segs[play.cacheI];
    if (done.coords && done.coords.length >= 2) play.staticFeatures.push({ type: "Feature", properties: { key: done.key, kind: done.kind, sel: 0, trodden: 1 }, geometry: { type: "LineString", coordinates: done.coords } });
    bump(play.staticUsage, done.from);
    bump(play.staticUsage, done.to);
  }
  const s = play.segs[play.i];
  const baseFeatures = play.staticFeatures.slice();
  // 到达后：当前段先以"墨迹虚线"落定（彗星随后在其上淡出，交接不硬切）
  if (play.grow >= 1 && s.coords && s.coords.length >= 2) {
    baseFeatures.push({ type: "Feature", properties: { key: s.key, kind: s.kind, sel: 0, trodden: 1 }, geometry: { type: "LineString", coordinates: s.coords } });
  }
  src.setData({ type: "FeatureCollection", features: baseFeatures });
  // 彗星按当前段交通方式换色（铁路绿/航班红/地面金），只在类型变化的那一帧动 paint
  if (play.cometKind !== s.kind && glMap.getLayer("routes-comet")) {
    play.cometKind = s.kind;
    glMap.setPaintProperty("routes-comet", "line-gradient", cometPaint(s.kind));
    glMap.setPaintProperty("comet-head", "circle-color", `rgb(${COMET_RGB[s.kind] || COMET_RGB.flight})`);
  }
  // 新段开始（grow 刚重置）：彗星亮度复位（上一段结束时被淡出到 0）
  if (play.grow < 0.05 && glMap.getLayer("routes-comet") && play.cometFaded !== false) {
    glMap.setPaintProperty("routes-comet", "line-opacity", 1);
    glMap.setPaintProperty("comet-head", "circle-opacity", 0.95);
    play.cometFaded = false;
  }
  if (play.grow >= 1) play.cometFaded = true;
  // 彗星：当前生长段 + 头部光点
  const cometSrc = glMap.getSource("comet");
  if (cometSrc) {
    const coords = sliceLine(s.coords, play.grow >= 1 ? 1 : play.grow);
    const cometFeatures = [];
    if (coords && coords.length >= 2) {
      cometFeatures.push({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } });
      cometFeatures.push({ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: coords[coords.length - 1] } });
    }
    cometSrc.setData({ type: "FeatureCollection", features: cometFeatures });
  }
  const usage = new Map(play.staticUsage);
  bump(usage, s.from);                              // 出发地先亮
  if (play.grow > 0.92) bump(usage, s.to);          // 终点等线长到才亮
  updateCityMarkers(usage);
}

// 镜头跟随：只框"已揭示"城市的范围——前期国内自然停在中国，行程长到国外才自动缩小到世界。
function fitPlaybackRevealed() {
  if (!play) return;
  let minLng = 999, minLat = 999, maxLng = -999, maxLat = -999, any = false;
  for (let k = 0; k <= play.i && k < play.segs.length; k++) {
    [play.segs[k].fromLL, play.segs[k].toLL].forEach(ll => { if (ll) { any = true; minLng = Math.min(minLng, ll[0]); maxLng = Math.max(maxLng, ll[0]); minLat = Math.min(minLat, ll[1]); maxLat = Math.max(maxLat, ll[1]); } });
  }
  if (!any) return;
  const key = [minLng, minLat, maxLng, maxLat].map(v => Math.round(v)).join(",");
  if (key === play.fitKey) return;                  // 范围没变就不动镜头
  play.fitKey = key;
  // 上下留足空间，别让行程顶到报头/底部指标；缩得更松一点。
  glMap.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: { top: 140, bottom: 170, left: 100, right: 100 }, duration: 900, maxZoom: 5.4 });
}

// 电影化镜头：跟随「当前段」而非累积范围——旧策略一旦去过欧洲，镜头就永远卡在欧亚全景，
// 播国内段时画面 80% 是无关大陆。现在：当前段两端已在视口内且尺度合适→镜头不动（稳）；
// 否则平滑飞到该段，飞行时长不超过段生长时长的 0.8（快速档也不打架）。
function fitPlaybackSegment() {
  if (!play || !glMap) return;
  const s = play.segs[play.i]; if (!s) return;
  const pts = [s.fromLL, s.toLL].filter(Boolean);
  if (!pts.length) return;
  let minLng = 999, minLat = 999, maxLng = -999, maxLat = -999;
  pts.forEach(ll => { minLng = Math.min(minLng, ll[0]); maxLng = Math.max(maxLng, ll[0]); minLat = Math.min(minLat, ll[1]); maxLat = Math.max(maxLat, ll[1]); });
  const growMs = PLAY_GROW_MS[playSpeed] || PLAY_GROW_MS.normal;
  // 段跨度（经度当量）：深港这种 30km 短跳约 0.35°，洲际段几十度
  const segSpan = Math.max(maxLng - minLng, (maxLat - minLat) * 1.6, 0.3);
  try {
    const view = glMap.getBounds();
    const allVisible = pts.every(ll => view.contains(ll));
    if (allVisible && play.i > 0) {
      // 都看得见且视口尺度与该段匹配（不超过 6 倍）才不动镜头；
      // 旧版下限 0.8°×10 倍意味着省级视野下深港短跳永远"算看得清"——根本看不清
      const viewSpan = Math.max(view.getEast() - view.getWest(), (view.getNorth() - view.getSouth()) * 1.6);
      if (viewSpan < segSpan * 6) return;
    }
  } catch (e) { /* getBounds 异常时直接 fit */ }
  glMap.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
    padding: { top: 150, bottom: 200, left: 130, right: 130 },
    duration: Math.min(880, Math.max(380, growMs * 0.8)),
    // 镜头上限随段尺度走：城际短跳给到城市级特写（能看清深港怎么过的关），中程省级，长程大区级
    maxZoom: segSpan < 0.8 ? 8.6 : segSpan < 3 ? 7.2 : 6.2
  });
}

function markTimelineActive(id) {
  if (!els.timeline) return;
  els.timeline.querySelectorAll(".journey").forEach(n => n.classList.toggle("active", n.dataset.id === id));
}

function onPlayAdvance() {
  const s = play.segs[play.i]; if (!s) return;
  selectedId = s.repId;                 // 详情卡跟随当前段
  focusedCity = stripShi(s.from);       // 出发地先亮(你在那儿)；线长到终点后在 playTick 切到终点
  fitPlaybackSegment();                 // 镜头跟随当前段（电影化），不再用累积范围
  markTimelineActive(s.repId);
  const rep = records.find(r => r.id === s.repId);
  renderDetail(rep);                    // 右侧"当前一段"实时跟随播放
  updatePlayCaption(rep);               // 浮标显示这段的日期/交通/时间/时长
  requestAnimationFrame(scrollActiveTimeline);
}

function setPlayBtn(text, playing) {
  if (!els.playBtn) return;
  els.playBtn.textContent = text;
  els.playBtn.classList.toggle("is-playing", !!playing);
  if (els.playResetBtn) els.playResetBtn.hidden = !play;
  if (els.playStopBtn) els.playStopBtn.hidden = !play;
}

function playTick(ts) {
  if (!play) { playTimer = null; return; }
  if (!play.lastTs) play.lastTs = ts;
  const dt = Math.min(64, ts - play.lastTs); play.lastTs = ts;
  const growMs = PLAY_GROW_MS[playSpeed] || PLAY_GROW_MS.normal;
  if (play.grow < 1) {
    play.grow = Math.min(1, play.grow + dt / growMs);
    if (play.grow >= 1) {
      play.holdUntil = ts + growMs * 0.45;
      const s = play.segs[play.i]; if (s) focusedCity = stripShi(s.to);   // 到达：终点亮起，停顿一下再走
      // 彗星渐隐交接：虚线已在 drawPlayback 落定，彗星在其上 450ms 淡出，避免"唰一下变虚线"的硬切
      if (glMap && glMap.getLayer("routes-comet")) {
        glMap.setPaintProperty("routes-comet", "line-opacity", 0);
        glMap.setPaintProperty("comet-head", "circle-opacity", 0);
      }
    }
    const fill = document.getElementById("playBarFill");        // 全程进度（含段内生长）——浮标里的细线
    if (fill) fill.style.width = `${(((play.i + play.grow) / play.segs.length) * 100).toFixed(2)}%`;
  } else if (ts >= play.holdUntil) {
    if (play.i >= play.segs.length - 1) {                      // 播到最后一段：停住、保留完整旅程画面，不循环
      playTimer = null; drawPlayback(); setPlayBtn("重新播放", false);
      play.fitKey = ""; fitPlaybackRevealed();                 // 终幕：镜头缓缓拉远，回看整场旅程
      return;
    }
    play.i += 1; play.grow = 0; onPlayAdvance();
  }
  drawPlayback();
  playTimer = requestAnimationFrame(playTick);
}

function startPlayback(fromZero) {
  if (fromZero || !play) {
    const segs = play && !fromZero ? play.segs : buildPlaySegments(timelineRecords());
    if (!segs.length) return;
    play = { segs, i: 0, grow: 0, lastTs: 0, holdUntil: 0, fitKey: "" };
  } else {
    play.lastTs = 0;   // 续播：从暂停处接上
    play.holdUntil = performance.now() + (play.holdRemain || 0);  // 暂停期间时钟仍在走，补回剩余停顿，避免跳段
    play.holdRemain = 0;
  }
  onPlayAdvance();
  setPlayBtn("暂停", true);
  if (!playTimer) playTimer = requestAnimationFrame(playTick);
}

function togglePlayback() {
  if (play && playTimer) {                                     // 播放中 → 暂停（保留进度）
    cancelAnimationFrame(playTimer); playTimer = null;
    play.holdRemain = Math.max(0, play.holdUntil - performance.now());  // 记下"到达停顿"剩余量，续播时补回
    setPlayBtn("继续", false);
    return;
  }
  if (play && !playTimer) {                                    // 已暂停/播完 → 继续 或 重播
    const atEnd = play.i >= play.segs.length - 1 && play.grow >= 1;
    startPlayback(atEnd);                                      // 播完了就从头，否则接上
    return;
  }
  startPlayback(false);                                        // 全新开始
}

function resetPlayback() { startPlayback(true); }              // 重置＝从最早一段重新播放

function stopPlayback() {                                       // 完全退出播放，恢复整张静态地图
  const wasEras = !!eraTimer;
  stopEras(false);                                              // 若在「岁月」演替也一并打断
  const wasPlaying = !!play;
  if (playTimer) cancelAnimationFrame(playTimer);
  playTimer = null;
  play = null;
  setPlayBtn("播放旅程", false);
  updatePlayCaption(null);
  const cometSrc = glMap && glMap.getSource && glMap.getSource("comet");
  if (cometSrc) cometSrc.setData({ type: "FeatureCollection", features: [] });   // 收掉彗星
  if (wasPlaying || wasEras) render();   // 清掉播放残影/某一年的部分线网，恢复完整地图
}

// ——「岁月」模式：旅程按年份逐年生长（2022 → 2026 像墨迹一年年晕染铺满地图）——
let eraTimer = null;
function stopEras(rerender = true) {
  if (!eraTimer) return;
  clearTimeout(eraTimer);
  eraTimer = null;
  const btn = document.getElementById("eraBtn");
  if (btn) btn.classList.remove("is-playing");
  updatePlayCaption(null);
  if (rerender) render();
}

function playEras() {
  if (eraTimer) { stopEras(); return; }   // 再点一次 = 停止演替、回到全图
  stopPlayback();
  const list = filteredRecords().filter(r => !r._gap);
  const years = [...new Set(list.map(r => String(r.startDate || "").slice(0, 4)).filter(Boolean))].sort();
  if (!years.length) return;
  const btn = document.getElementById("eraBtn");
  if (btn) btn.classList.add("is-playing");
  if (els.posterCaption) els.posterCaption.hidden = true;   // 藏底部城市落款——否则"2026"和"HONG KONG"两层字叠在一起，显得超粗且一直是上次选中的城
  let idx = 0;
  const step = () => {
    if (idx >= years.length) {
      eraTimer = setTimeout(() => stopEras(), 3200);   // 演替完：在全图上停一拍，再淡出字幕
      return;
    }
    const y = years[idx];
    const upto = list.filter(r => String(r.startDate || "").slice(0, 4) <= y);
    const thisYear = list.filter(r => String(r.startDate || "").startsWith(y));
    renderMap(upto);                                   // 线网累计生长到这一年
    const el = els.playCaption;
    if (el) {
      const moves = thisYear.filter(r => ["flight", "rail", "road"].includes(r.kind)).length;
      const cities = new Set();
      thisYear.forEach(r => { if (r.countsAsVisited) [r.origin, r.destination].filter(Boolean).forEach(c => cities.add(stripShi(c))); });
      el.innerHTML = `<span class="pc-era">${escapeHtml(y)}</span><span class="pc-meta">${moves} 段行程　·　${cities.size} 座城</span>`;
      el.hidden = false;
    }
    // 镜头缓缓框住"截至这一年"的足迹——疆域随岁月扩张
    let minLng = 999, minLat = 999, maxLng = -999, maxLat = -999, any = false;
    upto.forEach(r => [r.origin, r.destination].forEach(c => {
      const ll = cityLngLat(c);
      if (ll) { any = true; minLng = Math.min(minLng, ll[0]); maxLng = Math.max(maxLng, ll[0]); minLat = Math.min(minLat, ll[1]); maxLat = Math.max(maxLat, ll[1]); }
    }));
    if (any && glMap) glMap.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: { top: 150, bottom: 210, left: 120, right: 120 }, duration: 1500, maxZoom: 5.6 });
    idx += 1;
    eraTimer = setTimeout(step, 3000);
  };
  step();
}

function dateRange(record) {
  if (!record?.startDate) return "-";
  return record.startDate === record.endDate ? record.startDate : `${record.startDate} ~ ${record.endDate}`;
}

function displayTitle(record) {
  const t = String(record?.title || "").replaceAll(" -> ", " → ");
  // stay 记录标题统一为「X停留」：早期导入留下的 "深圳 → 深圳" 形态在显示层归一
  if (record?.kind === "stay") {
    const m = /^(.+?)\s*→\s*(.+)$/.exec(t);
    if (m && stripShi(m[1].trim()) === stripShi(m[2].trim())) return `${stripShi(m[1].trim())}停留`;
  }
  return t;
}

// 「展示模式」：隐去工作痕迹给别人看。空值不再喊"待补"，安静省略。
let showMode = false;
try { showMode = localStorage.getItem("yw-show-mode") === "1"; } catch (e) { /* 隐私模式等 */ }

function money(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return showMode ? "" : "待补";
  return `¥${Number(value).toLocaleString("zh-CN", { maximumFractionDigits: 2 })}`;
}

function duration(minutes) {
  if (minutes === null || minutes === undefined || Number.isNaN(Number(minutes))) return showMode ? "" : "待补";
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  if (!hours) return `${remain} 分`;
  return remain ? `${hours} 小时 ${remain} 分` : `${hours} 小时`;
}

function applyShowMode() {
  document.body.classList.toggle("show-mode", showMode);
  const btn = document.getElementById("showModeBtn");
  if (btn) { btn.classList.toggle("is-on", showMode); btn.textContent = showMode ? "展示 ●" : "展示"; }
}

function toggleShowMode() {
  showMode = !showMode;
  try { localStorage.setItem("yw-show-mode", showMode ? "1" : "0"); } catch (e) { /* 忽略 */ }
  if (showMode && els.confidence && els.confidence.value !== "all") els.confidence.value = "all";  // 展示模式不留置信度筛选
  applyShowMode();
  render();   // 重建文案（待补→省略）
}

// 「标题报头」显隐：左上大标题块（台头 / 主标题 / 资料行）可一键淡去，
// 给纯净地图或截图让位。独立于展示模式，单独记忆到 localStorage。
let titleHidden = false;
try { titleHidden = localStorage.getItem("yw-title-hidden") === "1"; } catch (e) { /* 隐私模式等 */ }

// 当前生效的标题 = SITE_TITLE 默认值 叠加 用户在页面上改过的（localStorage 覆盖层）。
// 这样开源者改代码里的 SITE_TITLE 是"出厂默认"，而每个人在自己浏览器里随时改、随时存。
const TITLE_OVERRIDE_KEY = "yw-site-title";
function currentSiteTitle() {
  let o = {};
  try { o = JSON.parse(localStorage.getItem(TITLE_OVERRIDE_KEY)) || {}; } catch (e) { /* 隐私模式等 */ }
  const merged = Object.assign({}, SITE_TITLE, o);
  if (!o.docTitle) merged.docTitle = String(merged.title || "").replace(/\s*\n\s*/g, "").trim() || SITE_TITLE.docTitle;
  return merged;
}

// 把当前标题写进左上报头 + 浏览器标签页。
function applySiteTitle() {
  const t = currentSiteTitle();
  const eyebrowEl = document.querySelector(".stage-title .eyebrow");
  const h1El = document.querySelector(".stage-title h1");
  if (eyebrowEl) {
    eyebrowEl.textContent = t.eyebrow || "";
    eyebrowEl.style.display = t.eyebrow ? "" : "none";
  }
  if (h1El) {
    h1El.innerHTML = String(t.title || "").split("\n").map(escapeHtml).join("<br>");
  }
  if (t.docTitle) document.title = t.docTitle;
}

// 标题编辑弹窗：随时在页面上改报头文字，存到本地浏览器，可一键恢复默认。
let titleEditorEl = null;
function openTitleEditor() {
  if (!titleEditorEl) {
    titleEditorEl = document.createElement("div");
    titleEditorEl.className = "mp-overlay"; titleEditorEl.hidden = true;
    titleEditorEl.innerHTML = `<div class="mp-dialog te-dialog" role="dialog" aria-label="自定义标题">
      <div class="mp-head"><span class="mp-title">自定义标题</span><button type="button" class="mp-close" aria-label="关闭">×</button></div>
      <div class="te-form">
        <label class="te-field"><span>台头小字（英文，可留空）</span><input id="teEyebrow" class="te-eyebrow" type="text" maxlength="48" placeholder="例：JOURNEY ATLAS"></label>
        <label class="te-field"><span>主标题</span><textarea id="teTitle" rows="2" maxlength="40" placeholder="例：我的&#10;旅行地图"></textarea><span class="te-hint">回车换行，会照样断行显示</span></label>
        <div class="te-actions">
          <button type="button" id="teReset" class="te-reset">恢复默认</button>
          <button type="button" id="teCancel" class="te-btn-ghost">取消</button>
          <button type="button" id="teSave" class="te-btn-primary">保存</button>
        </div>
      </div></div>`;
    document.body.appendChild(titleEditorEl);
    const close = () => { titleEditorEl.hidden = true; };
    const eyebrowIn = titleEditorEl.querySelector("#teEyebrow");
    const titleIn = titleEditorEl.querySelector("#teTitle");
    titleEditorEl.querySelector(".mp-close").addEventListener("click", close);
    titleEditorEl.querySelector("#teCancel").addEventListener("click", close);
    titleEditorEl.addEventListener("mousedown", e => { if (e.target === titleEditorEl) close(); });
    document.addEventListener("keydown", e => { if (titleEditorEl && !titleEditorEl.hidden && e.key === "Escape") close(); });
    titleEditorEl.querySelector("#teSave").addEventListener("click", () => {
      const payload = { eyebrow: eyebrowIn.value.trim(), title: titleIn.value.replace(/\r/g, "").trimEnd() };
      try { localStorage.setItem(TITLE_OVERRIDE_KEY, JSON.stringify(payload)); } catch (e) { /* 忽略 */ }
      applySiteTitle(); close();
    });
    titleEditorEl.querySelector("#teReset").addEventListener("click", () => {
      try { localStorage.removeItem(TITLE_OVERRIDE_KEY); } catch (e) { /* 忽略 */ }
      const d = currentSiteTitle();
      eyebrowIn.value = d.eyebrow || ""; titleIn.value = d.title || "";
      applySiteTitle();
    });
  }
  const t = currentSiteTitle();
  titleEditorEl.querySelector("#teEyebrow").value = t.eyebrow || "";
  titleEditorEl.querySelector("#teTitle").value = t.title || "";
  titleEditorEl.hidden = false;
  titleEditorEl.querySelector("#teTitle").focus();
}

function applyTitleVis() {
  document.body.classList.toggle("title-off", titleHidden);
  const chk = document.getElementById("titleVisChk");
  if (chk) chk.checked = !titleHidden;   // 勾上=显示标题
}

function setTitleHidden(hidden) {
  titleHidden = hidden;
  try { localStorage.setItem("yw-title-hidden", titleHidden ? "1" : "0"); } catch (e) { /* 忽略 */ }
  applyTitleVis();
}

// 跨境（跨大时区）判断：用于在时间后提示"当地"，免得国际航班"12:00→06:00"看着像时间倒流。
function isCrossTimezone(record) {
  const cn = new Set(["中国", "中国香港", "中国澳门"]);
  const a = cityMeta(stripShi(record.origin || "")).country;
  const b = cityMeta(stripShi(record.destination || "")).country;
  return (a && !cn.has(a)) || (b && !cn.has(b));
}

// 行程时间标签："12:00–06:00 +1天 当地"。跨夜补"+N天"（endDate 未进位时按"到达<出发"兜底），跨境补"当地"。
function tripTimeText(record) {
  const dep = String(record.departTime || "").trim();
  const arr = String(record.arriveTime || "").trim();
  if (!dep && !arr) return "";
  if (!dep || !arr) return dep || arr;
  // 时刻一律折成分钟数再比较："9:30" vs "12:00" 这类未补零的手填值用字符串比较会误判跨夜
  const toMin = t => { const m = /^(\d{1,2}):(\d{2})$/.exec(t); return m ? (+m[1]) * 60 + (+m[2]) : NaN; };
  const depMin = toMin(dep), arrMin = toMin(arr);
  const arrEarlier = Number.isFinite(depMin) && Number.isFinite(arrMin) ? arrMin < depMin : arr < dep;
  const span = daysBetween(record.startDate, record.endDate);
  let delta = Array.isArray(span) ? Math.max(0, span.length - 1) : 0;
  if (delta <= 0 && arrEarlier) delta = 1;         // 跨夜但 endDate 未进位
  if (delta > 1 && !arrEarlier && record.kind !== "stay") delta = 0;  // 移动段日期跨度异常大(合并录入)时不显示夸张的 +N天
  let s = `${dep}–${arr}`;
  if (delta > 0) s += ` +${delta}天`;
  if (isCrossTimezone(record)) s += " 当地";
  return s;
}

// 播放时的"当前段"浮标：日期 + 起讫 + 交通/车次 + 时间(含+N天/当地) + 时长。
function updatePlayCaption(rec) {
  if (els.posterCaption) els.posterCaption.hidden = !!rec;   // 播放中藏掉底部城市名，免得跟顶部浮标重复/抖动
  const el = els.playCaption; if (!el) return;
  if (!rec) { el.hidden = true; el.innerHTML = ""; return; }
  const kindLabel = (KIND[rec.kind] && KIND[rec.kind].label) || rec.kind || "";
  const no = rec.transportNo ? ` ${rec.transportNo}` : "";
  const tt = tripTimeText(rec);
  const dur = duration(rec.durationMinutes);
  const meta = [kindLabel + no, tt, (dur && dur !== "待补") ? dur : ""].filter(Boolean).join("　·　");
  const route = `${stripShi(rec.origin || "")} → ${stripShi(rec.destination || "")}`;
  const prog = play ? `<span class="pc-prog">${play.i + 1} / ${play.segs.length}</span>` : "";
  // 重建字幕时把当前进度直接烤进 inline 宽度——否则新 <i> 从 0 宽被 transition 拉到当前值，
  // 看起来像"每段都重新加载一遍进度条"
  const pct = play ? (((play.i + Math.min(play.grow || 0, 1)) / play.segs.length) * 100).toFixed(2) : 0;
  const bar = play ? `<span class="pc-bar"><i id="playBarFill" style="width:${pct}%"></i></span>` : "";
  el.innerHTML = `<span class="pc-date">${escapeHtml(dateRange(rec))}</span>`
    + `<span class="pc-route">${escapeHtml(route)}</span>`
    + (meta ? `<span class="pc-meta">${escapeHtml(meta)}</span>` : "")
    + prog + bar;
  el.hidden = false;
}

function confidenceLabel(value) {
  return CONFIDENCE[value] || value || "缺口·待补段";
}

function daysBetween(start, end) {
  if (!start) return [];
  const days = [];
  const cursor = new Date(`${start}T00:00:00`);
  const finish = new Date(`${end || start}T00:00:00`);
  if (Number.isNaN(cursor.getTime()) || Number.isNaN(finish.getTime())) return days;
  // 本地格式化：本地午夜 + toISOString(UTC) 在东八区会整体偏移成"前一天"
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  for (const day = new Date(cursor); day <= finish; day.setDate(day.getDate() + 1)) {
    days.push(fmt(day));
  }
  return days;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quote = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quote && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quote = !quote;
    } else if (char === "," && !quote) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quote) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some(value => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some(value => value.trim())) rows.push(row);
  const header = rows.shift() || [];
  return rows.map(values => Object.fromEntries(header.map((key, index) => [key, values[index] || ""])));
}

function toCsv(list) {
  const header = [
    "startDate",
    "endDate",
    "kind",
    "title",
    "origin",
    "destination",
    "departTime",
    "arriveTime",
    "durationMinutes",
    "transportNo",
    "amountCny",
    "invoiceAmountCny",
    "traveler",
    "people",
    "purpose",
    "project",
    "reimbursement",
    "confidence",
    "countsAsAway",
    "countsAsVisited",
    "showInTimeline",
    "displayLayer",
    "evidence",
    "notes"
  ];
  const lines = [header.join(",")];
  list.forEach(record => {
    lines.push(header.map(key => {
      const value = Array.isArray(record[key]) ? record[key].join(" / ") : record[key] ?? "";
      return `"${String(value).replaceAll('"', '""')}"`;
    }).join(","));
  });
  return lines.join("\n");
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function extractJsonCandidate(text) {
  const clean = String(text || "")
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const firstObject = clean.indexOf("{");
  const firstArray = clean.indexOf("[");
  const starts = [firstObject, firstArray].filter(index => index >= 0);
  if (!starts.length) return "";
  const start = Math.min(...starts);
  const endObject = clean.lastIndexOf("}");
  const endArray = clean.lastIndexOf("]");
  const end = Math.max(endObject, endArray);
  return end > start ? clean.slice(start, end + 1) : "";
}

function parseStructuredRecords(text) {
  const candidate = extractJsonCandidate(text);
  if (!candidate) return [];
  const data = JSON.parse(candidate);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.records)) return data.records;
  if (data.record) return [data.record];
  if (data.startDate || data.origin || data.destination) return [data];
  return [];
}

function tryParseStructuredRecords(text) {
  try {
    return parseStructuredRecords(text);
  } catch (error) {
    return [];
  }
}

function setIntakeStatus(message, preview) {
  if (els.intakeStatus) els.intakeStatus.textContent = message;
  if (els.intakePreview && preview !== undefined) {
    els.intakePreview.textContent = typeof preview === "string" ? preview : JSON.stringify(preview, null, 2);
  }
}

function parseTicketText(text) {
  const raw = String(text || "").replace(/\s+/g, " ").trim();
  if (!raw) throw new Error("没有可识别文字");

  const dateInfo = extractTicketDate(raw);
  const times = Array.from(raw.matchAll(/(?:^|[^\d])([01]?\d|2[0-3]):([0-5]\d)(?!\d)/g))
    .map(match => `${match[1].padStart(2, "0")}:${match[2]}`);
  const transportNo = extractTransportNo(raw);
  const kind = inferKind(transportNo, raw);
  const [origin, destination] = extractCityPair(raw);
  const amountCny = extractAmount(raw);
  const durationMinutes = computeDurationMinutes(dateInfo.value, times[0], dateInfo.value, times[1]);
  const notes = [
    "由票据入口试填，请校对原票。",
    dateInfo.note,
    !origin || !destination ? "出发地或到达地待确认。" : "",
    amountCny === null ? "金额待确认。" : ""
  ].filter(Boolean).join(" ");

  return {
    startDate: dateInfo.value,
    endDate: dateInfo.value,
    kind,
    origin: origin || "",
    destination: destination || "",
    title: [origin, destination].filter(Boolean).join(" → "),
    departTime: times[0] || "",
    arriveTime: times[1] || "",
    durationMinutes,
    transportNo,
    amountCny,
    traveler: OWNER_NAME,
    people: [OWNER_NAME],
    confidence: "partial",
    countsAsAway: kind !== "cancelled",
    countsAsVisited: kind !== "cancelled",
    showInTimeline: true,
    displayLayer: "journey",
    notes
  };
}

function extractTicketDate(text) {
  const full = text.match(/(20\d{2})\s*[年\/\-.]\s*(\d{1,2})\s*[月\/\-.]\s*(\d{1,2})\s*日?/);
  if (full) return { value: formatDateParts(full[1], full[2], full[3]), note: "" };

  const compact = text.match(/\b(20\d{2})([01]\d)([0-3]\d)\b/);
  if (compact) return { value: formatDateParts(compact[1], compact[2], compact[3]), note: "" };

  const monthDay = text.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (monthDay) {
    return {
      value: formatDateParts(new Date().getFullYear(), monthDay[1], monthDay[2]),
      note: "票据未见年份，暂按当前年份推定。"
    };
  }

  return { value: "", note: "日期待确认。" };
}

function formatDateParts(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function extractTransportNo(text) {
  const train = text.match(/(?:^|[^A-Z0-9])([GCDZTK]\d{1,5})(?![A-Z0-9])/i);
  if (train) return train[1].toUpperCase();
  const flight = text.match(/(?:^|[^A-Z0-9])([A-Z0-9]{2}\d{3,4})(?![A-Z0-9])/i);
  return flight ? flight[1].toUpperCase() : "";
}

function inferKind(transportNo, text) {
  if (/退票|退款|改签|取消/.test(text)) return "cancelled";
  if (/^[GCDZTK]\d/i.test(transportNo) || /车次|高铁|动车|火车|铁路|检票口/.test(text)) return "rail";
  if (transportNo || /航班|登机|机票|机场|舱位/.test(text)) return "flight";
  return "other";
}

function extractCityPair(text) {
  const candidates = [
    ...Object.keys(CITY_ALIAS).sort((a, b) => b.length - a.length),
    ...Object.keys(CITY).sort((a, b) => b.length - a.length)
  ];
  const matches = [];

  candidates.forEach(candidate => {
    const index = text.indexOf(candidate);
    if (index >= 0) {
      const city = normalizeCityName(candidate);
      if (city) matches.push({ city, index });
    }
  });

  const found = uniqueCitiesByOrder(matches);
  if (found.length >= 2) return found.slice(0, 2);
  const stationMatches = Array.from(text.matchAll(/([\u4e00-\u9fa5]{2,8})(?:站|机场)/g))
    .map(match => ({ city: normalizeCityName(match[1]), index: match.index }))
    .filter(match => match.city);
  uniqueCitiesByOrder([...matches, ...stationMatches]).forEach(city => {
    if (!found.includes(city)) found.push(city);
  });
  return found.slice(0, 2);
}

function uniqueCitiesByOrder(matches) {
  const found = [];
  matches
    .sort((a, b) => a.index - b.index)
    .forEach(match => {
      if (!found.includes(match.city)) found.push(match.city);
    });
  return found;
}

function normalizeCityName(value) {
  const clean = String(value || "")
    .replace(/[（(].*?[）)]/g, "")
    .replace(/火车站|高铁站|国际机场|机场|车站|站/g, "")
    .trim();
  if (CITY_ALIAS[clean]) return CITY_ALIAS[clean];
  if (CITY[clean]) return clean;
  const direct = Object.keys(CITY).find(city => clean.includes(city));
  if (direct) return direct;
  const stripped = clean.replace(/[东西南北]$/, "");
  return CITY[stripped] ? stripped : "";
}

function extractAmount(text) {
  const currency = text.match(/[¥￥]\s*(\d+(?:\.\d{1,2})?)/);
  if (currency) return Number(currency[1]);
  const labeled = text.match(/(?:票价|金额|合计|实付|支付|付款)[^\d]{0,10}(\d+(?:\.\d{1,2})?)\s*元?/);
  if (labeled) return Number(labeled[1]);
  const yuan = text.match(/(\d+(?:\.\d{1,2})?)\s*元/);
  return yuan ? Number(yuan[1]) : null;
}

function computeDurationMinutes(startDate, departTime, endDate, arriveTime) {
  if (!departTime || !arriveTime) return null;
  const startDay = startDate || "2000-01-01";
  const endDay = endDate || startDay;
  const start = new Date(`${startDay}T${departTime}:00`);
  const finish = new Date(`${endDay}T${arriveTime}:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(finish.getTime())) return null;
  if (finish < start) finish.setDate(finish.getDate() + 1);
  return Math.max(0, Math.round((finish - start) / 60000));
}

function fillFormFromRecord(record) {
  const form = els.form.elements;
  const setField = (name, value) => {
    if (form[name]) form[name].value = value ?? "";
  };
  setField("startDate", record.startDate);
  setField("endDate", record.endDate || record.startDate);
  setField("kind", record.kind || "other");
  setField("origin", record.origin);
  setField("destination", record.destination);
  setField("title", record.title || [record.origin, record.destination].filter(Boolean).join(" → "));
  setField("transportNo", record.transportNo);
  setField("departTime", record.departTime);
  setField("arriveTime", record.arriveTime);
  setField("durationMinutes", record.durationMinutes);
  setField("amountCny", record.amountCny);
  setField("confidence", record.confidence || "partial");
  setField("traveler", record.traveler || OWNER_NAME);
  setField("project", record.project || record.purpose || "");
  setField("notes", record.notes || record.evidence || "");
}

function importRecordsToLocal(imported, message) {
  const now = Date.now();
  const stamped = imported.map((item, index) => ({
    ...item,
    id: item.id || `${item.startDate || "date"}-${item.kind || "journey"}-${now}-${index}`
  }));
  records = normalize([...records, ...stamped]);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records, null, 2));
  setupFilters();
  selectedId = stamped[0]?.id || selectedId;
  els.status.textContent = message;
  render();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

// 主图配色：3 套基础皮肤(暖纸/板岩/夜蓝=瓦片底图原色) + 20 套 maptoposter 主题(给底图重上色)。
// 基础皮肤直接换瓦片样式；主题则在浅/深底图上重上色(applyMapTheme)，故有"很多配色"且保留街道。
const SKIN_KEY = "journeyatlas_map_skin";
function applySkin(key) {
  const t = (typeof window !== "undefined" && window.POSTER_THEMES || []).find(x => x.id === key);
  if (t) {                                   // maptoposter 主题：按明暗选浅/深基础底图，再重上色
    mapTheme = t.colors;
    if (posterIsDark(t.colors.bg)) document.documentElement.dataset.skin = "night"; else delete document.documentElement.dataset.skin;
    applyMapStyle(posterIsDark(t.colors.bg) ? "night" : "warm");
  } else {                                   // 基础皮肤：原色瓦片
    mapTheme = null;
    if (key && key !== "warm") document.documentElement.dataset.skin = key; else delete document.documentElement.dataset.skin;
    applyMapStyle(key);
  }
}

// 通用色板下拉：把 POSTER_PALETTES(23 套) 渲染成"4 小圆 + 名称"，挂到容器并接回调。
// 色板下拉选项：浅色一组、深色一组分开列（深色主题已抬亮度可辨）。分组标题不可点。
function swatchOptionsHtml(currentKey) {
  const entries = Object.entries(POSTER_PALETTES);
  const opt = ([k, p]) => `<button type="button" class="mp-sw-opt${k === currentKey ? " on" : ""}" data-skin="${escapeHtml(k)}"><span class="mp-sw-dots">${posterSwatchDots(p)}</span><span class="mp-sw-name">${escapeHtml(p.label || k)}</span></button>`;
  const light = entries.filter(([, p]) => !p.night), dark = entries.filter(([, p]) => p.night);
  return `<div class="mp-sw-group">浅色 · ${light.length}</div>${light.map(opt).join("")}<div class="mp-sw-group">深色 · ${dark.length}</div>${dark.map(opt).join("")}`;
}

// 使用说明（三个点 → 使用说明）。开源后别人也能一眼看懂各处含义。
const HELP_HTML = `
<section><h4>这是什么</h4><p>把你的差旅票据整理成一张会"生长"的个人行旅地图：每段行程一条线，去过的城市点亮，可按时间播放、可导出海报。数据存在本地，离线也能看。</p></section>
<section><h4>底部五个指标（跟随当前筛选实时算）</h4><ul>
<li><b>在路天数</b>：计入"在外过夜"的总天数。</li>
<li><b>可见花销</b>：当前可见记录的金额合计。</li>
<li><b>移动小时</b>：有时长的 飞行、铁路、地面/水路 段累加。</li>
<li><b>点亮城市</b>：到访过的城市数。</li>
<li><b>待补字段</b>：当前可见记录里还缺的字段数（证据/时长/金额）。换筛选数会变——它统计的是"当前这批记录"的缺口，不是 bug。</li></ul></section>
<section><h4>置信度 = 这段行程有多确定</h4><ul>
<li><b>已确认</b>：有票/订单等确凿证据。</li>
<li><b>部分确认</b>：大致能确认，细节或归属待核。</li>
<li><b>推定</b>：靠行程链或旁证推断（某段没票，但前后接得上）。</li>
<li><b>缺口·待补段</b>：还没录的<b>连接段</b>。选这一档，会动态列出"到达地 ≠ 下一段出发地"的断点——就是你下一步要找票补上的那些段。</li></ul></section>
<section><h4>配色 / 海报</h4><p>23 套配色，<b>浅色/深色分组</b>，地名文字也跟主题色走。「行旅海报」可选尺寸/范围/指标导出高清 PNG；范围只决定地图画多大，指标始终是你"当前筛选"的总数。</p></section>
<section><h4>播放旅程</h4><p>从最早一段按时间生长，镜头跟随；可暂停 / 继续 / 重播(↻) / 停止(■)。每段底部浮标显示 日期·交通·时间·时长；国际跨时区会标"当地 · +N天"，免得"12:00→06:00"看着像倒流。</p></section>
<section><h4>旅行档案</h4><p>总里程、出行次数、国家/大洲，以及<b>城市停留时长</b>（每座城累计住几晚·到访几次，按"到达→下次离开"实算）、高频路线等。</p></section>
<section><h4>右下角图例 / 录入口径</h4><p>图例：<b>航线、铁路、停留、地面/水路、费用层</b>对应地图上不同颜色的线（地面/水路＝自驾·打车·渡轮·陆路口岸等非空非铁的地面与水上交通）。录入只录能证明<b>本人真实出行</b>的：付款人≠出行人、退票/改签不点亮、金额与时间只填票面能看到的、不猜。</p></section>
`;
let helpEl = null;
function openHelp() {
  if (!helpEl) {
    helpEl = document.createElement("div");
    helpEl.className = "mp-overlay help-overlay"; helpEl.hidden = true;
    helpEl.innerHTML = `<div class="mp-dialog help-dialog" role="dialog" aria-label="使用说明"><div class="mp-head"><span class="mp-title">使用说明</span><button type="button" class="mp-close" aria-label="关闭">×</button></div><div class="mp-body help-body">${HELP_HTML}</div></div>`;
    document.body.appendChild(helpEl);
    const close = () => { helpEl.hidden = true; };
    helpEl.querySelector(".mp-close").addEventListener("click", close);
    helpEl.addEventListener("mousedown", e => { if (e.target === helpEl) close(); });
    document.addEventListener("keydown", e => { if (helpEl && !helpEl.hidden && e.key === "Escape") close(); });
  }
  helpEl.hidden = false;
}

function mountSwatchPicker(container, currentKey, onPick) {
  const cur = POSTER_PALETTES[currentKey] || POSTER_PALETTES.warm;
  const opts = swatchOptionsHtml(currentKey);
  container.classList.add("mp-swatch");
  container.innerHTML = `<button type="button" class="mp-sw-trigger"><span class="mp-sw-dots">${posterSwatchDots(cur)}</span><span class="mp-sw-name">${escapeHtml(cur.label || currentKey)}</span><em>⌄</em></button><div class="mp-sw-list" hidden>${opts}</div>`;
  const trigger = container.querySelector(".mp-sw-trigger"), list = container.querySelector(".mp-sw-list");
  trigger.addEventListener("click", e => { e.stopPropagation(); list.hidden = !list.hidden; });
  list.addEventListener("click", e => {
    e.stopPropagation();   // 列表内点击不冒泡→不收起，方便连续试色；点别处才收
    const opt = e.target.closest("[data-skin]"); if (!opt) return;
    const key = opt.dataset.skin;
    list.querySelectorAll(".mp-sw-opt").forEach(o => o.classList.toggle("on", o.dataset.skin === key));
    const p = POSTER_PALETTES[key] || POSTER_PALETTES.warm;
    trigger.querySelector(".mp-sw-dots").innerHTML = posterSwatchDots(p);
    trigger.querySelector(".mp-sw-name").textContent = p.label || key;
    onPick(key);
  });
  document.addEventListener("click", () => { if (!list.hidden) list.hidden = true; });
}

// 顶部导航视图切换：显隐 data-pane 区块，保持地图主视图聚焦。
function setActiveView(view) {
  document.querySelectorAll("[data-pane]").forEach(el => {
    el.hidden = el.dataset.pane !== view;
  });
  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.nav === view);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindEvents() {
  [els.year, els.traveler, els.kind, els.confidence].forEach(element => {
    element.addEventListener("input", () => {
      stopPlayback();
      closeMapPopups();   // 筛选变了，弹卡里列的行程已不符
      render();
    });
  });

  bindSearch();
  bindLedgerSearch();

  els.playBtn.addEventListener("click", togglePlayback);
  const eraBtnEl = document.getElementById("eraBtn");
  if (eraBtnEl) eraBtnEl.addEventListener("click", playEras);
  const showModeBtnEl = document.getElementById("showModeBtn");
  if (showModeBtnEl) showModeBtnEl.addEventListener("click", toggleShowMode);

  const titleVisChkEl = document.getElementById("titleVisChk");
  if (titleVisChkEl) titleVisChkEl.addEventListener("change", () => setTitleHidden(!titleVisChkEl.checked));
  if (els.playResetBtn) els.playResetBtn.addEventListener("click", resetPlayback);
  if (els.playStopBtn) els.playStopBtn.addEventListener("click", () => { focusedCity = ""; stopPlayback(); render(); });   // 一键停止并显示全部
  if (els.posterBtn) els.posterBtn.addEventListener("click", () => openStreetPosterSite(selectedCity()));
  if (els.posterBtnTop) els.posterBtnTop.addEventListener("click", () => openStreetPosterSite(selectedCity()));
  const posterMapBtn = document.getElementById("posterMapBtn");
  if (posterMapBtn) posterMapBtn.addEventListener("click", openTravelPoster);
  const immersiveBtn = document.getElementById("immersiveBtn");
  if (immersiveBtn) immersiveBtn.addEventListener("click", toggleImmersive);
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      stopPlayback();
      setMapView(btn.dataset.view);
    });
  });
  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => setActiveView(btn.dataset.nav));
  });
  const mapSkinSwatch = document.getElementById("mapSkinSwatch");
  if (mapSkinSwatch) {
    const saved = localStorage.getItem(SKIN_KEY) || "warm";
    applySkin(saved);
    mountSwatchPicker(mapSkinSwatch, saved, key => { applySkin(key); localStorage.setItem(SKIN_KEY, key); });
  }
  const speedSel = document.getElementById("playSpeedSelect");
  if (speedSel) { speedSel.value = playSpeed; speedSel.addEventListener("change", () => { playSpeed = speedSel.value; }); }
  // ··· 菜单自动收回：点到菜单外即关；鼠标移开 0.5s 后关（焦点还在内部的下拉里则不关）。
  document.querySelectorAll('.more-checks input[data-metric]').forEach(cb => {
    cb.checked = metricVis[cb.dataset.metric] !== false;
    cb.addEventListener("change", () => { metricVis[cb.dataset.metric] = cb.checked; localStorage.setItem("journeyatlas-metric-vis", JSON.stringify(metricVis)); applyMetricVis(); });
  });
  applyMetricVis();
  const moreMenu = document.querySelector(".more-menu");
  if (moreMenu) {
    let moreT = null;
    document.addEventListener("pointerdown", e => { if (moreMenu.open && !moreMenu.contains(e.target)) moreMenu.open = false; });
    moreMenu.addEventListener("mouseleave", () => { moreT = window.setTimeout(() => { if (moreMenu.open && !moreMenu.contains(document.activeElement)) moreMenu.open = false; }, 500); });
    moreMenu.addEventListener("mouseenter", () => { if (moreT) { clearTimeout(moreT); moreT = null; } });
  }
  const helpBtn = document.getElementById("helpBtn");
  if (helpBtn) helpBtn.addEventListener("click", () => { document.querySelector(".more-menu")?.removeAttribute("open"); openHelp(); });

  const titleEditBtn = document.getElementById("titleEditBtn");
  if (titleEditBtn) titleEditBtn.addEventListener("click", () => { document.querySelector(".more-menu")?.removeAttribute("open"); openTitleEditor(); });
  document.getElementById("importBtn").addEventListener("click", () => els.fileInput.click());
  document.getElementById("exportJsonBtn").addEventListener("click", () => download(`travel-log-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ records }, null, 2), "application/json"));
  document.getElementById("exportCsvBtn").addEventListener("click", () => download(`travel-log-${new Date().toISOString().slice(0, 10)}.csv`, "\uFEFF" + toCsv(records), "text/csv;charset=utf-8"));  // BOM：否则 Excel 打开中文乱码
  document.getElementById("resetBtn").addEventListener("click", async () => {
    // 会清掉本机新增/导入的记录（不可逆），先确认
    if (!window.confirm("重载会丢弃本机新增、尚未导出的记录，恢复为文件版本。确定重载？")) return;
    stopPlayback();
    localStorage.removeItem(STORAGE_KEY);
    els.ocrText.value = "";
    els.ticketFileInput.value = "";
    els.ticketFileName.textContent = "选择图片或 PDF";
    setIntakeStatus("等待票据", "未识别");
    await loadData({ preferLocal: false });
    setupFilters();
    selectedId = records.find(record => record.showInTimeline !== false)?.id || records[0]?.id || "";
    render();
  });

  // 一键清空：把全部行程清掉，做成你自己的空白地图（写入空集合，刷新后保持为空）。
  // 想找回示例数据用「重载资料」；想永久清空（部署给别人看也是空的）则把 data/travel-log.json 的 records 改成 []。
  document.getElementById("clearBtn").addEventListener("click", () => {
    if (!window.confirm("清空全部数据？\n\n地图、时间线、统计都会归零，方便你录入自己的行程。\n（示例数据可随时用「重载资料」找回。）")) return;
    stopPlayback();
    records = [];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([], null, 2)); } catch (e) { /* 隐私模式 */ }
    els.ocrText.value = "";
    selectedId = "";
    setupFilters();
    els.status.textContent = "空白地图，0 条行程";
    render();
    document.querySelector(".more-menu")?.removeAttribute("open");
  });

  els.fileInput.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      let imported;
      if (file.name.endsWith(".csv")) {
        imported = parseCsv(text);
      } else {
        const parsed = JSON.parse(text);                      // 只 parse 一次
        imported = Array.isArray(parsed) ? parsed : parsed.records;
      }
      if (!Array.isArray(imported) || !imported.length) throw new Error("文件里没有 records 数组或为空");
      records = normalize(imported);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records, null, 2));
      setupFilters();
      selectedId = records.find(record => record.showInTimeline !== false)?.id || records[0]?.id || "";
      els.status.textContent = `已导入 ${records.length} 条行程`;
      render();
    } catch (error) {
      els.status.textContent = `导入失败：${error.message || "文件格式无法识别"}（资料未改动）`;
    } finally {
      event.target.value = "";
    }
  });

  els.ticketFileInput.addEventListener("change", event => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      els.ticketFileName.textContent = "选择图片或 PDF";
      setIntakeStatus("等待票据", "未识别");
      return;
    }
    els.ticketFileName.textContent = files.map(file => file.name).join(" / ");
    setIntakeStatus(`已选择 ${files.length} 个文件`, "把票据交给任意 AI 识别后，粘贴标准 JSON；或粘贴系统 OCR 文本后试填。");
  });

  els.parseOcrBtn.addEventListener("click", () => {
    try {
      const structured = tryParseStructuredRecords(els.ocrText.value);
      const record = structured[0] || parseTicketText(els.ocrText.value);
      fillFormFromRecord(record);
      setIntakeStatus("已试填，等待校对", record);
      els.form.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      setIntakeStatus("识别失败", error.message || "请补充票据文字");
    }
  });

  els.importAiBtn.addEventListener("click", () => {
    try {
      const imported = parseStructuredRecords(els.ocrText.value);
      if (!imported.length) throw new Error("没有找到 records JSON");
      importRecordsToLocal(imported, `已从 AI JSON 导入 ${imported.length} 条行程`);
      setIntakeStatus("已导入地图", imported);
    } catch (error) {
      setIntakeStatus("导入失败", error.message || "请粘贴标准 JSON");
    }
  });

  els.copyPromptBtn.addEventListener("click", async () => {
    await copyText(AI_RECORD_PROMPT);
    setIntakeStatus("识别提示已复制", "把票据图片或 PDF 发给任意 AI，再让它按提示输出 JSON。");
  });

  els.form.addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(els.form);
    const item = Object.fromEntries(form.entries());
    item.id = `${item.startDate}-${item.kind}-${Date.now()}`;
    item.endDate = item.endDate || item.startDate;
    item.title = item.title || [item.origin, item.destination].filter(Boolean).join(" → ");
    item.amountCny = parseOptionalNumber(item.amountCny);
    item.durationMinutes = parseOptionalNumber(item.durationMinutes);
    item.people = item.traveler ? [item.traveler] : [];
    item.countsAsAway = item.kind !== "cancelled";
    item.countsAsVisited = item.kind !== "cancelled";
    records = normalize([...records, item]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records, null, 2));
    setupFilters();
    selectedId = item.id;
    els.status.textContent = "新路线已加入本机地图";
    els.form.reset();
    els.form.elements.traveler.value = OWNER_NAME;
    render();
  });
}

async function init() {
  try {
    await loadData();
  } catch (error) {
    if (!records.length) records = [];
    els.status.textContent = "资料读取失败，请通过本地服务打开页面或导入 JSON";
    console.error(error);
  }
  setupFilters();
  bindEvents();
  bindPosterModal();
  applySiteTitle();  // 写入自定义标题（SITE_TITLE 配置）
  applyShowMode();   // 恢复上次的「展示/工作台」模式（localStorage 记忆）
  applyTitleVis();   // 恢复上次的「标题报头」显隐（localStorage 记忆）
  selectedId = records.find(record => record.showInTimeline !== false)?.id || records[0]?.id || "";
  initGlMap();   // 异步加载瓦片，load 后会再 render() 画路线/城市
  render();      // 先把时间线/档案/详情等非地图部分填上
}

init();
