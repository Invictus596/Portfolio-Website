import type { ReactNode } from "react";

type SectionHeaderProps = {
  /** Id for the headline, so the parent section can be labelled by it. */
  id?: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
};

/**
 * Section headline block: mono index + rule + eyebrow, then an emphasized
 * headline. This is one of the few places the emphasized type style is used.
 */
export function SectionHeader({
  id,
  index,
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div data-reveal>
      <div className="flex items-center gap-3">
        <span className="m3-label text-primary">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-outline-variant" />
        <span className="m3-label text-on-surface-variant">{eyebrow}</span>
      </div>
      <h2 id={id} className="m3-headline-em mt-5 text-on-surface">
        {title}
      </h2>
      {description ? (
        <p className="m3-body mt-4 max-w-md text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </div>
  );
}
