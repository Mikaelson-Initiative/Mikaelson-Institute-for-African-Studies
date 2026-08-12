import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { DraftNotice } from "@/components/draft-notice";
import { SectionLabel } from "@/components/section-label";

export const metadata: Metadata = {
  title: "Mission",
  description:
    "Mikaelson Institute for African Studies is a Pan-African academic research institute dedicated to the study, preservation, production, and dissemination of knowledge about Africa and its peoples.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Mission"
        title="A pan-African research institute, built to last."
        lede="Mikaelson Institute for African Studies is dedicated to the study, preservation, production, and dissemination of knowledge about Africa and its peoples. We exist because Africa must not only be studied by the world — Africa must also be a place from which the world produces knowledge."
      />

      <div className="mx-auto max-w-3xl space-y-16 px-4 py-16 sm:px-6">

        {/* Research Areas */}
        <Reveal>
          <SectionLabel>Research Areas</SectionLabel>
          <div className="mt-6 space-y-10">
            {[
              {
                title: "History & Decolonization",
                body: "We examine Africa's histories, civilizations, intellectual traditions, colonial encounters, liberation movements, and continuing struggles over memory, identity, and knowledge.",
              },
              {
                title: "Society & Politics",
                body: "We study institutions, governance, citizenship, political thought, social change, inequality, development, migration, conflict, and the evolving relationship between African societies and the state.",
              },
              {
                title: "Arts & Culture",
                body: "We explore literature, visual arts, music, film, language, architecture, heritage, popular culture, and the many ways Africans create, preserve, and reinterpret meaning.",
              },
              {
                title: "Religion & Philosophy",
                body: "We investigate African philosophies, indigenous knowledge systems, religious traditions, spirituality, ethics, metaphysics, and the intellectual traditions through which African communities have understood existence and society.",
              },
            ].map((area) => (
              <div key={area.title}>
                <h2 className="font-display text-lg font-semibold text-ink">
                  {area.title}
                </h2>
                <p className="mt-2 text-base text-ink-muted">{area.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* What We Believe */}
        <Reveal>
          <SectionLabel>What We Believe</SectionLabel>
          <div className="mt-6 space-y-4 text-lg text-ink">
            <p>
              Scholarship is not merely the accumulation of information. It is a
              responsibility.
            </p>
            <p>
              Knowledge shapes how societies understand themselves, how
              institutions make decisions, and how generations imagine their
              future.
            </p>
            <p>
              We seek scholarship that is rigorous without being detached,
              critical without being cynical, historically grounded without being
              imprisoned by the past, and imaginative without abandoning
              evidence.
            </p>
            <p>
              We believe African scholarship should be able to speak to African
              communities while contributing meaningfully to global intellectual
              life.
            </p>
          </div>
        </Reveal>

        {/* Pan-African Outlook */}
        <Reveal>
          <SectionLabel>Pan-African Outlook</SectionLabel>
          <div className="mt-6 space-y-4 text-lg text-ink">
            <p>Africa is not a single story.</p>
            <p>
              It is a continent of civilizations, nations, languages,
              philosophies, religions, cultures, contradictions, struggles, and
              possibilities.
            </p>
            <p>
              Our Pan-African outlook does not seek to erase difference. It
              creates intellectual spaces where those differences can be studied,
              debated, connected, and understood.
            </p>
            <p>
              The Institute welcomes scholarship from across Africa and the
              African diaspora.
            </p>
          </div>
        </Reveal>

        {/* Method */}
        <Reveal>
          <SectionLabel>On Method</SectionLabel>
          <DraftNotice>
            proposed by the build team for the Institute&rsquo;s review — not
            yet formally adopted.
          </DraftNotice>
          <div className="mt-4 space-y-4 text-lg text-ink">
            <p>
              Every paper the Institute publishes goes through double-anonymous
              peer review: at least two reviewers with relevant subject-matter
              expertise, working from the manuscript alone, without the
              author&rsquo;s name or institutional affiliation attached.
            </p>
            <p>
              Reviewers assess a submission on four grounds — originality,
              evidentiary rigor, engagement with existing scholarship, and
              clarity of argument — and return one of four verdicts: accept,
              accept with minor revisions, major revisions and resubmit, or
              decline.
            </p>
            <p>
              Editorial decisions are made independently of the Mikaelson
              Community Development and Tech Initiative and of any institution
              an author is affiliated with.
            </p>
            <p>
              Sources are held to ordinary academic standards for the field in
              question: primary sources cited with archive or provenance
              information where available, secondary sources current and fairly
              represented, and all claims traceable to a citation a reader can
              independently check.
            </p>
          </div>
        </Reveal>

        {/* Building for Generations */}
        <Reveal>
          <SectionLabel>Building for Generations</SectionLabel>
          <div className="mt-6 space-y-4 text-lg text-ink">
            <p>
              Mikaelson Institute for African Studies is designed as an
              institution that can outlive its founders.
            </p>
            <p>
              We are building archives, publications, research communities,
              intellectual networks, and traditions of scholarship that can serve
              researchers today and generations yet to come.
            </p>
            <p className="font-semibold">
              Our ambition is simple: to help build an enduring African
              intellectual institution.
            </p>
          </div>
        </Reveal>

        {/* Naming — still placeholder */}
        <Reveal>
          <SectionLabel>On Name</SectionLabel>
          <PlaceholderNotice>
            the naming rationale for &ldquo;Mikaelson Institute for African
            Studies&rdquo; goes here once drafted.
          </PlaceholderNotice>
        </Reveal>

        {/* Relationship to parent initiative */}
        <Reveal>
          <SectionLabel>Relationship to the Mikaelson Initiative</SectionLabel>
          <p className="mt-3 text-lg text-ink">
            MIAS is a new initiative of the Mikaelson Community Development and
            Tech Initiative. The Institute shares the parent
            organization&rsquo;s brand system but operates with its own
            editorial and academic independence — the credibility a research
            institute needs is separate from, though connected to, the
            Initiative that founded it.
          </p>
        </Reveal>
      </div>
    </>
  );
}
