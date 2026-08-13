"use client";

import { useCallback, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingImage, cursorSpring } from "@/components/floating-image";

// ── Types ────────────────────────────────────────────────────────────────────

export interface TeamMember {
  index: string;      // "01", "02", etc.
  name: string;
  role: string;
  affiliation?: string;
  image?: string;     // optional profile image URL — enables floating preview card
}

export interface TeamCategory {
  label: string;
  members: TeamMember[];
}

// ── Spring configs ───────────────────────────────────────────────────────────

const nameSpring  = { type: "spring" as const, stiffness: 300, damping: 22 };
const metaSpring  = { type: "spring" as const, stiffness: 200, damping: 30 };

// ── MemberRow ─────────────────────────────────────────────────────────────────

function MemberRow({
  member,
  isLast,
  onEnter,
  onLeave,
}: {
  member: TeamMember;
  isLast: boolean;
  onEnter: (member: TeamMember) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={!isLast ? "border-b border-ink/10" : ""}>
      <div
        className="flex cursor-default select-none items-center gap-4 py-5 sm:gap-6"
        onMouseEnter={() => { setHovered(true);  onEnter(member); }}
        onMouseLeave={() => { setHovered(false); onLeave(); }}
      >
        {/* Index */}
        <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-ink-muted/40 transition-colors duration-300 group-hover:text-ink-muted">
          {member.index}
        </span>

        {/* Name */}
        <div className="flex min-w-0 flex-1 items-baseline">
          <motion.span
            className="block truncate font-display font-semibold leading-none tracking-tight"
            animate={{
              x:     hovered ? 16 : 0,
              scale: hovered ? 1.02 : 1,
              color: hovered ? "#003e45" : "#4a4438",   // teal-deep on hover, ink-muted at rest
            }}
            transition={nameSpring}
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.75rem)" }}
          >
            {member.name}
          </motion.span>
        </div>

        {/* Role + affiliation — desktop/tablet only, hover reveals it */}
        <motion.div
          className="hidden shrink-0 text-right sm:block"
          animate={{ opacity: hovered ? 1 : 0.4 }}
          transition={metaSpring}
        >
          <p className="font-mono-ledger text-xs uppercase tracking-widest text-ink-muted">
            {member.role}
          </p>
          {member.affiliation && (
            <p className="mt-0.5 font-mono-ledger text-xs text-ink/40">
              {member.affiliation}
            </p>
          )}
        </motion.div>

        {/* Mobile: no hover, so a tap-to-reveal "+" replaces the floating
            image preview — there's no cursor to follow on touch. */}
        {member.image && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? `Hide ${member.name}'s photo` : `Show ${member.name}'s photo`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink-muted transition-colors duration-200 active:bg-ink/5 sm:hidden"
          >
            {expanded ? <X aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Mobile-only inline photo reveal */}
      <AnimatePresence initial={false}>
        {expanded && member.image && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden sm:hidden"
          >
            <div className="pb-5">
              <p className="mb-2 font-mono-ledger text-xs uppercase tracking-widest text-ink-muted">
                {member.role}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.image}
                alt={member.name}
                className="h-56 w-full rounded-2xl object-cover shadow-lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── PlaceholderRow ───────────────────────────────────────────────────────────

function PlaceholderRow({ index, isLast }: { index: string; isLast: boolean }) {
  return (
    <div
      className={`flex items-center gap-6 py-5 ${
        !isLast ? "border-b border-ink/10" : ""
      }`}
    >
      <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-ink/20">
        {index}
      </span>
      <div className="h-8 flex-1 animate-pulse rounded-md bg-ink/8" />
      <div className="hidden h-4 w-32 animate-pulse rounded bg-ink/8 sm:block" />
    </div>
  );
}

// ── CategorySection ──────────────────────────────────────────────────────────

function CategorySection({
  category,
  onEnter,
  onLeave,
}: {
  category: TeamCategory;
  onEnter: (member: TeamMember) => void;
  onLeave: () => void;
}) {
  const isEmpty = category.members.length === 0;
  const placeholders = ["01", "02", "03"];

  return (
    <section>
      <div className="border-b border-ink/10 pb-3">
        <p className="font-mono-ledger text-xs uppercase tracking-widest text-ink-muted/60">
          {category.label}
        </p>
      </div>

      {isEmpty
        ? placeholders.map((idx, i) => (
            <PlaceholderRow
              key={idx}
              index={idx}
              isLast={i === placeholders.length - 1}
            />
          ))
        : category.members.map((member, i) => (
            <MemberRow
              key={member.index}
              member={member}
              isLast={i === category.members.length - 1}
              onEnter={onEnter}
              onLeave={onLeave}
            />
          ))}
    </section>
  );
}

// ── KineticTeam (root) ────────────────────────────────────────────────────────

export function KineticTeam({ categories }: { categories: TeamCategory[] }) {
  // Mouse position as motion values — no React state re-renders on mousemove
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, cursorSpring);
  const springY = useSpring(rawY, cursorSpring);

  // Which member is currently hovered (only matters when they have an image)
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    },
    [rawX, rawY]
  );

  const handleEnter = useCallback((member: TeamMember) => {
    if (member.image) {
      setActiveImage({ src: member.image, alt: member.name });
    }
  }, []);

  const handleLeave = useCallback(() => {
    setActiveImage(null);
  }, []);

  return (
    <>
      {/* ── Floating image (rendered at root, above all stacking contexts) ── */}
      <AnimatePresence>
        {activeImage && (
          <FloatingImage
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            x={springX}
            y={springY}
          />
        )}
      </AnimatePresence>

      {/* ── Page body ──────────────────────────────────────────────────────── */}
      <div
        className="relative w-full bg-beige"
        onMouseMove={handleMouseMove}
      >
        {/* Subtle ambient depth — warm teal shimmer, keeps it from feeling flat */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 70% 40% at 15% 0%, rgba(0,62,69,0.06) 0%, transparent 65%)",
              "radial-gradient(ellipse 50% 35% at 85% 100%, rgba(0,62,69,0.04) 0%, transparent 60%)",
            ].join(", "),
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

          {/* ── Heading ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <p className="mb-4 font-mono-ledger text-xs uppercase tracking-widest text-ink-muted/60">
              Our Community
            </p>
            <h2
              className="font-display font-bold leading-none tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              <span className="text-teal-deep">The people who make</span>{" "}
              <span className="text-black">the work possible.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base text-ink-muted">
              Mikaelson Institute is built around researchers, scholars, writers,
              editors, and cultural practitioners who believe knowledge is a
              public responsibility.
            </p>
          </motion.div>

          {/* ── Category sections ──────────────────────────────────── */}
          <div className="space-y-14">
            {categories.map((category, i) => (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.07,
                }}
              >
                <CategorySection
                  category={category}
                  onEnter={handleEnter}
                  onLeave={handleLeave}
                />
              </motion.div>
            ))}
          </div>

          {/* ── Join invite ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 border-t border-ink/10 pt-10"
          >
            <p className="font-mono-ledger text-xs uppercase tracking-widest text-ink-muted/60">
              Join Us
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Interested in making an impact?
            </h2>
            <p className="mt-3 max-w-lg text-base text-ink-muted">
              We are building our community. If you are a researcher, scholar,
              editor, or practitioner whose work engages seriously with Africa,
              we want to hear from you.
            </p>
            <div className="mt-6">
              <Button href="/contact" variant="primary">
                Get in Touch
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
