// Renders the raster assets for the success-stories deck:
//   maps (overview, per country, per-project locators), logo PNGs and name tiles.
// Logos: assets/logos/<logo>.png is used as is; <logo>.svg is rasterised; otherwise a name tile is drawn.
// Usage (from the repo root): CHROMIUM_PATH=/path/to/chrome node presentation/success-stories/render.mjs
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const A = join(HERE, "assets");
const OUT = join(A, "generated");
const TMP = join(OUT, "_tmp");
for (const d of [OUT, TMP, join(OUT, "maps"), join(OUT, "logos")]) mkdirSync(d, { recursive: true });

const data = JSON.parse(readFileSync(join(HERE, "stories.json"), "utf8"));
const region = JSON.parse(readFileSync(join(A, "region.geojson"), "utf8"));
const NAVY = "#102840", ORANGE = "#E05826", SAND = "#F3F2EE", LAND = "#DCE2E7", SLATE = "#3B5368";
const HIGHLIGHT = ["Egypt", "Saudi Arabia", "Oman"];
const fontUrl = (p) => `file://${join(ROOT, "node_modules", p)}`;
const FONTS = `
@font-face{font-family:BC;font-weight:700;src:url(${fontUrl("@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2")})}
@font-face{font-family:BC;font-weight:800;src:url(${fontUrl("@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2")})}
@font-face{font-family:BC;font-weight:600;src:url(${fontUrl("@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2")})}
@font-face{font-family:B;font-weight:500;src:url(${fontUrl("@fontsource/barlow/files/barlow-latin-500-normal.woff2")})}`;

/* --------------------------------------------------------------- sites */
const SITES = {
  damietta: { name: "Damietta", lat: 31.42, lon: 31.70, refs: [2, 24] },
  talkha: { name: "Talkha", lat: 31.06, lon: 31.37, refs: [3, 7, 14] },
  kureimat: { name: "El Kureimat", lat: 29.27, lon: 31.24, refs: [3, 10, 15, 21] },
  ataka: { name: "Ataka (Suez)", lat: 29.93, lon: 32.44, refs: [1] },
  sokhna: { name: "Ain Sokhna", lat: 29.65, lon: 32.35, refs: [6] },
  arish: { name: "Al Arish", lat: 31.13, lon: 33.80, refs: [13] },
  alexandria: { name: "Alexandria", lat: 31.20, lon: 29.92, refs: [26] },
  shoaiba: { name: "Shoaiba", lat: 20.67, lon: 39.53, refs: [8, 11, 27] },
  rabigh: { name: "Rabigh", lat: 22.80, lon: 39.03, refs: [12, 19] },
  yanbu: { name: "Yanbu", lat: 23.95, lon: 38.28, refs: [20, 25] },
  makkah: { name: "Makkah", lat: 21.42, lon: 39.83, refs: [22] },
  riyadh: { name: "Riyadh", lat: 24.70, lon: 46.75, refs: [9] },
  qassim: { name: "Al Qassim", lat: 26.33, lon: 43.97, refs: [23] },
  jouf: { name: "Al Jouf", lat: 29.95, lon: 40.20, refs: [16] },
  qurayyat: { name: "Al Qurayyat", lat: 31.33, lon: 37.34, refs: [17] },
  abqaiq: { name: "Abqaiq", lat: 25.93, lon: 49.67, refs: [28] },
  sur: { name: "Sur", lat: 22.57, lon: 59.53, refs: [18] },
};
// label placement per view: [dx, dy, anchor] in px of a 1000-px-wide map
const LABELS = {
  overview: { damietta: [-4, -16, "end"], talkha: [-14, 10, "end"], kureimat: [-12, 6, "end"], ataka: [10, 2, "start"], sokhna: [10, 20, "start"],
    arish: [8, -16, "start"], alexandria: [-12, 22, "end"], shoaiba: [-12, 10, "end"], rabigh: [-12, 4, "end"], yanbu: [-12, 0, "end"], makkah: [12, 8, "start"],
    riyadh: [12, 6, "start"], qassim: [12, 4, "start"], jouf: [12, 4, "start"], qurayyat: [12, -16, "start"], abqaiq: [12, 6, "start"], sur: [-12, 6, "end"] },
  saudi: { abqaiq: [-12, -12, "end"], qurayyat: [12, 10, "start"] },
  egypt: { damietta: [12, -10, "start"], talkha: [-12, -8, "end"], kureimat: [-14, 8, "end"], ataka: [12, -2, "start"], sokhna: [12, 14, "start"],
    arish: [-12, -16, "end"], alexandria: [-12, 6, "end"] },
};

