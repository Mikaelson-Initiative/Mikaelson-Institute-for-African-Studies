import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { ComingSoonNotice } from "@/components/coming-soon-notice";
import { SectionLabel } from "@/components/section-label";

export const metadata: Metadata = {
  title: "Call for Papers",
  description:
    "Mikaelson Institute for African Studies invites researchers, scholars, independent intellectuals, writers, and emerging academics to submit original work for consideration.",
  keywords: [
    "African studies call for papers",
    "African studies research areas",
    "African studies academic submissions",
  ],
  alternates: { canonical: "/call-for-papers" },
};

const researchAreas = [
  {
    title: "History & Decolonization",
    topics: [
      "African histories and civilizations",
      "Colonialism and its legacies",
      "Decolonization movements",
      "Liberation struggles",
      "Pan-Africanism",
      "Historical memory and the archive",
      "African intellectual history",
      "Historiography and methodology",
      "Indigenous knowledge systems",
    ],
  },
  {
    title: "Society & Politics",
    topics: [
      "African political thought",
      "Governance and institutions",
      "Democracy and citizenship",
      "Social movements",
      "Development and inequality",
      "Migration",
      "Conflict and peace",
      "Urbanization",
      "Technology and society",
      "Youth and social change",
    ],
  },
  {
    title: "Arts & Culture",
    topics: [
      "African literature",
      "Music",
      "Film",
      "Visual arts",
      "Architecture",
      "Language",
      "Heritage",
      "Popular culture",
      "Cultural memory",
      "Creative expression",
    ],
  },
  {
    title: "Religion & Philosophy",
    topics: [
      "African philosophies",
      "Indigenous religious traditions",
      "Christianity and Islam in African contexts",
      "Spirituality and ethics",
      "Metaphysics",
      "Indigenous knowledge systems",
      "African philosophical traditions",
      "Religion and social life",
    ],
  },
];

const whoCanSubmit = [
  "University researchers",
  "Independent scholars",
  "Graduate and doctoral students",
  "Early-career researchers",
  "Writers",
  "Cultural practitioners",
  "Interdisciplinary researchers",
];

const whatWeLookFor = [
  {
    quality: "Original.",
    description:
      "It contributes something meaningful to an existing conversation, rather than restating what is already known.",
  },
  {
    quality: "Rigorous.",
    description:
      "It takes evidence, methodology, sources, and argument seriously — and is honest about the limits of its own claims.",
  },
  {
    quality: "Relevant.",
    description:
      "It speaks to questions that matter — to scholars, to communities, to the study of Africa.",
  },
  {
    quality: "Thoughtful.",
    description:
      "It recognizes complexity rather than reducing African societies to simple narratives or familiar frameworks.",
  },
  {
    quality: "Accessible.",
    description:
      "Academic seriousness should not require unnecessary obscurity. Writing that a careful reader outside your specialization can follow is a mark of intellectual strength, not weakness.",
  },
];

export default function CallForPapersPage() {
  return (
    <>
      <PageHero
        eyebrow="Call for Papers"
        title="Contribute to African Scholarship."
        lede="Mikaelson Institute for African Studies invites researchers, scholars, independent intellectuals, writers, and emerging academics to submit original work for consideration."
      />

      <div className="mx-auto max-w-3xl space-y-14 px-4 py-16 sm:px-6">

        {/* Priority notice */}
        <Reveal>
          <ComingSoonNotice>
            Our first priority right now is Ubuntu, the Institute&rsquo;s
            cohort-based learning programme. A new call for papers will
            follow once that is underway.
          </ComingSoonNotice>
        </Reveal>

        {/* Active call placeholder */}
        <Reveal>
          <PlaceholderNotice>
            the current cycle&rsquo;s deadline, word-count limits, citation
            format, and specific submission guidelines go here once confirmed by
            the Institute — not invented for this build.
          </PlaceholderNotice>

          <div className="mt-6 rounded-lg border border-dashed border-ink/20 bg-paper p-8 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              A new call for papers is being prepared.
            </p>
            <p className="mx-auto mt-3 max-w-md text-base text-ink-muted">
              Return to this page for upcoming opportunities to contribute to the
              Institute&rsquo;s research and publications.
            </p>
            <div className="mt-6 flex justify-center">
              <Button href="/contact">Register Interest</Button>
            </div>
          </div>
        </Reveal>

        {/* Introduction */}
        <Reveal>
          <div className="space-y-4 text-lg text-ink">
            <p>
              We are particularly interested in scholarship that asks difficult
              questions, challenges inherited assumptions, recovers neglected
              histories, and contributes new ways of understanding African
              societies.
            </p>
            <p>
              We welcome submissions across all four of the Institute&rsquo;s
              research areas, and we especially encourage scholars based in
              Africa and researchers contributing to African intellectual
              capacity.
            </p>
          </div>
        </Reveal>

        {/* Research areas */}
        <Reveal>
          <SectionLabel>Research Areas</SectionLabel>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {researchAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-lg border border-ink/10 bg-paper p-5"
              >
                <h2 className="font-display text-base font-semibold text-ink">
                  {area.title}
                </h2>
                <ul className="mt-3 space-y-1">
                  {area.topics.map((topic) => (
                    <li
                      key={topic}
                      className="font-mono-ledger text-xs text-ink-muted"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Who can submit */}
        <Reveal>
          <SectionLabel>Who Can Submit</SectionLabel>
          <p className="mt-3 text-lg text-ink">
            We welcome submissions from:
          </p>
          <ul className="mt-4 space-y-2">
            {whoCanSubmit.map((who) => (
              <li key={who} className="flex items-start gap-2 text-ink-muted">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-deep"
                />
                {who}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base text-ink-muted">
            Interdisciplinary work is encouraged. We do not require institutional
            affiliation to submit.
          </p>
        </Reveal>

        {/* What we look for */}
        <Reveal>
          <SectionLabel>What We Look For</SectionLabel>
          <div className="mt-6 space-y-6">
            {whatWeLookFor.map((item) => (
              <div key={item.quality}>
                <p className="font-display text-base font-semibold text-ink">
                  {item.quality}
                </p>
                <p className="mt-1 text-base text-ink-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Review process */}
        <Reveal>
          <SectionLabel>Review Process</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Depending on the publication or programme, submissions may undergo
            editorial review, peer review, expert review, or another appropriate
            evaluation process. The specific process applicable to a given call
            will be described in its guidelines.
          </p>
          <p className="mt-3 text-ink-muted">
            You will be notified by email at each stage of the process.
          </p>
        </Reveal>

        {/* Closing institutional statement */}
        <Reveal>
          <div className="rounded-lg border border-ink/10 bg-paper p-8">
            <p className="text-lg text-ink">
              We are interested not only in scholarship that confirms what is
              already known.
            </p>
            <p className="mt-4 text-lg text-ink">
              We are interested in scholarship that makes us stop and ask:
            </p>
            <ul className="mt-6 space-y-3 text-ink">
              <li className="font-semibold">What have we misunderstood?</li>
              <li className="font-semibold">
                Whose knowledge have we overlooked?
              </li>
              <li className="font-semibold">
                What histories remain unwritten?
              </li>
              <li className="font-semibold">
                What assumptions should be reconsidered?
              </li>
              <li className="font-semibold">
                What can African scholarship teach the world?
              </li>
            </ul>
          </div>
        </Reveal>

        {/* How to submit CTA */}
        <Reveal>
          <SectionLabel>How to Submit</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Submit your abstract and a PDF or DOCX of your paper through the
            submission form. No account is required — you will receive a
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
