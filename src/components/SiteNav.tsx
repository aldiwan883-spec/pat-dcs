"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { localizedPath, splitPathname, type Locale } from "@/lib/i18n";
import { Icon } from "./Icon";

interface Props {
  locale: Locale;
  items: { href: string; label: string }[];
  ctaLabel: string;
  switchLabel: string;
  switchAria: string;
  menuLabel: string;
  closeLabel: string;
}

export function SiteNav({ locale, items, ctaLabel, switchLabel, switchAria, menuLabel, closeLabel }: Props) {
  const { path } = splitPathname(usePathname());
  const [open, setOpen] = useState(false);
  const other: Locale = locale === "en" ? "ar" : "en";

  const isActive = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));
  const link = (href: string, label: string, mobile = false) => (
    <Link
      key={href}
      href={localizedPath(locale, href)}
      onClick={() => setOpen(false)}
      aria-current={isActive(href) ? "page" : undefined}
      className={`font-medium transition-colors hover:text-brand-ink ${
        isActive(href) ? "text-brand-ink" : "text-navy"
      } ${mobile ? "block border-b border-line py-3 text-lg" : "text-[1.0625rem]"}`}
    >
      {label}
    </Link>
  );

  const switcher = (
    <Link
      href={localizedPath(other, path)}
      lang={other}
      hrefLang={other}
      aria-label={switchAria}
      className="rounded-full border border-line px-4 py-1.5 text-base font-medium hover:border-navy"
    >
      {switchLabel}
    </Link>
  );

  return (
    <>
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
        {items.map((i) => link(i.href, i.label))}
        {switcher}
        <Link href={localizedPath(locale, "/contact")} className="btn btn-primary !min-h-11 !px-5">
          {ctaLabel}
        </Link>
      </nav>

      <button
        type="button"
        className="flex size-11 items-center justify-center rounded border border-line lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? closeLabel : menuLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Primary"
          className="absolute inset-x-0 top-full border-b border-line bg-white px-5 pb-5 shadow-lg lg:hidden"
        >
          {items.map((i) => link(i.href, i.label, true))}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {switcher}
            <Link href={localizedPath(locale, "/contact")} onClick={() => setOpen(false)} className="btn btn-primary">
              {ctaLabel}
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
