import { useEffect } from "react";

/**
 * Arms the scroll-reveal system.
 *
 * The `reveal-ready` class is only added once an IntersectionObserver exists,
 * so with scripting disabled (or an ancient browser) every `[data-reveal]`
 * block simply renders in place instead of staying invisible.
 *
 * Honours `prefers-reduced-motion` by revealing everything immediately.
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
      nodes.forEach((node) => node.classList.add("is-revealed"));
      return;
    }

    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, []);
}
