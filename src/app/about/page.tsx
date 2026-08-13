import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/section-label";
import { ScrollSequence } from "@/components/scroll-sequence";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Mission",
  description:
    "Mikaelson Institute for African Studies is a Pan-African academic research institute dedicated to the study, preservation, production, and dissemination of knowledge about Africa and its peoples.",
};

const scrollItems = [
  {
    title: "History & Decolonization",
    description:
      "We examine Africa's histories, civilizations, intellectual traditions, colonial encounters, liberation movements, and continuing struggles over memory, identity, and knowledge.",
    image: "https://framerusercontent.com/images/lhnpTUDSHCiEqOcYWw3IgyQLXLw.jpg",
  },
  {
    title: "Society & Politics",
    description:
      "We study institutions, governance, citizenship, political thought, social change, inequality, development, migration, conflict, and the evolving relationship between African societies and the state.",
    image: "https://framerusercontent.com/images/vbi15EI0SKGBMFuHBq0fD5qts.jpg",
  },
  {
    title: "Arts & Culture",
    description:
      "We explore literature, visual arts, music, film, language, architecture, heritage, popular culture, and the many ways Africans create, preserve, and reinterpret meaning.",
    image: "https://framerusercontent.com/images/atH29B8qZsDGO8JU0YFBIRpY.jpg",
  },
  {
    title: "Religion & Philosophy",
    description:
      "We investigate African philosophies, indigenous knowledge systems, religious traditions, spirituality, ethics, metaphysics, and the intellectual traditions through which African communities have understood existence and society.",
    image: "https://framerusercontent.com/images/OlcYwy9qDmu95G9Dc6eW2ASz8.jpg",
  },
  {
    title: "What We Believe",
    description:
      "Scholarship is not merely the accumulation of information. It is a responsibility. Knowledge shapes how societies understand themselves, how institutions make decisions, and how generations imagine their future. We seek scholarship that is rigorous without being detached, critical without being cynical, historically grounded without being imprisoned by the past, and imaginative without abandoning evidence. We believe African scholarship should be able to speak to African communities while contributing meaningfully to global intellectual life.",
    image: "https://framerusercontent.com/images/quLlxAWB6hZScEdDdUwggjiFY.jpg",
  },
  {
    title: "Pan-African Outlook",
    description:
      "Africa is not a single story. It is a continent of civilizations, nations, languages, philosophies, religions, cultures, contradictions, struggles, and possibilities. Our Pan-African outlook does not seek to erase difference. It creates intellectual spaces where those differences can be studied, debated, connected, and understood. The Institute welcomes scholarship from across Africa and the African diaspora.",
    image: "https://framerusercontent.com/images/lhnpTUDSHCiEqOcYWw3IgyQLXLw.jpg",
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