/* --------------------------------------------------------------- map svg */
function view(lon0, lon1, lat0, lat1, width) {
  const latc = ((lat0 + lat1) / 2) * (Math.PI / 180);
  const k = width / ((lon1 - lon0) * Math.cos(latc));
  const height = Math.round((lat1 - lat0) * k);
  return { lon0, lat1, k, latc, width, height, p: (lon, lat) => [(lon - lon0) * Math.cos(latc) * k, (lat1 - lat) * k] };
}
function pathOf(geom, v) {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  return polys.map((poly) => poly.map((ring) => "M" + ring.map(([x, y]) => v.p(x, y).map((n) => n.toFixed(1)).join(",")).join("L") + "Z").join("")).join("");
}
function mapSvg(v, { sites, highlightSite, labels, countryLabels = true, pinScale = 1, labelSize = 17, title }) {
  const s = v.width / 1000;
  const land = region.features.map((f) => {
    const hi = HIGHLIGHT.includes(f.properties.name);
    return `<path d="${pathOf(f.geometry, v)}" fill="${hi ? NAVY : LAND}" stroke="#fff" stroke-width="${0.8 * s}"/>`;
  }).join("");
  const cl = countryLabels ? [["EGYPT", 29.6, 26.6], ["SAUDI ARABIA", 44.2, 23.6], ["OMAN", 56.4, 20.6]].map(([n, lon, lat]) => {
    const [x, y] = v.p(lon, lat);
    return `<text x="${x}" y="${y}" font-family="BC" font-weight="700" font-size="${22 * s}" letter-spacing="${3 * s}" fill="rgba(255,255,255,.55)" text-anchor="middle">${n}</text>`;
  }).join("") : "";
  const pins = Object.entries(sites).map(([key, site]) => {
    const [x, y] = v.p(site.lon, site.lat);
    if (x < -20 || y < -20 || x > v.width + 20 || y > v.height + 20) return "";
    const on = !highlightSite || highlightSite === key;
    const r = (highlightSite === key ? 11 : 7 + Math.min(site.refs.length, 4)) * s * pinScale;
    const lab = labels?.[key];
    const label = lab && on ? `<text x="${x + lab[0] * s}" y="${y + lab[1] * s}" text-anchor="${lab[2]}" font-family="BC" font-weight="700"
      font-size="${labelSize * s}" fill="#fff" stroke="${NAVY}" stroke-width="${4 * s}" paint-order="stroke">${site.name}${highlightSite ? "" : ` · ${site.refs.length}`}</text>` : "";
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${on ? ORANGE : "rgba(224,88,38,.45)"}" stroke="#fff" stroke-width="${2.2 * s}"/>${label}`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${v.width}" height="${v.height}" viewBox="0 0 ${v.width} ${v.height}">
    <rect width="100%" height="100%" fill="${SAND}"/>${land}${cl}${pins}${title ?? ""}</svg>`;
}

/* --------------------------------------------------------------- render helpers */
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox", "--allow-file-access-from-files"] });
const page = await browser.newPage();
let n = 0;
async function shot(html, w, h, out, transparent = false) {
  const f = join(TMP, `r${n++}.html`);
  writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}html,body{margin:0;background:${transparent ? "transparent" : "#fff"}}</style></head><body>${html}</body></html>`);
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`file://${f}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
}
const trim = (file) => execFileSync("convert", [file, "-trim", "+repage", file]);

/* --------------------------------------------------------------- maps */
{
  const v = view(18, 65, 13, 37.5, 2400);
  const labels = Object.fromEntries(Object.entries(LABELS.overview).map(([k, [dx, dy, a]]) => [k, [dx * 1.6, dy * 1.6, a]]));
  await shot(mapSvg(v, { sites: SITES, labels }), v.width, v.height, join(OUT, "maps", "overview.png"));
}
const COUNTRY_VIEWS = {
  egypt: [27.6, 35.4, 27.4, 32.0],
  saudi: [34.2, 56.2, 15.6, 32.6],
  oman: [51.0, 61.2, 17.0, 26.6],
};
const countryOf = (site) => (site.lon < 35 && site.lat > 28.5 && site.lon > 24 ? "egypt" : site.lon > 51.5 && site.lat < 27 && site.lon > 55 ? "oman" : "saudi");
for (const [c, [lo0, lo1, la0, la1]] of Object.entries(COUNTRY_VIEWS)) {
  const v = view(lo0, lo1, la0, la1, 1600);
  const sites = Object.fromEntries(Object.entries(SITES).filter(([, s]) => countryOf(s) === c));
  const labels = Object.fromEntries(Object.keys(sites).map((k) => [k, (LABELS[c]?.[k] ?? LABELS.overview[k])]));
  await shot(mapSvg(v, { sites, labels, pinScale: 1.5, labelSize: 30, countryLabels: false }), v.width, v.height, join(OUT, "maps", `country-${c}.png`));
}
for (const story of data.stories) {
  const key = Object.entries(SITES).find(([, s]) => s.refs.includes(story.no))?.[0];
  const site = SITES[key];
  const c = countryOf(site);
  const [lo0, lo1, la0, la1] = COUNTRY_VIEWS[c];
  const v = view(lo0, lo1, la0, la1, 700);
  const sites = Object.fromEntries(Object.entries(SITES).filter(([, s]) => countryOf(s) === c));
  const right = site.lon > (lo0 + lo1) / 2;
  const labels = { [key]: [right ? -22 : 22, 12, right ? "end" : "start"] };
  await shot(mapSvg(v, { sites, highlightSite: key, labels, labelSize: 46, pinScale: 1.6, countryLabels: false }), v.width, v.height, join(OUT, "maps", `locator-${story.no}.png`));
}

/* --------------------------------------------------------------- logos and name tiles */
for (const [key, co] of Object.entries(data.companies)) {
  const out = join(OUT, "logos", `${key}.png`);
  const png = join(A, "logos", `${co.logo}.png`);
  const svg = join(A, "logos", `${co.logo}.svg`);
  if (co.logo && existsSync(png)) {
    copyFileSync(png, out);
  } else if (co.logo && existsSync(svg)) {
    await shot(`<div style="width:1600px;height:500px;display:flex;align-items:center;justify-content:center"><img src="file://${svg}" style="width:1500px;max-height:420px"></div>`, 1600, 500, out, true);
  } else {
    const name = co.tile ?? co.name.replace(/ \(.*\)$/, "").replace(/ — .*$/, "");
    await shot(`<div style="width:1400px;height:300px;display:flex;align-items:center;justify-content:center;font:700 120px/1 BC;letter-spacing:4px;color:${SLATE};text-transform:uppercase;white-space:nowrap">${name}</div>`, 1400, 300, out, true);
  }
  trim(out);
}

await browser.close();
console.log("rendered maps and logos into", OUT);
