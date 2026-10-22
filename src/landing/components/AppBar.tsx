import { Link } from "react-router-dom";
import { ThemeSwitcher } from "../../theme/ThemeSwitcher";
import { useContactPulse } from "./ContactPulse";
import { MagneticHover } from "./MagneticHover";
import { M3Button } from "./M3Button";

const SECTIONS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

/**
 * M3 top app bar: translucent surface, hairline divider, and a filled CTA.
 * The top-left cluster holds the theme switcher and the identity link, whose
 * portrait sits in a 40px circle — the same footprint as the old monogram.
 */
export function AppBar() {
  const { pulseContact } = useContactPulse();

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <ThemeSwitcher />

          <Link
            to="/"
            aria-label="Abdul Khader — home"
            className="group flex items-center gap-3 rounded-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <img
              src="/images/profile.jpg"
              alt=""
              width={40}
              height={40}
              decoding="async"
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-outline-variant/60 transition-transform duration-[var(--md-spring-fast-spatial-duration)] ease-[var(--md-spring-fast-spatial)] group-hover:scale-105"
            />
            <span className="hidden sm:block">
              <span className="m3-title-md block leading-tight text-on-surface">
                Abdul Khader
              </span>
              <span className="m3-body-sm block text-on-surface-variant">
                Software Engineer
              </span>
            </span>
          </Link>
        </div>

        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="m3-label rounded-full px-4 py-2.5 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container-high hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <MagneticHover strength={4} className="flex">
          <M3Button onClick={pulseContact} size="sm">
            Get in touch
          </M3Button>
        </MagneticHover>
      </div>
    </header>
  );
}
