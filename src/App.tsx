import { Suspense, useEffect, useRef, useLayoutEffect, Component, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Html,
  Text3D,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Pixelation,
} from "@react-three/postprocessing";
import * as THREE from "three";

const FONT_REG = "/fonts/jetbrains-mono-regular.json";
const FONT_BOLD = "/fonts/jetbrains-mono-bold.json";

type ProjectData = {
  title: string;
  desc: string;
  url: string;
  x: number;
  y: number;
};

const PROJECTS: ProjectData[] = [
  {
    title: "OBSIDIAN ANTI-CHEAT",
    desc: "Blockchain security system.\nTop 11 Finalist built with Cairo & Next.js.",
    url: "https://github.com/Invictus596/Obsidian-Anti-Cheat",
    x: -2.45,
    y: 1.4,
  },
  {
    title: "GITHUB-GREENS",
    desc: "Automated contribution graph utility.\nMaintains developer activity logs.",
    url: "https://github.com/Invictus596",
    x: 2.45,
    y: 1.4,
  },
  {
    title: "LAN-TUI",
    desc: "Terminal-based network interface.\nLightweight TUI for local diagnostics.",
    url: "https://github.com/Invictus596",
    x: -2.45,
    y: -1.4,
  },
  {
    title: "KBRD",
    desc: "Custom keyboard utility.\nAdvanced mapping for mechanical boards.",
    url: "https://github.com/Invictus596",
    x: 2.45,
    y: -1.4,
  },
];

const _turntableAxis = new THREE.Vector3(0, 1, 0);
const _turntableQuat = new THREE.Quaternion();
const _localZAxis = new THREE.Vector3(0, 0, 1);
const _spinQuat = new THREE.Quaternion();

class EnvBoundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function CenteredText({
  position,
  ...props
}: React.ComponentProps<typeof Text3D> & {
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const geo = mesh.geometry as THREE.BufferGeometry;
    geo.computeBoundingBox();
    const box = geo.boundingBox;
    if (!box) return;
    const cx = (box.max.x + box.min.x) / 2;
    const cy = (box.max.y + box.min.y) / 2;
    mesh.position.x = (position?.[0] ?? 0) - cx;
    mesh.position.y = (position?.[1] ?? 0) - cy;
    mesh.position.z = position?.[2] ?? 0;
  }, [position]);

  return <Text3D ref={meshRef} {...props} />;
}

function LeftText({
  position,
  ...props
}: React.ComponentProps<typeof Text3D> & {
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const geo = mesh.geometry as THREE.BufferGeometry;
    geo.computeBoundingBox();
    const box = geo.boundingBox;
    if (!box) return;
    const cy = (box.max.y + box.min.y) / 2;
    mesh.position.x = position?.[0] ?? 0;
    mesh.position.y = (position?.[1] ?? 0) - cy;
    mesh.position.z = position?.[2] ?? 0;
  }, [position]);

  return <Text3D ref={meshRef} {...props} />;
}

function HeroTexts() {
  return (
    <group position={[-2.6, 0.6, 0.5]}>
      <LeftText
        font={FONT_BOLD}
        size={0.22}
        height={0.02}
        position={[0, 0.0, 0]}
      >
        [ABDUL KHADER]
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
      <LeftText
        font={FONT_BOLD}
        size={0.1}
        height={0.02}
        position={[0, -0.3, 0]}
      >
        MULTI-DISCIPLINARY
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
      <LeftText
        font={FONT_BOLD}
        size={0.1}
        height={0.02}
        position={[0, -0.45, 0]}
      >
        SOFTWARE ENGINEER
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[0, -0.7, 0]}
      >
        I BUILD END-TO-END SYSTEMS —
        <meshStandardMaterial color="#94a3b8" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[0, -0.85, 0]}
      >
        WEB EXPERIENCES, DEVELOPER TOOLS,
        <meshStandardMaterial color="#94a3b8" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[0, -1.0, 0]}
      >
        WEB3 INFRASTRUCTURE, DATA,
        <meshStandardMaterial color="#94a3b8" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[0, -1.15, 0]}
      >
        AND MACHINE LEARNING.
        <meshStandardMaterial color="#94a3b8" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.05}
        height={0.02}
        position={[0, -1.4, 0]}
      >
        [ BUILDING AT THE EDGE OF SOFTWARE ]
        <meshStandardMaterial color="#94a3b8" />
      </LeftText>
    </group>
  );
}

