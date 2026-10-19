export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** A string that exists in every supported language. */
export type L10n = Record<Locale, string>;

export const T = (en: string, ar: string): L10n => ({ en, ar });

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/**
 * English lives at the site root (it keeps the old WordPress URLs valid),
 * Arabic lives under /ar.
 */
export function localizedPath(locale: Locale, path = "/"): string {
  const clean = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Splits a browser pathname into its locale and locale-less path. */
export function splitPathname(pathname: string): { locale: Locale; path: string } {
  const match = pathname.match(/^\/(en|ar)(\/.*)?$/);
  if (match) return { locale: match[1] as Locale, path: match[2] || "/" };
  return { locale: defaultLocale, path: pathname || "/" };
}

export const ogLocale: Record<Locale, string> = { en: "en_US", ar: "ar_EG" };
