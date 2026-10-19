import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { locales } from "@/lib/i18n";
import { localizedUrl } from "@/lib/seo";

const staticPages = [
  { path: "/", priority: 1, changeFrequency: "monthly" as const },
  { path: "/about-us", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "yearly" as const },
  { path: "/projects", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/credentials", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages = [
    ...staticPages,
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, priority: 0.6, changeFrequency: "yearly" as const })),
  ];

  return pages.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)])),
      },
    })),
  );
}
