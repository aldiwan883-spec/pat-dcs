import { period, type Project } from "@/data/projects";
import { services, type ServiceId } from "@/data/services";
import type { Dictionary } from "@/i18n";
import { locales, localizedPath, type Locale } from "./i18n";

/** Plain, serialisable shape handed to listing components. */
export interface ProjectCard {
  slug: string;
  no: number;
  href: string;
  name: string;
  type: string;
  country: string;
  countryLabel: string;
  platform: string;
  platformLabel: string;
  services: ServiceId[];
  partners: string[];
  period: string;
  figureValue: string;
  figureUnit: string;
  /** Lower-cased text in both languages, used by the search box. */
  search: string;
}

export function toCard(p: Project, locale: Locale, dict: Dictionary): ProjectCard {
  const searchParts = [
    ...locales.flatMap((l) => [p.name[l], p.type[l], p.summary[l]]),
    ...p.partners,
    p.capacity ?? "",
    dict.labels.country[p.country],
    dict.labels.platform[p.platform],
    ...p.services.map((id) => services.find((s) => s.id === id)?.title.en ?? ""),
  ];
  return {
    slug: p.slug,
    no: p.no,
    href: localizedPath(locale, `/projects/${p.slug}`),
    name: p.name[locale],
    type: p.type[locale],
    country: p.country,
    countryLabel: dict.labels.country[p.country],
    platform: p.platform,
    platformLabel: dict.labels.platform[p.platform],
    services: p.services,
    partners: p.partners,
    period: period(p),
    figureValue: p.figure.value,
    figureUnit: p.figure.unit[locale],
    search: searchParts.join(" ").toLowerCase(),
  };
}
