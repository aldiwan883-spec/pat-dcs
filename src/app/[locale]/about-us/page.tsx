import type { Metadata } from "next";
import Image from "next/image";
import { Container, CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { experienceCompanies } from "@/data/site";
import { getDictionary } from "@/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { seo } = getDictionary(locale).about;
  return pageMetadata({ locale, path: "/about-us", title: seo.title, description: seo.description });
}

const gallery = [
  { src: "/images/control-room-operators.jpg", w: 1600, h: 1200, alt: { en: "Operators working in a power plant control room", ar: "مشغّلون يعملون في غرفة تحكم بمحطة كهرباء" } },
  { src: "/images/ovation-gt-hmi.jpg", w: 1400, h: 1050, alt: { en: "Ovation operator station on a gas turbine control cabinet", ar: "محطة تشغيل Ovation على كابينة تحكم توربين غازي" } },
  { src: "/images/dcs-cabinet.jpg", w: 1000, h: 1333, alt: { en: "DCS cabinet with IO modules", ar: "كابينة نظام DCS بوحدات IO" } },
  { src: "/images/operator-workstation.jpg", w: 1400, h: 1050, alt: { en: "Engineer at a DCS operator workstation", ar: "مهندس أمام محطة تشغيل نظام DCS" } },
] as const;

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.h1} lead={t.lead} />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-4xl">{t.storyTitle}</h2>
            <div className="prose-pat mt-5 text-lg text-muted">
              {t.story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <h3 className="mt-10 text-2xl font-semibold">{t.approachTitle}</h3>
            <p className="mt-2 text-lg text-muted">{t.approach}</p>
          </div>
          <div className="rounded-md bg-sand p-6 sm:p-8">
            <h3 className="display text-3xl">{dict.credentials.experienceTitle}</h3>
            <p className="mt-3 text-muted">{dict.home.experienceBody}</p>
            <ul className="mt-4 flex flex-wrap gap-2" dir="ltr">
              {experienceCompanies.map((c) => (
                <li key={c} className="rounded-full bg-white px-4 py-1.5 font-medium">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-sand py-16 sm:py-20">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="display text-4xl">{t.visionTitle}</h2>
            <p className="mt-4 text-lg text-muted">{t.vision}</p>
          </div>
          <div>
            <h2 className="display text-4xl">{t.missionTitle}</h2>
            <p className="mt-4 text-lg text-muted">{t.mission}</p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="display text-4xl">{t.valuesTitle}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {t.values.map((v, i) => (
              <li key={v} className="border-t-4 border-brand pt-3">
                <span className="display text-3xl text-brand-ink" dir="ltr">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 text-lg font-semibold">{v}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container>
          <SectionHeading title={t.galleryTitle} lead={t.galleryLead} />
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((g) => (
              <li key={g.src} className="relative aspect-4/3 overflow-hidden rounded-md bg-sand">
                <Image src={g.src} alt={g.alt[locale]} width={g.w} height={g.h} sizes="(min-width: 768px) 25vw, 50vw" className="size-full object-cover" />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand locale={locale} title={dict.home.ctaTitle} body={dict.home.ctaBody} cta={dict.common.contactCta} />
    </>
  );
}
