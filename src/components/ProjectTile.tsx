import Link from "next/link";
import type { ProjectCard } from "@/lib/projects";
import { Icon } from "./Icon";

/** Navy project tile: the plant size (or key figure) is the visual anchor. */
export function ProjectTile({ project }: { project: ProjectCard }) {
  const long = project.figureValue.length > 5;
  return (
    <Link
      href={project.href}
      className="group flex min-h-72 flex-col gap-3 rounded-md bg-navy p-6 text-white transition-colors hover:bg-navy-soft"
    >
      <div
        dir="ltr"
        className={`display text-start text-brand-soft ${long ? "text-5xl" : "text-6xl"} leading-[0.95]`}
      >
        {project.figureValue}
      </div>
      <div className="text-sm uppercase tracking-widest text-white/70">
        {project.figureUnit} · {project.countryLabel} · <bdi dir="ltr">{project.period}</bdi>
      </div>
      <h3 className="mt-auto text-xl font-semibold leading-snug">{project.name}</h3>
      <div className="flex items-center justify-between gap-3 text-[0.95rem] text-white/80">
        <span>{project.type}</span>
        <Icon name="arrow" className="size-5 shrink-0 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" flip />
      </div>
    </Link>
  );
}
