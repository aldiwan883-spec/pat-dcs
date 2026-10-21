import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/site";
import type { Dictionary } from "@/i18n";
import { localizedPath, type Locale } from "@/lib/i18n";
import { navItems } from "./Header";
import { Icon } from "./Icon";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Image src="/images/brand/pat-lockup-horizontal-reverse.png" alt={company.name[locale]} width={640} height={165} className="h-14 w-auto" />
          <p className="mt-4 max-w-sm text-[1rem] text-white/75">{dict.footer.about}</p>
        </div>

        <nav aria-label={dict.footer.company}>
          <h2 className="eyebrow text-brand-soft">{dict.footer.company}</h2>
          <ul className="mt-4 space-y-2">
            {navItems(dict).map((i) => (
              <li key={i.href}>
                <Link href={localizedPath(locale, i.href)} className="text-white/85 hover:text-brand-soft">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-brand-soft">{dict.footer.contactTitle}</h2>
          <ul className="mt-4 space-y-3 text-white/85">
            <li className="flex items-start gap-3">
              <Icon name="phone" className="mt-1 size-5 shrink-0" />
              <a href={`tel:${company.phone}`} dir="ltr" className="hover:text-brand-soft">
                {company.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="mail" className="mt-1 size-5 shrink-0" />
              <a href={`mailto:${company.email}`} className="hover:text-brand-soft">
                {company.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="pin" className="mt-1 size-5 shrink-0" />
              <span>{company.address[locale]}</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="clock" className="mt-1 size-5 shrink-0" />
              <span>
                {dict.stats.supportValue} · {dict.contact.hoursValue}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto max-w-6xl space-y-2 px-5 py-6 text-sm text-white/65 sm:px-6">
          <p>{dict.footer.trademark}</p>
          <p>
            © {new Date().getFullYear()} {company.legalName} {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
