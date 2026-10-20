import { chromium } from "playwright-core";
import { readFileSync } from "fs";
const B = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const b = await chromium.launch({ args: ["--no-sandbox", "--allow-file-access-from-files"] });
const page = await b.newPage();
const png = async (svg, out, width) => {
  const src = readFileSync(`${B}/${svg}`, "utf8");
  const [, vw, vh] = src.match(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/);
  const height = Math.round((width * vh) / vw);
  await page.setViewportSize({ width, height });
  await page.setContent(`<html><body style="margin:0;background:transparent"><div style="width:${width}px;height:${height}px">${src.replace(/width="[^"]*" height="[^"]*"/, `width="${width}" height="${height}"`)}</div></body></html>`);
  await page.waitForLoadState("load");
  await page.screenshot({ path: `${B}/${out}`, omitBackground: true, clip: { x: 0, y: 0, width, height } });
};
const pdf = async (svgs, out, wmm, hmm) => {
  const pages = svgs.map((s) => `<div style="width:${wmm}mm;height:${hmm}mm;page-break-after:always;overflow:hidden">${readFileSync(`${B}/${s}`, "utf8")}</div>`).join("");
  await page.setContent(`<html><head><style>@page{size:${wmm}mm ${hmm}mm;margin:0}body{margin:0}</style></head><body>${pages}</body></html>`);
  await page.waitForLoadState("load");
  await page.pdf({ path: `${B}/${out}`, width: `${wmm}mm`, height: `${hmm}mm`, printBackground: true, pageRanges: `1-${svgs.length}` });
};
for (const s of ["color", "reverse", "navy", "white"]) {
  await png(`logo/pat-symbol-${s}.svg`, `png/pat-symbol-${s}-1024.png`, 1024);
  await png(`logo/pat-lockup-horizontal-${s}.svg`, `png/pat-lockup-horizontal-${s}-2000.png`, 2000);
}
for (const s of ["color", "reverse"]) {
  await png(`logo/pat-lockup-stacked-${s}.svg`, `png/pat-lockup-stacked-${s}-1200.png`, 1200);
  await png(`logo/pat-lockup-arabic-${s}.svg`, `png/pat-lockup-arabic-${s}-2000.png`, 2000);
}
await png("logo/pat-symbol-color.svg", "png/pat-symbol-color-256.png", 256);
await png("logo/pat-lockup-horizontal-color.svg", "png/pat-lockup-horizontal-color-600.png", 600);
await png("logo/pat-favicon.svg", "png/pat-favicon-512.png", 512);
await png("logo/pat-favicon.svg", "png/pat-favicon-180.png", 180);
await png("logo/pat-app-icon.svg", "png/pat-app-icon-1024.png", 1024);
await png("logo/pat-weave-device.svg", "png/pat-weave-device-1600.png", 1600);
await pdf(["stationery/business-card-front-ahdy-abu-malwa.svg", "stationery/business-card-back.svg"], "print/business-card-ahdy-abu-malwa-91x61mm-bleed.pdf", 91, 61);
await pdf(["stationery/letterhead-a4.svg"], "print/letterhead-a4.pdf", 210, 297);
await b.close();
console.log("exported");
