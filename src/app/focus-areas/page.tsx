import type { Metadata } from "next";
import { BookOpen, Landmark, Palette, Scale } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { focusAreas } from "@/lib/focus-areas";

export const metadata: Metadata = {
  title: "Research Focus Areas",
  description: "The Institute's research focus areas.",
};

const icons = {
  landmark: Landmark,
  scale: Scale,
  palette: Palette,
  "book-open": BookOpen,
} as const;

export default function FocusAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="Focus Areas"
        lede="MIAS is a general pan-African research institute — these four areas anchor its current research agenda."
      />

      <div className="mx-auto max-w-3xl space-y-16 px-4 py-16 sm:px-6">
        {focusAreas.map((area) => {
          const Icon = icons[area.icon];
          return (
            <Reveal key={area.slug}>
              <section id={area.slug} className="scroll-mt-24">
                <Icon aria-hidden="true" className="h-8 w-8 text-teal-deep" />
                <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
                  {area.title}
                </h2>
                <p className="mt-3 text-lg text-ink-muted">{area.summary}</p>
              </section>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
