import type { Metadata } from "next";
import { SITE_URL, company } from "@/data/site";
import { locales, localizedPath, ogLocale, type Locale } from "./i18n";

export const localizedUrl = (locale: Locale, path = "/") => {
  const p = localizedPath(locale, path);
  return p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`;
};

export const DEFAULT_OG_IMAGE = "/og/default.jpg";

interface PageMeta {
  locale: Locale;
  /** Locale-less path, e.g. "/projects/damietta-…". */
  path: string;
  title: string;
  description: string;
  /** Use the title as-is instead of appending the site name. */
  absoluteTitle?: boolean;
  image?: string;
  type?: "website" | "article";
}

/** Title, description, canonical, hreflang alternates, Open Graph and Twitter card. */
export function pageMetadata({ locale, path, title, description, absoluteTitle, image, type = "website" }: PageMeta): Metadata {
  const canonical = localizedUrl(locale, path);
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localizedUrl(l, path);
  languages["x-default"] = localizedUrl("en", path);
  const images = [{ url: image ?? DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: company.name[locale] }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type,
      url: canonical,
      title,
      description,
      siteName: "PAT — Power Automation Team",
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}
