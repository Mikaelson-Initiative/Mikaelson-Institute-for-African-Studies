import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PlaceholderNotice } from "@/components/placeholder-notice";

export const metadata: Metadata = {
  title: "Terms of Submission",
  description: "Authorship and copyright terms for papers submitted to MIAS.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Submission" />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <PlaceholderNotice>
          authorship and copyright terms for submitted work go here once the
          Institute confirms existing legal language, or decides to draft new
          terms from scratch (MIAS_PRD.md Sec. 10, Q5).
        </PlaceholderNotice>
      </div>
    </>
  );
}
