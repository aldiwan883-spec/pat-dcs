"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/lib/i18n";

type Status = "idle" | "sending" | "success" | "error";

const field =
  "w-full rounded border border-line bg-white px-4 py-3 text-base text-navy placeholder:text-navy/50 focus:border-navy";

export function ContactForm({ locale, dict, email }: { locale: Locale; dict: Dictionary; email: string }) {
  const t = dict.contact;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = t.required;
    if (!data.email?.trim()) next.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = t.invalidEmail;
    if (!data.message?.trim()) next.message = t.required;
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const label = (id: string, text: string, required = false) => (
    <label htmlFor={id} className="mb-1 block text-sm font-semibold text-muted">
      {text}
      {required && <span aria-hidden="true"> *</span>}
    </label>
  );
  const err = (id: string) =>
    errors[id] ? (
      <p id={`${id}-error`} className="mt-1 text-sm font-medium text-red-700">
        {errors[id]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div>
        {label("name", t.name, true)}
        <input id="name" name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        {err("name")}
      </div>
      <div>
        {label("email", t.email, true)}
        <input id="email" name="email" type="email" dir="ltr" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        {err("email")}
      </div>
      <div>
        {label("phone", t.phone)}
        <input id="phone" name="phone" type="tel" dir="ltr" autoComplete="tel" className={field} />
      </div>
      <div>
        {label("company", t.company)}
        <input id="company" name="company" autoComplete="organization" className={field} />
      </div>
      <div className="sm:col-span-2">
        {label("message", t.message, true)}
        <textarea id="message" name="message" rows={6} placeholder={t.messagePlaceholder} className={field} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />
        {err("message")}
      </div>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-60">
          {status === "sending" ? t.sending : t.submit}
        </button>
        <p role="status" aria-live="polite" className="text-base">
          {status === "success" && <span className="font-semibold text-green-800">{t.success}</span>}
          {status === "error" && (
            <span className="font-semibold text-red-700">
              {t.error}{" "}
              <a href={`mailto:${email}`} className="underline">
                {email}
              </a>
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
