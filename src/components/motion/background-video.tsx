"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { isSlowConnection } from "@/lib/connection";

const noopSubscribe = () => () => {};

/**
 * Generic self-hosted background video with the same graceful-degradation
 * rule used everywhere on the site: never autoplay a moving background under
 * prefers-reduced-motion or a reported slow/data-saver connection — show the
 * static poster frame instead, a complete look rather than a broken one.
 *
 * Also never fetches the video until it's actually near the viewport — a
 * below-the-fold instance (e.g. the Library section's video) shouldn't
 * compete with the hero video for bandwidth on initial load. An
 * above-the-fold instance is already in view on mount, so this costs it
 * nothing.
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isNearViewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsNearViewport(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isNearViewport]);

  if (shouldReduceMotion || isSlow || !isNearViewport) {
    // A permanent fallback (reduced motion / slow connection) is real,
    // above-the-fold-capable content, so it can be an LCP priority image;
    // "just not near the viewport yet" is a temporary placeholder for a
    // video that hasn't started loading, never priority.
    const isPermanentFallback = shouldReduceMotion || isSlow;
    return (
      <div ref={containerRef} className="absolute inset-0 h-full w-full">
        <Image src={poster} alt="" aria-hidden="true" fill priority={isPermanentFallback} sizes="100vw" className="object-cover" />
      </div>
    );
  }

  return (
    <video aria-hidden="true" className={className} poster={poster} autoPlay muted loop playsInline preload="metadata">
      <source src={src} type="video/mp4" />
    </video>
  );
}
