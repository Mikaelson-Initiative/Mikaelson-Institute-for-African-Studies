"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { isSlowConnection } from "@/lib/connection";

const GlobeScene = dynamic(
  () => import("@/components/globe/globe-scene").then((mod) => mod.GlobeScene),
  { ssr: false },
);

const noopSubscribe = () => () => {};

/**
 * The hero's 3D backdrop — our own globe (Steps 1-2 of the pinned-scroll-
 * globe brief), not a video. Kept light per the low-bandwidth constraint
 * (MIAS_Design_PRD.md Sec. 6): skipped entirely on a reported slow/data-saver
 * connection (falls back to the plain Deep Teal hero background, still a
 * complete design, not a broken one), non-interactive (pointer-events-none,
 * purely decorative), and dimmed so hero text stays legible over it.
 *
 * useSyncExternalStore rather than useEffect+setState: `navigator.connection`
 * is a client-only value that can legitimately differ from the server's
 * render, and getServerSnapshot exists precisely for that — it's never
 * invoked during SSR, so isSlowConnection() only ever runs in the browser.
 */
export function HeroGlobe() {
  const shouldRender = useSyncExternalStore(
    noopSubscribe,
    () => !isSlowConnection(),
    () => false,
  );

  if (!shouldRender) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30">
      <GlobeScene background="transparent" />
    </div>
  );
}
