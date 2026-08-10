"use client";

import { BackgroundVideo } from "@/components/motion/background-video";

/**
 * The hero's cinematic backdrop: African-empire landmark fragments
 * converging into the continent's outline (generated, Higgsfield/Seedance).
 * Self-hosted from public/hero/ rather than hotlinked from the generation
 * host. Kept light per the low-bandwidth constraint (MIAS_Design_PRD.md
 * Sec. 6): re-encoded to ~600KB with audio stripped (it autoplays muted, the
 * track was dead weight). Degradation rules live in BackgroundVideo.
 */
export function HeroVideo() {
  return (
    <BackgroundVideo
      src="/hero/africa-empires-converge.mp4"
      poster="/hero/africa-empires-converge-poster.jpg"
    />
  );
}
