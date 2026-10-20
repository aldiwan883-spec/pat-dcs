# PAT brand identity

Power Automation Team Co. — **باور أوتوميشن تيم** — DCS & Instruments Specialists, since 1991.
English is the primary language of the brand; Arabic is used alongside it.

## Positioning

**The commissioning specialists.** PAT is the team EPC contractors and system vendors (Emerson, Hanwha, …)
call when a control system has to be brought online: installation supervision, IO loop checks, device tests,
commissioning, start-up, punch-list closure and operator training.

- **Promise:** from the first cabinet to commercial operation.
- **Personality:** precise, calm under pressure, field-proven, understated.
- **Voice:** facts instead of adjectives — plant, capacity, year, scope. No “leader”, “best”, “revolutionizing”.
  Example: *“Shoaiba Stage I — ABB to Ovation, IO loop checks and start-up on a tight schedule.”*

## Logo

The symbol: two woven bundles of signal lines (navy, steel blue, orange) around the slab-serif **PAT**.

| File | Use |
|---|---|
| `logo/pat-symbol-color.svg` | Default symbol on white / light backgrounds |
| `logo/pat-symbol-reverse.svg` | On navy or dark photos (navy parts turn white) |
| `logo/pat-symbol-navy.svg`, `pat-symbol-white.svg` | One-colour: engraving, stamps, embroidery, fax/forms |
| `logo/pat-lockup-horizontal-*.svg` | Primary lockup with the name — website header, letterhead, documents |
| `logo/pat-lockup-stacked-*.svg` | Square formats: social profile, roll-ups, title slides |
| `logo/pat-lockup-arabic-*.svg` | Arabic materials |
| `logo/pat-favicon.svg` | Letters only — favicon and anything under 48 px |
| `logo/pat-app-icon.svg` | Symbol on white square (app / profile icon) |
| `logo/pat-weave-device.svg` | The line bundles without letters — graphic device, never a logo replacement |
| `png/` | Transparent PNG exports of all of the above |

**Clear space:** keep free space around the logo equal to the height of the letter **P**.
**Minimum size:** symbol 48 px / 12 mm; below that use the favicon (letters only). Horizontal lockup 160 px / 35 mm wide.

**Don’t:** recolour the stripes, add shadows or glows, stretch, rotate the symbol, put the colour version on busy
photos (use the reverse or white version on a dark overlay), or rebuild the letters in another typeface.

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
| Headlines | **Barlow Condensed** 600/700 | Upper case for short headings, slight tracking |
| Body, UI, forms | **Barlow** 400/500/600 | |
| Arabic | **Cairo** 400–800 | No letter-spacing, no upper case rules |
| Logo letters | Slab serif inside the symbol only | Never re-typeset — use the files |

All three are free (Google Fonts / Fontsource). Office fallback: Arial Narrow (headings) and Arial (body).

## Stationery

| File | |
|---|---|
| `stationery/business-card-front-ahdy-abu-malwa.svg`, `business-card-back.svg` | 85 × 55 mm card, 3 mm bleed |
| `print/business-card-ahdy-abu-malwa-91x61mm-bleed.pdf` | Print-ready, 2 pages (front + back), 91 × 61 mm with bleed |
| `stationery/letterhead-a4.svg`, `print/letterhead-a4.pdf` | A4 letterhead |
| `email/signature.html` | E-mail signature (logo served from patdcs.com) |

Keep text 4 mm inside the trim line. Ask the printer for a hard proof to match the navy and orange.
New cards: copy the front file and change name, title and phone, or regenerate with `source/brand.py`.

## Photography

Real site photography only: control rooms, cabinets, operator stations, teams in correct PPE.
AI-generated or stock scenes may be used as brand mood images but never captioned as a specific project or client site.

## Source

`source/` holds the logo source image and the scripts that traced it and generated every file here
(`trace.py` → `build_symbol.py` → `brand.py` → `export.mjs`).
