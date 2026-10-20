# PAT brand identity

Power Automation Team Co. — **باور أوتوميشن تيم** — DCS & Instruments Specialists, since 1991.
English is the primary language of the brand; Arabic is used alongside it.

Quick look: `previews/` has one sheet per group (logo, stationery, ID badge, PPE, vehicle, signage,
roll-up, social, presentation, merchandise, brand board).

## Positioning

**The commissioning specialists.** PAT is the team EPC contractors and system vendors (Emerson, Hanwha, …)
call when a control system has to be brought online: installation supervision, IO loop checks, device tests,
commissioning, start-up, punch-list closure and operator training.

- **Promise:** from the first cabinet to commercial operation.
- **Personality:** precise, calm under pressure, field-proven, understated.
- **Voice:** facts instead of adjectives — plant, capacity, year, scope. No “leader”, “best”, “revolutionizing”.
  Example: *“Shoaiba Stage I — ABB to Ovation, IO loop checks and start-up on a tight schedule.”*

## Logo — `logo/` (SVG masters) and `png/logo/` (transparent PNG)

The symbol: two woven bundles of signal lines (navy, steel blue, orange) around the slab-serif **PAT**.

| File | Use |
|---|---|
| `pat-symbol-color` | Default symbol on white / light backgrounds |
| `pat-symbol-reverse` | On navy or dark photos (navy parts turn white) |
| `pat-symbol-navy`, `pat-symbol-white` | One colour: engraving, stamps, embroidery, forms |
| `pat-lockup-horizontal-*` | Primary lockup — website header, letterhead, documents |
| `pat-lockup-stacked-*` | Square formats: social profile, roll-ups, title slides |
| `pat-lockup-arabic-*` | Arabic materials |
| `*-reverse-transparent` | White + colour artwork without background, for printing on navy fabric or dark surfaces |
| `pat-favicon` | Letters only — favicon and anything under 48 px |
| `pat-app-icon` | Symbol on a white square (profile pictures, app icon) |
| `pat-weave-device` | One stripe bundle, no letters — the graphic device, never a logo replacement |

**Clear space:** the height of the letter **P** on every side. **Minimum size:** symbol 12 mm / 48 px
(below that use the favicon); horizontal lockup 35 mm / 160 px wide.

**Don’t:** recolour the stripes, add shadows or glows, stretch or rotate the symbol, put the colour version on busy
photos (use reverse or white on a dark overlay), or rebuild the letters in another typeface.

## The weave — graphic device

One stripe bundle of the logo, enlarged, sweeping in from an edge at about 57° and running off the page
(business card, folder, roll-up, slides, social). Keep it off text; keep its ends cropped by the page edge.
`brand.py` places it with `weave(x, y, length, angle)`.

## Colour

| Name | HEX | RGB | CMYK (start values — confirm with a printed proof) | Use |
|---|---|---|---|---|
| PAT Navy | `#102840` | 16 40 64 | 75 38 0 75 | Text, backgrounds, primary colour |
| PAT Orange | `#E05826` | 224 88 38 | 0 61 83 12 | Logo, graphic accents, rules |
| PAT Steel Blue | `#2A7CAC` | 42 124 172 | 76 28 0 33 | Logo, charts, secondary accents |
| Orange — UI | `#EC6B35` | 236 107 53 | — | Buttons with navy text (4.8 : 1) |
| Orange — text | `#B8441A` | 184 68 26 | — | Orange text on white (5.4 : 1) |
| Orange — on dark | `#F07A4A` | 240 122 74 | — | Orange text on navy (5.4 : 1) |
| Sand | `#F3F2EE` | 243 242 238 | — | Light section backgrounds |
| Slate | `#3B5368` | 59 83 104 | — | Secondary text |

PAT Orange on white is 3.75 : 1 — fine for the logo and large graphics, not for body text (use *Orange — text*).

## Typography

| Use | Typeface | Notes |
|---|---|---|
| Headlines | **Barlow Condensed** 600/700/800 | Upper case for short headings |
| Body, UI, forms | **Barlow** 400/500/600 | |
| Arabic | **Cairo** 400–800 | No letter-spacing, no upper-case rules |
| Logo letters | Slab serif inside the symbol only | Never re-typeset — use the files |

