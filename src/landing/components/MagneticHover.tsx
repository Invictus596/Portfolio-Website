import type { ReactNode } from "react";
import { useMagnetic } from "../../hooks/useMagnetic";

type MagneticHoverProps = {
  children: ReactNode;
  /**
   * Maximum offset in px when the pointer sits at the element's edge.
   * Keep it small — 4–8px reads as "gravity", anything more reads as a bug.
   */
  strength?: number;
  className?: string;
};

/**
 * Wraps an interactive element in a gravity well.
 *
 * The movement lives on this wrapper, never on the control itself. That is the
 * whole point: a `transform: scale()` on the element that holds the label
 * forces the browser to re-rasterise glyphs at a fractional scale for the
 * entire hover, which is what produced the subpixel blur. Here the text keeps
 * its own static, integer-sized box and only the composited layer around it
 * moves.
 *
 * The actual pointer math lives in `useMagnetic`, which no-ops on coarse
 * pointers and under `prefers-reduced-motion`.
 *
 * Layout note: this renders a block-level `div`, so it becomes the flex/grid
 * item in place of its child. Pass the layout classes (`flex`, `h-full`, …)
 * via `className` and let the child fill it.
 */
export function MagneticHover({
  children,
  strength = 6,
  className,
}: MagneticHoverProps) {
  const ref = useMagnetic<HTMLDivElement>(strength);

  return (
    <div
      ref={ref}
      className={className ? `magnetic-hover ${className}` : "magnetic-hover"}
    >
      {children}
    </div>
  );
}
