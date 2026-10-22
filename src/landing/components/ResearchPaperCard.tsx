import { PUBLICATION } from "../../three/data";
import { MagneticHover } from "./MagneticHover";
import { M3Button } from "./M3Button";
import { ArrowUpRight, FileTextIcon, ScrollPaperIcon } from "./icons";

/**
 * Peer-reviewed publication showcase.
 *
 * This replaces the old "GitHub greens" card. It is deliberately NOT a fourth
 * project tile: a full-width, primary-tinted band reads as an announcement,
 * which is the right weight for a paper.
 *
 * The paper badge next to the title is itself an anchor, so the affordance
 * "click the scroll icon to open the paper" works directly, and the trailing
 * CTA duplicates it for keyboard and scanning users.
 */
export function ResearchPaperCard() {
  return (
    <article
      data-reveal
      className="group relative mt-10 overflow-hidden rounded-[var(--radius-xl)] border border-primary/30 bg-surface-container p-6 sm:p-8"
    >
      {/* Accent wash — decorative, sits behind everything. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/12 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="flex items-start gap-5">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--radius-md)] bg-primary text-on-primary shadow-[var(--md-elevation-1)]">
            <ScrollPaperIcon className="h-6 w-6" />
          </span>

          <div className="min-w-0">
            <p className="m3-label text-tertiary">Peer-reviewed publication</p>

            <h3 className="m3-title-lg mt-2 flex flex-wrap items-center gap-3 text-on-surface">
              {PUBLICATION.title}
              <a
                href={PUBLICATION.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open "${PUBLICATION.title}" in a new tab`}
                title="Open the paper in a new tab"
                className="inline-grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/45 text-primary transition-colors duration-200 hover:bg-primary hover:text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <FileTextIcon className="h-4 w-4" />
              </a>
            </h3>

            <p className="m3-body-sm mt-2 max-w-xl text-on-surface-variant">
              {PUBLICATION.venue} — the full text is free to read.
            </p>
          </div>
        </div>

        <MagneticHover
          strength={5}
          className="flex shrink-0 self-start md:self-auto"
        >
          <M3Button
            href={PUBLICATION.url}
            external
            trailing={<ArrowUpRight className="h-4 w-4" />}
          >
            Read the paper
          </M3Button>
        </MagneticHover>
      </div>
    </article>
  );
}
