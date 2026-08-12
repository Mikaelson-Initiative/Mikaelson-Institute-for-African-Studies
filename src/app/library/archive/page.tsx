import type { Metadata } from "next";
import { Archive } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderNotice } from "@/components/placeholder-notice";

export const metadata: Metadata = {
  title: "Published Papers / Archive",
  description:
    "The permanent, citable archive of peer-reviewed papers accepted by the Mikaelson Institute for African Studies.",
};

export default function ArchivePage() {
  return (
    <>
      <PageHero eyebrow="Library" title="Published Papers / Archive" />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal>
          <PlaceholderNotice>
            the archive populates once the first Call for Papers cohort completes review —
            no papers, authors, or citations are invented for this build.
          </PlaceholderNotice>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg border border-dashed border-ink/20 bg-paper p-6 text-center"
              >
                <Archive aria-hidden="true" className="h-10 w-10 text-ink/30" />
                <p className="mt-3 font-mono-ledger text-xs text-ink-muted">Paper pending</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </>
  );
}
