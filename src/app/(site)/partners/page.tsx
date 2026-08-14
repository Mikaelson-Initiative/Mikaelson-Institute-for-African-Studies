import type { Metadata } from "next";
import { KineticPartners, type Partner, type PartnershipArea } from "@/components/kinetic-partners";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Institutions and organizations partnering with the Mikaelson Institute for African Studies in scholarship, research, knowledge preservation, and African intellectual life.",
  keywords: [
    "African studies partnerships",
    "African studies institutions",
    "African studies collaboration",
  ],
  alternates: { canonical: "/partners" },
};

// Revalidate periodically instead of caching at build time — otherwise a
// Partner row edited via Prisma Studio wouldn't show up until the next
// deploy, defeating the point of moving this off a hardcoded array.
export const revalidate = 60;

// Partner list now lives in the Partner table (see prisma/schema.prisma and
// docs/backend-services-plan.md's Phase 2 CMS section) instead of a
// hardcoded array, so staff can add confirmed partners via Prisma Studio
// (`npx prisma studio`) without a code deploy.
//
// RULE: Do NOT invent partner names, logos, or affiliations. `logo` enables
// the floating hover preview (same mechanic as team member photos) — only
// set it once a real logo file exists.
const partnershipAreas: PartnershipArea[] = [
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

export default async function PartnersPage() {
  const rows = await prisma.partner.findMany({ orderBy: { sortOrder: "asc" } });
  const partners: Partner[] = rows.map((row) => ({
    name: row.name,
    type: row.type ?? undefined,
    logo: row.logo ?? undefined,
  }));

  return <KineticPartners areas={partnershipAreas} partners={partners} />;
}
