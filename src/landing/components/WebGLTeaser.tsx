import { Link } from "react-router-dom";
import { MagneticHover } from "./MagneticHover";
import { ArrowRight, CubeIcon } from "./icons";

/**
 * Desktop-only easter egg.
 *
 * The wrapper is `hidden` below the `md` breakpoint and `md:flex` above it, so
 * the 3D route is completely absent from the mobile layout (display: none
 * removes it from flow, hit-testing and the accessibility tree).
 *
 * It is also the loudest affordance on the page by design: a continuous pulse
 * ring (CSS) plus a magnetic pull toward the pointer (desktop only, via
 * <MagneticHover> — the label itself never scales, so it stays sharp).
 */
export function WebGLTeaser() {
  return (
    <div className="mt-10 hidden border-t border-outline-variant/50 pt-8 md:flex md:items-center md:justify-between md:gap-8">
      <div className="max-w-sm">
        <p className="m3-label flex items-center gap-2 text-tertiary">
          <CubeIcon className="h-3.5 w-3.5" />
          Easter egg / WebGL
        </p>
        <p className="m3-body-sm mt-2 text-on-surface-variant">
          A scroll-driven 3D portfolio came first. It wants a desktop GPU and a
          little patience.
        </p>
      </div>

      <MagneticHover strength={7} className="flex shrink-0">
        <Link
          to="/3d"
          className="m3-teaser m3-state group relative inline-flex min-h-12 items-center gap-3 bg-primary-container px-5 py-3 text-on-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <CubeIcon className="h-4 w-4 shrink-0" />
          <span className="m3-title-md">
            Initialize WebGL Experience (View 3D Portfolio)
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-[var(--md-spring-default-spatial-duration)] ease-[var(--md-spring-default-spatial)] group-hover:translate-x-1" />
        </Link>
      </MagneticHover>
    </div>
  );
}
