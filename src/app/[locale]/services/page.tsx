import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, CtaBand, PageHero } from "@/components/ui";
import { Icon, serviceIcon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { fmt, getDictionary } from "@/i18n";
import { localizedPath } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { ORG_ID, breadcrumbSchema } from "@/lib/schema";
import { localizedUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { seo } = getDictionary(locale).services;
  return pageMetadata({ locale, path: "/services", title: seo.title, description: seo.description });
}

export default async function ServicesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.services;

  const schema = [
    breadcrumbSchema(locale, [
      { name: dict.nav.home, path: "/" },
      { name: dict.nav.services, path: "/services" },
    ]),
    ...services.map((s) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${localizedUrl(locale, "/services")}#${s.id}`,
      name: s.title[locale],
      description: s.summary[locale],
      provider: { "@id": ORG_ID },
      areaServed: ["Egypt", "Saudi Arabia", "Oman"],
      inLanguage: locale,
    })),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <PageHero eyebrow={t.eyebrow} title={t.h1} lead={t.lead} image="/images/site/plant-steam.jpg" />

      <section className="py-14 sm:py-20">
        <Container className="space-y-6">
          {services.map((s, i) => {
            const related = projects.filter((p) => p.services.includes(s.id)).length;
            return (
              <article
                key={s.id}
                id={s.id}
                className="grid scroll-mt-24 overflow-hidden rounded-md border border-line md:grid-cols-[0.8fr_1fr_1.1fr]"
              >
                <div className="relative min-h-56 bg-navy">
                  <Image src={s.photo} alt="" fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-brand-ink">
                    <Icon name={serviceIcon[s.id]} className="size-8" />
                    <span className="display text-2xl" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="display mt-3 text-3xl sm:text-4xl">{s.title[locale]}</h2>
                  <p className="mt-3 text-lg text-muted">{s.summary[locale]}</p>
                </div>
                <div className="p-6 pt-0 sm:p-8 md:ps-0">
                  <h3 className="eyebrow text-brand-ink">{t.scope}</h3>
                  <ul className="mt-3 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b.en} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-brand" />
                        <span>{b[locale]}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`${localizedPath(locale, "/projects")}?service=${s.id}`}
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-ink underline underline-offset-4"
                  >
                    {fmt(t.relatedProjects, { n: related })}
                    <Icon name="arrow" className="size-5" flip />
                  </Link>
                </div>
              </article>
            );
          })}
        </Container>
      </section>

      <CtaBand locale={locale} title={t.ctaTitle} body={t.ctaBody} cta={dict.common.contactCta} />
    </>
  );
}
