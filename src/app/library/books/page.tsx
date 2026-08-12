"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/section-label";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

type Genre = {
  id: string;
  label: string;
  description: string;
  cards: CardItem[];
};

// Book covers sourced from Open Library (covers.openlibrary.org) using ISBNs.
// These are real, publicly available cover images for published works.
const genres: Genre[] = [
  {
    id: "history-decolonization",
    label: "History & Decolonization",
    description:
      "Essential reading across African civilizations, colonial encounter, intellectual history, and the ongoing work of decolonization.",
    cards: [
      {
        imgUrl: "https://covers.openlibrary.org/b/id/426011-L.jpg",
        alt: "Africa in History — Basil Davidson",
        linkUrl: "https://openlibrary.org/isbn/9780297764052",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0882580132-L.jpg",
        alt: "How Europe Underdeveloped Africa — Walter Rodney",
        linkUrl: "https://openlibrary.org/isbn/0882580132",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780435080167-L.jpg",
        alt: "Decolonising the Mind — Ngũgĩ wa Thiong'o",
        linkUrl: "https://openlibrary.org/isbn/9780435080167",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780802141323-L.jpg",
        alt: "The Wretched of the Earth — Frantz Fanon",
        linkUrl: "https://openlibrary.org/isbn/9780802141323",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780901787033-L.jpg",
        alt: "Africa Must Unite — Kwame Nkrumah",
        linkUrl: "https://openlibrary.org/isbn/9780901787033",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780520034433-L.jpg",
        alt: "A History of Africa — J.D. Fage",
        linkUrl: "https://openlibrary.org/isbn/9780520034433",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0618001905-L.jpg",
        alt: "King Leopold's Ghost — Adam Hochschild",
        linkUrl: "https://openlibrary.org/isbn/0618001905",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0349104492-L.jpg",
        alt: "The Scramble for Africa — Thomas Pakenham",
        linkUrl: "https://openlibrary.org/isbn/0349104492",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0679724672-L.jpg",
        alt: "The Black Jacobins — C.L.R. James",
        linkUrl: "https://openlibrary.org/isbn/0679724672",
      },
    ],
  },
  {
    id: "society-politics",
    label: "Society & Politics",
    description:
      "Scholarship on governance, political thought, social movements, development, and the making of African public life.",
    cards: [
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780385474542-L.jpg",
        alt: "Things Fall Apart — Chinua Achebe",
        linkUrl: "https://openlibrary.org/isbn/9780385474542",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780226048680-L.jpg",
        alt: "I Write What I Like — Steve Biko",
        linkUrl: "https://openlibrary.org/isbn/9780226048680",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780307719225-L.jpg",
        alt: "Why Nations Fail — Acemoglu & Robinson",
        linkUrl: "https://openlibrary.org/isbn/9780307719225",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780521388016-L.jpg",
        alt: "The State in Africa — Jean-François Bayart",
        linkUrl: "https://openlibrary.org/isbn/9780521388016",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780815702207-L.jpg",
        alt: "Democracy and Development in Africa — Claude Ake",
        linkUrl: "https://openlibrary.org/isbn/9780815702207",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0374139563-L.jpg",
        alt: "Dead Aid — Dambisa Moyo",
        linkUrl: "https://openlibrary.org/isbn/0374139563",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/id/852880-L.jpg",
        alt: "The Fate of Africa — Martin Meredith",
        linkUrl: "https://openlibrary.org/isbn/1586485482",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0316548189-L.jpg",
        alt: "Long Walk to Freedom — Nelson Mandela",
        linkUrl: "https://openlibrary.org/isbn/0316548189",
      },
    ],
  },
  {
    id: "arts-culture",
    label: "Arts & Culture",
    description:
      "Literature, visual culture, language, and the rich traditions of African creative and cultural production.",
    cards: [
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9781400044702-L.jpg",
        alt: "Half of a Yellow Sun — Chimamanda Ngozi Adichie",
        linkUrl: "https://openlibrary.org/isbn/9781400044702",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9781101971062-L.jpg",
        alt: "Homegoing — Yaa Gyasi",
        linkUrl: "https://openlibrary.org/isbn/9781101971062",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/id/275041-L.jpg",
        alt: "Season of Migration to the North — Tayeb Salih",
        linkUrl: "https://openlibrary.org/isbn/0435900668",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9781616953836-L.jpg",
        alt: "Purple Hibiscus — Chimamanda Ngozi Adichie",
        linkUrl: "https://openlibrary.org/isbn/9781616953836",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780954702335-L.jpg",
        alt: "Nervous Conditions — Tsitsi Dangarembga",
        linkUrl: "https://openlibrary.org/isbn/9780954702335",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780435902544-L.jpg",
        alt: "The African Image — Ezekiel Mphahlele",
        linkUrl: "https://openlibrary.org/isbn/9780435902544",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0435905554-L.jpg",
        alt: "So Long a Letter — Mariama Bâ",
        linkUrl: "https://openlibrary.org/isbn/0435905554",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/id/275135-L.jpg",
        alt: "The Joys of Motherhood — Buchi Emecheta",
        linkUrl: "https://openlibrary.org/isbn/0435906844",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0385474555-L.jpg",
        alt: "No Longer at Ease — Chinua Achebe",
        linkUrl: "https://openlibrary.org/isbn/0385474555",
      },
    ],
  },
  {
    id: "religion-philosophy",
    label: "Religion & Philosophy",
    description:
      "African philosophies, indigenous knowledge systems, religious traditions, and the intellectual work of African thinkers.",
    cards: [
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780435895914-L.jpg",
        alt: "African Religions and Philosophy — John S. Mbiti",
        linkUrl: "https://openlibrary.org/isbn/9780435895914",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/id/14166428-L.jpg",
        alt: "Contrasts and Contests about Philosophy — Mogobe B. Ramose",
        linkUrl: "https://openlibrary.org/isbn/9781138223479",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9781856494366-L.jpg",
        alt: "An Introduction to African Philosophy — Samuel Olusegun Okafor",
        linkUrl: "https://openlibrary.org/isbn/9781856494366",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/9780521319386-L.jpg",
        alt: "African Philosophy: An Introduction — Richard H. Bell",
        linkUrl: "https://openlibrary.org/isbn/9780521319386",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0316552003-L.jpg",
        alt: "The Africans: A Triple Heritage — Ali A. Mazrui",
        linkUrl: "https://openlibrary.org/isbn/0316552003",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0195068521-L.jpg",
        alt: "In My Father's House — Kwame Anthony Appiah",
        linkUrl: "https://openlibrary.org/isbn/0195068521",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0253204682-L.jpg",
        alt: "The Invention of Africa — V.Y. Mudimbe",
        linkUrl: "https://openlibrary.org/isbn/0253204682",
      },
      {
        imgUrl: "https://covers.openlibrary.org/b/isbn/0853451362-L.jpg",
        alt: "Consciencism — Kwame Nkrumah",
        linkUrl: "https://openlibrary.org/isbn/0853451362",
      },
    ],
  },
];

export default function BooksPage() {
  const [activeGenre, setActiveGenre] = useState(genres[0].id);

  const current = genres.find((g) => g.id === activeGenre) ?? genres[0];

  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Books"
        lede="Scholarship worth reading. Organised by research area."
      />

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
              <span className="font-semibold text-ink">Note —</span> These
              titles are presented as recommended reading aligned with the
              Institute&rsquo;s research areas. They are not published by
              Mikaelson Institute for African Studies. The Institute&rsquo;s own
              publications will appear here as the collection develops.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}
