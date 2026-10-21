import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, CtaBand, SectionHeading, Weave } from "@/components/ui";
import { ClientWall } from "@/components/ClientWall";
import { Icon, serviceIcon } from "@/components/Icon";
import { ProjectTile } from "@/components/ProjectTile";
import { featuredProjects, projectStats, projects } from "@/data/projects";
import { services } from "@/data/services";
import { company, experienceCompanies } from "@/data/site";
import { getDictionary } from "@/i18n";
import { localizedPath } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { toCard } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { seo } = getDictionary(locale).home;
  return pageMetadata({ locale, path: "/", title: seo.title, description: seo.description, absoluteTitle: true });
}

const onSite: { src: string; span?: string; alt: { en: string; ar: string } }[] = [
  { src: "/images/site/control-room-startup.jpg", span: "col-span-2 row-span-2", alt: { en: "PAT engineers at the DCS operator stations during start-up", ar: "مهندسو PAT أمام محطات تشغيل DCS أثناء بدء التشغيل" } },
  { src: "/images/site/marshalling-cabinet.jpg", alt: { en: "Marshalling cabinet during loop checks", ar: "كابينة توزيع أثناء فحص الحلقات" } },
  { src: "/images/site/ovation-gt-panel.jpg", alt: { en: "Ovation operator panel on a gas-turbine control cabinet", ar: "لوحة تشغيل Ovation على كابينة تحكم توربين غازي" } },
  { src: "/images/site/team-crane.jpg", alt: { en: "PAT team on site in front of a power plant", ar: "فريق PAT في الموقع أمام محطة كهرباء" } },
  { src: "/images/site/io-modules.jpg", alt: { en: "DCS IO modules inside a control cabinet", ar: "وحدات IO داخل كابينة تحكم" } },
];

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.home;
  const href = (p: string) => localizedPath(locale, p);

  const stats = [
    { value: String(company.founded), label: dict.stats.established },
    { value: String(projectStats.total), label: dict.stats.projects },
    { value: String(projectStats.countries), label: dict.stats.countries },
    { value: dict.stats.supportValue, label: dict.stats.support },
  ];

  const byCountry = (["egypt", "saudi-arabia", "oman"] as const).map((country) => ({
    country,
    count: projects.filter((p) => p.country === country).length,
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Image
          src="/images/site/team-site.jpg"
          alt={t.heroAlt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy via-navy/85 to-navy/20 rtl:bg-linear-to-l" />
        <Weave className="-right-36 -top-48 -z-10 hidden w-[36rem] lg:block rtl:right-auto rtl:-left-36" />
        <Container className="py-20 sm:py-28 lg:py-32">
          <p className="eyebrow text-brand-soft">{t.eyebrow}</p>
          <h1 className="display mt-4 max-w-3xl text-5xl sm:text-7xl lg:text-8xl">{t.h1}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">{t.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={href("/projects")} className="btn btn-primary">
              {dict.common.viewProjects}
            </Link>
            <Link href={href("/contact")} className="btn btn-light">
              {dict.common.contactCta}
            </Link>
          </div>
        </Container>
      </section>

      {/* Stats (computed from the data, never hand-typed) */}
      <section className="bg-sand">
        <Container>
          <dl className="grid grid-cols-2 gap-6 py-9 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-3">
                <dd className="display order-first text-5xl sm:text-6xl" dir="ltr">
                  {s.value}
                </dd>
                <dt className="text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Trusted by */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={t.trustedEyebrow} title={t.trustedTitle} />
          <div className="mt-10">
            <ClientWall contractors={t.trustedContractors} owners={t.trustedOwners} />
          </div>
          <p className="mt-6 text-sm text-muted">{t.trustedNote}</p>
        </Container>
      </section>

      {/* Services */}
      <section className="bg-sand py-16 sm:py-20">
        <Container>
          <SectionHeading title={t.servicesTitle} lead={t.servicesLead} />
          <div className="mt-10 grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link key={s.id} href={`${href("/services")}#${s.id}`} className="group overflow-hidden rounded-md bg-white shadow-sm">
                <div className="relative aspect-4/3 overflow-hidden bg-navy">
                  <Image
                    src={s.photo}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="border-t-4 border-brand p-5">
                  <Icon name={serviceIcon[s.id]} className="size-7 text-brand-ink" />
                  <h3 className="mt-3 text-xl font-semibold leading-snug group-hover:text-brand-ink">{s.title[locale]}</h3>
                  <p className="mt-2 text-muted">{s.summary[locale]}</p>
                </div>
              </Link>
            ))}
            <Link
              href={href("/services")}
              className="relative isolate flex min-h-48 items-end gap-2 overflow-hidden rounded-md bg-navy p-5 text-xl font-semibold text-white hover:text-brand-soft"
            >
              <Weave className="-right-20 -top-10 -z-10 w-80 opacity-80 rtl:right-auto rtl:-left-20" />
              {dict.common.allServices}
              <Icon name="arrow" className="size-5" flip />
            </Link>
          </div>
        </Container>
      </section>

      {/* On site: real photos only */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={t.onSiteEyebrow} title={t.onSiteTitle} lead={t.onSiteLead} />
          <ul className="mt-10 grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[14rem] md:grid-cols-4">
            {onSite.map((p) => (
              <li key={p.src} className={`relative overflow-hidden rounded-md bg-navy ${p.span ?? ""}`}>
                <Image src={p.src} alt={p.alt[locale]} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Where we have worked */}
      <section className="bg-navy text-white">
        <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.5fr_1fr]">
          <Image
            src="/images/site/region-map.png"
            alt={t.mapAlt}
            width={1600}
            height={922}
            sizes="(min-width: 1024px) 640px, 92vw"
            className="h-auto w-full rounded-md"
          />
          <div>
            <SectionHeading eyebrow={t.whereEyebrow} title={t.whereTitle} lead={t.whereLead} light />
            <dl className="mt-8 space-y-4">
              {byCountry.map((c) => (
                <div key={c.country} className="flex items-baseline gap-4 border-b border-white/15 pb-3">
                  <dd className="display w-16 text-5xl text-brand-soft" dir="ltr">
                    {c.count}
                  </dd>
                  <dt className="text-lg">
                    <Link href={`${href("/projects")}?country=${c.country}`} className="hover:text-brand-soft">
                      {dict.labels.country[c.country]}
                    </Link>
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Selected projects */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading title={t.projectsTitle} lead={t.projectsLead} />
            <Link href={href("/projects")} className="font-semibold text-brand-ink underline underline-offset-4">
              {dict.common.allProjects} ({projectStats.total})
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((p) => (
              <li key={p.slug}>
                <ProjectTile project={toCard(p, locale, dict)} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Credentials */}
      <section className="bg-sand">
        <Container className="grid items-center gap-10 py-16 sm:py-20 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow text-brand-ink">{t.credentialsEyebrow}</p>
            <h2 className="display mt-2 text-4xl sm:text-5xl">{t.credentialsTitle}</h2>
            <p className="mt-5 max-w-xl text-lg text-muted">{t.credentialsBody}</p>
            <Link href={href("/credentials")} className="btn btn-outline mt-7">
              {t.credentialsLink}
            </Link>
          </div>
          <Image
            src="/images/emerson-plaque.jpg"
            alt={dict.credentials.plaqueAlt}
            width={1200}
            height={1471}
            sizes="(min-width: 768px) 380px, 90vw"
            className="mx-auto h-auto w-full max-w-sm shadow-2xl"
          />
        </Container>
      </section>

      {/* Why PAT + experience */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading title={t.whyTitle} />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.why.map((w) => (
              <div key={w.title}>
                <h3 className="text-xl font-semibold">{w.title}</h3>
                <p className="mt-2 text-muted">{w.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 rounded-md border border-line p-6 sm:p-8">
            <h3 className="display text-3xl">{t.experienceTitle}</h3>
            <p className="mt-3 text-muted">{t.experienceBody}</p>
            <ul className="mt-4 flex flex-wrap gap-2" dir="ltr">
              {experienceCompanies.map((c) => (
                <li key={c} className="rounded-full bg-sand px-4 py-1.5 font-medium">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CtaBand locale={locale} title={t.ctaTitle} body={t.ctaBody} cta={dict.common.contactCta} />
    </>
  );
}
