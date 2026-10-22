import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, ScrollControls, useGLTF } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Pixelation,
} from "@react-three/postprocessing";
import { PortfolioScene } from "./PortfolioScene";

/**
 * The scroll-driven WebGL portfolio. This module (and the whole three.js /
 * drei / postprocessing tree behind it) is only ever imported by the lazy
 * `/3d` route, so the main 2D landing page ships without any of it.
 */
export default function Experience() {
  // The Pixelation effect instance exposes `granularity`; the wrapper doesn't
  // publish a ref type, so the handle is intentionally opaque here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pixelRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-full bg-[#0A0D14]">
      <Canvas
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-[#0A0D14] font-mono text-sky-200">
            Loading 3D...
          </div>
        }
        camera={{ position: [0, 0, 5], fov: isMobile ? 64 : 50 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
        }}
      >
        <color attach="background" args={["#1E222A"]} />
        <ScrollControls pages={3} damping={0.1} infinite>
          <Suspense
            fallback={
              <Html center>
                <div className="animate-pulse whitespace-nowrap font-mono text-xl text-sky-400">
                  [ INITIATING WEBGL ENVIRONMENT... ]
                </div>
              </Html>
            }
          >
            <PortfolioScene pixelRef={pixelRef} isMobile={isMobile} />
          </Suspense>
        </ScrollControls>
        <EffectComposer multisampling={0}>
          <Pixelation ref={pixelRef} granularity={0} />
          <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.2} />
          <Vignette offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
      {!isMobile && (
        <div className="scroll-cue">
          [ SCROLL ]
          <span className="scroll-cue-arrow">↓</span>
        </div>
      )}
    </div>
  );
}

useGLTF.preload("/models/portfolio_scene.glb");
