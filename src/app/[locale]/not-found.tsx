import Link from "next/link";
import { Container } from "@/components/ui";
import { ar } from "@/i18n/ar";
import { en } from "@/i18n/en";

export const metadata = { title: "404", robots: { index: false, follow: false } };

/** not-found pages receive no route params, so both languages are shown. */
export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="grid gap-12 md:grid-cols-2">
        <div>
          <p className="display text-8xl text-brand">404</p>
          <h1 className="display mt-2 text-4xl">{en.notFound.title}</h1>
          <p className="mt-3 text-lg text-muted">{en.notFound.body}</p>
          <Link href="/" className="btn btn-primary mt-6">
            {en.notFound.home}
          </Link>
        </div>
        <div dir="rtl" lang="ar">
          <h2 className="display text-4xl">{ar.notFound.title}</h2>
          <p className="mt-3 text-lg text-muted">{ar.notFound.body}</p>
          <Link href="/ar" className="btn btn-outline mt-6">
            {ar.notFound.home}
          </Link>
        </div>
      </Container>
    </section>
  );
}
