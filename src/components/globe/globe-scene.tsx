"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { Group } from "three";
import { globeMarkers } from "@/lib/globe-markers";
import { latLongToVector3 } from "@/lib/geo";

const GLOBE_RADIUS = 1.5;
const MARKER_RADIUS = GLOBE_RADIUS + 0.02;

/**
 * Step 2 of the pinned-scroll-globe brief: static glowing points for the 15
 * pre-colonial civilizations (Technical Brief Sec. 2), still auto-rotating
 * with the globe, no scroll or labels yet. Light Yellow is the brand's
 * sanctioned "sparing highlight" color for exactly this kind of marker/dot
 * use (MIAS_Design_PRD.md Sec. 2).
 */
function Markers() {
  return (
    <>
      {globeMarkers.map((marker) => {
        const position = latLongToVector3(marker.lat, marker.lon, MARKER_RADIUS);
        return (
          <mesh key={marker.slug} position={position}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#ffe665" />
          </mesh>
        );
      })}
    </>
  );
}

/**
 * Step 1 of the pinned-scroll-globe brief: a bare, auto-rotating sphere,
 * no scroll logic. Styled from brand tokens, not a photoreal earth texture —
 * a flat Deep Teal sphere with a Turquoise wireframe shell standing in for a
 * lat/long grid.
 */
function Globe() {
  const groupRef = useRef<Group>(null);
  const shouldReduceMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (!groupRef.current || shouldReduceMotion) return;
    groupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
        <meshStandardMaterial color="#003e45" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.005, 24, 16]} />
        <meshBasicMaterial color="#5ce1e6" wireframe transparent opacity={0.35} />
      </mesh>
      <Markers />
    </group>
  );
}

export function GlobeScene({ background = "#e9e1d8" }: { background?: string | "transparent" }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: background === "transparent" }}
    >
      {background !== "transparent" && <color attach="background" args={[background]} />}
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 3, 5]} intensity={1.1} />
      <Globe />
    </Canvas>
  );
}
