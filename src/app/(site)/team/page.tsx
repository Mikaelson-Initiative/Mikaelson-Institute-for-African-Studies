import type { Metadata } from "next";
import { KineticTeam, type TeamCategory } from "@/components/kinetic-team";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The people behind Mikaelson Institute for African Studies: researchers, scholars, editors, and community members committed to rigorous African scholarship.",
  keywords: ["African studies researchers", "African studies scholars", "African studies team"],
  alternates: { canonical: "/team" },
};

// Revalidate periodically instead of caching at build time — otherwise a
// TeamMember row edited via Prisma Studio wouldn't show up until the next
// deploy, defeating the point of moving this off a hardcoded array.
export const revalidate = 60;

// Team roster now lives in the TeamMember table (see prisma/schema.prisma
// and docs/backend-services-plan.md's Phase 2 CMS section) instead of a
// hardcoded array, so staff can add/remove people via Prisma Studio
// (`npx prisma studio`) without a code deploy.
//
// RULE: Do NOT invent names, credentials, affiliations, or biographies.
// Categories with no rows render the component's placeholder skeleton rows.
const CATEGORY_ORDER = [
  "Executive Leadership",
  "Research Fellows",
  "Research Associates",
  "Editorial Team",
  "Library & Archives",
  "Advisory Council",
];

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  const byCategory = new Map<string, TeamCategory["members"]>();
  for (const member of members) {
    const list = byCategory.get(member.category) ?? [];
    list.push({
      index: member.displayIndex,
      name: member.name,
      role: member.role,
      affiliation: member.affiliation ?? undefined,
      image: member.image ?? undefined,
    });
    byCategory.set(member.category, list);
  }

  const categories: TeamCategory[] = CATEGORY_ORDER.map((label) => ({
    label,
    members: byCategory.get(label) ?? [],
  }));

  return <KineticTeam categories={categories} />;
}
