import type { Metadata } from "next";
import { Users2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderNotice } from "@/components/placeholder-notice";

export const metadata: Metadata = {
  title: "Community",
  description: "How to engage with the Mikaelson Institute for African Studies community.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHero eyebrow="Community" title="Community" />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal>
          <PlaceholderNotice>
            what &ldquo;Community&rdquo; means for MIAS — a reader/student
            mailing list, a discussion forum, seminars and events, partner
            institutions — hasn&rsquo;t been defined yet. Not invented for
            this build; content goes here once the Institute decides its
            scope.
          </PlaceholderNotice>

          <div className="mt-10 flex flex-col items-center rounded-lg border border-dashed border-ink/20 bg-paper p-10 text-center">
            <Users2 aria-hidden="true" className="h-10 w-10 text-ink/30" />
            <p className="mt-3 font-mono-ledger text-xs text-ink-muted">
              Community content pending
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}
