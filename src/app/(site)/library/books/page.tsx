import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { BooksClient, type Genre } from "@/components/books-client";
import { prisma } from "@/lib/prisma";

// Previously impossible: the old page.tsx was a "use client" component
// (top-level useState for the genre tabs), and Next.js only allows
// `metadata` exports from Server Components. Splitting the interactive
// part into books-client.tsx (for the CMS migration above) also happens to
// unblock this — the tab title was falling back to the site default before.
export const metadata: Metadata = {
  title: "Books",
  description:
    "Recommended reading aligned with the Institute's research areas, organised by focus area.",
  keywords: ["African studies reading list", "African studies books", "African history books"],
  alternates: { canonical: "/library/books" },
};

// Revalidate periodically instead of caching at build time — otherwise a
// BookRecommendation row edited via Prisma Studio wouldn't show up until
// the next deploy, defeating the point of moving this off a hardcoded array.
export const revalidate = 60;

// Genre metadata (id/label/description) mirrors the site's fixed four
// research focus areas (see src/lib/focus-areas.ts) — a deliberate
// institutional decision, kept as code. Only the book entries within each
// genre are growing content, now sourced from the BookRecommendation table
// (see prisma/schema.prisma and docs/backend-services-plan.md's Phase 2 CMS
// section) so staff can add/reorder titles via Prisma Studio without a
// code deploy.
const GENRE_META: Omit<Genre, "cards">[] = [
  {
    id: "history-decolonization",
    label: "History & Decolonization",
    description:
      "Essential reading across African civilizations, colonial encounter, intellectual history, and the ongoing work of decolonization.",
  },
  {
    id: "society-politics",
    label: "Society & Politics",
    description:
      "Scholarship on governance, political thought, social movements, development, and the making of African public life.",
  },
  {
    id: "arts-culture",
    label: "Arts & Culture",
    description:
      "Literature, visual culture, language, and the rich traditions of African creative and cultural production.",
  },
  {
    id: "religion-philosophy",
    label: "Religion & Philosophy",
    description:
      "African philosophies, indigenous knowledge systems, religious traditions, and the intellectual work of African thinkers.",
  },
];

export default async function BooksPage() {
  const books = await prisma.bookRecommendation.findMany({
    orderBy: [{ genre: "asc" }, { sortOrder: "asc" }],
  });

  const genres: Genre[] = GENRE_META.map((genre) => ({
    ...genre,
    cards: books
      .filter((book) => book.genre === genre.id)
      .map((book) => ({
        imgUrl: book.imgUrl.replace("-L.jpg", "-M.jpg"),
        alt: book.title,
        linkUrl: book.linkUrl,
      })),
  }));

  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Books"
        lede="Scholarship worth reading. Organised by research area."
      />
      <BooksClient genres={genres} />
    </>
  );
}
