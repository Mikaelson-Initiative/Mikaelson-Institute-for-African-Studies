import type { Metadata } from "next";
import { Handshake } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { SectionLabel } from "@/components/section-label";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Institutions and organizations partnering with the Mikaelson Institute for African Studies in scholarship, research, knowledge preservation, and African intellectual life.",
};

const partnershipAreas = [
  {
    title: "Research Collaboration",
    description:
      "Joint research projects, co-authored scholarship, and shared intellectual programmes with universities and independent research institutions.",
  },
  {
    title: "Knowledge & Archives",
    description:
      "Libraries, archives, and cultural heritage institutions committed to preserving and making accessible African documentary and material memory.",
  },
  {
    title: "Academic Exchange",
    description:
      "Scholar exchange programmes, visiting fellowships, and collaborative seminars that deepen intellectual relationships across institutions and continents.",
  },
  {
    title: "Publishing",
    description:
      "Academic publishers, journals, and presses whose work aligns with the Institute's commitment to rigorous African scholarship.",
  },
  {
    title: "Education",
    description:
      "Schools, universities, colleges, and educational organizations working to strengthen African intellectual traditions and access to scholarship.",
  },
  {
    title: "Arts & Culture",
    description:
      "Museums, galleries, cultural centres, and arts organizations contributing to the documentation and interpretation of African creative life.",
  },
  {
    title: "Public Scholarship",
    description:
      "Civil society organizations, foundations, media, and community institutions engaged in translating scholarship into broader public understanding.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Serious intellectual work is rarely built alone."
        lede="We seek relationships with universities, research institutes, libraries, archives, cultural institutions, publishers, civil society organizations, foundations, and communities across Africa and beyond."
      />

      <div className="mx-auto max-w-3xl space-y-16 px-4 py-16 sm:px-6">

        {/* Institutional intro */}
        <Reveal>
          <div className="space-y-4 text-lg text-ink">
            <p>
              Our partnerships are built around a shared commitment to
              knowledge, scholarship, cultural preservation, and human
              development.
            </p>
            <p>
              We do not view partnership simply as a funding relationship. We
              seek relationships that create intellectual value, expand access to
              knowledge, strengthen African research capacity, and contribute to
              lasting institutions.
            </p>
          </div>
        </Reveal>

        {/* Partnership areas */}
        <Reveal>
          <SectionLabel>Partnership Areas</SectionLabel>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {partnershipAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-lg border border-ink/10 bg-paper p-5"
              >
                <h2 className="font-display text-base font-semibold text-ink">
                  {area.title}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">{area.description}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Current partners — placeholder */}
        <Reveal>
          <SectionLabel>Current Partners</SectionLabel>
          <PlaceholderNotice>
            partner institutions haven&rsquo;t been confirmed yet — no names,
            logos, or affiliations are invented for this build.
          </PlaceholderNotice>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg border border-dashed border-ink/20 bg-paper p-6 text-center"
              >
                <Handshake
                  aria-hidden="true"
                  className="h-8 w-8 text-ink/25"
                />
                <p className="mt-3 font-mono-ledger text-xs text-ink-muted">
                  Partner pending
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Partnership enquiries */}
        <Reveal>
          <SectionLabel>Partnership Enquiries</SectionLabel>
          <p className="mt-3 text-lg text-ink">
            If your institution or organization is interested in exploring a
            partnership with the Institute, we would welcome that conversation.
          </p>
          <p className="mt-3 text-base text-ink-muted">
            Please reach out to us at{" "}
            <a
              href="mailto:partnerships@mikaelsoninitiative.org"
              className="text-teal-deep underline"
            >
              partnerships@mikaelsoninitiative.org
            </a>
            .
          </p>
          <p className="mt-1 font-mono-ledger text-xs text-ink-muted">
            [Placeholder — confirm the correct partnership email address before
            publication.]
          </p>
          <div className="mt-6">
            <Button href="/contact">Get in Touch</Button>
          </div>
        </Reveal>
      </div>
    </>
  );
}
