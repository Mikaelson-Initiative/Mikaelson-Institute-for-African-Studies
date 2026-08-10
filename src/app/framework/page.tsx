import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Timeline } from "@/components/timeline";
import { frameworkStages } from "@/lib/framework-stages";

export const metadata: Metadata = {
  title: "Framework",
  description: "The chronological framework behind MIAS's History & Decolonization research.",
};

export default function FrameworkPage() {
  return (
    <>
      <PageHero
        eyebrow="History & Decolonization — Approach"
        title="A chronological framework."
        lede="Our History & Decolonization research follows a single historical throughline, from pre-colonial societies to the contemporary continent — one of MIAS's four focus areas, not the whole of its work."
      />

      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <Timeline stages={frameworkStages} />
      </div>
    </>
  );
}
