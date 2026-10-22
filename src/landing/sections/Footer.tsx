import type { CSSProperties } from "react";
import { PROFILE } from "../../three/data";
import { useContactPulse } from "../components/ContactPulse";
import { MagneticHover } from "../components/MagneticHover";
import { M3Button } from "../components/M3Button";
import { FluidBackdrop } from "../components/FluidBackdrop";
import { WebGLTeaser } from "../components/WebGLTeaser";
import { GithubIcon, LinkedinIcon, MailIcon } from "../components/icons";

const QUOTE =
  "Technology is a Tool Created by Humanity to Conquer Reality.";

export function Footer() {
  const year = new Date().getFullYear();
  const { isPulsating } = useContactPulse();
  const pulseClass = isPulsating ? " is-pulsating" : "";

  return (
    <footer
      id="contact"
      className="relative scroll-mt-24 border-t border-outline-variant/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="m3-surface relative overflow-hidden border border-outline-variant/50 bg-surface-container p-7 sm:p-10 lg:p-12">
          <FluidBackdrop className="opacity-70" />

          <div className="relative">
            <p className="m3-label text-primary">03 / Contact</p>

            <h2 className="m3-display-sm-em mt-4 max-w-2xl text-on-surface">
              Let&rsquo;s build something that holds up.
            </h2>

            <p className="m3-body mt-4 max-w-xl text-on-surface-variant">
              Open to internships, collaborations, and interesting problems.
              Email is fastest; the repositories are the honest version of my
              résumé.
            </p>

            <blockquote className="mt-8 max-w-2xl border-l-2 border-primary/40 pl-5">
              <p className="m3-title-lg text-on-surface">
                {QUOTE.split(" ").map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    data-reveal
                    style={
                      {
                        "--reveal-delay": `${index * 55}ms`,
                      } as CSSProperties
                    }
                    className="mr-[0.28em] inline-block"
                  >
                    {word}
                  </span>
                ))}
              </p>
            </blockquote>

            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticHover
                strength={5}
                className={`flex contact-pulse-target${pulseClass}`}
              >
                <M3Button
                  href={`mailto:${PROFILE.email}`}
                  leading={<MailIcon className="h-4 w-4" />}
                >
                  Email me
                </M3Button>
              </MagneticHover>
              <MagneticHover
                strength={5}
                className={`flex contact-pulse-target${pulseClass}`}
              >
                <M3Button
                  href={PROFILE.github}
                  external
                  variant="tonal"
                  leading={<GithubIcon className="h-4 w-4" />}
                >
                  GitHub
                </M3Button>
              </MagneticHover>
              <MagneticHover
                strength={5}
                className={`flex contact-pulse-target${pulseClass}`}
              >
                <M3Button
                  href={PROFILE.linkedin}
                  external
                  variant="outlined"
                  leading={<LinkedinIcon className="h-4 w-4" />}
                >
                  LinkedIn
                </M3Button>
              </MagneticHover>
            </div>
          </div>

          {/* Desktop-only gateway to the 3D portfolio. */}
          <WebGLTeaser />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="m3-body-sm text-on-surface-variant">
            © {year} Abdul Khader. Built in the terminal, at 3am.
          </p>
          <p className="m3-label text-on-surface-variant/60">
            M3 Expressive · React 19 · R3F
          </p>
        </div>
      </div>
    </footer>
  );
}
