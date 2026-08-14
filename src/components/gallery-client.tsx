"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ResilientImage } from "@/components/ui/resilient-image";

export type GalleryImage = {
  title: string;
  imgUrl: string;
};

// Gentle, staggered vertical float — each tile drifts at a slightly
// different duration/phase so the grid doesn't move in lockstep. Disabled
// entirely under prefers-reduced-motion (site-wide rule, see cursor-follower
// and other motion components) rather than just slowed down.
function FloatingTile({ image, index }: { image: GalleryImage; index: number }) {
  const reduceMotion = useReducedMotion();
  const duration = 5 + (index % 4) * 0.7;
  const delay = (index % 5) * 0.3;

  return (
    <motion.figure
      className="group relative overflow-hidden rounded-2xl bg-paper shadow-lg"
      animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
      transition={
        reduceMotion
          ? undefined
          : { duration, delay, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-black/5">
        <ResilientImage
          src={image.imgUrl}
          alt={image.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 font-mono-ledger text-xs text-white/90">
        {image.title}
      </figcaption>
    </motion.figure>
  );
}

export function GalleryClient({ images }: { images: GalleryImage[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, i) => (
        <FloatingTile key={image.imgUrl} image={image} index={i} />
      ))}
    </div>
  );
}
