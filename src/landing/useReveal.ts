import { useEffect } from "react";

/** Fraction of an element that must be on screen before it animates in. */
const REVEAL_RATIO = 0.1;

const REVEAL_CLASS = "is-revealed";

type RevealEntry = Pick<
  IntersectionObserverEntry,
  "isIntersecting" | "intersectionRatio"
> & {
  target: Pick<Element, "classList">;
};

/**
 * The reveal policy, kept pure so it can be exercised without a browser.
 *
 *   entering with ≥10% visible → add `is-revealed` (starts the entrance)
 *   fully out of view           → remove it (rewinds for the next entrance)
 *
 * Rewinding is gated on `!isIntersecting` (ratio 0) rather than on falling
 * back below `REVEAL_RATIO` on purpose: a 900px card is still ~90px on screen
 * at 10%, so rewinding there would visibly blink it out. "Fully out" happens
 * off-screen, so the rewind itself is never seen — the animation simply
 * starts fresh the next time the block comes back.
 */
export function applyReveal(entries: readonly RevealEntry[]): void {
  for (const entry of entries) {
    const { classList } = entry.target;

    if (entry.isIntersecting) {
      // Ignore the sliver that first pokes over the fold; wait for a
      // meaningful slice before starting the entrance.
      if (entry.intersectionRatio >= REVEAL_RATIO) {
        classList.add(REVEAL_CLASS);
      }
      continue;
    }

    // Guarded so the initial off-screen sweep does not touch the DOM.
    if (classList.contains(REVEAL_CLASS)) {
      classList.remove(REVEAL_CLASS);
    }
  }
}

/**
 * Arms the scroll-reveal system — and keeps it armed, so entrances replay.
 *
 * The observer never unobserves: `applyReveal` removes the class when a block
 * leaves the viewport completely, which restores the CSS pre-reveal state and
 * lets the next entrance restart `fluid-entrance` from the top of its
 * stagger. Hero text, About cards, the publication band, project cards and
 * the contact quote all opt in via `data-reveal`.
 *
 * `reveal-ready` is only added once an IntersectionObserver exists, so with
 * scripting disabled (or an ancient browser) every `[data-reveal]` block
 * simply renders in place instead of staying invisible.
 *
 * Honours `prefers-reduced-motion` by revealing everything immediately and
 * never replaying.
 */
export function useRevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      nodes.forEach((node) => node.classList.add(REVEAL_CLASS));
      return;
    }

    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => applyReveal(entries),
      { rootMargin: "0px", threshold: [0, REVEAL_RATIO] },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);
}
