/**
 * PAT company profile generator.
 *   npx tsx profile/build.ts            -> profile/out/pat-company-profile.pdf (A4, for e-mail)
 *                                          profile/out/pat-company-profile-print-bleed.pdf (A4 + 3 mm bleed)
 * Content comes from the website data (src/data), so the project list stays in one place.
 * Needs a Chromium binary: set CHROMIUM_PATH, or install one with `npx playwright install chromium`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { period, projectBySlug, projects, type Project } from "../src/data/projects";
import { services } from "../src/data/services";
import { company } from "../src/data/site";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const OUT = join(HERE, "out");
const YEAR = 2026;

const COUNTRY: Record<string, string> = { egypt: "Egypt", "saudi-arabia": "Saudi Arabia", oman: "Oman" };
const PLATFORM: Record<string, string> = {
  ovation: "Emerson Ovation", deltav: "Emerson DeltaV", emerson: "Emerson DCS",
  siemens: "Siemens S7 PLC", alstom: "Alstom DCS", other: "—",
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const img = (name: string) => `img/${name}.jpg`;
const brand = (p: string) => `../brand/${p}`;
const font = (pkg: string, file: string) => `../node_modules/${pkg}/files/${file}`;

const ICON: Record<string, string> = {
  dcs: "M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zM10 10h4v4h-4z",
  plc: "M9 2v5M15 2v5M6 7h12v4a6 6 0 01-12 0V7zM12 17v5",
  commissioning: "M12 3v8M6.4 6.6a8 8 0 1011.2 0",
  ic: "M12 14l4-4M3.5 17a9 9 0 1117 0",
  training: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 21h15",
  staffing: "M9 11a3 3 0 100-6 3 3 0 000 6zM3 19a6 6 0 0112 0M16 11a3 3 0 000-6M17 19h4a5 5 0 00-4-4.9",
  support: "M12 4l9 16H3L12 4zM12 10v4M12 17h.01",
};
const icon = (id: string, cls = "icon") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON[id]}"/></svg>`;

const total = projects.length;
const countries = new Set(projects.map((p) => p.country)).size;
const byCountry = (c: string) => projects.filter((p) => p.country === c);

/* ------------------------------------------------------------------ page shells */
let pageNo = 0;
function page(body: string, opts: { cls?: string; footer?: boolean; dark?: boolean } = {}) {
  pageNo += 1;
  const foot = opts.footer === false ? "" : `<footer class="foot${opts.dark ? " foot-dark" : ""}">
      <span>Power Automation Team — Company Profile ${YEAR}</span><span>${company.phoneDisplay} · patdcs.com</span><span class="num">${String(pageNo).padStart(2, "0")}</span></footer>`;
  return `<section class="page ${opts.cls ?? ""}"><div class="inner">${body}</div>${foot}</section>`;
}
const head = (eyebrow: string, title: string, lead?: string) =>
  `<p class="eyebrow">${eyebrow}</p><h2 class="h">${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ""}`;

/* ------------------------------------------------------------------ pages */
const cover = () => page(`
  <div class="cover-photo" style="background-image:url(${img("plant-steam")})"></div>
  <div class="cover-shade"></div>
  <img class="weave cover-weave" src="${brand("logo/pat-weave-device-reverse.svg")}" alt="">
  <img class="cover-logo" src="${brand("logo/pat-lockup-horizontal-reverse-transparent.svg")}" alt="Power Automation Team">
  <div class="cover-title">
    <p class="eyebrow on-dark">Company profile ${YEAR}</p>
    <h1>The team that brings<br>your plant control<br>system online.</h1>
    <p class="cover-sub">DCS installation supervision · loop checks · commissioning · start-up · training</p>
  </div>
  <div class="cover-foot">Egypt · Saudi Arabia · Oman — since 1991</div>`, { cls: "dark cover", footer: false });

