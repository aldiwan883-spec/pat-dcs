import Link from "next/link";
import type { ReactNode } from "react";
import { localizedPath, type Locale } from "@/lib/i18n";
import { Icon } from "./Icon";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-6 ${className}`}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  as?: "h1" | "h2";
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className={`eyebrow ${light ? "text-brand-soft" : "text-brand-ink"}`}>{eyebrow}</p>}
      <Tag className={`display mt-2 text-4xl sm:text-5xl ${light ? "text-white" : ""}`}>{title}</Tag>
      {lead && <p className={`mt-4 text-lg sm:text-xl ${light ? "text-white/80" : "text-muted"}`}>{lead}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <section className="bg-navy text-white">
      <Container className="py-14 sm:py-20">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} lead={lead} light />
      </Container>
    </section>
  );
}

export function Breadcrumbs({
  locale,
  label,
  items,
}: {
  locale: Locale;
  label: string;
  items: { name: string; path?: string }[];
}) {
  return (
    <nav aria-label={label} className="text-[0.95rem] text-white/75">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            {item.path ? (
              <Link href={localizedPath(locale, item.path)} className="hover:text-brand-soft">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-white">
                {item.name}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CtaBand({
  locale,
  title,
  body,
  cta,
}: {
  locale: Locale;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <section className="bg-navy text-white">
      <Container className="flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="display text-4xl sm:text-5xl">{title}</h2>
          <p className="mt-3 text-lg text-white/80">{body}</p>
        </div>
        <Link href={localizedPath(locale, "/contact")} className="btn btn-primary shrink-0">
          {cta}
          <Icon name="arrow" className="size-5" flip />
        </Link>
      </Container>
    </section>
  );
}
