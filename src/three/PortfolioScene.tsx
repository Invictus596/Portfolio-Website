import { Component, Suspense, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  useScroll,
} from "@react-three/drei";
import * as THREE from "three";
import { HeroTexts, AboutTexts, ProjectTexts } from "./texts";

/**
 * The postprocessing `Pixelation` ref isn't exported with a usable type, so we
 * describe only the surface we touch. Granularity is driven from the camera
 * distance inside the render loop.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PixelationHandle = any;

const _turntableAxis = new THREE.Vector3(0, 1, 0);
const _turntableQuat = new THREE.Quaternion();
const _localZAxis = new THREE.Vector3(0, 0, 1);
const _spinQuat = new THREE.Quaternion();

/** Keeps the 3D scene alive when the HDR environment fails to load. */
class EnvBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Shader portal used by the aperture walls: a pixelated iris that opens as the
 * camera approaches, tinted with the Nord palette (converted to linear space).
 */
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

export function PortfolioScene({
  pixelRef,
  isMobile,
}: {
  pixelRef: RefObject<PixelationHandle>;
  isMobile: boolean;
}) {
  const { scene } = useGLTF("/models/portfolio_scene.glb");
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const clickedMesh = useRef<THREE.Mesh | null>(null);
  const projectsGroupRef = useRef<THREE.Group>(null);
  const glassManRef = useRef<THREE.Mesh>(null);
  const glassShardRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wall1Mat = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if (!glassManRef.current.userData.basePos) {
        glassManRef.current.userData.basePos =
          glassManRef.current.position.clone();
      }
    }
    if (glassShardRef.current && !glassShardRef.current.userData.basePos) {
      glassShardRef.current.userData.basePos =
        glassShardRef.current.position.clone();
    }
  }, [scene]);

  useEffect(() => {
    const scale = isMobile ? 0.65 : 1;
    // GLB Rx(π/2): world = (localX, −localZ, localY).
    // GlassMan: localZ=-2 → worldY=2 (hero top). GlassShard: localZ=-4 → worldY=4 (about top).
    const applyLayout = (
      mesh: THREE.Mesh | null,
      baseX: number,
      mobileZ: number,
    ) => {
      if (!mesh) return;
      mesh.scale.setScalar(scale);
      const base = mesh.userData.basePos as THREE.Vector3 | undefined;
      if (base) {
        const x = isMobile ? baseX : base.x;
        const z = isMobile ? mobileZ : base.z;
        mesh.position.set(x, base.y, z);
      }
    };
    applyLayout(glassManRef.current, 0.0, -2);
    applyLayout(glassShardRef.current, 0.0, -4);
  }, [isMobile]);

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
    const camDist =
      currentSection === 0 ? 5 : isMobile ? 8 : currentSection === 2 ? 8 : 5;
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
        <HeroTexts isMobile={isMobile} />
        <AboutTexts isMobile={isMobile} />
        <ProjectTexts projectsGroupRef={projectsGroupRef} isMobile={isMobile} />
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
