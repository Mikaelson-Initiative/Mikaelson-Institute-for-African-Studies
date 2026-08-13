"use client";

import { motion, type useMotionValue } from "framer-motion";

// Tight spring for cursor-follow — buttery, no overshoot. Shared by any
// kinetic list (team, partners, ...) that previews an image near the cursor.
export const cursorSpring = { stiffness: 260, damping: 28 };

// Receives motion-value x/y so position updates happen outside React's
// render cycle — no state re-renders on every mousemove.
export function FloatingImage({
  src,
  alt,
  x,
  y,
}: {
  src: string;
  alt: string;
  x: ReturnType<typeof useMotionValue<number>>;
  y: ReturnType<typeof useMotionValue<number>>;
}) {
  return (
    <motion.div
      className="pointer-events-none fixed z-[9999] hidden overflow-hidden rounded-2xl shadow-2xl sm:block"
      style={{
        width: 140,
        height: 196,
        x,
        y,
        translateX: 20,
        translateY: -98,
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} draggable={false} className="h-full w-full object-cover" />
      {/* Vignette ring */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/20" />
    </motion.div>
  );
}