const glance = () => page(`
  ${head("PAT at a glance", "The commissioning specialists")}
  <p class="lead">Since 1991, EPC contractors and control-system vendors have called PAT when a distributed control system
  has to be brought online: installation supervision, IO loop checks, device tests, commissioning, start-up,
  punch-list closure and operator training — in power plants across Egypt, Saudi Arabia and Oman.</p>
  <div class="stats">
    <div><b>1991</b><span>Established</span></div>
    <div><b>${total}</b><span>Reference projects</span></div>
    <div><b>${countries}</b><span>Countries</span></div>
    <div><b>24/7</b><span>Support</span></div>
  </div>
  <figure class="photo tall"><img src="${img("team-site")}" alt=""><figcaption>PAT commissioning team on site.</figcaption></figure>
  <div class="cols3 small-gap">
    <div class="tile"><h4>Who calls us</h4><p>EPC contractors and system vendors — Emerson, Hanwha, Daewoo, Skoda, CMI, INITEC, GE, Orascom, Saudi FAL, KBR.</p></div>
    <div class="tile"><h4>When</h4><p>New DCS projects, migrations and retrofits, outages, start-ups, loop tests and punch-list closure.</p></div>
    <div class="tile"><h4>What they get</h4><p>Engineers who have done it before, procedures that are safe and easy to track, and a team that stays to commercial operation.</p></div>
  </div>`);

const about = () => page(`
  ${head("About us", "Thirty-five years on site")}
  <div class="cols2">
    <div class="prose">
      <p>Power Automation Team (PAT) was established in 1991 to cover power plants in Egypt and the Middle East.
      Our work spans power generation, water and petrochemical plants.</p>
      <p>The team consists of qualified local engineers and technicians who have worked with major international companies,
      including Emerson, Techint, Alstom, GE, Siemens, Skoda, CMI, Iberdrola and INITEC.</p>
      <p>We provide engineers and technicians on a contractual basis — part-time or full-time, for short or extended periods —
      screened to match each job, and we prepare and implement commissioning procedures adapted to each plant so that our
      clients deliver faster, safer and at optimum cost.</p>
      <div class="founder">
        <img src="${brand("png/logo/pat-symbol-color-256.png")}" alt="">
        <div><b>${company.owner.en}</b><span>Founder &amp; Managing Director — recognised by Emerson Process Management
        as DCS Lead Engineer on Emerson Ovation projects in Egypt.</span></div>
      </div>
    </div>
    <div>
      <figure class="photo"><img src="${img("control-room-team")}" alt=""><figcaption>Control room during commissioning.</figcaption></figure>
      <div class="vm">
        <h4>Vision</h4><p>To be the premier automation control-systems provider for power, petrochemical and industrial customers —
        quality, reliability and customer satisfaction first.</p>
        <h4>Values</h4><p>Quality above all · Safety in every step · Transparency in communication · Teamwork · Continuous development</p>
      </div>
    </div>
  </div>`);

const servicesPage = () => page(`
  ${head("Services", "What PAT does on site", "From the first cabinet to commercial operation.")}
  <div class="svc-grid">
    ${services.map((s) => `<article class="svc">${icon(s.id)}<h3>${esc(s.title.en)}</h3><p>${esc(s.summary.en)}</p>
      <ul>${s.bullets.slice(0, 3).map((b) => `<li>${esc(b.en)}</li>`).join("")}</ul></article>`).join("")}
    <article class="svc svc-cta"><h3>One team, one schedule</h3><p>Any combination of these services, staffed and supervised by PAT
    for the duration of your outage or start-up.</p><p class="cta-line">${company.phoneDisplay}<br>info@patdcs.com</p></article>
  </div>`);

