"use client";

import { useReducedMotion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Landmark, Palette, Scale } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TiltCard } from "@/components/motion/tilt-card";
import type { FocusArea } from "@/lib/focus-areas";

const icons = {
  landmark: Landmark,
  scale: Scale,
  palette: Palette,
  "book-open": BookOpen,
} as const;

const PAGE_HEIGHT_CLASS = "h-[26rem] sm:h-[24rem]";

/**
 * Back to the ContainerScroll-framed nested reader per Michael's request.
 * Trade-off worth remembering: this only captures scroll while the cursor is
 * actually over the box — the full-viewport pinned version (removed here)
 * was the fix for "don't let scroll leak past it regardless of mouse
 * position." Each page is still a real link to its own page (added after
 * this container was first built), and still tilts toward the cursor.
 */
export function FocusAreaReader({ areas }: { areas: FocusArea[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const pageHeight = track.clientHeight;
      if (pageHeight === 0) return;
      setIndex(Math.round(track.scrollTop / pageHeight));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (nextIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(areas.length - 1, nextIndex));
    track.scrollTo({
      top: clamped * track.clientHeight,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="mx-auto flex max-w-md items-stretch gap-3">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Research focus areas"
        className={`flex-1 snap-y snap-mandatory overflow-y-auto ${PAGE_HEIGHT_CLASS} [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {areas.map((area, i) => {
          const Icon = icons[area.icon];
          return (
            <div
              key={area.slug}
              className={`w-full shrink-0 snap-start px-1 ${PAGE_HEIGHT_CLASS}`}
              aria-hidden={i !== index}
            >
              <TiltCard className="h-full">
                <Link
                  href={`/focus-areas#${area.slug}`}
                  className="group flex h-full flex-col items-center justify-center rounded-2xl bg-paper px-6 py-8 text-center transition-colors duration-200 hover:bg-beige-panel sm:px-10"
                >
                  <Icon aria-hidden="true" className="h-12 w-12 text-teal-deep" />
                  <h3 className="mt-6 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    {area.title}
                  </h3>
                  <p className="mt-4 text-base text-ink-muted sm:text-lg">{area.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-deep group-hover:gap-2">
                    Explore this area →
                  </span>
                </Link>
              </TiltCard>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous focus area"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink/20 text-ink transition-colors duration-200 hover:border-teal-deep hover:text-teal-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronUp aria-hidden="true" className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center gap-2" role="tablist" aria-label="Focus area pages">
          {areas.map((a, i) => (
            <button
              key={a.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to ${a.title}`}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
                i === index ? "bg-teal-deep" : "bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === areas.length - 1}
          aria-label="Next focus area"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink/20 text-ink transition-colors duration-200 hover:border-teal-deep hover:text-teal-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronDown aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Page {index + 1} of {areas.length}: {areas[index]?.title}
      </p>
    </div>
  );
}
