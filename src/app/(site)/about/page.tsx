import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/section-label";
import { ScrollSequence } from "@/components/scroll-sequence";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Mission",
  description:
    "Mikaelson Institute for African Studies is a Pan-African academic research institute dedicated to the study, preservation, production, and dissemination of knowledge about Africa and its peoples.",
  keywords: [
    "African studies institute",
    "African studies mission",
    "pan-African research institute",
    "African studies education",
    "African studies university",
  ],
  alternates: { canonical: "/about" },
};

const scrollItems = [
  {
    title: "Who We Are",
    description:
      "Mikaelson Institute for African Studies is a Pan-African academic research institute dedicated to the study, preservation, production, and dissemination of knowledge about Africa and its peoples.",
    image: "/images/about/who-we-are.png",
  },
  {
    title: "Why We Do This",
    description:
      "For too long, there has been a profound lack of thorough, internally-driven academic research into African history, civilizations, and philosophies. Knowledge shapes how societies understand themselves, and we exist to change this paradigm. Africa must not only be studied by the world — it must be a place from which the world produces knowledge.",
    image: "/images/about/why-we-do-this.png",
  },
  {
    title: "Our Mission",
    description:
      "Our mission is to foster rigorous, historically grounded, and imaginative scholarship. We create intellectual spaces where Africa's histories, civilizations, and possibilities can be studied, debated, and connected by a new generation of thinkers.",
    image: "/images/about/our-mission.png",
  },
  {
    title: "Our Vision",
    description:
      "We envision a robust intellectual ecosystem where African scholarship speaks directly to African communities while contributing profoundly to global intellectual life, free from colonial frameworks.",
    image: "/images/about/our-vision.png",
  },
  {
    title: "Global Impact & UN Goals",
    description:
      "Our work directly advances the United Nations Sustainable Development Goals, particularly Quality Education (Goal 4), Reduced Inequalities (Goal 10), and Peace, Justice and Strong Institutions (Goal 16). By empowering African scholars, we contribute to a more equitable global knowledge economy.",
    image: "/images/about/global-impact.png",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Mission"
        title="A pan-African research institute, built to last."
        lede="Mikaelson Institute for African Studies is dedicated to the study, preservation, production, and dissemination of knowledge about Africa and its peoples. We exist because Africa must not only be studied by the world — Africa must also be a place from which the world produces knowledge."
      />
      <ScrollSequence items={scrollItems}>
        <div className="mx-auto max-w-3xl px-4 pt-12 pb-8 sm:px-6">
          {/* Relationship to parent initiative */}
          <Reveal>
            <SectionLabel>Relationship to the Mikaelson Initiative</SectionLabel>
            <p className="mt-3 text-lg text-ink">
              MIAS is a new initiative of the Mikaelson Community Development and
              Tech Initiative. The Institute shares the parent
              organization&rsquo;s brand system but operates with its own
              editorial and academic independence — the credibility a research
              institute needs is separate from, though connected to, the
              Initiative that founded it.
            </p>
          </Reveal>
        </div>
      </ScrollSequence>
    </>
  );
}
