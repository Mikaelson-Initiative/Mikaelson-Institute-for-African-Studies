import type { Metadata } from "next";
import { KineticTeam, type TeamCategory } from "@/components/kinetic-team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The people behind Mikaelson Institute for African Studies — researchers, scholars, editors, and community members committed to rigorous African scholarship.",
};

// ── Team data ─────────────────────────────────────────────────────────────────
//
// RULE: Do NOT invent names, credentials, affiliations, or biographies.
// Each category is seeded with an empty members array until confirmed profiles
// are provided. The component renders placeholder skeleton rows in their place.
// To add a person, append a TeamMember object with at minimum: index, name, role.
// The optional `image` field enables the floating preview card on hover.
//
// Example entry (remove comment when real data is confirmed):
//   {
//     index: "01",
//     name: "Full Name",
//     role: "Director of Research",
//     affiliation: "Institution Name",
//     image: "/team/full-name.jpg",  // place in /public/team/
//   }

const categories: TeamCategory[] = [
  {
    label: "Executive Leadership",
    members: [
      {
        index: "01",
        name: "Michael Olukayode",
        role: "Founder & Research Fellow",
        affiliation: "Mikaelson Institute for African Studies",
        image: "/team/20240726_164330.jpeg",
      },
    ],
  },

  {
    label: "Research Fellows",
    members: [],
  },
  {
    label: "Research Associates",
    members: [],
  },
  {
    label: "Editorial Team",
    members: [],
  },
  {
    label: "Library & Archives",
    members: [],
  },
  {
    label: "Advisory Council",
    members: [],
  },
];

export default function TeamPage() {
  return (
    <KineticTeam categories={categories} />
  );
}
