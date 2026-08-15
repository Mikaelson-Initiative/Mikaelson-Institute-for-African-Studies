import { BookHeart, BookOpen, GraduationCap, Library, Star, Medal } from "lucide-react";

// ₦20,000 per book — the progress tracker on /library/support derives book
// counts from this rate rather than a separately-maintained number. Reader
// and Scholar below predate this rate (they were priced against an earlier
// ₦10,000/book figure) and don't divide evenly into it — 50,000/20,000 and
// 250,000/20,000 aren't whole numbers. Their "impact" copy hasn't been
// reconciled yet; pending a decision on rounding vs. re-pricing those two
// tiers. Sponsor a Book is priced exactly at this rate, so it's clean.
export const COST_PER_BOOK_NAIRA = 20_000;
export const TARGET_BOOKS = 1_000_000;

export type ContributionTier = {
  tier: string;
  amount: number;
  impact: string;
  icon: typeof BookHeart;
  color: string;
  bg: string;
};

export const contributionTiers: ContributionTier[] = [
  {
    tier: "Sponsor a Book",
    amount: 20_000,
    impact: "Provides 1 book to our library.",
    icon: BookOpen,
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
  },
  {
    tier: "Reader",
    amount: 50_000,
    impact: "Provides 5 books to our library.",
    icon: BookHeart,
    color: "text-teal-600",
    bg: "bg-teal-600/10",
  },
  {
    tier: "Scholar",
    amount: 250_000,
    impact: "Provides 25 books and covers shipping.",
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-600/10",
  },
  {
    tier: "Curator",
    amount: 1_000_000,
    impact: "Provides 100 books. Name immortalized in the archive.",
    icon: Library,
    color: "text-indigo-600",
    bg: "bg-indigo-600/10",
  },
  {
    tier: "Patron",
    amount: 5_000_000,
    impact: "Provides 500 books. A dedicated plaque in the library.",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    tier: "Visionary",
    amount: 25_000_000,
    impact: "Funds a full collection wing in your honor.",
    icon: Medal,
    color: "text-purple-600",
    bg: "bg-purple-600/10",
  },
];

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}
