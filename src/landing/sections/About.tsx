import type { CSSProperties, ReactNode } from "react";
import { PROFILE } from "../../three/data";
import { SectionHeader } from "../components/SectionHeader";
import { CubeIcon, ScrollIcon, SparkIcon, TerminalIcon } from "../components/icons";

type Capability = {
  icon: ReactNode;
  title: string;
  body: string;
};

const CAPABILITIES: Capability[] = [
  {
    icon: <TerminalIcon className="h-4.5 w-4.5" />,
    title: "Full-stack engineering",
    body: "React and Next.js interfaces over typed, boring-in-a-good-way APIs.",
  },
  {
    icon: <CubeIcon className="h-4.5 w-4.5" />,
    title: "Web3 & cryptography",
    body: "Trustless systems and zero-knowledge proof infrastructure on Starknet.",
  },
  {
    icon: <SparkIcon className="h-4.5 w-4.5" />,
    title: "Machine learning",
    body: "Efficient models built to ship, not just to sit in a notebook.",
  },
  {
    icon: <ScrollIcon className="h-4.5 w-4.5" />,
    title: "Creative engineering",
    body: "Shaders, motion, and 3D on the web — the fun side of the same stack.",
  },
];

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative scroll-mt-24 border-t border-outline-variant/40"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[0.38fr_0.62fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            id="about-title"
            index="01"
            eyebrow="About"
            title="Systems, not screens."
          />
        </div>

        <div className="lg:pt-1">
          <p data-reveal className="m3-body-lg text-on-surface">
            I&rsquo;m a software engineer building at the intersection of deep
            tech, data, and creative web experiences.
          </p>

          <p
            data-reveal
            style={delay(40)}
            className="m3-label mt-4 inline-flex items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container px-3 py-1.5 text-on-surface-variant"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-primary"
            />
            {PROFILE.academic}
          </p>

          <p
            data-reveal
            style={delay(80)}
            className="m3-body mt-5 text-on-surface-variant"
          >
            Most of my work lives close to the metal: trustless systems,
            zero-knowledge proof infrastructure, efficient machine learning
            models, and the occasional immersive 3D experience. I like
            interfaces that stay out of the way and systems that hold up under
            load.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((capability, index) => (
              <article
                key={capability.title}
                data-reveal
                style={delay(120 + index * 70)}
                className="group rounded-[var(--radius-xl)] border border-outline-variant/50 bg-surface-container p-5 transition-colors duration-200 hover:border-outline-variant"
              >
                <span className="inline-grid h-9 w-9 place-items-center rounded-[var(--radius-md)] bg-primary-container/70 text-on-primary-container">
                  {capability.icon}
                </span>
                <h3 className="m3-title-md mt-4 text-on-surface">
                  {capability.title}
                </h3>
                <p className="m3-body-sm mt-1.5 text-on-surface-variant">
                  {capability.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
