import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="bg-teal-deep text-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          {eyebrow && (
            <p className="font-mono-ledger text-xs tracking-widest text-turquoise uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {lede && <div className="mt-4 max-w-2xl text-base text-paper/80 sm:text-lg">{lede}</div>}
          {children}
        </Reveal>
      </div>
    </div>
  );
}
