import type { Metadata } from "next";
import { ArrowRight, BookOpen, Archive as ArchiveIcon, HandCoins } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { LibraryShowcase } from "@/components/library-showcase";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/section-label";
import { PlaceholderNotice } from "@/components/placeholder-notice";

export const metadata: Metadata = {
  title: "Library",
  description:
    "The Mikaelson Library — a long-term intellectual resource for the study of Africa, bringing together scholarship, archival materials, research guides, and digital resources.",
  keywords: [
    "African studies library",
    "African studies archive",
    "African studies research guides",
    "African studies scholarship",
  ],
  alternates: { canonical: "/library" },
};

const collections = [
  "African History",
  "Decolonization & Intellectual History",
  "Society & Politics",
  "Arts & Culture",
  "Religion & Philosophy",
  "Contemporary Africa",
];

const supportTiers = [
  { amount: "₦10,000", label: "Sponsor" },
  { amount: "₦25,000", label: "Supporter" },
  { amount: "₦50,000", label: "Patron" },
  { amount: "₦100,000", label: "Founding Patron" },
];

export default function LibraryPage() {
  return (
    <>
      <PageHero
        eyebrow="Library"
        title="The Mikaelson Library"
        lede="Preserving African Knowledge. Making Knowledge Accessible."
      />

      <div className="mx-auto max-w-4xl space-y-20 px-4 py-16 sm:px-6">

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
                className="flex items-center gap-3 rounded-lg border border-ink/10 bg-paper p-4 transition-colors duration-200 hover:border-teal-deep/40"
              >
                <BookOpen aria-hidden="true" className="h-4 w-4 shrink-0 text-teal-deep" />
                <p className="font-display text-sm font-semibold text-ink">{name}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Digital knowledge + Building an archive */}
        <Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-ink/10 bg-paper p-6">
              <SectionLabel>Digital Knowledge</SectionLabel>
              <p className="mt-4 text-base text-ink-muted">
                We are committed to building an increasingly accessible digital
                library. Where copyright and licensing permit, we will provide
                access to research, publications, bibliographies, and other
                resources in digital form — available to scholars, students,
                and curious readers wherever they are.
              </p>
            </div>
            <div className="rounded-lg border border-ink/10 bg-paper p-6">
              <SectionLabel>Building an Archive</SectionLabel>
              <p className="mt-4 text-base text-ink-muted">
                A library is also an act of memory. The Institute will work
                toward preserving documents, oral histories, research
                materials, institutional records, photographs, manuscripts,
                and other materials that contribute to understanding African
                experiences across time and place.
              </p>
            </div>
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
              <BookOpen aria-hidden="true" className="h-8 w-8 text-teal-deep" />
              <h2 className="mt-4 font-display text-xl font-semibold text-ink">
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
              <ArchiveIcon aria-hidden="true" className="h-8 w-8 text-teal-deep" />
              <h2 className="mt-4 font-display text-xl font-semibold text-ink">
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

        {/* Support the Library */}
        <Reveal>
          <div className="rounded-2xl bg-teal-deep px-6 py-12 text-center sm:px-12">
            <HandCoins aria-hidden="true" className="mx-auto h-10 w-10 text-turquoise" />
            <SectionLabel tone="inverse" className="mt-4 justify-center">
              Support the Library
            </SectionLabel>
            <h2 className="mx-auto mt-4 max-w-xl font-display text-2xl font-semibold text-paper sm:text-3xl">
              Help us build a library of African books to educate people.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-paper/80">
              Every contribution goes toward acquiring, preserving, and
              digitising African scholarship — starting at ₦10,000.
            </p>

            <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {supportTiers.map((tier) => (
                <div
                  key={tier.amount}
                  className="flex flex-col items-center rounded-xl bg-paper/10 p-6 text-center"
                >
                  <p className="font-mono-ledger text-xs tracking-widest text-turquoise uppercase">
                    {tier.label}
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-paper">
                    {tier.amount}
                  </p>
                  <div className="mt-4">
                    <Button href="/contact" variant="ghost-inverse">
                      Support
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-md text-sm text-paper/70">
              Want to give a different amount? Any contribution helps.
            </p>
            <div className="mt-4">
              <Button href="/contact" variant="primary">
                Contribute a Custom Amount
              </Button>
            </div>

            <div className="mx-auto mt-8 max-w-xl text-left">
              <PlaceholderNotice>
                online payment isn&rsquo;t wired up yet — the buttons above
                route to our contact page so we can coordinate your
                contribution directly. A direct payment link will replace this
                once it&rsquo;s confirmed.
              </PlaceholderNotice>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
