import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "filled" | "tonal" | "outlined" | "text";

type M3ButtonProps = {
  /**
   * In-app routes ("/3d"), in-page anchors, mailto: and external URLs.
   * Omit it to render a real `<button>` — use that for in-page actions like
   * the smooth-scroll "Get in touch" CTA.
   */
  href?: string;
  children: ReactNode;
  variant?: Variant;
  /** "sm" keeps the 48px target but tightens horizontal padding for app bars. */
  size?: "md" | "sm";
  /** Trailing icon, usually an arrow. */
  trailing?: ReactNode;
  /** Leading icon. */
  leading?: ReactNode;
  /** Opens in a new tab (external links only). */
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  /** Fires for links and buttons alike. */
  onClick?: () => void;
};

const VARIANTS: Record<Variant, string> = {
  filled: "bg-primary text-on-primary",
  tonal:
    "bg-secondary-container text-on-secondary-container",
  outlined:
    "border border-outline text-on-surface",
  text: "text-primary px-2",
};

/**
 * M3 Expressive button. Shape morphs from a soft rounded rectangle to a pill
 * on hover (expressive shape tokens), with a tonal state layer on top.
 * Minimum target height is 48px — M3 accessible touch target.
 */
export function M3Button({
  href,
  children,
  variant = "filled",
  size = "md",
  trailing,
  leading,
  external,
  className = "",
  ariaLabel,
  onClick,
}: M3ButtonProps) {
  const classes = [
    "m3-button m3-state group inline-flex min-h-12 items-center justify-center gap-2.5",
    size === "sm" ? "px-4 py-2.5" : "px-6 py-3",
    "m3-title-md select-none",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    VARIANTS[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {leading}
      <span>{children}</span>
      {trailing}
    </>
  );

  // No destination → a real button. In-page actions should not pretend to be
  // links (no href, no middle-click, correct semantics for assistive tech).
  if (!href) {
    return (
      <button
        type="button"
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  // "/3d" and any future in-app route goes through the client router; anchors,
  // mailto: and external URLs stay plain links.
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      aria-label={ariaLabel}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}
