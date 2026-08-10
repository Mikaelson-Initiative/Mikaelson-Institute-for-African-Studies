"use client";

import { useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/motion/background-video";

/**
 * The book-opening centerpiece for the Library section. Title text is real
 * HTML (correctly spelled, accessible), not baked into the video — AI video
 * models render in-video text unreliably. It's timed to fade out as the
 * cover starts to open (see .animate-book-title, ~4s to match the loop);
 * under reduced motion the video doesn't autoplay at all, so the title just
 * stays put rather than running a fade tied to motion that isn't happening.
 */
export function LibraryShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
      <BackgroundVideo src="/library/book-opening.mp4" poster="/library/book-opening-poster.jpg" />
      <div aria-hidden="true" className="absolute inset-0 bg-teal-deep/30" />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <p
          className={`text-center font-display text-2xl font-semibold text-paper sm:text-4xl ${
            shouldReduceMotion ? "" : "animate-book-title"
          }`}
        >
          African History of Africa
        </p>
      </div>
    </div>
  );
}
