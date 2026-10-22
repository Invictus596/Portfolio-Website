import { PROJECTS, PROFILE } from "../../three/data";
import { MagneticHover } from "../components/MagneticHover";
import { ProjectCard } from "../components/ProjectCard";
import { ResearchPaperCard } from "../components/ResearchPaperCard";
import { SectionHeader } from "../components/SectionHeader";
import { ArrowUpRight } from "../components/icons";

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative scroll-mt-24 border-t border-outline-variant/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            id="projects-title"
            index="02"
            eyebrow="Projects"
            title="Shipped, not shelved."
            description="A few things I have built and actually run. The rest live in the repositories."
          />

          <MagneticHover strength={4} className="flex self-start sm:self-auto">
            <a
              data-reveal
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="m3-label group inline-flex items-center gap-2 rounded-full border border-outline-variant/60 px-4 py-2.5 text-on-surface-variant transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              All repositories
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-[var(--md-spring-default-spatial-duration)] ease-[var(--md-spring-default-spatial)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </MagneticHover>
        </div>

        <ResearchPaperCard />

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
