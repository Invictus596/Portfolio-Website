import { AppBar } from "../landing/components/AppBar";
import { ContactPulseProvider } from "../landing/components/ContactPulse";
import { Hero } from "../landing/sections/Hero";
import { About } from "../landing/sections/About";
import { Projects } from "../landing/sections/Projects";
import { Footer } from "../landing/sections/Footer";
import { useRevealObserver } from "../landing/useReveal";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/**
 * The public face of the site: a 2D, M3 Expressive landing page.
 * No three.js, no WebGL, no GLB — all of that is behind the desktop-only
 * `/3d` link in the footer.
 */
export default function LandingPage() {
  useDocumentTitle("Abdul Khader — Multi-disciplinary Software Engineer");
  useRevealObserver();

  return (
    <ContactPulseProvider>
      <div className="min-h-screen bg-surface text-on-surface">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <AppBar />

        <main id="main">
          <Hero />
          <About />
          <Projects />
        </main>

        <Footer />
      </div>
    </ContactPulseProvider>
  );
}
