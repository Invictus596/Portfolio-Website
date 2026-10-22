import { useLayoutEffect, useRef, type ComponentProps, type RefObject } from "react";
import { Text3D } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { PROJECTS } from "./data";

const FONT_REG = "/fonts/jetbrains-mono-regular.json";
const FONT_BOLD = "/fonts/jetbrains-mono-bold.json";

/** Text3D centred on the X/Y axes so panes stay perfectly middled. */
function CenteredText({
  position,
  ...props
}: ComponentProps<typeof Text3D> & {
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

/** Text3D anchored to its left edge — used for terminal-style lines. */
function LeftText({
  position,
  ...props
}: ComponentProps<typeof Text3D> & {
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

type LineSpec = {
  text: string;
  font: string;
  size: number;
  ms?: number;
  color: string;
  x: number;
  y: number;
  my: number;
  to?: string;
};

function TermLine({ spec, isMobile }: { spec: LineSpec; isMobile: boolean }) {
  const common = {
    font: spec.font,
    size: isMobile ? (spec.ms ?? spec.size) : spec.size,
    height: 0.02,
    onClick: spec.to ? () => window.open(spec.to, "_blank") : undefined,
    onPointerOver: spec.to
      ? () => (document.body.style.cursor = "pointer")
      : undefined,
    onPointerOut: spec.to
      ? () => (document.body.style.cursor = "auto")
      : undefined,
  };
  if (isMobile) {
    return (
      <CenteredText position={[0, spec.my, 0]} {...common}>
        {spec.text}
        <meshStandardMaterial color={spec.color} />
      </CenteredText>
    );
  }
  return (
    <LeftText position={[spec.x, spec.y, 0]} {...common}>
      {spec.text}
      <meshStandardMaterial color={spec.color} />
    </LeftText>
  );
}

export function HeroTexts({ isMobile }: { isMobile: boolean }) {
  const lines: LineSpec[] = [
    { text: "[ABDUL KHADER]", font: FONT_BOLD, size: 0.22, color: "#e0f2fe", x: 0, y: 0.0, my: 0.0 },
    { text: "MULTI-DISCIPLINARY", font: FONT_BOLD, size: 0.1, color: "#e0f2fe", x: 0, y: -0.3, my: -0.3 },
    { text: "SOFTWARE ENGINEER", font: FONT_BOLD, size: 0.1, color: "#e0f2fe", x: 0, y: -0.45, my: -0.45 },
    { text: "I BUILD END-TO-END SYSTEMS —", font: FONT_REG, size: 0.06, color: "#94a3b8", x: 0, y: -0.7, my: -0.7 },
    { text: "WEB EXPERIENCES, DEVELOPER TOOLS,", font: FONT_REG, size: 0.06, color: "#94a3b8", x: 0, y: -0.85, my: -0.85 },
    { text: "WEB3 INFRASTRUCTURE, DATA,", font: FONT_REG, size: 0.06, color: "#94a3b8", x: 0, y: -1.0, my: -1.0 },
    { text: "AND MACHINE LEARNING.", font: FONT_REG, size: 0.06, color: "#94a3b8", x: 0, y: -1.15, my: -1.15 },
    { text: "[ BUILDING AT THE EDGE OF SOFTWARE ]", font: FONT_REG, size: 0.05, color: "#94a3b8", x: 0, y: -1.4, my: -1.4 },
  ];
  return (
    <group
      position={isMobile ? [0, -2.0, 0.5] : [-2.6, 0.6, 0.5]}
      scale={isMobile ? 0.55 : 1}
    >
      {lines.map((spec) => (
        <TermLine key={spec.text} spec={spec} isMobile={isMobile} />
      ))}
    </group>
  );
}

export function AboutTexts({ isMobile }: { isMobile: boolean }) {
  const lines: LineSpec[] = [
    { text: "[ABOUT ME]", font: FONT_BOLD, size: 0.22, ms: 0.2, color: "#e0f2fe", x: 0, y: 1.8, my: 2.6 },
    { text: "$ whoami", font: FONT_BOLD, size: 0.09, ms: 0.08, color: "#88C0D0", x: 0, y: 1.3, my: 1.5 },
    { text: "CS ENGINEERING STUDENT @ OU", font: FONT_REG, size: 0.07, ms: 0.06, color: "#e0f2fe", x: 0, y: 1.1, my: 1.05 },
    { text: "I BUILD AT THE INTERSECTION OF", font: FONT_REG, size: 0.06, ms: 0.05, color: "#94a3b8", x: 0, y: 0.9, my: 0.65 },
    { text: "DEEP TECH, DATA, AND CREATIVE", font: FONT_REG, size: 0.06, ms: 0.05, color: "#94a3b8", x: 0, y: 0.75, my: 0.3 },
    { text: "WEB EXPERIENCES.", font: FONT_REG, size: 0.06, ms: 0.05, color: "#94a3b8", x: 0, y: 0.6, my: 0.0 },
    { text: "$ currently_building", font: FONT_BOLD, size: 0.09, ms: 0.08, color: "#88C0D0", x: 0, y: 0.2, my: -1.2 },
    { text: "→ TRUSTLESS SYSTEMS ON STARKNET", font: FONT_REG, size: 0.06, ms: 0.05, color: "#e0f2fe", x: 0, y: -0.05, my: -1.7 },
    { text: "→ ZERO-KNOWLEDGE PROOF INFRASTRUCTURE", font: FONT_REG, size: 0.06, ms: 0.05, color: "#e0f2fe", x: 0, y: -0.2, my: -2.15 },
    { text: "→ EFFICIENT MACHINE LEARNING MODELS", font: FONT_REG, size: 0.06, ms: 0.05, color: "#e0f2fe", x: 0, y: -0.35, my: -2.55 },
    { text: "→ IMMERSIVE 3D WEB EXPERIENCES", font: FONT_REG, size: 0.06, ms: 0.05, color: "#e0f2fe", x: 0, y: -0.5, my: -2.9 },
    { text: "$ outside_the_terminal", font: FONT_BOLD, size: 0.09, ms: 0.08, color: "#88C0D0", x: 2.6, y: 1.3, my: -4.5 },
    { text: "→ RICING ARCH / FEDORA", font: FONT_REG, size: 0.06, ms: 0.05, color: "#e0f2fe", x: 2.6, y: 1.05, my: -5.0 },
    { text: "→ ANALYZING F1 TELEMETRY", font: FONT_REG, size: 0.06, ms: 0.05, color: "#e0f2fe", x: 2.6, y: 0.9, my: -5.45 },
    { text: "→ SIM RACING", font: FONT_REG, size: 0.06, ms: 0.05, color: "#e0f2fe", x: 2.6, y: 0.75, my: -5.85 },
    { text: "→ ACTION GAMES", font: FONT_REG, size: 0.06, ms: 0.05, color: "#e0f2fe", x: 2.6, y: 0.6, my: -6.2 },
    { text: "$ contact", font: FONT_BOLD, size: 0.09, ms: 0.08, color: "#88C0D0", x: 2.6, y: 0.2, my: -7.4 },
    { text: "[ MAIL ]", font: FONT_BOLD, size: 0.08, ms: 0.075, color: "#e0f2fe", x: 2.6, y: -0.05, my: -7.9, to: "mailto:abdulkhader.dev@gmail.com" },
    { text: "[ LINKEDIN ]", font: FONT_BOLD, size: 0.08, ms: 0.075, color: "#e0f2fe", x: 3.9, y: -0.05, my: -8.4, to: "https://www.linkedin.com/in/invictus596/" },
  ];
  return (
    <group
      position={isMobile ? [0, 0.4, -12] : [-1.8, -0.6, -12]}
      scale={isMobile ? 0.55 : 1}
    >
      {lines.map((spec) => (
        <TermLine key={spec.text} spec={spec} isMobile={isMobile} />
      ))}
    </group>
  );
}

export function ProjectTexts({
  projectsGroupRef,
  isMobile,
}: {
  projectsGroupRef: RefObject<THREE.Group | null>;
  isMobile: boolean;
}) {
  return (
    <group
      ref={projectsGroupRef}
      position={[0, 0, -24]}
      scale={isMobile ? 0.5 : 1}
    >
      <CenteredText
        font={FONT_BOLD}
        size={0.2}
        height={0.02}
        position={isMobile ? [0, 8, 0] : [0, 3.2, 0]}
      >
        [MY PROJECTS]
        <meshStandardMaterial color="#e0f2fe" />
      </CenteredText>
      <CenteredText
        font={FONT_BOLD}
        size={0.08}
        height={0.02}
        position={isMobile ? [0, -6, 0.5] : [0, -2.8, 0.5]}
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
      {PROJECTS.map((p, i) => (
        <group
          key={p.title}
          position={isMobile ? [0, 5 - i * 3.0, 0] : [p.x, p.y, 0]}
        >
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
