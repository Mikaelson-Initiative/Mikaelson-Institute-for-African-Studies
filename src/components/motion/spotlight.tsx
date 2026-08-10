"use client";

import { motion, useSpring, useTransform, type SpringOptions } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

/**
 * A single, restrained mouse-following glow — ported from an external
 * reference (mias/components/ui/spotlight.tsx) and re-themed in Turquoise.
 * Opacity/position only, fades in on hover, fades out on leave: a clear
 * cause-and-effect animation, not ambient decoration.
 *
 * Placed once, on the hero — not on the Focus Area cards, which have their
 * own deliberately simpler "background shift only" hover rule
 * (MIAS_Animated_Frontend_PRD.md Sec. 4) that this would otherwise clash with.
 */
export function Spotlight({ className = "", size = 450, springOptions = { bounce: 0 } }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    parent.style.position = "relative";
    parent.style.overflow = "hidden";
    setParentElement(parent);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement],
  );

  useEffect(() => {
    if (!parentElement) return;
    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);
    parentElement.addEventListener("mousemove", handleMouseMove);
    parentElement.addEventListener("mouseenter", onEnter);
    parentElement.addEventListener("mouseleave", onLeave);
    return () => {
      parentElement.removeEventListener("mousemove", handleMouseMove);
      parentElement.removeEventListener("mouseenter", onEnter);
      parentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] from-turquoise/20 via-turquoise/8 to-transparent blur-2xl transition-opacity duration-300 ${
        isHovered ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{ width: size, height: size, left: spotlightLeft, top: spotlightTop }}
    />
  );
}
