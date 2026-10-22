import type { CSSProperties } from "react";
import { useContactPulse } from "../components/ContactPulse";
import { MagneticHover } from "../components/MagneticHover";
import { M3Button } from "../components/M3Button";
import { TerminalCard } from "../components/TerminalCard";
import { FluidBackdrop } from "../components/FluidBackdrop";
import { ArrowRight, ScrollIcon } from "../components/icons";

const STACK = ["TypeScript", "React", "Three.js", "Next.js", "Cairo", "Python"];

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const { pulseContact } = useContactPulse();

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
    >
      <FluidBackdrop />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-20">
        <div>
          <span
            data-reveal
            style={delay(0)}
            className="inline-flex items-center gap-2.5 rounded-full border border-outline-variant/60 bg-surface-container/70 px-4 py-2 backdrop-blur"
          >
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="m3-label text-on-surface-variant">
              Open to internships &amp; collabs
            </span>
          </span>

          <p
            data-reveal
            style={delay(40)}
            className="m3-label mt-8 text-on-surface-variant"
          >
            Multi-disciplinary software engineer
          </p>

          <h1
            id="hero-title"
            data-reveal
            style={delay(80)}
            className="m3-display-em mt-4 text-on-surface"
          >
            Building at the <span className="text-primary">Edge</span> of
            Software
          </h1>

          <p
            data-reveal
            style={delay(140)}
            className="m3-body-lg mt-6 max-w-xl text-on-surface-variant"
          >
            Working across web experiences, developer tooling, Web3
            infrastructure, data, and machine learning — from the shader to the
            schema.
          </p>

          <div
            data-reveal
            style={delay(200)}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticHover strength={5} className="flex">
              <M3Button
                href="#projects"
                trailing={
                  <ArrowRight className="h-4 w-4 transition-transform duration-[var(--md-spring-default-spatial-duration)] ease-[var(--md-spring-default-spatial)] group-hover:translate-x-0.5" />
                }
              >
                View projects
              </M3Button>
            </MagneticHover>
            <MagneticHover strength={5} className="flex">
              <M3Button onClick={pulseContact} variant="outlined">
                Get in touch
              </M3Button>
            </MagneticHover>
          </div>

          <div
            data-reveal
            style={delay(260)}
            className="mt-12 flex flex-wrap items-center gap-3"
          >
            <span className="m3-label text-on-surface-variant/60">Stack</span>
            <span aria-hidden="true" className="h-px w-6 bg-outline-variant" />
            <p className="m3-mono text-[11.5px] tracking-[0.08em] text-on-surface-variant">
              {STACK.join("  ·  ")}
            </p>
          </div>
        </div>

        <div data-reveal style={delay(120)} className="relative">
          <TerminalCard />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative mx-auto hidden max-w-6xl items-center gap-3 px-6 pb-10 lg:flex"
      >
        <ScrollIcon className="h-4 w-4 text-on-surface-variant/50" />
        <span className="m3-label text-on-surface-variant/50">Scroll</span>
      </div>
    </section>
  );
}
