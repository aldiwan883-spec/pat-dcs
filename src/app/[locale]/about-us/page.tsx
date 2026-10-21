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
  { src: "/images/site/team-site.jpg", w: 1600, h: 1200, alt: { en: "PAT team in PPE in front of a power plant", ar: "فريق PAT بمعدات السلامة أمام محطة كهرباء" } },
  { src: "/images/site/control-room-startup.jpg", w: 1600, h: 1200, alt: { en: "Start-up in a power plant control room", ar: "بدء التشغيل في غرفة تحكم محطة كهرباء" } },
  { src: "/images/site/marshalling-cabinet.jpg", w: 1200, h: 1600, alt: { en: "Marshalling cabinet wiring", ar: "توصيلات كابينة التوزيع" } },
  { src: "/images/site/ovation-gt-panel.jpg", w: 1600, h: 1200, alt: { en: "Ovation operator station on a gas turbine control cabinet", ar: "محطة تشغيل Ovation على كابينة تحكم توربين غازي" } },
  { src: "/images/site/team-night.jpg", w: 1200, h: 1600, alt: { en: "PAT team on a night shift during commissioning", ar: "فريق PAT في وردية ليلية أثناء التشغيل التجريبي" } },
  { src: "/images/site/plant-steam.jpg", w: 1600, h: 1200, alt: { en: "Power plant during start-up", ar: "محطة كهرباء أثناء بدء التشغيل" } },
  { src: "/images/site/io-wiring.jpg", w: 1200, h: 1600, alt: { en: "DCS IO modules and field wiring", ar: "وحدات IO وتوصيلات ميدانية لنظام DCS" } },
  { src: "/images/site/control-room-team.jpg", w: 1600, h: 1200, alt: { en: "Operators working in a power plant control room", ar: "مشغّلون يعملون في غرفة تحكم بمحطة كهرباء" } },
] as const;

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.h1} lead={t.lead} image="/images/site/team-stack.jpg" />

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
