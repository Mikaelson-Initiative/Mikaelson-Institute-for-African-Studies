import { BookOpen, Library, Star } from "lucide-react";

// Shown on /signup right after a Cohort 01 application is submitted — an
// optional, skippable step. ₦1,000/₦3,000/₦5,000 tiers, charged via the
// existing Paystack integration (see src/lib/paystack.ts), which is NGN-only.
export type CohortDonationTier = {
  tier: string;
  amount: number;
  impact: string;
  icon: typeof BookOpen;
  color: string;
  bg: string;
};

export const cohortDonationTiers: CohortDonationTier[] = [
  {
    tier: "Founding Supporter",
    amount: 1_000,
    impact: "Your name becomes part of Cohort 01's story, remembered as one of the people who made it possible.",
    icon: BookOpen,
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
  },
  {
    tier: "Library Builder",
    amount: 3_000,
    impact: "You put real shelves and real books in front of real students, the library this cohort will learn from.",
    icon: Library,
    color: "text-teal-600",
    bg: "bg-teal-600/10",
  },
  {
    tier: "Institute Patron",
    amount: 5_000,
    impact: "You become one of the people this Institute is built on, a name future cohorts will thank.",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}
