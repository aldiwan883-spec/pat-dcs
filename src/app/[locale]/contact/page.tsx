import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Icon, type IconName } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { Container, PageHero } from "@/components/ui";
import { company } from "@/data/site";
import { getDictionary } from "@/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { seo } = getDictionary(locale).contact;
  return pageMetadata({ locale, path: "/contact", title: seo.title, description: seo.description });
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.contact;

  const rows: { icon: IconName; label: string; node: React.ReactNode }[] = [
    {
      icon: "phone",
      label: t.mainPhone,
      node: (
        <a href={`tel:${company.phone}`} dir="ltr" className="inline-block hover:text-brand-ink">
          {company.phoneDisplay}
        </a>
      ),
    },
    {
      icon: "phone",
      label: t.supportPhone,
      node: (
        <a href={`tel:${company.supportPhone}`} dir="ltr" className="inline-block hover:text-brand-ink">
          {company.supportPhoneDisplay}
        </a>
      ),
    },
    {
      icon: "mail",
      label: t.emailLabel,
      node: (
        <a href={`mailto:${company.email}`} className="hover:text-brand-ink">
          {company.email}
        </a>
      ),
    },
    {
      icon: "mail",
      label: t.salesLabel,
      node: (
        <a href={`mailto:${company.salesEmail}`} className="hover:text-brand-ink">
          {company.salesEmail}
        </a>
      ),
    },
    {
      icon: "mail",
      label: t.serviceLabel,
      node: (
        <a href={`mailto:${company.serviceEmail}`} className="hover:text-brand-ink">
          {company.serviceEmail}
        </a>
      ),
    },
    {
      icon: "pin",
      label: t.addressLabel,
      node: (
        <>
          {company.address[locale]}
          <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-base font-medium text-brand-ink underline underline-offset-4">
            {t.openMap}
          </a>
        </>
      ),
    },
    { icon: "clock", label: t.hoursLabel, node: `${dict.stats.supportValue} · ${t.hoursValue}` },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: dict.nav.home, path: "/" },
          { name: dict.nav.contact, path: "/contact" },
        ])}
      />
      <PageHero eyebrow={t.eyebrow} title={t.h1} lead={t.lead} image="/images/site/team-night.jpg" />

      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative">
            <h2 className="display text-3xl sm:text-4xl">{t.formTitle}</h2>
            <div className="mt-6">
              <ContactForm locale={locale} dict={dict} email={company.email} />
            </div>
          </div>

          <aside className="space-y-5 rounded-md bg-sand p-6 sm:p-8">
            {rows.map((r) => (
              <div key={r.label} className="flex gap-4">
                <Icon name={r.icon} className="mt-1 size-6 shrink-0 text-brand-ink" />
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wider text-muted">{r.label}</div>
                  <div className="text-lg font-medium">{r.node}</div>
                </div>
              </div>
            ))}
            <div className="border-t border-line pt-5">
              <div className="text-sm font-semibold uppercase tracking-wider text-muted">{t.directLines}</div>
              <ul className="mt-2 space-y-1">
                {company.directLines.map((l) => (
                  <li key={l.phone} className="flex flex-wrap justify-between gap-x-4">
                    <span>{l.role[locale]}</span>
                    <a href={`tel:${l.phone}`} dir="ltr" className="font-medium hover:text-brand-ink">
                      {l.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
