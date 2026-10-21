import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ProjectsLibrary } from "@/components/ProjectsLibrary";
import { Container, PageHero } from "@/components/ui";
import { countryIds, projectStats, sortedProjects } from "@/data/projects";
import { services } from "@/data/services";
import { fmt, getDictionary } from "@/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { toCard } from "@/lib/projects";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/data/site";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { seo } = getDictionary(locale).projects;
  const v = { n: projectStats.total };
  return pageMetadata({ locale, path: "/projects", title: fmt(seo.title, v), description: fmt(seo.description, v) });
}

export default async function ProjectsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.projects;
  const cards = sortedProjects.map((p) => toCard(p, locale, dict));

  const platformIds = [...new Set(cards.map((c) => c.platform))];
  const countries = countryIds.map((id) => ({ value: id, label: dict.labels.country[id] }));
  const serviceOptions = services.map((s) => ({ value: s.id, label: s.title[locale] }));
  const platforms = platformIds.map((id) => ({
    value: id,
    label: dict.labels.platform[id as keyof typeof dict.labels.platform],
  }));

  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.h1,
    numberOfItems: cards.length,
    itemListElement: cards.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}${c.href}`,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(locale, [
            { name: dict.nav.home, path: "/" },
            { name: dict.nav.projects, path: "/projects" },
          ]),
          list,
        ]}
      />
      <PageHero
        eyebrow={t.eyebrow}
        title={t.h1}
        lead={fmt(t.lead, { n: projectStats.total, c: projectStats.countries })}
        image="/images/site/control-room-team.jpg"
      />
      <section className="py-12 sm:py-16">
        <Container>
          <ProjectsLibrary
            items={cards}
            countries={countries}
            services={serviceOptions}
            platforms={platforms}
            labels={{
              searchLabel: t.searchLabel,
              searchPlaceholder: t.searchPlaceholder,
              filterCountry: t.filterCountry,
              filterService: t.filterService,
              filterPlatform: t.filterPlatform,
              all: t.all,
              showing: t.showing,
              reset: t.reset,
              empty: t.empty,
            }}
          />
        </Container>
      </section>
    </>
  );
}
