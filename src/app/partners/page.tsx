import type { Metadata } from "next";
import { KineticPartners, type Partner, type PartnershipArea } from "@/components/kinetic-partners";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Institutions and organizations partnering with the Mikaelson Institute for African Studies in scholarship, research, knowledge preservation, and African intellectual life.",
};

// RULE: Do NOT invent partner names, logos, or affiliations. `logo` enables
// the floating hover preview (same mechanic as team member photos) — only
// set it once a real logo file exists; leave it unset rather than reusing
// a different entity's mark.
//
// Mikaelson Initiative is the Institute's real parent organization (see
// site-footer.tsx and the About page) — logo is the parent's own "M" mark
// (public/logos/Mikealson initiative logo.png), distinct from MIAS's mark.
const partners: Partner[] = [
  {
    name: "Mikaelson Initiative",
    type: "Parent Organization",
    logo: "/logos/Mikealson initiative logo.png",
  },
];

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

export default function PartnersPage() {
  return <KineticPartners areas={partnershipAreas} partners={partners} />;
}
