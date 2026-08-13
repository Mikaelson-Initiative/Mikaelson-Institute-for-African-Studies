"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export type ScrollItem = {
  title: string;
  description: string;
  image?: string;
};

export function ScrollSequence({ items, children }: { items: ScrollItem[], children?: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-16 px-6 py-16 text-center">
        {items.map((item) => (
          <div key={item.title}>
            <h2 className="text-3xl font-semibold text-neutral-900 sm:text-5xl">{item.title}</h2>
            <p className="mt-4 text-base text-neutral-500 sm:text-lg">{item.description}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full py-32 px-6">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-24 md:gap-[15vh] pb-[30vh]">
        {items.map((item) => (
          <DepthCard key={item.title} item={item} />
        ))}
        
        {children && (
          <div className="w-full flex justify-center mt-12">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

function DepthCard({ item }: { item: ScrollItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this specific card
  const { scrollYProgress } = useScroll({
    target: cardRef,
    // Start effect when top of card hits 20% from top of viewport
    // End effect when top of card hits top of viewport
    offset: ["start 20%", "start -50%"],
  });

  // As the card scrolls up out of view, it scales down and fades out
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
        willChange: "transform, opacity",
      }}
      className="mx-auto w-full max-w-4xl flex flex-col bg-white rounded-[60px] md:rounded-[80px] overflow-hidden shadow-[inset_0px_0px_50px_0px_#2e4b46] border border-black/5"
    >
      <div className="w-full p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        
        {/* Image Frame - Perfect Square inside the wide card */}
        <div className="w-full md:w-1/2 flex items-center justify-center md:justify-start">
          <div className="relative w-full max-w-[400px] aspect-square rounded-[40px] overflow-hidden flex-shrink-0 bg-neutral-100 shadow-xl">
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center py-4 md:py-8 pr-4 text-center md:text-left">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-black leading-[1.1] tracking-tight">
            {item.title.split(' ').map((word: string, i: number) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h2>
          <p className="mt-6 md:mt-8 text-base md:text-lg text-black/80 leading-relaxed font-sans max-w-sm mx-auto md:mx-0">
            {item.description}
          </p>
        </div>

      </div>
    </motion.div>
  );
}
