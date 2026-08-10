import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PlaceholderNotice } from "@/components/placeholder-notice";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the Mikaelson Institute for African Studies handles your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <PlaceholderNotice>
          the Institute&rsquo;s privacy policy — including its data
          retention/deletion policy for submitted content and personal data
          (MIAS_PRD.md Sec. 8) — goes here once drafted. Not drafted from
          scratch for this build, since privacy commitments are a legal
          decision, not an engineering one.
        </PlaceholderNotice>
      </div>
    </>
  );
}