function AboutTexts() {
  return (
    <group position={[-1.8, -0.6, -12]}>
      <LeftText
        font={FONT_BOLD}
        size={0.22}
        height={0.02}
        position={[0, 1.8, 0]}
      >
        [ABOUT ME]
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>

      {/* COLUMN 1 (Left) */}
      <LeftText
        font={FONT_BOLD}
        size={0.09}
        height={0.02}
        position={[0, 1.3, 0]}
      >
        $ whoami
        <meshStandardMaterial color="#88C0D0" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.07}
        height={0.02}
        position={[0, 1.1, 0]}
      >
        CS ENGINEERING STUDENT @ OU
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[0, 0.9, 0]}
      >
        I BUILD AT THE INTERSECTION OF
        <meshStandardMaterial color="#94a3b8" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[0, 0.75, 0]}
      >
        DEEP TECH, DATA, AND CREATIVE
        <meshStandardMaterial color="#94a3b8" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[0, 0.6, 0]}
      >
        WEB EXPERIENCES.
        <meshStandardMaterial color="#94a3b8" />
      </LeftText>

      <LeftText
        font={FONT_BOLD}
        size={0.09}
        height={0.02}
        position={[0, 0.2, 0]}
      >
        $ currently_building
        <meshStandardMaterial color="#88C0D0" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[0, -0.05, 0]}
      >
        → TRUSTLESS SYSTEMS ON STARKNET
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[0, -0.2, 0]}
      >
        → ZERO-KNOWLEDGE PROOF INFRASTRUCTURE
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[0, -0.35, 0]}
      >
        → EFFICIENT MACHINE LEARNING MODELS
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[0, -0.5, 0]}
      >
        → IMMERSIVE 3D WEB EXPERIENCES
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>

      {/* COLUMN 2 (Right) */}
      <LeftText
        font={FONT_BOLD}
        size={0.09}
        height={0.02}
        position={[2.6, 1.3, 0]}
      >
        $ outside_the_terminal
        <meshStandardMaterial color="#88C0D0" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[2.6, 1.05, 0]}
      >
        → RICING ARCH / FEDORA
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[2.6, 0.9, 0]}
      >
        → ANALYZING F1 TELEMETRY
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[2.6, 0.75, 0]}
      >
        → SIM RACING
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
      <LeftText
        font={FONT_REG}
        size={0.06}
        height={0.02}
        position={[2.6, 0.6, 0]}
      >
        → ACTION GAMES
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>

      <LeftText
        font={FONT_BOLD}
        size={0.09}
        height={0.02}
        position={[2.6, 0.2, 0]}
      >
        $ contact
        <meshStandardMaterial color="#88C0D0" />
      </LeftText>
      <LeftText
        font={FONT_BOLD}
        size={0.08}
        height={0.02}
        position={[2.6, -0.05, 0]}
        onClick={() => window.open("mailto:abdulkhader.dev@gmail.com", "_blank")}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        [ MAIL ]
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
      <LeftText
        font={FONT_BOLD}
        size={0.08}
        height={0.02}
        position={[3.9, -0.05, 0]}
        onClick={() =>
          window.open("https://www.linkedin.com/in/invictus596/", "_blank")
        }
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        [ LINKEDIN ]
        <meshStandardMaterial color="#e0f2fe" />
      </LeftText>
    </group>
  );
}

function ProjectTexts({
  projectsGroupRef,
}: {
  projectsGroupRef: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group ref={projectsGroupRef} position={[0, 0, -24]}>
      <CenteredText
        font={FONT_BOLD}
        size={0.2}
        height={0.02}
        position={[0, 3.2, 0]}
      >
        [MY PROJECTS]
        <meshStandardMaterial color="#e0f2fe" />
      </CenteredText>
      <CenteredText
        font={FONT_BOLD}
        size={0.08}
        height={0.02}
        position={[0, -2.8, 0.5]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (e.camera.position.z > -10) return;
          window.open("https://github.com/Invictus596/", "_blank");
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          if (e.camera.position.z > -10) return;
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        [ GITHUB ]
        <meshStandardMaterial color="#88C0D0" />
      </CenteredText>
      {PROJECTS.map((p) => (
        <group key={p.title} position={[p.x, p.y, 0]}>
          {/* Pinned to the top of the glass pane */}
          <CenteredText
            font={FONT_BOLD}
            size={0.15}
            height={0.02}
            position={[0, 0.9, 0.5]}
          >
            {p.title}
            <meshStandardMaterial color="#e0f2fe" />
          </CenteredText>

          {/* Perfectly centered multi-line description */}
          <CenteredText
            font={FONT_REG}
            size={0.07}
            height={0.02}
            position={[0, 0.1, 0.5]}
          >
            {p.desc}
            <meshStandardMaterial color="#94a3b8" />
          </CenteredText>

          {/* Pinned to the bottom of the glass pane */}
          <CenteredText
            font={FONT_BOLD}
            size={0.075}
            height={0.02}
            position={[0, -0.8, 0.5]}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              if (e.camera.position.z > -10) return;
              window.open(p.url, "_blank");
            }}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              if (e.camera.position.z > -10) return;
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          >
            [CLICK HERE TO VIEW THE PROJECT IN GITHUB]
            <meshStandardMaterial color="#88C0D0" />
          </CenteredText>
        </group>
      ))}
    </group>
  );
}

