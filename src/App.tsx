import { Suspense, lazy } from "react";
import { Link, Route, Routes } from "react-router-dom";
import LandingPage from "./routes/LandingPage";

/**
 * Code-split boundary: the entire three.js / R3F / postprocessing stack lives
 * in this chunk and is only fetched when someone opens `/3d`.
 */
const ThreeDPage = lazy(() => import("./routes/ThreeDPage"));

function WebGLLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#0A0D14] px-6">
      <p className="animate-pulse font-mono text-sm tracking-[0.18em] text-sky-400">
        [ INITIATING WEBGL ENVIRONMENT... ]
      </p>
    </div>
  );
}

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6 text-center">
      <div>
        <p className="m3-label text-primary">404</p>
        <h1 className="m3-headline-em mt-4 text-on-surface">
          This route doesn&rsquo;t exist.
        </h1>
        <p className="m3-body mt-3 text-on-surface-variant">
          The page you asked for was never built — or has been shelved.
        </p>
        <Link
          to="/"
          className="m3-button m3-state m3-title-md mt-8 inline-flex min-h-12 items-center justify-center bg-primary px-6 py-3 text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/3d"
        element={
          <Suspense fallback={<WebGLLoader />}>
            <ThreeDPage />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
