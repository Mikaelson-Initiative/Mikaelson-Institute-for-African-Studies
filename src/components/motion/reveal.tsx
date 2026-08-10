"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds — used sparingly, e.g. for the hero's title→subtext→CTA order. */
  delay?: number;
};

/**
 * Fades + rises content in once, the first time it scrolls into view, and never
 * re-triggers on scroll up/down (MIAS_Animated_Frontend_PRD.md Sec. 4). Collapses
 * to a plain opacity fade under prefers-reduced-motion — non-negotiable per Sec. 4.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: shouldReduceMotion ? 0.15 : 0.4,
        ease: [0.16, 1, 0.3, 1],
        delay: shouldReduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