All free (Google Fonts / Fontsource). Office fallback: Arial Narrow (headings), Arial (body).

## Applications

Print-ready PDFs are in `print/` (RGB from the SVG masters, with bleed where noted — ask the printer to convert
to their CMYK profile and send a hard proof). Text is converted to outlines, so no fonts are needed to print.

| Item | Files | Size |
|---|---|---|
| Business card | `stationery/business-card-front-ahdy-abu-malwa.svg`, `business-card-back.svg`, `print/business-card-…pdf` | 85 × 55 mm + 3 mm bleed |
| Letterhead | `stationery/letterhead-a4.svg`, `print/letterhead-a4.pdf` | A4 |
| Envelope | `stationery/envelope-dl.svg`, `print/envelope-dl-…pdf` | DL 220 × 110 mm + 3 mm bleed |
| Presentation folder | `stationery/folder-a4-outer.svg`, `folder-a4-inner.svg` + PDFs | 2 × 220 × 310 mm + 3 mm bleed — apply the printer’s die-line (pocket, spine) |
| E-mail signature | `email/signature.html` | Logo served from patdcs.com |
| ID badge | `badge/id-badge-front.svg`, `id-badge-back.svg`, `print/id-badge-…pdf` | CR80 54 × 86 mm + 2 mm bleed |
| Lanyard | `badge/lanyard-900x20mm.svg` | 900 × 20 mm repeat |
| Hard hat | `ppe/hardhat-decal-58x56mm.svg`, `ppe/hardhat-side-sticker-110x30mm.svg` | Cut to the rounded rectangle |
| Coveralls | `ppe/coverall-chest-light-90mm.svg`, `coverall-chest-navy-90mm.svg`, `coverall-back-navy-260mm.svg` | Heat transfer / print; for embroidery keep ≥ 90 mm |
| Hi-vis vest | `ppe/vest-back-navy-print-250mm.svg` | One colour navy |
| Vehicle | `vehicle/door-decal-600mm.svg`, `rear-quarter-1200x900mm.svg`, `tailgate-1200x100mm.svg` | Cut/printed vinyl — confirm sizes on the vehicle |
| Signage | `signage/reception-lockup-2000mm.svg`, `signage/entrance-plate-300x200mm.svg` + PDF | Reception: brushed metal or acrylic letters |
| Roll-up | `rollup/rollup-850x2000mm.svg`, `print/rollup-…pdf` | 850 × 2000 mm + 3 mm; most stands hide ~100 mm at the bottom |
| LinkedIn | `social/linkedin-cover-1584x396.svg`, `linkedin-company-cover-1128x191.svg`; profile picture `png/logo/pat-app-icon-400.png` | px |
| Social posts | `social/post-project-1080.svg`, `post-services-1080.svg`, `post-since-1991-1080.svg` | 1080 × 1080 px templates |
| Presentation | `presentation/title-slide-1920x1080.svg`, `closing-slide-1920x1080.svg` | 16 : 9 (full deck in the presentation phase) |
| Company profile cover | `presentation/profile-cover-a4.svg`, `print/profile-cover-…pdf` | A4 + 3 mm bleed |
| Merchandise | `merch/mug-wrap-200x85mm.svg`, `notebook-a5-cover.svg`, `tote-print-250mm.svg`, `sticker-sheet-a5.svg` (+ PDF) | — |
| Brand board | `board/brand-board-1920x1080.svg`, `print/brand-board.pdf` | One-page summary |

Each SVG also has PNG exports in `png/<folder>/`.

**New business cards / badges:** add a person to `PEOPLE` in `source/brand.py` (name, title, phone) and run the
generator — or ask for it. The badge front is a template (`NAME SURNAME`, `ID 0000`).

## Photography

Real site photography: control rooms, cabinets, operator stations, teams in correct PPE.
AI-generated or stock scenes may be used as mood images but never captioned as a specific project or client site.
Large prints (roll-up, signage) need photos of at least 3500 px on the long side — the current site photos are not.

## Source

`source/` holds the logo artwork and the scripts that traced it and generate every file here — see `source/README.md`.
