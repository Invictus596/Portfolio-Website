import { Link } from "react-router-dom";
import Experience from "../three/Experience";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/**
 * `/3d` — the original scroll-driven WebGL portfolio, now a sub-route.
 * Every asset it loads (`/models`, `/hdrs`, `/fonts`) is referenced from
 * `public/` by absolute URL, so moving the component never breaks a path.
 */
export default function ThreeDPage() {
  useDocumentTitle("3D Portfolio — Abdul Khader");

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0A0D14]">
      <Experience />

      <Link
        to="/"
        className="fixed left-4 top-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-full border border-sky-400/30 bg-[#0A0D14]/75 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sky-200/80 backdrop-blur transition-colors duration-200 hover:border-sky-300/70 hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        <span aria-hidden="true">←</span>
        Exit to main site
      </Link>
    </div>
  );
}
