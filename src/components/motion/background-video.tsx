"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { isSlowConnection } from "@/lib/connection";

const noopSubscribe = () => () => {};

/**
 * Generic self-hosted background video with the same graceful-degradation
 * rule used everywhere on the site: never autoplay a moving background under
 * prefers-reduced-motion or a reported slow/data-saver connection — show the
 * static poster frame instead, a complete look rather than a broken one.
 */
export function BackgroundVideo({
  src,
  poster,
  className = "absolute inset-0 h-full w-full object-cover",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const isSlow = useSyncExternalStore(noopSubscribe, isSlowConnection, () => false);

  if (shouldReduceMotion || isSlow) {
    return <Image src={poster} alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover" />;
  }

  return (
    <video aria-hidden="true" className={className} poster={poster} autoPlay muted loop playsInline preload="metadata">
      <source src={src} type="video/mp4" />
    </video>
  );
}
