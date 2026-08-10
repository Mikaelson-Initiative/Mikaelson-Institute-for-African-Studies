"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const INTERVAL_MS = 2500;

/**
 * Cycles through a word list on a timer — opacity + translateY only, 350ms,
 * ease-out. This is a second ambient/looping exception alongside the hero's
 * palimpsest drift (MIAS_Animated_Frontend_PRD.md Sec. 4 originally scoped
 * that to "the one place ambient motion is acceptable"); freezes on the
 * first word under prefers-reduced-motion, same as the drift does.
 */
export function RotatingWord({ words, className = "" }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Fixed to the longest word's width so switching words never reflows the
  // headline (and, with it, the whole hero's height) — the bug being fixed.
  const longestWordChars = Math.max(...words.map((word) => word.length));

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [shouldReduceMotion, words.length]);

  return (
    <span className="relative inline-block">
      <span
        aria-hidden="true"
        style={{ minWidth: `${longestWordChars}ch` }}
        className={`relative inline-block text-center ${className}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">{words.join(", ")}.</span>
    </span>
  );
}
