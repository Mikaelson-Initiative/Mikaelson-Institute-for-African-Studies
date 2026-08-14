import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ScrollSequence } from "@/components/scroll-sequence";
import { frameworkStages } from "@/lib/framework-stages";

export const metadata: Metadata = {
  title: "Framework",
  description: "The chronological framework behind MIAS's History & Decolonization research.",
  keywords: [
    "African history framework",
    "decolonization studies",
    "African studies research methodology",
    "African history timeline",
  ],
  alternates: { canonical: "/framework" },
};

export default function FrameworkPage() {
  const scrollItems = frameworkStages.map((stage) => ({
    title: stage.label,
    description: stage.summary,
    image: `/framework/${stage.slug}.png`
  }));

  return (
    <>
      <PageHero
        eyebrow="History & Decolonization: Approach"
        title="A chronological framework."
        lede="Our History & Decolonization research follows a single historical throughline, from pre-colonial societies to the contemporary continent (one of MIAS's four focus areas, not the whole of its work)."
      />

      <ScrollSequence items={scrollItems} />
    </>
  );
}
