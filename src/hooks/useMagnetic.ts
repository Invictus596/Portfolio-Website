import { useEffect, useRef } from "react";

/**
 * Magnetic hover: pulls an element a few pixels toward the pointer.
 *
 * The offset is published as `--magnet-x` / `--magnet-y`, which the element's
 * own `transform` consumes. That keeps the movement compositor-friendly and
 * lets CSS own the easing.
 *
 * Skipped entirely for touch input and for users who ask for reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 6) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof window.matchMedia !== "function") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    if (reduceMotion.matches || !finePointer.matches) return;

    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Whole-pixel offsets: the movement lands on the compositor's pixel
        // grid, so glyph rasterisation stays sharp at rest. Rounding the
        // *target* is enough — CSS interpolates the frames in between.
        element.style.setProperty("--magnet-x", `${Math.round(dx * strength)}px`);
        element.style.setProperty("--magnet-y", `${Math.round(dy * strength)}px`);
      });
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      element.style.setProperty("--magnet-x", "0px");
      element.style.setProperty("--magnet-y", "0px");
    };

    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerleave", reset);
    element.addEventListener("focus", reset);
    element.addEventListener("blur", reset);

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", reset);
      element.removeEventListener("focus", reset);
      element.removeEventListener("blur", reset);
      element.style.removeProperty("--magnet-x");
      element.style.removeProperty("--magnet-y");
    };
  }, [strength]);

  return ref;
}
