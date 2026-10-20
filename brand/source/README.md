# Logo source and generators

`pat-logo-source.png` is the approved logo artwork. Everything in `brand/` is generated from it:

1. `trace.py` — splits the artwork into navy / blue / orange masks and traces them (needs `vtracer`, `numpy`, `pillow`). Run inside `brand/source/`.
2. `build_symbol.py` — re-traces stripes as smooth curves and the letters as crisp polygons → `layers.json`, `bbox.json`, `m-letters.png`.
3. `brand.py` — writes every SVG (symbol variants, lockups, favicon, business card, letterhead) with text converted to outlines
   (needs `fonttools`, `brotli`, `uharfbuzz`; run from the repository root after `npm install` so the Fontsource fonts exist).
4. `export.mjs` — renders PNGs and print PDFs with Playwright/Chromium (`npm i -D playwright` first).

To make a card for another person, call `card_front(...)` in `brand.py` with their name, title and phone.
