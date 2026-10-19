"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectCard } from "@/lib/projects";
import { Icon } from "./Icon";
import { ProjectTile } from "./ProjectTile";

interface Option {
  value: string;
  label: string;
}

interface Props {
  items: ProjectCard[];
  countries: Option[];
  services: Option[];
  platforms: Option[];
  labels: {
    searchLabel: string;
    searchPlaceholder: string;
    filterCountry: string;
    filterService: string;
    filterPlatform: string;
    all: string;
    showing: string;
    reset: string;
    empty: string;
  };
}

type Filters = { q: string; country: string; service: string; platform: string };
const empty: Filters = { q: "", country: "", service: "", platform: "" };

const selectClass =
  "w-full rounded border border-line bg-white px-3 py-3 text-base text-navy focus:border-navy";

/**
 * Every project is rendered on the server (good for search engines); the
 * filters only hide cards in the browser. Filter state lives in the URL query
 * (?country=egypt&service=dcs&platform=ovation&q=…) so views can be shared.
 */
export function ProjectsLibrary({ items, countries, services, platforms, labels }: Props) {
  const [f, setF] = useState<Filters>(empty);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setF({
      q: p.get("q") ?? "",
      country: p.get("country") ?? "",
      service: p.get("service") ?? "",
      platform: p.get("platform") ?? "",
    });
  }, []);

  const update = (patch: Partial<Filters>) => {
    const next = { ...f, ...patch };
    setF(next);
    const p = new URLSearchParams();
    (Object.keys(next) as (keyof Filters)[]).forEach((k) => next[k] && p.set(k, next[k]));
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  const visible = useMemo(() => {
    const tokens = f.q.toLowerCase().split(/\s+/).filter(Boolean);
    return new Set(
      items
        .filter(
          (i) =>
            (!f.country || i.country === f.country) &&
            (!f.service || i.services.includes(f.service as ProjectCard["services"][number])) &&
            (!f.platform || i.platform === f.platform) &&
            tokens.every((t) => i.search.includes(t)),
        )
        .map((i) => i.slug),
    );
  }, [items, f]);

  const filtered = f.q || f.country || f.service || f.platform;
  const select = (id: string, label: string, value: string, options: Option[], key: keyof Filters) => (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-muted">
        {label}
      </label>
      <select id={id} className={selectClass} value={value} onChange={(e) => update({ [key]: e.target.value })}>
        <option value="">{labels.all}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      <div className="grid gap-4 rounded-md bg-sand p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="project-search" className="mb-1 block text-sm font-semibold text-muted">
            {labels.searchLabel}
          </label>
          <div className="relative">
            <Icon name="search" className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <input
              id="project-search"
              type="search"
              value={f.q}
              placeholder={labels.searchPlaceholder}
              onChange={(e) => update({ q: e.target.value })}
              className={`${selectClass} ps-10`}
            />
          </div>
        </div>
        {select("f-country", labels.filterCountry, f.country, countries, "country")}
        {select("f-service", labels.filterService, f.service, services, "service")}
        {select("f-platform", labels.filterPlatform, f.platform, platforms, "platform")}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
        <p className="text-muted">
          {labels.showing.replace("{shown}", String(visible.size)).replace("{n}", String(items.length))}
        </p>
        {filtered && (
          <button type="button" onClick={() => update(empty)} className="font-semibold text-brand-ink underline underline-offset-4">
            {labels.reset}
          </button>
        )}
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug} hidden={!visible.has(item.slug)}>
            <ProjectTile project={item} />
          </li>
        ))}
      </ul>
      {visible.size === 0 && <p className="mt-8 text-lg text-muted">{labels.empty}</p>}
    </div>
  );
}
