import type { Transition, Variants } from "framer-motion";

/**
 * Central timing/easing scale for the whole site (MIAS_Animated_Frontend_PRD.md
 * Sec. 4 + Sec. 6 "Consistency" checklist item — no page invents its own timing).
 */
export const DURATION = {
  micro: 0.2, // hover/focus states, card hover
  reveal: 0.4, // section/content reveals — the spec's upper bound
} as const;

export const EASE_ENTER = [0.16, 1, 0.3, 1] as const; // ease-out
export const EASE_EXIT = [0.7, 0, 0.84, 0] as const; // ease-in

export const enterTransition: Transition = {
  duration: DURATION.reveal,
  ease: EASE_ENTER,
};

export const microTransition: Transition = {
  duration: DURATION.micro,
  ease: EASE_ENTER,
};

/** Opacity + translateY only — never a layout-affecting property. */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: enterTransition },
};

export const fadeUpVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

/** Stagger container for a small, bounded set of children (hero: title/subtext/CTA). */
export function staggerContainer(staggerChildren: number): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren: 0 },
    },
  };
}
