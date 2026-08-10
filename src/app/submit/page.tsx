import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SubmitPaperForm } from "@/components/forms/submit-paper-form";

export const metadata: Metadata = {
  title: "Submit a Paper",
  description: "Submit a paper to the Mikaelson Institute for African Studies.",
};

export default function SubmitPage() {
  return (
    <>
      <PageHero eyebrow="Submissions" title="Submit a Paper" />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <SubmitPaperForm />
      </div>
    </>
  );
}
