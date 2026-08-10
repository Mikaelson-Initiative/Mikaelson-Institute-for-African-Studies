"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  /** Seconds between each child's reveal. Hero: ~0.12. List entries: 0.04–0.06. */
  staggerChildren?: number;
  /** Trigger once on scroll into view rather than immediately on mount. */
  onViewport?: boolean;
};

/**
 * Parent for a small, bounded set of children that should reveal in reading
 * order (title → subtext → CTA), or a light list stagger (archive entries).
 * Each child must be a <StaggerItem>.
 */
export function StaggerGroup({
  children,
  className,
  staggerChildren = 0.12,
  onViewport = false,
}: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerChildren,
      },
    },
  };

  const viewportProps = onViewport
    ? { whileInView: "visible" as const, viewport: { once: true, margin: "-80px" } }
    : { animate: "visible" as const };

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={containerVariants}
      {...viewportProps}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.35,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
