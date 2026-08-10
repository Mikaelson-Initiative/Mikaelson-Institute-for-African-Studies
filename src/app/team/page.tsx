import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderNotice } from "@/components/placeholder-notice";

export const metadata: Metadata = {
  title: "Team",
  description: "The Mikaelson Institute for African Studies' editorial board and fellows.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero eyebrow="People" title="Team & Fellows" />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal>
          <PlaceholderNotice>
            the editorial board, founding team, and research fellows launch
            here once bios and photos are confirmed (MIAS_PRD.md Sec. 10, Q2)
            — no names or roles are invented for this build.
          </PlaceholderNotice>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg border border-dashed border-ink/20 bg-paper p-6 text-center"
              >
                <Users aria-hidden="true" className="h-10 w-10 text-ink/30" />
                <p className="mt-3 font-mono-ledger text-xs text-ink-muted">
                  Bio pending
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </>
  );
}
