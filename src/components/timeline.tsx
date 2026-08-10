"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { FrameworkStage } from "@/lib/framework-stages";

/**
 * The connecting line draws in (scaleY, transform-origin: top) as the section
 * first enters view. This is the one place a "sequence" animation is justified
 * per MIAS_Animated_Frontend_PRD.md Sec. 4 — the content is genuinely
 * chronological, not decoratively numbered.
 */
export function Timeline({ stages }: { stages: FrameworkStage[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute top-2 left-[15px] w-px bg-turquoise"
        style={{ height: "calc(100% - 2rem)", transformOrigin: "top" }}
        variants={{
          hidden: { scaleY: shouldReduceMotion ? 1 : 0 },
          visible: {
            scaleY: 1,
            transition: { duration: shouldReduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] },
          },
        }}
      />

      <ol className="space-y-10">
        {stages.map((stage, index) => (
          <motion.li
            key={stage.slug}
            className="relative flex gap-6 pl-10"
            variants={{
              hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: shouldReduceMotion ? 0.15 : 0.3,
                  delay: shouldReduceMotion ? 0 : 0.4 + index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            <span
              aria-hidden="true"
              className="absolute top-1 left-2 h-3 w-3 rounded-full border-2 border-turquoise bg-paper"
            />
            <div>
              <p className="font-mono-ledger text-xs tracking-widest text-teal-deep uppercase">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                {stage.label}
              </h3>
              <p className="mt-2 max-w-xl text-ink-muted">{stage.summary}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
