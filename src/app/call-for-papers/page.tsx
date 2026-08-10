import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { focusAreas } from "@/lib/focus-areas";

export const metadata: Metadata = {
  title: "Call for Papers",
  description: "Current submission guidelines for the Mikaelson Institute for African Studies.",
};

export default function CallForPapersPage() {
  return (
    <>
      <PageHero
        eyebrow="Call for Papers"
        title="We welcome submissions across all four focus areas."
      />

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-16 sm:px-6">
        <Reveal>
          <PlaceholderNotice>
            the current cycle&rsquo;s deadline, word-count limits, and citation
            format go here once the Institute confirms them — not invented for
            this build.
          </PlaceholderNotice>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-xl font-semibold text-ink">Scope</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-ink-muted">
            {focusAreas.map((area) => (
              <li key={area.slug}>{area.title}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-xl font-semibold text-ink">Review Process</h2>
          <p className="mt-3 text-ink-muted">
            Submissions move through editorial review: <em>submitted</em> →{" "}
            <em>in review</em> → <em>revisions requested</em> (if needed) →{" "}
            <em>accepted</em> or <em>rejected</em>. Accepted papers are
            assigned to a forthcoming volume. You&rsquo;ll be notified by
            email at every status change.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-xl font-semibold text-ink">How to Submit</h2>
          <p className="mt-3 text-ink-muted">
            Submit your abstract and a PDF or DOCX of your paper through the
            submission form. No account is required — you&rsquo;ll receive a
            confirmation email with a link to track your submission&rsquo;s
            status.
          </p>
          <div className="mt-6">
            <Button href="/submit">Submit a Paper</Button>
          </div>
        </Reveal>
      </div>
    </>
  );
}
