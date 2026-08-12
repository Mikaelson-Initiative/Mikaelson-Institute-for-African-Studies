import type { Metadata } from "next";
import { Landmark, Scale, Palette, BookOpen, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SubmitPaperForm } from "@/components/forms/submit-paper-form";
import { SectionLabel } from "@/components/section-label";
import { focusAreas } from "@/lib/focus-areas";

export const metadata: Metadata = {
  title: "Submit a Paper",
  description:
    "Submit original scholarship to Mikaelson Institute for African Studies across history & decolonization, society & politics, arts & culture, and religion & philosophy.",
};

const iconMap = {
  landmark: Landmark,
  scale: Scale,
  palette: Palette,
  "book-open": BookOpen,
} as const;

const qualities = [
  {
    word: "Original.",
    detail: "It contributes something new — not just a summary of existing work.",
  },
  {
    word: "Rigorous.",
    detail:
      "It takes sources, methodology, and evidence seriously.",
  },
  {
    word: "Relevant.",
    detail: "It speaks to questions that matter in African studies.",
  },
  {
    word: "Thoughtful.",
    detail:
      "It recognizes complexity rather than reducing Africa to simple narratives.",
  },
  {
    word: "Accessible.",
    detail:
      "Academic clarity is a virtue. Necessary difficulty only.",
  },
];

export default function SubmitPage() {
  return (
    <div className="bg-beige">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="bg-teal-deep text-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <Reveal>
            <p className="font-mono-ledger text-xs tracking-widest text-turquoise uppercase">
              Submissions
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Submit a Paper
            </h1>
            <p className="mt-4 max-w-2xl text-base text-paper/80 sm:text-lg">
              We invite researchers, scholars, independent intellectuals, and
              emerging academics to contribute original work to African
              scholarship.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── Two-column body ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-16 lg:grid-cols-[1fr_480px] lg:gap-12 xl:gap-20">

          {/* Left — editorial context */}
          <div className="space-y-14">

            {/* Focus areas */}
            <Reveal>
              <SectionLabel>Research Areas</SectionLabel>
              <p className="mt-3 text-base text-ink-muted">
                We accept work across all four of the Institute&rsquo;s research
                areas. Interdisciplinary work is encouraged.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {focusAreas.map((area) => {
                  const Icon = iconMap[area.icon];
                  return (
                    <div
                      key={area.slug}
                      className="flex gap-3 rounded-lg border border-ink/10 bg-paper p-4"
                    >
                      <Icon
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-teal-deep"
                      />
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {area.title}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {area.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            {/* What we look for */}
            <Reveal>
              <SectionLabel>What We Look For</SectionLabel>
              <div className="mt-6 space-y-5">
                {qualities.map((q) => (
                  <div key={q.word} className="flex gap-3">
                    <ArrowRight
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep"
                    />
                    <p className="text-base text-ink">
                      <span className="font-semibold">{q.word}</span>{" "}
                      <span className="text-ink-muted">{q.detail}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Review note */}
            <Reveal>
              <SectionLabel>Review Process</SectionLabel>
              <p className="mt-3 text-base text-ink-muted">
                Depending on the programme, submissions may undergo editorial,
                peer, or expert review. You will be notified by email at each
                stage. No account is required — you will receive a tracking link
                immediately after submission.
              </p>
              <p className="mt-3 text-sm text-ink-muted">
                Before submitting, please read the{" "}
                <a
                  href="/terms"
                  className="text-teal-deep underline"
                >
                  Terms of Submission
                </a>{" "}
                and{" "}
                <a
                  href="/call-for-papers"
                  className="text-teal-deep underline"
                >
                  Call for Papers
                </a>
                .
              </p>
            </Reveal>

            {/* Closing statement */}
            <Reveal>
              <blockquote className="border-l-2 border-teal-deep pl-5">
                <p className="text-lg font-medium text-ink">
                  Africa must not only be studied by the world.
                </p>
                <p className="mt-1 text-lg font-medium text-ink">
                  Africa must also be a place from which the world produces
                  knowledge.
                </p>
              </blockquote>
            </Reveal>
          </div>

          {/* Right — submission form */}
          <div className="lg:pt-0">
            <Reveal>
              <div className="sticky top-24 rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm sm:p-8">
                <h2 className="font-display text-xl font-semibold text-ink">
                  Submission Form
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  All fields are required unless marked optional.
                </p>
                <div className="mt-6">
                  <SubmitPaperForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
