import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { GalleryClient, type GalleryImage } from "@/components/gallery-client";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A curated gallery of contemporary African art, presented alongside the Institute's research.",
};

// Curated reference images from Adeche Atelier's 2026 collection
// (adeche.art) — a real, independent artist/studio, not MIAS's own work.
// Every URL below was verified live before use; none are invented.
const images: GalleryImage[] = [
  {
    title: "Shaped From Earth, 2026",
    imgUrl: "https://static.wixstatic.com/media/649bca_2f701db4c43146349d711a3a14a9c279~mv2.png",
  },
  {
    title: "Ngai, 2026",
    imgUrl: "https://static.wixstatic.com/media/649bca_4a8f97bedfe7438eab804fa1e0808410~mv2.jpg",
  },
  {
    title: "Abuk, 2026",
    imgUrl: "https://static.wixstatic.com/media/649bca_b46d4a8cc3e0454e8fe5b0fd9463db9d~mv2.jpg",
  },
  {
    title: "Sowei Helmet Mask, 2026",
    imgUrl: "https://static.wixstatic.com/media/649bca_3f6c8e24772e4e13a568dd124817a922~mv2.jpg",
  },
  {
    title: "Chokwe Mask, 2026",
    imgUrl: "https://static.wixstatic.com/media/649bca_e3900727463047cf938c2dc897f10abc~mv2.jpg",
  },
  {
    title: "Bwa Plank Mask, 2026",
    imgUrl: "https://static.wixstatic.com/media/649bca_c8d876991757477f888338d75c82802f~mv2.jpg",
  },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Gallery"
        lede="Contemporary African art, in conversation with the Institute's research."
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <GalleryClient images={images} />

        <Reveal className="mt-10">
          <div className="rounded-lg border border-ink/10 bg-paper p-5">
            <p className="font-mono-ledger text-xs text-ink-muted">
              <span className="font-semibold text-ink">Note —</span> These
              works are by{" "}
              <a
                href="https://www.adeche.art"
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-teal-deep hover:underline"
              >
                Adeche Atelier
              </a>
              , an independent artist studio — they are not part of Mikaelson
              Institute&rsquo;s own collection. For inquiries about the
              artwork, please contact Adeche Atelier directly.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}
