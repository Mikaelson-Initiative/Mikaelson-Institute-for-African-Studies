import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { GalleryClient, type GalleryImage } from "@/components/gallery-client";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A curated gallery of contemporary African art, presented alongside the Institute's research.",
  keywords: ["African art gallery", "contemporary African art", "African studies arts and culture"],
  alternates: { canonical: "/library/gallery" },
};

// Revalidate periodically instead of caching at build time — otherwise a
// gallery item added or edited from the admin dashboard wouldn't show up
// until the next deploy.
export const revalidate = 60;

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } });
  const images: GalleryImage[] = items.map((item) => ({
    title: item.title,
    imgUrl: item.imageUrl,
  }));

  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Gallery"
        lede="Contemporary African art, in conversation with the Institute's research."
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {images.length > 0 ? (
          <GalleryClient images={images} />
        ) : (
          <div className="rounded-2xl border border-dashed border-ink/20 p-14 text-center text-sm text-ink-muted">
            No art in the gallery yet.
          </div>
        )}
      </div>
    </>
  );
}
