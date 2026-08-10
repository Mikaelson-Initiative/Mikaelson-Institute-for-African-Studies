import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderNotice } from "@/components/placeholder-notice";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Mikaelson Institute for African Studies' mission, methodology, and relationship to the Mikaelson Community Development and Tech Initiative.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A pan-African research institute, built to last."
        lede="MIAS is a general pan-African research institute — a home for rigorous scholarship across history, society, culture, and belief, not a single-subject institute."
      />

      <div className="mx-auto max-w-3xl space-y-16 px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="font-mono-ledger text-xs tracking-widest text-teal-deep uppercase">
            On Scope
          </h2>
          <p className="mt-3 text-lg text-ink">
            The Institute&rsquo;s research spans four areas: history and
            decolonization, society and politics and economics, arts and
            literature and culture, and religion and philosophy and lived
            experience. History is one lane among these, not the whole of
            the Institute&rsquo;s work.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="font-mono-ledger text-xs tracking-widest text-teal-deep uppercase">
            On Method
          </h2>
          <PlaceholderNotice>
            the Institute&rsquo;s methodological commitments (source
            standards, review criteria, editorial independence) go here once
            drafted — not invented for this build.
          </PlaceholderNotice>
        </Reveal>

        <Reveal>
          <h2 className="font-mono-ledger text-xs tracking-widest text-teal-deep uppercase">
            On Name
          </h2>
          <PlaceholderNotice>
            the naming rationale for &ldquo;Mikaelson Institute for African
            Studies&rdquo; goes here once drafted.
          </PlaceholderNotice>
        </Reveal>

        <Reveal>
          <h2 className="font-mono-ledger text-xs tracking-widest text-teal-deep uppercase">
            Relationship to the Mikaelson Initiative
          </h2>
          <p className="mt-3 text-lg text-ink">
            MIAS is a new initiative of the Mikaelson Community Development
            and Tech Initiative. The Institute shares the parent
            organization&rsquo;s brand system but operates with its own
            editorial and academic independence — the credibility a research
            institute needs is separate from, though connected to, the
            Initiative that founded it.
          </p>
        </Reveal>
      </div>
    </>
  );
}
