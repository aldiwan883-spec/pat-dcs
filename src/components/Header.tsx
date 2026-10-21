import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/site";
import type { Dictionary } from "@/i18n";
import { localizedPath, type Locale } from "@/lib/i18n";
import { SiteNav } from "./SiteNav";

export const navItems = (d: Dictionary) => [
  { href: "/", label: d.nav.home },
  { href: "/about-us", label: d.nav.about },
  { href: "/services", label: d.nav.services },
  { href: "/projects", label: d.nav.projects },
  { href: "/credentials", label: d.nav.credentials },
  { href: "/contact", label: d.nav.contact },
];

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
        <Link href={localizedPath(locale, "/")} className="flex items-center" aria-label={dict.site.name}>
          {locale === "ar" ? (
            <Image src="/images/brand/pat-lockup-arabic-color.png" alt={company.name[locale]} width={740} height={165} className="h-11 w-auto sm:h-12" priority />
          ) : (
            <Image src="/images/brand/pat-lockup-horizontal-color.png" alt={company.name[locale]} width={640} height={165} className="h-11 w-auto sm:h-12" priority />
          )}
        </Link>
        <SiteNav
          locale={locale}
          items={navItems(dict)}
          ctaLabel={dict.common.contactCta}
          switchLabel={dict.common.switchLanguage}
          switchAria={dict.common.switchLanguageLabel}
          menuLabel={dict.common.menu}
          closeLabel={dict.common.closeMenu}
        />
      </div>
    </header>
  );
}
