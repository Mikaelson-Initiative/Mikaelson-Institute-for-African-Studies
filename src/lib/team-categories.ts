// The single source of truth for TeamMember.category — both the public /team
// page (section order) and the admin dashboard's Team form (the category
// dropdown) read from this list, so a new category only needs adding here.
// A category with no members yet renders as placeholder skeleton rows on
// /team (see src/components/kinetic-team.tsx).
export const TEAM_CATEGORIES = [
  "Executive Leadership",
  "Research Fellows",
  "Research Associates",
  "Editorial Team",
  "Library & Archives",
  "Software Engineering",
  "Advisory Council",
] as const;
