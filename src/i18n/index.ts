import type { Locale } from "@/lib/i18n";
import { ar } from "./ar";
import { en, type Dictionary } from "./en";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

/** Replaces `{key}` placeholders in a dictionary string. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

export type { Dictionary };
