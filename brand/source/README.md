# Logo source and generators

`pat-logo-source.png` is the approved logo artwork. Everything in `brand/` is generated from it.

| Step | Script | Output |
|---|---|---|
| 1 | `trace.py` (run inside `brand/source/`) | colour masks + first trace |
| 2 | `build_symbol.py` (inside `brand/source/`) | `layers.json`, `bbox.json`, `m-letters.png` — stripes as smooth curves, letters as crisp outlines |
| 3 | `brand.py` (from the repo root) | every SVG in `brand/`, text converted to outlines; `manifest.json` |
| 4 | `export.mjs` (from the repo root) | `png/`, `print/` PDFs, `previews/` |

```bash
npm install                                   # Fontsource fonts used by brand.py
python3 -m venv .venv && .venv/bin/pip install fonttools brotli uharfbuzz numpy pillow scipy vtracer
.venv/bin/python brand/source/brand.py
npm i -D playwright && npx playwright install chromium
node brand/source/export.mjs
```

`letters-bbox.json` sizes the favicon. To add a business card, append to `PEOPLE` in `brand.py`.
The graphic device is placed with `weave(x, y, length, angle, piece="upper"|"lower", scheme)`.
