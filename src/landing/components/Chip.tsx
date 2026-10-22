import type { ReactNode } from "react";

/** M3 assist chip — pill shape, low-emphasis container, mono label type. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="m3-mono inline-flex items-center rounded-full border border-outline-variant/70 bg-surface-container-high/60 px-3 py-1 text-[11px] leading-4 tracking-[0.06em] text-on-surface-variant">
      {children}
    </span>
  );
}
