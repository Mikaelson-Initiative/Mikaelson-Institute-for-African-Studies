"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Ghosted historical place-names layered behind the hero content — the
 * "palimpsest" concept from MIAS_Design_PRD.md Sec. 3: older history visible
 * beneath the new, not replaced by it.
 *
 * Positions/timing are fixed (not randomized) so server and client render
 * identically — no hydration mismatch.
 */
const NAMES = [
  { name: "Kush", top: "12%", left: "8%", size: "text-2xl", duration: 11, delay: 0 },
  { name: "Aksum", top: "22%", left: "62%", size: "text-4xl", duration: 14, delay: 1.5 },
  { name: "Great Zimbabwe", top: "68%", left: "4%", size: "text-3xl", duration: 12.5, delay: 3 },
  { name: "Mali Empire", top: "8%", left: "40%", size: "text-xl", duration: 9.5, delay: 2 },
  { name: "Ife", top: "78%", left: "70%", size: "text-2xl", duration: 13, delay: 0.5 },
  { name: "Songhai", top: "45%", left: "82%", size: "text-3xl", duration: 15, delay: 4 },
  { name: "Nubia", top: "55%", left: "30%", size: "text-xl", duration: 10, delay: 5 },
  { name: "Kongo", top: "30%", left: "18%", size: "text-2xl", duration: 12, delay: 2.5 },
] as const;

/**
 * Feature flag per MIAS_Animated_Frontend_PRD.md Sec. 7/8 — this is the one
 * approved ambient-motion exception, kept easy to disable while it's evaluated
 * live rather than debated in the abstract. Defaults on.
 */
const DRIFT_ENABLED = process.env.NEXT_PUBLIC_ENABLE_HERO_DRIFT !== "false";

export function PalimpsestNames() {
  const shouldReduceMotion = useReducedMotion();
  const drifting = DRIFT_ENABLED && !shouldReduceMotion;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {NAMES.map((item) =>
        drifting ? (
          <motion.span
            key={item.name}
            className={`absolute font-display font-semibold tracking-wide text-paper ${item.size}`}
            style={{ top: item.top, left: item.left }}
            initial={{ opacity: 0.06 }}
            animate={{ opacity: [0.06, 0.16, 0.06] }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.name}
          </motion.span>
        ) : (
          <span
            key={item.name}
            className={`absolute font-display font-semibold tracking-wide text-paper opacity-[0.1] ${item.size}`}
            style={{ top: item.top, left: item.left }}
          >
            {item.name}
          </span>
        ),
      )}
    </div>
  );
}
