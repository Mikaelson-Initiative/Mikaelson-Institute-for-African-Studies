"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-linked "tilt to flat" reveal — adapted from an external reference
 * (mias/components/ui/container-scroll-animation.tsx), restyled in brand
 * colors and sized for a compact content grid rather than a single hero
 * image. Continuous scroll-tied rotation/scale is exactly the kind of motion
 * prefers-reduced-motion exists for, so it's disabled entirely (static,
 * flat, no scroll-tied transform) when that's set — not just shortened.
 */
export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: ReactNode;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleRange: [number, number] = isMobile ? [0.9, 0.97] : [1.04, 1];

  const rotate = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -32]);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center">
      <div className="w-full py-10 md:py-16" style={{ perspective: "1000px" }}>
        <Header translate={shouldReduceMotion ? 0 : translate} titleComponent={titleComponent} />
        <Card rotate={shouldReduceMotion ? 0 : rotate} scale={shouldReduceMotion ? 1 : scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Header({
  translate,
  titleComponent,
}: {
  translate: number | MotionValue<number>;
  titleComponent: ReactNode;
}) {
  return (
    <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
      {titleComponent}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate: number | MotionValue<number>;
  scale: number | MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026",
      }}
      className="mx-auto mt-8 w-full max-w-5xl rounded-[30px] border-4 border-teal-deep-panel bg-teal-deep-panel p-2 md:mt-12 md:p-4"
    >
      <div className="w-full overflow-hidden rounded-2xl bg-beige p-4 md:p-8">{children}</div>
    </motion.div>
  );
}
