# PAT company profile

`out/pat-company-profile.pdf` — A4, 16 pages, for e-mail.
`out/pat-company-profile-print-bleed.pdf` — same with 3 mm bleed, for the printer.
`out/pages/` — PNG preview of each page.

Rebuild after changing projects, services or contact details (they come from `src/data`, shared with the website):

```bash
CHROMIUM_PATH=/path/to/chrome npm run profile     # or: npx playwright install chromium
```

Photos: `img/` (selected and resized from `/images`, EXIF removed). Text lives in `build.ts`.
