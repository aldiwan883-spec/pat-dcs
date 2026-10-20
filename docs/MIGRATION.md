# Migration, SEO and go-live runbook

The old site (patdcs.com, WordPress + Elementor) must be treated as **compromised** until proven
otherwise: it served a hidden Swedish casino-bonus block on the home page (links to
`casinobonussverige.com` and `digitfans.site`) and its sitemap listed 10 casino posts
(`/casinos-that-accept-*-uk-2026`) plus ~16 leftover solar-template posts and pages.

## 1. Before / alongside the cut-over (old WordPress)

- [ ] Change every password: WordPress admins, hosting panel, FTP/SSH, database, domain registrar, e-mail.
- [ ] Review users (`wp-sitemap-users-1.xml` exposed them); delete unknown admins.
- [ ] Take a full backup, then remove the injected block and unknown plugins/themes (the hidden
      `div.wm-hl-b` appears between Elementor widgets, so look for a plugin/theme filter, not page content).
- [ ] Ask who holds hosting/admin access (the footer credits the original web agency).
- [ ] Do not leave the old site online after DNS moves; the spam URLs must answer 410 from the new site.

## 2. URL map (implemented in code)

| Old URL | New behaviour |
|---|---|
| `/`, `/about-us`, `/services`, `/projects`, `/contact` | **Same URL**, new page (English) |
| `/our-team` | 301/308 → `/about-us` |
| `/<slug>/` with trailing slash | 308 → without slash (`src/proxy.ts`) |
| `/wp-sitemap*.xml` | 301 → `/sitemap.xml` |
| `/casinos-that-accept-*`, anything matching casino/betting/gambling/poker/slots | **410 Gone** |
| 9 solar blog posts, 7 solar template pages, `/blog-solar-energy-v2` | **410 Gone** |
| `/wp-admin`, `/wp-login.php`, `/wp-content/*`, `/wp-json/*`, `/xmlrpc.php`, `/feed`, `/category/*`, `/tag/*`, `/author/*` | **410 Gone** |
| `/en/*` | 308 → `/*` (English lives at the root) |

The old site had no per-project pages, so there are no project URLs to preserve; the new
`/projects/<slug>` pages are additional indexable content (28 × 2 languages).
Full lists: `src/lib/legacy.ts`. Test after deploy: `curl -sI https://patdcs.com/casinos-that-accept-paypal-uk-2026` → `410`.

## 3. Technical SEO included

- Unique `<title>` and meta description per page and language; canonical URLs.
- `hreflang` (`en`, `ar`, `x-default`) on every page and in `sitemap.xml`.
- `sitemap.xml` (6 pages + 28 projects, both languages) and `robots.txt`.
- JSON-LD: `Organization`/`ProfessionalService` (founding year, address, phones, areas served),
  `WebSite`, `BreadcrumbList`, `Service` list, project `ItemList`.
- Open Graph / Twitter cards (`public/og/default.jpg`).
- Static pre-rendering, optimised images (AVIF/WebP), security headers, no third-party scripts or fonts.
- Statistics are computed from the data (no hand-typed counters like the old broken `0%` ones).

## 4. Go-live checklist

1. Set `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` on the host; verify the sending domain in Resend.
2. Deploy to a Next.js host (Vercel or any Node host: `npm run build && npm start`).
3. Smoke test: every URL in section 2, the contact form, `/ar`, the language switcher.
4. Lower DNS TTL a day ahead; switch DNS; keep the old host offline or isolated afterwards.
5. Google Search Console: add the domain property, submit `https://patdcs.com/sitemap.xml`,
   inspect `/` and `/projects`, and use **Removals** for the old casino URLs (410 will also clear them over time).
   Check *Security issues* and *Manual actions* for hacked-content warnings and request a review if present.
6. Bing Webmaster Tools: import from Search Console.
7. Check `site:patdcs.com casino` in Google a week later; keep the 410 rules permanently.
8. Marketing: register a Google Business Profile for the New Damietta address, and use the
   project pages as landing pages for campaigns.

## 5. Not covered by code (needs a person)

- Real project photos and documents (publish only what clients allow).
- Printed colour proof for the business cards and letterhead (navy and orange).
- Rate limiting / CAPTCHA for the contact form beyond the built-in honeypot and per-instance limiter.
