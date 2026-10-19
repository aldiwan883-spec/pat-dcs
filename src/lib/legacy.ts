/**
 * Legacy URLs of the old WordPress site (patdcs.com).
 *
 *  - Real pages keep their URL (/about-us, /services, /projects, /contact).
 *  - /our-team is a permanent redirect (see next.config.ts).
 *  - Spam (casino posts) and template leftovers (solar) answer 410 Gone so
 *    Google drops them quickly.
 *  - WordPress internals answer 410 as well; the WP sitemaps redirect to the
 *    new /sitemap.xml.
 */

const solarPosts = [
  "unlocking-the-power-of-solar-energy-a-comprehensive-guide",
  "the-future-is-solar-advancements-in-solar-technology",
  "how-solar-panels-work-a-closer-look-at-photovoltaic-systems",
  "benefits-of-going-solar-why-switching-to-solar-energy-makes-sense",
  "solar-energy-myths-vs-facts-debunking-common-misconceptions",
  "choosing-the-right-solar-panel-system-for-your-home-or-business",
  "solar-energy-financing-options-making-solar-affordable",
  "maximizing-solar-energy-efficiency-tips-for-optimal-performance",
  "the-environmental-impact-of-solar-energy-a-sustainable-choice",
];

const solarPages = [
  "blog-solar-energy-v2",
  "sun-power-solutions",
  "solar-tech-services",
  "bright-star-solar-services",
  "energy-storage-solutions",
  "high-efficiency-panels",
  "cleaning-and-maintenance",
];

const goneSlugs = new Set([...solarPosts, ...solarPages]);

const goneSegments = new Set([
  "wp-admin",
  "wp-login.php",
  "wp-content",
  "wp-includes",
  "wp-json",
  "wp-cron.php",
  "xmlrpc.php",
  "feed",
  "comments",
  "category",
  "tag",
  "author",
]);

/** Gambling spam injected into the old site (e.g. /casinos-that-accept-paypal-uk-2026). */
const spamPattern = /(casino|betting|gambl|poker|slot-?machine|bonus-?sverige)/i;

export type LegacyAction = { type: "gone" } | { type: "redirect"; to: string } | { type: "none" };

export function legacyAction(pathname: string): LegacyAction {
  const path = pathname.replace(/\/+$/, "") || "/";
  const first = path.split("/")[1] ?? "";

  if (first.startsWith("wp-sitemap")) return { type: "redirect", to: "/sitemap.xml" };
  if (goneSegments.has(first)) return { type: "gone" };
  if (path.split("/").length === 2 && goneSlugs.has(first)) return { type: "gone" };
  if (spamPattern.test(first)) return { type: "gone" };
  return { type: "none" };
}
