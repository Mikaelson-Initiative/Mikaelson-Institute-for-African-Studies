import type { Metadata } from "next";
import Image from "next/image";
import {
  Landmark,
  Scale,
  Palette,
  BookOpen,
  Microscope,
  Send,
  Search,
  MessageSquareText,
  BadgeCheck,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { SubmitPaperForm } from "@/components/forms/submit-paper-form";
import { SectionLabel } from "@/components/section-label";
import { focusAreas } from "@/lib/focus-areas";

export const metadata: Metadata = {
  title: "Submit a Paper",
  description:
    "Submit original scholarship to Mikaelson Institute for African Studies across history & decolonization, society & politics, arts & culture, religion & philosophy, and STEM & Metaphysics.",
  keywords: [
    "African studies journal submission",
    "African studies call for papers",
    "African studies research publication",
  ],
  alternates: { canonical: "/submit" },
};

const iconMap = {
  landmark: Landmark,
  scale: Scale,
  palette: Palette,
  "book-open": BookOpen,
  microscope: Microscope,
} as const;

const qualities = [
  {
    word: "Original.",
    detail: "It contributes something new — not just a summary of existing work.",
  },
  {
    word: "Rigorous.",
    detail: "It takes sources, methodology, and evidence seriously.",
  },
  {
    word: "Relevant.",
    detail: "It speaks to questions that matter in African studies.",
  },
  {
    word: "Thoughtful.",
    detail: "It recognizes complexity rather than reducing Africa to simple narratives.",
  },
  {
    word: "Accessible.",
    detail: "Academic clarity is a virtue. Necessary difficulty only.",
  },
];

const steps = [
  {
    icon: Send,
    title: "Submit",
    detail: "Send your paper — no account or fee required.",
  },
  {
    icon: Search,
    title: "Review",
    detail: "Editorial, peer, or expert review, depending on the programme.",
  },
  {
    icon: MessageSquareText,
    title: "Revise",
    detail: "You'll hear back by email at each stage, revisions included.",
  },
  {
    icon: BadgeCheck,
    title: "Publish",
    detail: "Accepted work joins the Institute's library.",
  },
];

export default function SubmitPage() {
  return (
    <div className="bg-beige">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-teal-deep text-paper">
        <Image
          src="/images/submit/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-teal-deep via-teal-deep/85 to-teal-deep/60"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
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
          <Reveal delay={0.12}>
            <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-6 border-t border-paper/15 pt-6">
              <div>
                <dt className="font-mono-ledger text-xs tracking-widest text-turquoise uppercase">
                  Focus areas
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold">{focusAreas.length}</dd>
              </div>
              <div>
                <dt className="font-mono-ledger text-xs tracking-widest text-turquoise uppercase">
                  Submission fee
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold">None</dd>
              </div>
              <div>
                <dt className="font-mono-ledger text-xs tracking-widest text-turquoise uppercase">
                  Account required
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold">No</dd>
              </div>
            </dl>
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
                We accept work across all of the Institute&rsquo;s research
                areas. Interdisciplinary work is encouraged.
              </p>
              <StaggerGroup
                className="mt-6 grid gap-4 sm:grid-cols-2"
                onViewport
                staggerChildren={0.06}
              >
                {focusAreas.map((area) => {
                  const Icon = iconMap[area.icon];
                  return (
                    <StaggerItem key={area.slug}>
                      <div className="group flex h-full gap-3 rounded-lg border border-ink/10 bg-paper p-4 transition-colors duration-200 hover:border-teal-deep/30 hover:bg-white">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-deep/10 text-teal-deep transition-colors duration-200 group-hover:bg-teal-deep group-hover:text-white">
                          <Icon aria-hidden="true" className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ink">
                            {area.title}
                          </p>
                          <p className="mt-0.5 text-xs text-ink-muted">
                            {area.summary}
                          </p>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
            </Reveal>

            {/* What we look for */}
            <Reveal>
              <SectionLabel>What We Look For</SectionLabel>
              <div className="mt-6 space-y-5">
                {qualities.map((q, i) => (
                  <div key={q.word} className="flex gap-4">
                    <span className="font-mono-ledger mt-0.5 text-xs text-teal-deep/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-base text-ink">
                      <span className="font-semibold">{q.word}</span>{" "}
                      <span className="text-ink-muted">{q.detail}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Review process */}
            <Reveal>
              <SectionLabel>Review Process</SectionLabel>
              <div className="relative mt-8 grid gap-8 sm:grid-cols-4 sm:gap-4">
                <div
                  aria-hidden="true"
                  className="absolute top-5 right-0 left-0 hidden h-px bg-ink/10 sm:block"
                />
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="relative">
                      <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-beige text-teal-deep">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <p className="mt-3 text-sm font-semibold text-ink">{step.title}</p>
                      <p className="mt-1 text-xs text-ink-muted">{step.detail}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-sm text-ink-muted">
                No account is required — you will receive a tracking link
                immediately after submission. Before submitting, please read
                the{" "}
                <a href="/terms" className="text-teal-deep underline">
                  Terms of Submission
                </a>{" "}
                and{" "}
                <a href="/call-for-papers" className="text-teal-deep underline">
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
