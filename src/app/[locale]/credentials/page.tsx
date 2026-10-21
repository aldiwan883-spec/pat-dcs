import type { Metadata } from "next";
import Image from "next/image";
import { Container, CtaBand, PageHero } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { experienceCompanies } from "@/data/site";
import { getDictionary } from "@/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { seo } = getDictionary(locale).credentials;
  return pageMetadata({ locale, path: "/credentials", title: seo.title, description: seo.description });
}

export default async function CredentialsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.credentials;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: dict.nav.home, path: "/" },
          { name: dict.nav.credentials, path: "/credentials" },
        ])}
      />
      <PageHero eyebrow={t.eyebrow} title={t.h1} lead={t.lead} image="/images/site/control-room-startup.jpg" />

      <section className="py-14 sm:py-20">
        <Container className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
          <Image
            src="/images/emerson-plaque.jpg"
            alt={t.plaqueAlt}
            width={1200}
            height={1471}
            sizes="(min-width: 768px) 420px, 90vw"
            priority
            className="mx-auto h-auto w-full max-w-md shadow-2xl"
          />
          <div>
            <blockquote className="border-s-4 border-brand ps-5 text-xl italic text-muted" dir="ltr" lang="en">
              “{t.quote}”
            </blockquote>

            <h2 className="display mt-10 text-3xl sm:text-4xl">{t.rolesTitle}</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2" dir="ltr">
              <div>
                <h3 className="font-semibold text-brand-ink">{t.leadEngineer}</h3>
                <ul className="mt-2 space-y-1">
                  {t.leadProjects.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-brand-ink">{t.engineer}</h3>
                <ul className="mt-2 space-y-1">
                  {t.engineerProjects.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-6 text-muted">{t.signedBy}</p>
          </div>
        </Container>
      </section>

      <section className="bg-sand py-14 sm:py-20">
        <Container>
          <h2 className="display text-3xl sm:text-4xl">{t.experienceTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg text-muted">{t.experienceBody}</p>
          <ul className="mt-6 flex flex-wrap gap-2" dir="ltr">
            {experienceCompanies.map((c) => (
              <li key={c} className="rounded-full bg-white px-4 py-1.5 font-medium">
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-3xl text-sm text-muted">{t.disclaimer}</p>
        </Container>
      </section>

      <CtaBand locale={locale} title={dict.home.ctaTitle} body={dict.home.ctaBody} cta={dict.common.contactCta} />
    </>
  );
}