function PortfolioScene({
  pixelRef,
}: {
  pixelRef: React.RefObject<any>;
}) {
  const { scene } = useGLTF("/models/portfolio_scene.glb");
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const clickedMesh = useRef<THREE.Mesh | null>(null);
  const projectsGroupRef = useRef<THREE.Group>(null);
  const glassManRef = useRef<THREE.Mesh>(null);
  const glassShardRef = useRef<THREE.Mesh>(null);
  const wall1Mat = useRef<any>(null);
  const wall2Mat = useRef<any>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.userData.initRot = child.rotation.clone();
        const mat = (child as THREE.Mesh)
          .material as THREE.MeshPhysicalMaterial;
        if (mat && mat.isMeshPhysicalMaterial) {
          mat.color = new THREE.Color("#0f172a");
          mat.emissive = new THREE.Color("#000000");
          mat.roughness = 0.35;
          mat.metalness = 0.05;
          mat.transmission = 0.95;
          mat.transparent = true;
          mat.clearcoat = 1.0;
          mat.clearcoatRoughness = 0.1;
          mat.ior = 1.45;
          mat.thickness = 2.5;
          mat.attenuationColor = new THREE.Color("#38bdf8");
          mat.attenuationDistance = 2.0;
          mat.needsUpdate = true;
        }
      }
    });
    glassManRef.current = scene.getObjectByName("GlassMan") as THREE.Mesh;
    glassShardRef.current = scene.getObjectByName("GlassShard") as THREE.Mesh;
    if (glassManRef.current) {
      glassManRef.current.userData.restQuat = glassManRef.current.quaternion.clone();
      glassManRef.current.userData.spinAngle = 0;
    }
  }, [scene]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (group) {
      group.rotation.y = THREE.MathUtils.lerp(
        group.rotation.y,
        state.pointer.x * 0.05,
        0.1,
      );
      group.rotation.x = THREE.MathUtils.lerp(
        group.rotation.x,
        -state.pointer.y * 0.04,
        0.1,
      );
    }

    const light = lightRef.current;
    if (light) {
      light.position.x = 4 + Math.sin(state.clock.elapsedTime * 0.5) * 1.5;
      light.position.y = 2 + Math.cos(state.clock.elapsedTime * 0.5) * 0.5;
      light.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 2;
    }

    if (glassShardRef.current) {
      glassShardRef.current.quaternion.premultiply(
        _turntableQuat.setFromAxisAngle(_turntableAxis, delta * 0.2),
      );
    }

    const currentSection = Math.round(scroll.offset * 2);
    const camDist = currentSection === 2 ? 8 : 5;
    const targetZ = -(currentSection * 12) + camDist;

    if (projectsGroupRef.current) {
      projectsGroupRef.current.visible = currentSection > 0;
    }

    if (pixelRef.current) {
      const targetVec = new THREE.Vector3(0, 0, targetZ);
      const dist = state.camera.position.distanceTo(targetVec);
      pixelRef.current.granularity = Math.min(dist * 4, 30);
    }

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      0,
      0.05,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      0,
      0.05,
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetZ,
      0.05,
    );

    if (wall1Mat.current) {
      const dist1 = Math.abs(state.camera.position.z - -6);
      const progress1 = dist1 < 8.0 ? Math.pow(1.0 - dist1 / 8.0, 3.0) : 0.0;
      wall1Mat.current.uniforms.uAperture.value = progress1 * 0.8;
    }
    if (wall2Mat.current) {
      const dist2 = Math.abs(state.camera.position.z - -15);
      const progress2 = dist2 < 8.0 ? Math.pow(1.0 - dist2 / 8.0, 3.0) : 0.0;
      wall2Mat.current.uniforms.uAperture.value = progress2 * 0.8;
    }

    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      if (mesh === glassShardRef.current) return;

      if (mesh === glassManRef.current) {
        const restQuat = mesh.userData.restQuat as THREE.Quaternion;
        const spinAngle = (mesh.userData.spinAngle as number) ?? 0;
        const targetAngle = mesh === clickedMesh.current ? Math.PI / 2 : 0;
        const nextAngle = THREE.MathUtils.lerp(spinAngle, targetAngle, 0.1);
        mesh.userData.spinAngle = nextAngle;
        mesh.quaternion
          .copy(restQuat)
          .multiply(_spinQuat.setFromAxisAngle(_localZAxis, nextAngle));
        return;
      }

      const initRot = mesh.userData.initRot as THREE.Euler | undefined;
      if (initRot) {
        mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, initRot.y, 0.1);
      }
    });
  });

    const apertureShader = {
      uniforms: { uAperture: { value: 0.0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uAperture;
        float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }

        void main() {
          // Linear-space equivalents of the Nord palette (three.js sRGB-encodes
          // ShaderMaterial output, so hex colors must be converted to linear):
          // #1E222A (Deep Nord Slate), #88C0D0 (Nord Frost Blue), #3B4252 (Nord1)
          vec3 bgColor = vec3(0.0130, 0.0160, 0.0232);
          vec3 lightEdge = vec3(0.2462, 0.5271, 0.6308);
          vec3 darkEdge = vec3(0.0437, 0.0545, 0.0844);

          // Solid early-return
          if (uAperture <= 0.001) {
            gl_FragColor = vec4(bgColor, 1.0);
            return;
          }

          // Shift UV so (0,0) is exactly the center of the wall
          vec2 centeredUv = vUv - 0.5;

          float pixels = 120.0;
          vec2 blockUv = floor(centeredUv * pixels) / pixels;

          // True distance from center + drastically reduced noise for shape retention
          float dist = length(blockUv);
          float noise = (random(blockUv) - 0.5) * 0.03;
          float jaggedDist = dist + noise;

          if(jaggedDist < uAperture) discard;

          float edgeDist = jaggedDist - uAperture;
          vec3 finalColor = bgColor;

          if (edgeDist < 0.015) { finalColor = lightEdge; }
          else if (edgeDist < 0.04) { finalColor = darkEdge; }

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    };

  return (
    <>
      <fog attach="fog" args={["#1E222A", 2, 12]} />
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[40, 10, -5]} intensity={1.2} color="#e0f2fe" />
      {/* Lightbulb specifically for the GlassMan (Hero section) */}
      <pointLight
        position={[-4, 1, 3]}
        intensity={4}
        distance={20}
        color="#88C0D0"
      />
      {/* SHARD LIGHTING CLUSTER */}
      {/* Front-left Cyan Key Light */}
      <pointLight
        position={[-6, 2, -10]}
        intensity={5}
        distance={15}
        color="#88C0D0"
      />
      {/* Right-side Soft Fill Light */}
      <pointLight
        position={[-2, -1, -11]}
        intensity={3}
        distance={10}
        color="#e0f2fe"
      />
      {/* Back-left Deep Rim Light to catch the sharp edges */}
      <pointLight
        position={[-5, 3, -14]}
        intensity={6}
        distance={15}
        color="#5E81AC"
      />
      <pointLight
        ref={lightRef}
        color="#38bdf8"
        intensity={2}
        distance={15}
      />
      <EnvBoundary>
        <Suspense fallback={null}>
          <Environment
            files="/hdrs/studio_small_512.hdr"
            resolution={128}
            environmentRotation={[0, Math.PI / 2, 0]}
          />
        </Suspense>
      </EnvBoundary>
      <group ref={groupRef}>
        <primitive
          object={scene}
          rotation={[Math.PI / 2, 0, 0]}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            const obj = e.object as THREE.Mesh;
            if (obj !== glassManRef.current) return;
            clickedMesh.current = obj;
            setTimeout(() => {
              clickedMesh.current = null;
            }, 300);
          }}
        />
        <HeroTexts />
        <AboutTexts />
        <ProjectTexts projectsGroupRef={projectsGroupRef} />
      </group>
      <mesh position={[0, 0, -6]}>
        <planeGeometry args={[50, 50]} />
        <shaderMaterial
          ref={wall1Mat}
          args={[{ ...apertureShader, uniforms: { uAperture: { value: 0.0 } } }]}
          transparent={true}
        />
      </mesh>
      <mesh position={[0, 0, -15]}>
        <planeGeometry args={[50, 50]} />
        <shaderMaterial
          ref={wall2Mat}
          args={[{ ...apertureShader, uniforms: { uAperture: { value: 0.0 } } }]}
          transparent={true}
        />
      </mesh>
    </>
  );
}

export default function App() {
  const pixelRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 768px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-notice">
        <div className="mobile-notice-title">[ WORK IN PROGRESS ]</div>
        <div className="mobile-notice-sub">
          PLEASE USE A DESKTOP BROWSER
          <br />
          FOR THE FULL EXPERIENCE.
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#0A0D14]">
      <Canvas
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-[#0A0D14] font-mono text-sky-200">
            Loading 3D...
          </div>
        }
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
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
            <PortfolioScene pixelRef={pixelRef} />
          </Suspense>
        </ScrollControls>
        <EffectComposer multisampling={0}>
          <Pixelation ref={pixelRef} granularity={0} />
          <Bloom
            luminanceThreshold={1.2}
            mipmapBlur
            intensity={0.2}
          />
          <Vignette offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/portfolio_scene.glb");
