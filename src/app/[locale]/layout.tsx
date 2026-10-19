import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-500.css";
import "@fontsource/barlow/latin-600.css";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource-variable/cairo/wght.css";
import "../globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/data/site";
import { getDictionary } from "@/i18n";
import { dirOf, isLocale, locales } from "@/lib/i18n";
import { organizationSchema, websiteSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const name = isLocale(locale) ? getDictionary(locale).site.name : "PAT";
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: "PAT",
    title: { default: name, template: "%s | PAT" },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} dir={dirOf(locale)}>
      <body>
        <a
          href="#main"
          className="absolute start-4 top-0 z-50 -translate-y-full rounded-b bg-brand px-4 py-2 font-semibold text-navy focus:translate-y-0"
        >
          {dict.common.skip}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="main">{children}</main>
        <Footer locale={locale} dict={dict} />
        <JsonLd data={[organizationSchema(locale), websiteSchema(locale)]} />
      </body>
    </html>
  );
}
