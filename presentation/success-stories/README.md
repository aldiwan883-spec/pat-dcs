# PAT success stories deck

An editable PowerPoint, with every title, description and label as a live text box, plus a PDF copy.

- `out/PAT-success-stories.pptx`: the editable deck. Install `presentation/fonts/*.ttf` first.
- `out/PAT-success-stories.pdf`: a PDF copy for email.

## Rebuild

```bash
npx tsx presentation/success-stories/export-data.ts                                  # projects.json from src/data/projects.ts
CHROMIUM_PATH=/path/to/chrome node presentation/success-stories/render.mjs           # maps, logos, name tiles
python presentation/success-stories/build.py                                         # needs python-pptx, qrcode
soffice --headless --convert-to pdf --outdir presentation/success-stories/out presentation/success-stories/out/PAT-success-stories.pptx
```

## Content

- `stories.json` holds each project's contractor(s), end user, sector, location and photo choice.
  - Entries with `confirmEndUser: true` are inferred and must be confirmed. They are also flagged in the speaker notes.
- **Logos:** drop an official SVG at `assets/logos/<logo>.svg` (for example `emerson.svg`) and re-run `render.mjs`. Companies without a file get a name tile.
- **Photos:**
  - Site photos go in `assets/photos/<key>.jpg`, with author and licence recorded in `assets/photos/CREDITS.json`.
  - Without a site photo, a PAT photo from `profile/img` is used and captioned as illustrative.
- **Map data:** Natural Earth (public domain).
