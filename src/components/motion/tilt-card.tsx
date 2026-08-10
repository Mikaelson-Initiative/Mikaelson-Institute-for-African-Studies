"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

const TILT_DEGREES = 6;

/**
 * Tilts toward the cursor within its own bounds — rotateX/rotateY only
 * (transform, never width/height/top/left), small range, spring-damped so
 * it settles rather than jitters. Disabled entirely under reduced motion,
 * same as the cursor follower: this is 1:1 with pointer input, but it's
 * still motion some users specifically want off.
 */
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springConfig = { damping: 20, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [TILT_DEGREES, -TILT_DEGREES]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-TILT_DEGREES, TILT_DEGREES]), springConfig);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        transformPerspective: 800,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
