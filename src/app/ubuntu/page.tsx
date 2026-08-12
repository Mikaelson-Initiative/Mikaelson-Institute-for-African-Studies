import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/section-label";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Ubuntu",
  description:
    "Ubuntu is how Mikaelson Institute for African Studies understands intellectual community — reading groups, public lectures, seminars, and open engagement with African scholarship.",
};

const programmes = [
  {
    label: "Reading Groups",
    description:
      "Small, recurring groups working through a shared text or theme within one of the four focus areas — history and decolonization, society and politics, arts and culture, or religion and philosophy.",
  },
  {
    label: "Public Lectures",
    description:
      "Open lectures bringing scholars, researchers, writers, and thinkers into conversation with the public on questions drawn from African studies.",
  },
  {
    label: "Seminars",
    description:
      "Scholars presenting their work and taking questions in a recurring seminar series, open to anyone who wants to attend.",
  },
  {
    label: "Research Conversations",
    description:
      "Structured discussions among researchers and scholars working on related questions — a space for ideas to develop before and beyond publication.",
  },
  {
    label: "Fellowships",
    description:
      "Opportunities for scholars and emerging researchers to engage more deeply with the Institute's work, community, and intellectual programmes.",
  },
  {
    label: "Student Programmes",
    description:
      "Engagement opportunities specifically for students — creating pathways into serious African scholarship from an early stage in a research career.",
  },
  {
    label: "Community Archives",
    description:
      "Working with communities to document, preserve, and make accessible the knowledge, records, and histories that belong to them.",
  },
  {
    label: "Cultural Conversations",
    description:
      "Programmes that bring scholarship and cultural practice into dialogue — recognising that art, music, literature, and lived culture are also forms of knowing.",
  },
];

export default function UbuntuPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="Ubuntu"
        lede="I Am Because We Are."
      />

      <div className="mx-auto max-w-3xl space-y-16 px-4 py-16 sm:px-6">

        {/* Core Ubuntu statement */}
        <Reveal>
          <div className="space-y-4 text-lg text-ink">
            <p>
              Ubuntu is more than a phrase.
            </p>
            <p>
              It represents an understanding of human life rooted in
              relationship, mutual responsibility, dignity, and community.
            </p>
            <p>
              At Mikaelson Institute for African Studies, Ubuntu informs how we
              understand intellectual life.
            </p>
          </div>
        </Reveal>

        {/* What knowledge can do */}
        <Reveal>
          <SectionLabel>Knowledge and Community</SectionLabel>
          <div className="mt-6 space-y-3 text-lg text-ink">
            <p>Knowledge does not exist only for the person who discovers it.</p>
            <p>It can strengthen a community.</p>
            <p>It can preserve a memory.</p>
            <p>It can challenge an institution.</p>
            <p>It can give language to an experience.</p>
            <p>It can help a generation understand itself.</p>
          </div>
        </Reveal>

        {/* Institute's community philosophy */}
        <Reveal>
          <SectionLabel>Our Community Philosophy</SectionLabel>
          <div className="mt-6 space-y-4 text-lg text-ink">
            <p>
              Communities should not simply be treated as subjects of research.
            </p>
            <p>
              The Institute seeks to create intellectual spaces where researchers
              and communities are in genuine conversation — where scholarship is
              carried forward not merely into journals, but into the places and
              relationships that give it meaning.
            </p>
            <p>
              We are building a community of scholars, readers, students,
              practitioners, and institutions who believe that African
              intellectual life deserves serious, sustained, and generous
              attention.
            </p>
          </div>
        </Reveal>

        {/* Programmes */}
        <Reveal>
          <SectionLabel>Programmes</SectionLabel>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {programmes.map((programme) => (
              <div
                key={programme.label}
                className="rounded-lg border border-ink/10 bg-paper p-5"
              >
                <h2 className="font-display text-base font-semibold text-ink">
                  {programme.label}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  {programme.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Launch state */}
        <Reveal>
          <PlaceholderNotice>
            the first seminar dates, reading group cohorts, and programme details
            haven&rsquo;t launched yet — this page describes the programme&rsquo;s
            shape, not a live schedule. No dates or attendees are invented for
            this build.
          </PlaceholderNotice>

          <div className="mt-6 rounded-lg border border-dashed border-ink/20 bg-paper p-10 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              First cohort forming.
            </p>
            <p className="mx-auto mt-3 max-w-md text-base text-ink-muted">
              Ubuntu programmes are being developed. Return to this page for
              announcements, or contact us to express interest in participating.
            </p>
            <div className="mt-6 flex justify-center">
              <Button href="/contact">Express Interest</Button>
            </div>
          </div>
        </Reveal>

        {/* Closing */}
        <Reveal>
          <p className="text-lg text-ink">
            That is Ubuntu: knowledge carried forward because we carry one
            another.
          </p>
        </Reveal>
      </div>
    </>
  );
}
