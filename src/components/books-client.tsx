"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/section-label";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

export type Genre = {
  id: string;
  label: string;
  description: string;
  cards: CardItem[];
};

export function BooksClient({ genres }: { genres: Genre[] }) {
  const [activeGenre, setActiveGenre] = useState(genres[0].id);

  const current = genres.find((g) => g.id === activeGenre) ?? genres[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      {/* ── Genre filter tabs ─────────────────────────────────── */}
      <Reveal>
        <SectionLabel>Browse by Research Area</SectionLabel>
        <div
          role="tablist"
          aria-label="Filter books by research area"
          className="mt-5 flex flex-wrap gap-2"
        >
          {genres.map((genre) => {
            const isActive = genre.id === activeGenre;
            return (
              <button
                key={genre.id}
                role="tab"
                id={`tab-${genre.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${genre.id}`}
                onClick={() => setActiveGenre(genre.id)}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-turquoise ${
                  isActive
                    ? "border-teal-deep bg-teal-deep text-paper shadow-sm"
                    : "border-ink/20 bg-paper text-ink hover:border-teal-deep hover:text-teal-deep"
                }`}
              >
                {genre.label}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* ── Fan carousel per genre ───────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeGenre}
          id={`panel-${activeGenre}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeGenre}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-8"
        >
          <p className="max-w-2xl text-base text-ink-muted">
            {current.description}
          </p>

          {/* Fan carousel — hover a card to see it lift; click to open on Open Library */}
          <SocialCards cards={current.cards} />

          <p className="mt-2 text-center font-mono-ledger text-xs text-ink/40">
            Hover to explore · Click to view on Open Library
          </p>
        </motion.div>
      </AnimatePresence>

      {/* ── Institutional note ────────────────────────────────── */}
      <Reveal className="mt-10">
        <div className="rounded-lg border border-ink/10 bg-paper p-5">
          <p className="font-mono-ledger text-xs text-ink-muted">
            <span className="font-semibold text-ink">Note -</span> These
            titles are presented as recommended reading aligned with the
            Institute&rsquo;s research areas. They are not published by
            Mikaelson Institute for African Studies. The Institute&rsquo;s own
            publications will appear here as the collection develops.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
