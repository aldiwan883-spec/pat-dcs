import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, CtaBand, SectionHeading } from "@/components/ui";
import { Icon, serviceIcon } from "@/components/Icon";
import { ProjectTile } from "@/components/ProjectTile";
import { featuredProjects, projectStats } from "@/data/projects";
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

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Image
          src="/images/control-room-team.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy via-navy/80 to-navy/30 rtl:bg-linear-to-l" />
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

      {/* Services */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading title={t.servicesTitle} lead={t.servicesLead} />
          <div className="mt-10 grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link key={s.id} href={`${href("/services")}#${s.id}`} className="group border-t-4 border-brand pt-4">
                <Icon name={serviceIcon[s.id]} className="size-7 text-brand-ink" />
                <h3 className="mt-3 text-xl font-semibold leading-snug group-hover:text-brand-ink">{s.title[locale]}</h3>
                <p className="mt-2 text-muted">{s.summary[locale]}</p>
              </Link>
            ))}
            <Link
              href={href("/services")}
              className="flex items-center gap-2 border-t-4 border-navy pt-4 text-xl font-semibold hover:text-brand-ink"
            >
              {dict.common.allServices}
              <Icon name="arrow" className="size-5" flip />
            </Link>
          </div>
        </Container>
      </section>

      {/* Selected projects */}
      <section className="pb-16 sm:pb-20">
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
