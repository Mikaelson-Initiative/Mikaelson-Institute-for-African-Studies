import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { SectionLabel } from "@/components/section-label";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The people behind Mikaelson Institute for African Studies — researchers, scholars, editors, and community members committed to rigorous African scholarship.",
};

const categories = [
  "Executive Leadership",
  "Research Fellows",
  "Research Associates",
  "Editorial Team",
  "Library & Archives",
  "Advisory Council",
];

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="People"
        title="The people who make the work possible."
        lede="Mikaelson Institute for African Studies is built around people who believe that knowledge is a public responsibility."
      />

      <div className="mx-auto max-w-3xl space-y-16 px-4 py-16 sm:px-6">

        {/* Introductory statement */}
        <Reveal>
          <div className="space-y-4 text-lg text-ink">
            <p>
              Our community brings together researchers, scholars, writers,
              editors, cultural practitioners, students, and institutional
              collaborators committed to deepening the study of Africa.
            </p>
            <p>
              We are intentionally interdisciplinary because the questions facing
              African societies rarely belong to one discipline alone.
            </p>
            <p>
              We do not believe that intellectual life belongs exclusively to
              universities. A serious research institution can learn from
              historians and philosophers, but also from artists, journalists,
              community leaders, archivists, educators, traditional knowledge
              holders, and people whose lived experiences challenge established
              assumptions.
            </p>
          </div>
        </Reveal>

        {/* Category placeholders */}
        {categories.map((category, i) => (
          <Reveal key={category} delay={i * 0.05}>
            <SectionLabel>{category}</SectionLabel>
            <PlaceholderNotice>
              bios and profiles for{" "}
              <strong>{category}</strong> will appear here once confirmed — no
              names, credentials, or affiliations are invented for this build.
            </PlaceholderNotice>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-lg border border-dashed border-ink/20 bg-paper p-6 text-center"
                >
                  <Users aria-hidden="true" className="h-8 w-8 text-ink/25" />
                  <p className="mt-3 font-mono-ledger text-xs text-ink-muted">
                    Bio pending
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
