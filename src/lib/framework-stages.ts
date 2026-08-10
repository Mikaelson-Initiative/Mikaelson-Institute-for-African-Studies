/**
 * The chronological framework named in MIAS_PRD.md Sec. 5, Sitemap item 4:
 * "pre-colonial → contact → colonial → independence → contemporary".
 */
export type FrameworkStage = {
  slug: string;
  label: string;
  summary: string;
};

export const frameworkStages: FrameworkStage[] = [
  {
    slug: "pre-colonial",
    label: "Pre-Colonial",
    summary: "African societies and states before European contact.",
  },
  {
    slug: "contact",
    label: "Contact",
    summary: "Early trade, exploration, and initial European presence.",
  },
  {
    slug: "colonial",
    label: "Colonial",
    summary: "The imposition and administration of colonial rule.",
  },
  {
    slug: "independence",
    label: "Independence",
    summary: "Anti-colonial movements and the transition to sovereign states.",
  },
  {
    slug: "contemporary",
    label: "Contemporary",
    summary: "The present continent, shaped by and reckoning with this history.",
  },
];
