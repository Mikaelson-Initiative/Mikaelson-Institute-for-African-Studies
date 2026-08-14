/**
 * MIAS's research focus areas — a general pan-African academic research
 * institute, not a history-only one. History & Decolonization is one focus
 * area among four, not the whole institute. Decided directly with Michael
 * (2026-08-09), replacing the earlier history-only framing.
 */
export type FocusArea = {
  slug: string;
  title: string;
  summary: string;
  icon: "landmark" | "scale" | "palette" | "book-open" | "microscope";
};

export const focusAreas: FocusArea[] = [
  {
    slug: "history-decolonization",
    title: "History & Decolonization",
    summary:
      "African societies from pre-colonial civilizations through colonialism, independence movements, and ongoing decolonization.",
    icon: "landmark",
  },
  {
    slug: "society-politics-economics",
    title: "Society, Politics & Economics",
    summary:
      "Governance, development, and the social and economic life of the continent, past and present.",
    icon: "scale",
  },
  {
    slug: "arts-literature-culture",
    title: "Arts, Literature & Culture",
    summary:
      "Creative and cultural production, literature, oral tradition, visual and performing arts, across Africa.",
    icon: "palette",
  },
  {
    slug: "religion-philosophy-lived-experience",
    title: "Religion, Philosophy & Lived Experience",
    summary:
      "Indigenous and world belief systems, philosophical traditions, and rigorous first-person research into lived and transcendent experience.",
    icon: "book-open",
  },
  {
    slug: "stem-metaphysics",
    title: "STEM & Metaphysics",
    summary:
      "Bridging technological advancement with deep philosophical inquiry, applying rigorous scientific methodologies to modern African challenges.",
    icon: "microscope",
  },
];
