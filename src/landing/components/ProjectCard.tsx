import type { CSSProperties } from "react";
import { projectSummary, type Project } from "../../three/data";
import { MagneticHover } from "./MagneticHover";
import { ArrowUpRight, TrophyIcon } from "./icons";
import { Chip } from "./Chip";

type ProjectCardProps = {
  project: Project;
  index: number;
};

/**
 * M3 Expressive card: 28px corners that bloom to 32px on hover, a tonal state
 * layer, an arrow that shifts on the spatial spring, and a gravity pull from
 * its <MagneticHover> wrapper.
 *
 * The card itself never scales — only the wrapper translates — so the title
 * and description stay razor sharp while the card leans toward the pointer.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <MagneticHover strength={8}>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        data-reveal
        style={{ "--reveal-delay": `${90 + index * 90}ms` } as CSSProperties}
        className="m3-card m3-state group relative flex h-full min-h-[248px] flex-col justify-between overflow-hidden border border-outline-variant/60 bg-surface-container p-6 sm:p-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
      <div className="flex items-start justify-between gap-4">
        <span className="m3-label text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="grid h-10 w-10 place-items-center rounded-full border border-outline-variant/70 text-on-surface-variant transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary">
          <ArrowUpRight className="h-4 w-4 transition-transform duration-[var(--md-spring-default-spatial-duration)] ease-[var(--md-spring-default-spatial)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>

      <div className="mt-10">
        <h3 className="m3-title-lg text-on-surface">{project.title}</h3>

        {project.award ? (
          <p className="mt-3 inline-flex items-center gap-2 self-start rounded-full border border-tertiary/40 bg-tertiary/10 px-3 py-1.5 text-tertiary">
            <TrophyIcon className="h-4 w-4 shrink-0" />
            <span className="m3-label">{project.award}</span>
          </p>
        ) : null}

        <p className="m3-body mt-3 text-on-surface-variant">
          {projectSummary(project)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      </div>

      {/* Corner bloom, revealed on hover. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/0 blur-2xl transition-colors duration-300 group-hover:bg-primary/15"
      />
      </a>
    </MagneticHover>
  );
}
