import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { LibraryShowcase } from "@/components/library-showcase";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/section-label";

export const metadata: Metadata = {
  title: "Library",
  description:
    "The Mikaelson Library — a long-term intellectual resource for the study of Africa, bringing together scholarship, archival materials, research guides, and digital resources.",
};

const collections = [
  "African History",
  "Decolonization & Intellectual History",
  "Society & Politics",
  "Arts & Culture",
  "Religion & Philosophy",
  "Contemporary Africa",
];

export default function LibraryPage() {
  return (
    <>
      <PageHero
        eyebrow="Library"
        title="The Mikaelson Library"
        lede="Preserving African Knowledge. Making Knowledge Accessible."
      />

      <div className="mx-auto max-w-4xl space-y-16 px-4 py-16 sm:px-6">

        {/* Book-opening centerpiece */}
        <Reveal>
          <LibraryShowcase />
        </Reveal>

        {/* Positioning statement */}
        <Reveal>
          <div className="space-y-4 text-lg text-ink">
            <p>
              The Mikaelson Library is being built as a long-term intellectual
              resource for the study of Africa.
            </p>
            <p>
              It brings together books, articles, papers, archival materials,
              digital resources, bibliographies, research guides, and other
              materials relevant to African studies.
            </p>
            <p>
              Our objective is not simply to collect information. It is to
              preserve knowledge that might otherwise disappear and make
              knowledge easier to discover, study, and build upon.
            </p>
          </div>
        </Reveal>

        {/* Collection categories */}
        <Reveal>
          <SectionLabel>Collection Areas</SectionLabel>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((name) => (
              <div
                key={name}
                className="rounded-lg border border-ink/10 bg-paper p-4"
              >
                <p className="font-display text-sm font-semibold text-ink">
                  {name}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Digital knowledge */}
        <Reveal>
          <SectionLabel>Digital Knowledge</SectionLabel>
          <div className="mt-3 space-y-4 text-lg text-ink">
            <p>
              We are committed to building an increasingly accessible digital
              library.
            </p>
            <p>
              Where copyright and licensing permit, we will provide access to
              research, publications, bibliographies, archival materials, and
              other resources in digital form — available to scholars, students,
              and curious readers wherever they are.
            </p>
          </div>
        </Reveal>

        {/* Building an archive */}
        <Reveal>
          <SectionLabel>Building an Archive</SectionLabel>
          <div className="mt-3 space-y-4 text-lg text-ink">
            <p>A library is also an act of memory.</p>
            <p>
              The Institute will work toward preserving documents, oral
              histories, research materials, institutional records, photographs,
              manuscripts, and other materials that contribute to understanding
              African experiences across time and place.
            </p>
          </div>
        </Reveal>

        {/* Empty state — collection is growing */}
        <Reveal>
          <div className="rounded-lg border border-dashed border-ink/20 bg-paper p-10 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              The collection is growing.
            </p>
            <p className="mx-auto mt-3 max-w-md text-base text-ink-muted">
              We are building the Mikaelson Library as a long-term repository
              for African scholarship and research materials. New resources will
              be added as the collection develops.
            </p>
          </div>
        </Reveal>

        {/* Navigation to sub-sections */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-lg border border-ink/10 bg-paper p-6">
              <h2 className="font-display text-xl font-semibold text-ink">
                Books
              </h2>
              <p className="mt-2 flex-1 text-base text-ink-muted">
                Full-length volumes of scholarship, published under the
                Institute&rsquo;s imprint.
              </p>
              <div className="mt-4">
                <Button href="/library/books" variant="ghost">
                  Browse Books
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-lg border border-ink/10 bg-paper p-6">
              <h2 className="font-display text-xl font-semibold text-ink">
                Published Papers / Archive
              </h2>
              <p className="mt-2 flex-1 text-base text-ink-muted">
                The permanent, citable archive of papers accepted through the
                Institute&rsquo;s Call for Papers.
              </p>
              <div className="mt-4">
                <Button href="/library/archive" variant="ghost">
                  View the Archive
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
