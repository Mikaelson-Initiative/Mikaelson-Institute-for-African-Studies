"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { hasFinePointer } from "@/lib/pointer";

const noopSubscribe = () => () => {};
const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, select";

/**
 * A ring that trails the cursor — the real system cursor stays visible
 * underneath; this is an accent layered on top, not a replacement. A true
 * cursor-hide is the part of custom cursors that actually causes
 * accessibility problems (lag, failure modes, confusion), so it's avoided
 * here. Fine-pointer devices only (no phantom cursor on touch) and fully
 * disabled under prefers-reduced-motion — cursor-follow is a textbook case
 * of motion some users specifically want off, even though it's 1:1 with
 * input rather than ambient.
 *
 * mix-blend-mode: difference on a white ring guarantees visibility against
 * any background color on this site (beige, paper, or Deep Teal) without
 * needing to know which section is underneath.
 */
export function CursorFollower() {
  const shouldReduceMotion = useReducedMotion();
  const finePointer = useSyncExternalStore(noopSubscribe, hasFinePointer, () => false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 25, stiffness: 300, mass: 0.5 });
  const springY = useSpring(y, { damping: 25, stiffness: 300, mass: 0.5 });

  const enabled = finePointer && !shouldReduceMotion;

  useEffect(() => {
    if (!enabled) return;

    function handleMove(event: MouseEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      setIsVisible(true);
    }
    function handleOver(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      setIsInteractive(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    }
    function handleLeaveWindow() {
      setIsVisible(false);
    }

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseleave", handleLeaveWindow);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseleave", handleLeaveWindow);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%", opacity: isVisible ? 1 : 0 }}
    >
      <motion.div
        className="rounded-full border-2 border-white"
        animate={{
          width: isInteractive ? 48 : 20,
          height: isInteractive ? 48 : 20,
          backgroundColor: isInteractive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