const steps = [
  ["Installation supervision", "Removal of old panels, new cabinets, cabling and power-up of the DCS."],
  ["Configuration", "Database, logic and graphics checks; hardware and software modifications."],
  ["Loop checks & device tests", "Cold and hot IO loop tests, device functional tests, instrument calibration."],
  ["Commissioning", "System-by-system commissioning of GT, ST, boiler, HRSG and BOP with the plant team."],
  ["Start-up & reliability run", "Start-up, troubleshooting and normalising the units to commercial operation."],
  ["Hand-over & training", "Punch-list closure, documentation, owner O&M courses and warranty support."],
];
const lifecycle = () => page(`
  ${head("How we work", "Where PAT fits in your project", "Call us for one step or for the whole sequence — the same engineers stay from installation to hand-over.")}
  <ol class="flow">${steps.map(([t, d], i) => `<li><span class="n">${String(i + 1).padStart(2, "0")}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol>
  <div class="cols2 photos2">
    <figure class="photo"><img src="${img("io-wiring")}" alt=""><figcaption>IO module wiring check.</figcaption></figure>
    <figure class="photo"><img src="${img("marshalling-cabinet")}" alt=""><figcaption>Marshalling cabinet before loop tests.</figcaption></figure>
  </div>
  <p class="note">Our procedures are written to be safe, easy to implement and documented so that every loop and device is traceable.</p>`);

const systems = () => page(`
  ${head("Control systems", "Platforms we commission", "Most of our work is on Emerson Ovation; our teams have also commissioned and troubleshot the systems below.")}
  <div class="chips">
    ${["Emerson Ovation", "Westinghouse WDPF → Ovation", "ABB → Ovation", "Emerson DeltaV", "Alstom DCS", "Siemens S7 PLC", "GE gas-turbine controls", "TCS → Ovation"].map((c) => `<span>${c}</span>`).join("")}
  </div>
  <div class="shots">
    <figure class="photo"><img src="${img("ovation-lube-oil-al-arish")}" alt=""><figcaption>Ovation lube-oil graphic — Al Arish STPP.</figcaption></figure>
    <figure class="photo"><img src="${img("ovation-synch-al-arish")}" alt=""><figcaption>Generator synchronising graphic — Al Arish STPP.</figcaption></figure>
    <figure class="photo"><img src="${img("ovation-electrical-al-arish")}" alt=""><figcaption>Electrical overview — Al Arish STPP.</figcaption></figure>
    <figure class="photo"><img src="${img("ovation-gt-panel")}" alt=""><figcaption>Ovation operator panel on a gas-turbine control cabinet.</figcaption></figure>
  </div>`);

const recognition = () => page(`
  ${head("Credentials", "Recognised by Emerson Process Management")}
  <div class="cols2 rec">
    <img class="plaque" src="${join(ROOT, "public/images/emerson-plaque.jpg")}" alt="Emerson recognition plaque">
    <div>
      <blockquote>“In recognition of Ahdy Abu-Malwa for technical contributions and excellence in delivery of Emerson Ovation
      Expert Control System Solutions within the Arab Republic of Egypt.”</blockquote>
      <h4>DCS Lead Engineer</h4>
      <ul><li>New Talkha 750 MW CC Expansion</li><li>Damietta 1,230 MW WDPF to Ovation Migration</li><li>El-Kureimat II 750 MW CC Power Station</li></ul>
      <h4>DCS Engineer</h4><ul><li>Ataka 900 MW Steam Modernization</li></ul>
      <p class="small">Signed by Robert Yeager, President, Emerson PWS, and T.C. Chan, Project Manager, Emerson PWS.</p>
      <p class="small muted">Emerson, Ovation, DeltaV and PlantWeb are trademarks of Emerson Electric Co. PAT is an independent company;
      these names describe work performed and recognition received.</p>
    </div>
  </div>`);

const featured: { slug: string; photo?: [string, string] }[] = [
  { slug: "damietta-ccpp-1230mw-dcs-migration" },
  { slug: "sur-ipp-ccpp-2000mw-oman" },
  { slug: "el-kurimat-i-dcs-migration" },
  { slug: "shoaiba-stage-1-dcs-rehabilitation" },
  { slug: "abqaiq-dcs-upgrade-aramco" },
  { slug: "al-arish-stpp-dcs-migration", photo: ["ovation-synch-al-arish", "Ovation graphics at Al Arish."] },
];
const projectCard = (p: Project, photo?: [string, string]) => `
  <article class="proj">
    <div class="fig"><b>${p.figure.value}</b><span>${p.figure.unit.en}</span></div>
    <div class="pbody">
      <p class="eyebrow">${esc(p.type.en)}</p>
      <h3>${esc(p.name.en)}</h3>
      <p class="meta">${COUNTRY[p.country]} · ${period(p)}${p.platform !== "other" ? ` · ${PLATFORM[p.platform]}` : ""}${p.partners.length ? ` · with ${p.partners.join(", ")}` : ""}</p>
      <ul>${p.scope.slice(0, 4).map((l) => `<li>${esc(l.en)}</li>`).join("")}</ul>
    </div>
    ${photo ? `<figure class="photo pphoto"><img src="${img(photo[0])}" alt=""></figure>` : ""}
  </article>`;
const featuredPages = () => [0, 3].map((start, i) => page(`
  ${i === 0 ? head("Selected projects", "References that match your next job") : head("Selected projects", "Continued")}
  ${featured.slice(start, start + 3).map((f) => projectCard(projectBySlug(f.slug)!, f.photo)).join("")}`)).join("");

const sorted = [...projects].sort((a, b) => a.no - b.no);
const registerPages = () => [0, 14].map((start, i) => page(`
  ${i === 0 ? head("Project register", `All ${total} reference projects`, "Listed as in our reference list; contracting party in the last column.") : head("Project register", "Continued")}
  <table class="reg"><thead><tr><th>No.</th><th>Project</th><th>Scope</th><th>Country</th><th>Year</th><th>System</th><th>With</th></tr></thead><tbody>
  ${sorted.slice(start, start + 14).map((p) => `<tr><td>${String(p.no).padStart(2, "0")}</td><td><b>${esc(p.name.en)}</b></td><td>${esc(p.type.en)}</td>
    <td>${COUNTRY[p.country]}</td><td>${period(p)}</td><td>${PLATFORM[p.platform]}</td><td>${esc(p.partners.join(", ") || "—")}</td></tr>`).join("")}
  </tbody></table>`)).join("");

const footprint = () => page(`
  ${head("Where we work", "Three countries, one team")}
  <div class="cols3">
    ${["egypt", "saudi-arabia", "oman"].map((c) => `<div class="country"><b>${byCountry(c).length}</b><h3>${COUNTRY[c]}</h3>
      <ul>${byCountry(c).sort((a, b) => a.start - b.start).map((p) => `<li>${esc(p.name.en.split(" — ")[0])} <span>${period(p)}</span></li>`).join("")}</ul></div>`).join("")}
  </div>
  <div class="cols2 partners">
    <div><h4>Worked with — contractors &amp; vendors</h4><p>Emerson · Hanwha · Daewoo · Skoda · CMI · INITEC · Iberdrola · GE · Orascom · Saudi FAL · Giza Systems · KBR · Savola · Leoron</p></div>
    <div><h4>Plant owners</h4><p>Saudi Electricity Company · Saudi Aramco · Marafiq · power plants of Egypt’s national grid</p></div>
  </div>`);

const operatorCourse = ["Typical Ovation DCS structure (theory)", "Alarm system and process diagrams", "Trend display and point information", "Point review, point viewer and error log"];
const maintCourse = [
  ["1", "Basic operator functions; right-click functions in Ovation Developer Studio (OV 100)"],
  ["2", "Creating and modifying analog, digital and packed points (OV 100)"],
  ["3", "Monitoring, tuning and calibrating existing control (OV 200)"],
  ["4", "Modifying existing control schemes (OV 200)"],
  ["5–6", "Creating new control sheets (OV 200)"],
  ["7", "Graphics Builder and non-point items"],
  ["8", "Building point-related graphics"],
  ["9", "Building and implementing control-interface graphics"],
  ["10", "Building and using macros on main graphics"],
];
const training = () => page(`
  ${head("Training", "Courses for owner operators and maintenance staff", "Delivered at the plant, on the plant’s own system, at the end of commissioning — and as stand-alone courses.")}
  <div class="cols2">
    <div class="course"><h3>Ovation operator course <span>4 days</span></h3>
      <ol>${operatorCourse.map((d, i) => `<li><b>Day ${i + 1}</b>${d}</li>`).join("")}</ol>
      <figure class="photo"><img src="${img("ovation-workstation")}" alt=""><figcaption>Ovation engineering workstation.</figcaption></figure>
    </div>
    <div class="course"><h3>Ovation maintenance course <span>10 days</span></h3>
      <ol>${maintCourse.map(([d, t]) => `<li><b>Day ${d}</b>${t}</li>`).join("")}</ol>
    </div>
  </div>
  <p class="note">Also: GT, ST, boiler, HRSG and BOP operation &amp; maintenance courses, DCS simulator instruction, and training-academy set-up (Marafiq, Yanbu).</p>`);

const gallery = () => page(`
  ${head("On site", "Our people, in the field")}
  <div class="gallery">
    <figure class="photo g1"><img src="${img("team-stack")}" alt=""></figure>
    <figure class="photo g2"><img src="${img("team-night")}" alt=""><figcaption>Night shift during start-up.</figcaption></figure>
    <figure class="photo g3"><img src="${img("dcs-cabinet")}" alt=""></figure>
    <figure class="photo g4"><img src="${img("team-crane")}" alt=""></figure>
    <figure class="photo g5"><img src="${img("synchronizing-panel")}" alt=""></figure>
    <figure class="photo g6"><img src="${img("control-room-startup")}" alt=""><figcaption>Start-up in the control room.</figcaption></figure>
  </div>`);

const engage = () => page(`
  ${head("Working with PAT", "How to engage us")}
  <div class="cols3">
    <div class="tile big"><h3>Scope package</h3><p>A defined scope — e.g. loop checks of a unit, DCS migration support, start-up of a GT — with our own supervision and procedures.</p></div>
    <div class="tile big"><h3>Technical staffing</h3><p>Screened engineers and technicians in your team: DCS HW/SW, I&amp;C, mechanical, electrical, operators. Part-time or full-time, short or extended.</p></div>
    <div class="tile big"><h3>Emergency support</h3><p>A team on site fast for problems that affect plant availability — DCS, gas turbines, PLCs, switchgear. Available 24/7.</p></div>
  </div>
  <div class="why">
    <figure class="photo"><img src="${img("new-control-room")}" alt=""><figcaption>New control room, ready for commissioning.</figcaption></figure>
    <div class="why-list">
      <h3>Why contractors work with PAT</h3>
      <div><b>High-quality personnel</b><p>Engineers and technicians with long power-plant experience, screened for each job.</p></div>
      <div><b>Competitive billing rates</b><p>Competitive pricing without compromising on quality.</p></div>
      <div><b>Flexible manpower</b><p>The team grows and shrinks with your scope and schedule.</p></div>
      <div><b>Commitment to quality</b><p>On time, within budget, documented and traceable.</p></div>
    </div>
  </div>
  <div class="contact-block">
    <h3>Talk to us about your next outage or start-up</h3>
    <div class="cols3">
      <div><h4>Phone</h4><p>${company.phoneDisplay} (24/7)<br>${company.supportPhoneDisplay} (technical support)</p></div>
      <div><h4>E-mail</h4><p>${company.email}<br>${company.salesEmail}<br>${company.serviceEmail}</p></div>
      <div><h4>Office</h4><p>${company.address.en}</p></div>
    </div>
  </div>`);

const backCover = () => page(`
  <img class="weave back-weave" src="${brand("logo/pat-weave-device-reverse.svg")}" alt="">
  <img class="back-logo" src="${brand("logo/pat-lockup-stacked-reverse-transparent.svg")}" alt="Power Automation Team">
  <div class="back-contact"><p>${company.phoneDisplay} · ${company.email}</p><p class="web">patdcs.com</p><p class="ar">باور أوتوميشن تيم</p></div>`,
  { cls: "dark back", footer: false });

/* ------------------------------------------------------------------ document */
function html(bleedMm: number) {
  pageNo = 0;
  const pages = [cover(), glance(), about(), servicesPage(), lifecycle(), systems(), recognition(), featuredPages(), registerPages(),
    footprint(), training(), gallery(), engage(), backCover()].join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>PAT — Company Profile ${YEAR}</title><style>
@font-face{font-family:Barlow;font-weight:400;src:url(${font("@fontsource/barlow", "barlow-latin-400-normal.woff2")})}
@font-face{font-family:Barlow;font-weight:500;src:url(${font("@fontsource/barlow", "barlow-latin-500-normal.woff2")})}
@font-face{font-family:Barlow;font-weight:600;src:url(${font("@fontsource/barlow", "barlow-latin-600-normal.woff2")})}
@font-face{font-family:Barlow;font-weight:700;src:url(${font("@fontsource/barlow", "barlow-latin-700-normal.woff2")})}
@font-face{font-family:"Barlow Condensed";font-weight:600;src:url(${font("@fontsource/barlow-condensed", "barlow-condensed-latin-600-normal.woff2")})}
@font-face{font-family:"Barlow Condensed";font-weight:700;src:url(${font("@fontsource/barlow-condensed", "barlow-condensed-latin-700-normal.woff2")})}
@font-face{font-family:"Barlow Condensed";font-weight:800;src:url(${font("@fontsource/barlow-condensed", "barlow-condensed-latin-800-normal.woff2")})}
@font-face{font-family:Cairo;font-weight:200 900;src:url(${font("@fontsource-variable/cairo", "cairo-arabic-wght-normal.woff2")})}
:root{--navy:#102840;--orange:#E05826;--otxt:#B8441A;--odark:#F07A4A;--blue:#2A7CAC;--sand:#F3F2EE;--slate:#3B5368;--line:#D5DCE2;--b:${bleedMm}mm}
@page{size:calc(210mm + 2*var(--b)) calc(297mm + 2*var(--b));margin:0}
*{box-sizing:border-box}html,body{margin:0;padding:0}
body{font-family:Barlow,sans-serif;color:var(--navy);font-size:9.6pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:calc(210mm + 2*var(--b));height:calc(297mm + 2*var(--b));overflow:hidden;page-break-after:always;background:#fff}
.inner{position:absolute;inset:calc(var(--b) + 16mm) calc(var(--b) + 16mm) calc(var(--b) + 20mm);display:flex;flex-direction:column;gap:5.5mm}
.foot{position:absolute;left:calc(var(--b) + 16mm);right:calc(var(--b) + 16mm);bottom:calc(var(--b) + 9mm);display:flex;gap:6mm;font-size:7pt;color:var(--slate);border-top:.3mm solid var(--line);padding-top:2.5mm}
.foot .num{margin-left:auto;font-weight:700;color:var(--navy)}
.eyebrow{font:600 9pt "Barlow Condensed";letter-spacing:.14em;text-transform:uppercase;color:var(--otxt);margin:0}
.eyebrow.on-dark{color:var(--odark)}
.h{font:800 27pt/1 "Barlow Condensed";text-transform:uppercase;margin:-3mm 0 0}
.lead{font-size:11.5pt;line-height:1.5;color:var(--slate);margin:0;max-width:165mm}
h3{font:700 13pt/1.15 "Barlow Condensed";margin:0}
h4{font:700 9.5pt "Barlow Condensed";letter-spacing:.08em;text-transform:uppercase;color:var(--otxt);margin:0 0 1.5mm}
p{margin:0}ul,ol{margin:0;padding-left:4.5mm}li{margin:.6mm 0}
.small{font-size:8pt}.muted{color:var(--slate)}
.note{font-size:9pt;color:var(--slate);border-left:1mm solid var(--orange);padding-left:3mm}
.cols2{display:grid;grid-template-columns:1fr 1fr;gap:7mm}.cols3{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm}
.photo{margin:0;position:relative;overflow:hidden;border-radius:1mm;background:var(--sand)}
.photo img{display:block;width:100%;height:100%;object-fit:cover}
.photo figcaption{position:absolute;left:0;right:0;bottom:0;padding:5mm 3mm 2mm;font-size:7.5pt;color:#fff;background:linear-gradient(transparent,rgba(16,40,64,.85))}
/* cover */
.dark{background:var(--navy);color:#fff}
.cover .inner,.back .inner{inset:0;display:block}
.cover-photo{position:absolute;inset:0;background-size:cover;background-position:center}
.cover-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(16,40,64,.92) 0%,rgba(16,40,64,.70) 45%,rgba(16,40,64,.96) 100%)}
.weave{position:absolute;transform:rotate(-15deg)}
.cover-weave{width:230mm;right:-95mm;bottom:-25mm}
.cover-logo{position:absolute;left:calc(var(--b) + 16mm);top:calc(var(--b) + 16mm);height:22mm}
.cover-title{position:absolute;left:calc(var(--b) + 16mm);top:calc(var(--b) + 92mm);right:calc(var(--b) + 16mm)}
.cover-title h1{font:800 40pt/0.98 "Barlow Condensed";text-transform:uppercase;margin:3mm 0 5mm}
.cover-sub{font-size:11pt;color:rgba(255,255,255,.85);max-width:120mm}
.cover-foot{position:absolute;left:calc(var(--b) + 16mm);bottom:calc(var(--b) + 16mm);font:600 10pt "Barlow Condensed";letter-spacing:.14em;text-transform:uppercase;color:var(--odark)}
/* glance */
.stats{display:grid;grid-template-columns:repeat(4,1fr);background:var(--sand);padding:5mm 6mm;border-radius:1mm}
.stats b{display:block;font:800 30pt/1 "Barlow Condensed"}.stats span{font-size:8.5pt;color:var(--slate)}
.photo.tall{height:82mm}
.tile{border-top:1mm solid var(--orange);padding-top:2.5mm}.tile p{font-size:9pt;color:var(--slate);margin-top:1mm}
.tile h4{color:var(--navy)}.tile.big h3{margin-bottom:1.5mm}
/* about */
.prose p+p{margin-top:3mm}.prose{font-size:10pt}
.founder{display:flex;gap:4mm;align-items:center;margin-top:6mm;background:var(--sand);padding:4mm;border-radius:1mm}
.founder img{width:16mm}.founder b{display:block;font:700 12pt "Barlow Condensed"}.founder span{font-size:8.5pt;color:var(--slate)}
.vm{margin-top:5mm}.vm p{font-size:9pt;color:var(--slate);margin-bottom:3mm}
.cols2 .photo{height:70mm}
/* services */
.svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.svc{border:.3mm solid var(--line);border-radius:1mm;padding:3.2mm 3.6mm}
.svc .icon{width:6mm;height:6mm;color:var(--otxt)}
.svc h3{margin:1mm 0;font-size:12pt}.svc p{font-size:8.2pt;line-height:1.38;color:var(--slate)}.svc ul{font-size:7.9pt;line-height:1.35;margin-top:1mm}.svc li{margin:.3mm 0}
.svc-cta{background:var(--navy);color:#fff;border:0}.svc-cta p{color:rgba(255,255,255,.8)}.cta-line{margin-top:3mm;font:700 11pt "Barlow Condensed";color:#fff!important}
/* lifecycle */
.flow{list-style:none;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;counter-reset:s}
.flow li{margin:0;background:var(--sand);padding:4mm;border-radius:1mm;position:relative}
.flow .n{font:800 20pt/1 "Barlow Condensed";color:var(--orange)}.flow h3{margin:1.5mm 0}.flow p{font-size:8.6pt;color:var(--slate)}
.photos2 .photo{height:78mm}
/* systems */
.chips{display:flex;flex-wrap:wrap;gap:2.5mm}.chips span{border:.3mm solid var(--navy);border-radius:10mm;padding:1.2mm 3.5mm;font:600 9pt Barlow}
.shots{display:grid;grid-template-columns:1fr 1fr;gap:4mm}.shots .photo{height:62mm}
/* recognition */
.rec{grid-template-columns:78mm 1fr;align-items:start}.plaque{width:100%;box-shadow:0 2mm 6mm rgba(16,40,64,.3)}
blockquote{margin:0 0 5mm;font-size:11.5pt;font-style:italic;color:var(--slate);border-left:1mm solid var(--orange);padding-left:4mm}
.rec ul{margin-bottom:4mm}.rec .small{margin-top:3mm}
/* projects */
.proj{display:grid;grid-template-columns:38mm 1fr;gap:5mm;border-top:.3mm solid var(--line);padding-top:4.5mm}
.proj:has(.pphoto){grid-template-columns:38mm 1fr 52mm}
.fig{background:var(--navy);color:#fff;border-radius:1mm;padding:4mm;display:flex;flex-direction:column;justify-content:flex-end;min-height:40mm}
.fig b{font:800 26pt/1 "Barlow Condensed";color:var(--odark)}.fig span{font:600 8pt "Barlow Condensed";letter-spacing:.12em;text-transform:uppercase}
.pbody h3{font-size:15pt;margin:1mm 0}.meta{font-size:8.5pt;color:var(--slate);margin-bottom:2mm}.pbody ul{font-size:8.8pt}
.pphoto{height:42mm}
/* register */
.reg{width:100%;border-collapse:collapse;font-size:7.6pt}
.reg th{text-align:left;font:700 8pt "Barlow Condensed";letter-spacing:.06em;text-transform:uppercase;background:var(--navy);color:#fff;padding:2mm}
.reg td{padding:2mm;border-bottom:.3mm solid var(--line);vertical-align:top}.reg tr:nth-child(even) td{background:#FAFAF8}
.reg td:first-child{font-weight:700;color:var(--otxt)}
/* footprint */
.country{background:var(--sand);border-radius:1mm;padding:4mm}.country b{font:800 30pt/1 "Barlow Condensed";color:var(--orange)}
.country h3{margin:1mm 0 2mm}.country ul{list-style:none;padding:0;font-size:8.1pt}.country li{border-bottom:.2mm solid var(--line);padding:.8mm 0;display:flex;justify-content:space-between;gap:2mm}
.country li span{color:var(--slate);white-space:nowrap}
.partners p{font-size:9.5pt;color:var(--slate)}
/* training */
.course h3{display:flex;justify-content:space-between;align-items:baseline;border-bottom:.6mm solid var(--orange);padding-bottom:1.5mm;margin-bottom:2mm}
.course h3 span{font:600 9pt Barlow;color:var(--otxt)}
.course ol{list-style:none;padding:0;font-size:8.8pt}.course li{display:grid;grid-template-columns:15mm 1fr;padding:1.2mm 0;border-bottom:.2mm solid var(--line)}
.course li b{color:var(--otxt)}.course .photo{height:60mm;margin-top:4mm}
/* gallery */
.gallery{display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:68mm 60mm 68mm;gap:3mm;flex:1}
.g1{grid-column:1/5}.g2{grid-column:5/7}.g3{grid-column:1/3;grid-row:2/4}.g4{grid-column:3/7}.g5{grid-column:3/5}.g6{grid-column:5/7}
/* engage */
.contact-block{margin-top:auto;background:var(--navy);color:#fff;border-radius:1mm;padding:7mm}
.contact-block h3{font-size:18pt;margin-bottom:5mm}.contact-block h4{color:var(--odark)}.contact-block p{font-size:9pt;color:rgba(255,255,255,.88)}
.why{display:grid;grid-template-columns:1fr 1fr;gap:6mm}.why .photo{height:86mm}
.why-list{display:flex;flex-direction:column;gap:3mm}.why-list b{font:700 11pt "Barlow Condensed"}.why-list p{font-size:8.8pt;color:var(--slate)}
/* back cover */
.back-weave{width:230mm;left:-50mm;bottom:-118mm}
.back-logo{position:absolute;left:50%;top:calc(var(--b) + 58mm);width:110mm;transform:translateX(-50%)}
.back-contact{position:absolute;left:0;right:0;top:calc(var(--b) + 150mm);text-align:center;font-size:11pt}
.back-contact .web{font:800 22pt "Barlow Condensed";margin-top:3mm}.back-contact .ar{font:700 13pt Cairo;margin-top:2mm;direction:rtl}
</style></head><body>${pages}</body></html>`;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const page = await browser.newPage();
  for (const [bleed, name] of [[0, "pat-company-profile.pdf"], [3, "pat-company-profile-print-bleed.pdf"]] as const) {
    const file = join(HERE, `profile${bleed ? "-bleed" : ""}.html`);
    writeFileSync(file, html(bleed));
    await page.goto(`file://${file}`, { waitUntil: "networkidle" });
    await page.pdf({ path: join(OUT, name), width: `${210 + 2 * bleed}mm`, height: `${297 + 2 * bleed}mm`, printBackground: true, preferCSSPageSize: true });
    if (!bleed) {
      // page previews
      await page.setViewportSize({ width: 794, height: 1123 });
      const n = await page.locator(".page").count();
      mkdirSync(join(OUT, "pages"), { recursive: true });
      for (let i = 0; i < n; i++) await page.locator(".page").nth(i).screenshot({ path: join(OUT, "pages", `page-${String(i + 1).padStart(2, "0")}.png`) });
    }
  }
  await browser.close();
  console.log("profile written to", OUT);
}
main();
