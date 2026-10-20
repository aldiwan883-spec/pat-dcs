import { SITE_URL, company } from "@/data/site";
import type { Locale } from "./i18n";
import { localizedUrl } from "./seo";

export const ORG_ID = `${SITE_URL}/#organization`;

export function organizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: company.legalName,
    alternateName: ["PAT", company.name.en, company.name.ar],
    url: SITE_URL,
    logo: `${SITE_URL}/images/brand/pat-symbol-color-256.png`,
    image: `${SITE_URL}/og/default.jpg`,
    description:
      locale === "ar"
        ? "باور أوتوميشن تيم: تشغيل وتسليم أنظمة DCS والقياس والتحكم لمحطات الكهرباء في مصر والسعودية وعُمان منذ 1991."
        : "Power Automation Team: DCS commissioning, I&C testing, start-up, training and technical staffing for power plants in Egypt, Saudi Arabia and Oman since 1991.",
    foundingDate: String(company.founded),
    founder: { "@type": "Person", name: company.owner.en },
    email: company.email,
    telephone: company.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.addressParts.street,
      addressLocality: company.addressParts.locality,
      addressCountry: company.addressParts.country,
    },
    areaServed: ["Egypt", "Saudi Arabia", "Oman"].map((name) => ({ "@type": "Country", name })),
    knowsAbout: [
      "Distributed control systems (DCS)",
      "Emerson Ovation",
      "Emerson DeltaV",
      "Power plant commissioning",
      "I&C loop and device testing",
      "PLC integration",
      "Operation and maintenance training",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: company.phone,
        email: company.serviceEmail,
        availableLanguage: ["English", "Arabic"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
      },
      { "@type": "ContactPoint", contactType: "sales", email: company.salesEmail, telephone: company.phone, availableLanguage: ["English", "Arabic"] },
    ],
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: localizedUrl(locale, "/"),
    name: "PAT — Power Automation Team",
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(locale: Locale, crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: localizedUrl(locale, c.path),
    })),
  };
}
