import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { ProjectTile } from "@/components/ProjectTile";
import { Breadcrumbs, Container, CtaBand, Weave } from "@/components/ui";
import { period, projectBySlug, projects, type Project } from "@/data/projects";
import { serviceById } from "@/data/services";
import { getDictionary } from "@/i18n";
import { localizedPath, locales, type Locale } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import { toCard } from "@/lib/projects";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

const clip = (s: string, max = 155) => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, "")}…`);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const project = projectBySlug(slug);
  if (!project) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: `${project.name[locale]} — ${project.type[locale]}`,
    description: clip(`${project.summary[locale]} ${dict.labels.country[project.country]}, ${period(project)}.`),
    image: project.images?.[0]?.src,
  });
}

/** Up to three other projects: same country or sharing a service first. */
function relatedTo(project: Project): Project[] {
  return projects
    .filter((p) => p.slug !== project.slug)
    .map((p) => ({
      p,
      score:
        (p.country === project.country ? 2 : 0) +
        p.services.filter((s) => project.services.includes(s)).length +
        (p.platform === project.platform && p.platform !== "other" ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || (b.p.end ?? b.p.start) - (a.p.end ?? a.p.start))
    .slice(0, 3)
    .map((x) => x.p);
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const locale: Locale = await resolveLocale(params);
  const project = projectBySlug(slug);
  if (!project) notFound();

  const dict = getDictionary(locale);
  const t = dict.project;
  const country = dict.labels.country[project.country];
  const crumbs = [
    { name: dict.nav.home, path: "/" },
    { name: dict.nav.projects, path: "/projects" },
    { name: project.name[locale], path: `/projects/${project.slug}` },
  ];

  const facts: { label: string; value: string; ltr?: boolean }[] = [
    { label: t.country, value: country },
    { label: t.period, value: period(project), ltr: true },
    ...(project.capacity ? [{ label: t.capacity, value: project.capacity, ltr: true }] : []),
    ...(project.platform !== "other" ? [{ label: t.platform, value: dict.labels.platform[project.platform] }] : []),
    ...(project.partners.length ? [{ label: t.partners, value: project.partners.join(" · "), ltr: true }] : []),
    { label: t.projectNumber, value: String(project.no).padStart(2, "0"), ltr: true },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(locale, crumbs)} />

      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Weave className="-bottom-24 -right-24 -z-10 hidden w-[34rem] opacity-90 md:block rtl:right-auto rtl:-left-24" />
        <Container className="py-12 sm:py-16">
          <Breadcrumbs
            locale={locale}
            label={dict.common.breadcrumb}
            items={[
              { name: crumbs[0].name, path: "/" },
              { name: crumbs[1].name, path: "/projects" },
              { name: crumbs[2].name },
            ]}
          />
          <p className="eyebrow mt-6 text-brand-soft">{project.type[locale]}</p>
          <h1 className="display mt-2 max-w-4xl text-4xl sm:text-6xl">{project.name[locale]}</h1>
          <ul className="mt-6 flex flex-wrap gap-2 text-[0.95rem]">
            {[country, period(project), ...(project.platform !== "other" ? [dict.labels.platform[project.platform]] : [])].map((tag) => (
              <li key={tag} className="rounded-full border border-white/30 px-3 py-1">
                <bdi dir="ltr">{tag}</bdi>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="display text-3xl sm:text-4xl">{t.summary}</h2>
            <p className="mt-4 text-xl text-muted">{project.summary[locale]}</p>

            <h2 className="display mt-12 text-3xl sm:text-4xl">{t.scope}</h2>
            <ul className="mt-5 space-y-3 text-lg">
              {project.scope.map((line) => (
                <li key={line.en} className="flex gap-3">
                  <span aria-hidden="true" className="mt-3 size-2 shrink-0 rounded-full bg-brand" />
                  <span>{line[locale]}</span>
                </li>
              ))}
            </ul>

            {project.images && project.images.length > 0 && (
              <ul className="mt-12 grid gap-3 sm:grid-cols-2">
                {project.images.map((img) => (
                  <li key={img.src}>
                    <Image src={img.src} alt={img.alt[locale]} width={1200} height={900} className="h-auto w-full rounded-md" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="h-fit space-y-6 rounded-md bg-sand p-6 sm:p-8">
            <div className="border-b border-line pb-6">
              <div dir="ltr" className="display text-start text-6xl text-brand-ink">
                {project.figure.value}
              </div>
              <div className="mt-1 text-muted">{project.figure.unit[locale]}</div>
            </div>
            <dl className="space-y-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-muted">{f.label}</dt>
                  <dd className="mt-0.5 text-lg font-medium" dir={f.ltr ? "ltr" : undefined}>
                    <span className="inline-block text-start">{f.value}</span>
                  </dd>
                </div>
              ))}
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-muted">{t.services}</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {project.services.map((id) => (
                    <Link
                      key={id}
                      href={`${localizedPath(locale, "/services")}#${id}`}
                      className="rounded-full bg-white px-3 py-1 text-[0.95rem] font-medium hover:text-brand-ink"
                    >
                      {serviceById(id).title[locale]}
                    </Link>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>
        </Container>
      </section>

      <section className="bg-sand py-14 sm:py-20">
        <Container>
          <h2 className="display text-3xl sm:text-4xl">{t.related}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTo(project).map((p) => (
              <li key={p.slug}>
                <ProjectTile project={toCard(p, locale, dict)} />
              </li>
            ))}
          </ul>
          <Link href={localizedPath(locale, "/projects")} className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-ink underline underline-offset-4">
            {dict.common.allProjects}
            <Icon name="arrow" className="size-5" flip />
          </Link>
        </Container>
      </section>

      <CtaBand locale={locale} title={t.ctaTitle} body={t.ctaBody} cta={dict.common.contactCta} />
    </>
  );
}
