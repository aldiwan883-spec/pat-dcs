// Renders the files listed in brand/source/manifest.json (written by brand.py):
//   PNG exports  -> brand/png/<folder>/<name>-<width>.png  (transparent where the SVG has no background)
//   print PDFs   -> brand/print/*.pdf
//   preview sheets -> brand/previews/<group>.png
// Usage (from the repository root):  node brand/source/export.mjs
// Needs Playwright: `npm i -D playwright` (or set CHROMIUM_PATH to a Chromium binary for playwright-core).
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { basename, dirname, join } from "path";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  ({ chromium } = await import("playwright-core"));
}

const BRAND = process.env.BRAND_DIR || new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const manifest = JSON.parse(readFileSync(join(BRAND, "source/manifest.json"), "utf8"));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox", "--allow-file-access-from-files"],
});
const page = await browser.newPage();

const viewBoxOf = (src) => src.match(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
const sized = (src, w, h) => src.replace(/width="[^"]*" height="[^"]*"/, `width="${w}" height="${h}"`);

async function png(rel, width) {
  const src = readFileSync(join(BRAND, rel), "utf8");
  const [vw, vh] = viewBoxOf(src);
  const height = Math.round((width * vh) / vw);
  await page.setViewportSize({ width, height: Math.max(height, 1) });
  await page.setContent(`<html><body style="margin:0;background:transparent">${sized(src, width, height)}</body></html>`);
  const out = join(BRAND, "png", dirname(rel), `${basename(rel, ".svg")}-${width}.png`);
  mkdirSync(dirname(out), { recursive: true });
  await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width, height } });
  return out;
}

async function pdf({ w, h, name, pages }) {
  const body = pages
    .map((rel) => `<div style="width:${w}mm;height:${h}mm;overflow:hidden;page-break-after:always">${sized(readFileSync(join(BRAND, rel), "utf8"), `${w}mm`, `${h}mm`)}</div>`)
    .join("");
  await page.setContent(`<html><head><style>@page{size:${w}mm ${h}mm;margin:0}body{margin:0}</style></head><body>${body}</body></html>`);
  const out = join(BRAND, name);
  mkdirSync(dirname(out), { recursive: true });
  await page.pdf({ path: out, width: `${w}mm`, height: `${h}mm`, printBackground: true, pageRanges: `1-${pages.length}` });
}

rmSync(join(BRAND, "png"), { recursive: true, force: true });
const groups = {};
for (const item of manifest) {
  const outs = [];
  for (const wpx of item.png) outs.push(await png(item.svg, wpx));
  if (item.pdf) await pdf(item.pdf);
  (groups[item.group] ??= []).push({ label: item.label, img: outs[outs.length - 1], dark: item.dark });
}

// Preview sheets (one per group), for GitHub and quick review.
mkdirSync(join(BRAND, "previews"), { recursive: true });
for (const [group, items] of Object.entries(groups)) {
  const cards = items
    .map((i) => `<figure style="margin:0;display:flex;flex-direction:column;gap:8px;max-width:100%">
      <div style="background:${i.dark ? "#102840" : "repeating-conic-gradient(#e6e9ec 0% 25%,#f4f5f6 0% 50%) 50%/20px 20px"};padding:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(16,40,64,.12)">
      <img src="file://${i.img}" style="max-width:560px;max-height:420px;display:block"></div>
      <figcaption style="font:600 15px system-ui;color:#102840">${i.label}</figcaption></figure>`)
    .join("");
  const html = join(tmpdir(), `pat-preview-${Date.now()}.html`);
  writeFileSync(html, `<html><body style="margin:0;padding:32px;background:#fff;font-family:system-ui">
    <h1 style="font:800 28px system-ui;color:#102840;margin:0 0 24px">PAT identity — ${group}</h1>
    <div style="display:flex;flex-wrap:wrap;gap:28px;align-items:flex-start">${cards}</div></body></html>`);
  await page.setViewportSize({ width: 1240, height: 800 });
  await page.goto(`file://${html}`);
  await page.waitForLoadState("load");
  const slug = group.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  await page.screenshot({ path: join(BRAND, "previews", `${slug}.png`), fullPage: true });
}

await browser.close();
console.log(`exported ${manifest.length} files`);
