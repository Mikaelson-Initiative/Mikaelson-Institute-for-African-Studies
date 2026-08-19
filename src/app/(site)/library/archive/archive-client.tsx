"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archive } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/section-label";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

type Category = {
  id: string;
  label: string;
  description: string;
  cards: CardItem[];
};

// Placeholder "cover" for a real, named book that hasn't been published yet —
// deliberately not a fake photographic cover (there isn't one), just the
// title/author on a plain brand-colored card so it doesn't read as a real scan.
function forthcomingCover(lines: string[], author: string) {
  const startY = 205 - (lines.length - 1) * 17;
  const tspans = lines
    .map((line, i) => `<tspan x="150" dy="${i === 0 ? 0 : 34}">${line}</tspan>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="460" viewBox="0 0 300 460"><rect width="300" height="460" fill="#003e45"/><rect x="10" y="10" width="280" height="440" fill="none" stroke="#5ce1e6" stroke-opacity="0.35"/><text x="150" y="${startY}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="24" font-weight="700" fill="#ffffff">${tspans}</text><text x="150" y="370" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="14" fill="#ffffffcc">${author}</text><text x="150" y="405" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" letter-spacing="3" fill="#5ce1e6">FORTHCOMING</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const AUTHOR = "Michael Olukayode";

// No accepted papers exist yet in any research area — the archive only shows
// real, named titles (the founder's forthcoming books). Categories with
// nothing real to show render an honest empty state instead of a stand-in
// reference library.
const categories: Category[] = [
  {
    id: "history-decolonization",
    label: "History & Decolonization",
    description:
      "Peer-reviewed scholarship on African historical formation, the colonial archive, post-colonial memory, and the politics of historical knowledge.",
    cards: [
      {
        imgUrl: forthcomingCover(["The Duality", "of a Black Man"], AUTHOR),
        alt: `The Duality of a Black Man, by ${AUTHOR}, forthcoming`,
      },
      {
        imgUrl: forthcomingCover(["If Africa Was", "Never Colonized"], AUTHOR),
        alt: `If Africa Was Never Colonized, by ${AUTHOR}, forthcoming`,
      },
      {
        imgUrl: forthcomingCover(["The Future", "of Africa"], AUTHOR),
        alt: `The Future of Africa, by ${AUTHOR}, forthcoming`,
      },
    ],
  },
  {
    id: "society-politics",
    label: "Society & Politics",
    description:
      "Research on African governance structures, social movements, constitutionalism, public policy, and the theoretical frameworks of African political science.",
    cards: [],
  },
  {
    id: "arts-culture",
    label: "Arts & Culture",
    description:
      "Scholarly work on African literary traditions, visual and performing arts, cultural theory, language, and the global circulation of African creative production.",
    cards: [],
  },
  {
    id: "religion-philosophy",
    label: "Religion & Philosophy",
    description:
      "African philosophical traditions, Ubuntu ethics, indigenous knowledge systems, theology, and the contributions of African thinkers to global thought.",
    cards: [],
  },
];

export default function ArchiveClient() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const current =
    categories.find((c) => c.id === activeCategory) ?? categories[0];

  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Published Papers / Archive"
        lede="The permanent, citable record of scholarship accepted by the Institute. Organised by research area."
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">

        {/* ── Category filter tabs ─────────────────────────────────── */}
        <Reveal>
          <SectionLabel>Browse by Research Area</SectionLabel>
          <div
            role="tablist"
            aria-label="Filter archive by research area"
            className="mt-5 flex flex-wrap gap-2"
          >
            {categories.map((cat) => {
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  id={`tab-${cat.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-turquoise ${
                    isActive
                      ? "border-teal-deep bg-teal-deep text-paper shadow-sm"
                      : "border-ink/20 bg-paper text-ink hover:border-teal-deep hover:text-teal-deep"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ── Cards or empty state per category ────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            id={`panel-${activeCategory}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeCategory}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-8"
          >
            <p className="max-w-2xl text-base text-ink-muted">
              {current.description}
            </p>

            {current.cards.length > 0 ? (
              <>
                <SocialCards cards={current.cards} />
                <p className="mt-2 text-center font-mono-ledger text-xs text-ink/40">
                  Hover to explore · Click to view full reference
                </p>
              </>
            ) : (
              <div className="mt-6">
                <PlaceholderNotice>
                  no papers or forthcoming titles have been confirmed yet for{" "}
                  {current.label}, nothing is invented for this build.
                </PlaceholderNotice>
                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center rounded-lg border border-dashed border-ink/20 bg-paper p-10 text-center"
                    >
                      <Archive aria-hidden="true" className="h-8 w-8 text-ink/25" />
                      <p className="mt-3 font-mono-ledger text-xs text-ink-muted">
                        Paper pending
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Institutional note ─────────────────────────────────────── */}
        <Reveal className="mt-10">
          <div className="rounded-lg border border-ink/10 bg-paper p-5">
            <p className="font-mono-ledger text-xs text-ink-muted">
              <span className="font-semibold text-ink">Archive note:</span>{" "}
              The Institute&rsquo;s own peer-reviewed publications will appear
              here as each Call for Papers cohort completes editorial review.
              The only real titles shown today are the three books marked
              &ldquo;Forthcoming&rdquo; under History &amp; Decolonization, by
              the Institute&rsquo;s founder, Michael Olukayode, with no
              confirmed release date yet; no other papers or books are
              invented for this build.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}
