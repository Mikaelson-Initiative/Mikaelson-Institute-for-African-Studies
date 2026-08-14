"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingImage, cursorSpring } from "@/components/floating-image";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PartnershipArea {
  title: string;
  description: string;
}

export interface Partner {
  name: string;
  type?: string;   // e.g. "University", "Library", "Foundation"
  logo?: string;    // enables the floating hover preview, same as team photos
}

// ── Spring configs (matching kinetic-team.tsx for design parity) ─────────────

const nameSpring = { type: "spring" as const, stiffness: 300, damping: 22 };

// ── PartnerRow ────────────────────────────────────────────────────────────────
// Hovering a partner with a logo floats it near the cursor — same mechanic
// as team member photos. Rows without a logo just skip the callback.

function PartnerRow({
  partner,
  index,
  isLast,
  onEnter,
  onLeave,
}: {
  partner: Partner;
  index: string;
  isLast: boolean;
  onEnter: (partner: Partner) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex cursor-default select-none items-center gap-6 py-5 ${!isLast ? "border-b border-ink/10" : ""}`}
      onMouseEnter={() => { setHovered(true); onEnter(partner); }}
      onMouseLeave={() => { setHovered(false); onLeave(); }}
    >
      <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-ink-muted/40">
        {index}
      </span>

      <div className="flex min-w-0 flex-1 items-baseline">
        <motion.span
          className="block truncate font-display font-semibold leading-none tracking-tight"
          animate={{
            x: hovered ? 16 : 0,
            scale: hovered ? 1.02 : 1,
            color: hovered ? "#003e45" : "#4a4438",
          }}
          transition={nameSpring}
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.75rem)" }}
        >
          {partner.name}
        </motion.span>
      </div>

      {partner.type && (
        <p className="hidden shrink-0 font-mono-ledger text-xs uppercase tracking-widest text-ink-muted sm:block">
          {partner.type}
        </p>
      )}
    </div>
  );
}

// ── PlaceholderRow (empty category — matches kinetic-team.tsx) ───────────────

function PlaceholderRow({ index, isLast }: { index: string; isLast: boolean }) {
  return (
    <div className={`flex items-center gap-6 py-5 ${!isLast ? "border-b border-ink/10" : ""}`}>
      <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-ink/20">{index}</span>
      <div className="h-8 flex-1 animate-pulse rounded-md bg-ink/8" />
    </div>
  );
}

// ── AreaRow (no image — text-only, per Partnership Areas' content shape) ────

function AreaRow({ area, index, isLast }: { area: PartnershipArea; index: string; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex cursor-default select-none items-start gap-6 py-6 ${!isLast ? "border-b border-ink/10" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="w-8 shrink-0 pt-1 font-mono text-xs tabular-nums text-ink-muted/40">
        {index}
      </span>

      <div className="min-w-0 flex-1">
        <motion.h3
          className="font-display font-semibold leading-none tracking-tight"
          animate={{
            x: hovered ? 16 : 0,
            color: hovered ? "#003e45" : "#4a4438",
          }}
          transition={nameSpring}
          style={{ fontSize: "clamp(1.375rem, 2.6vw, 2rem)" }}
        >
          {area.title}
        </motion.h3>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">{area.description}</p>
      </div>
    </div>
  );
}

// ── KineticPartners (root) ────────────────────────────────────────────────────

export function KineticPartners({
  areas,
  partners = [],
}: {
  areas: PartnershipArea[];
  partners?: Partner[];
}) {
  const placeholders = ["01", "02", "03"];
  const isEmpty = partners.length === 0;

  // Mouse position as motion values — no React state re-renders on mousemove
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, cursorSpring);
  const springY = useSpring(rawY, cursorSpring);

  const [activeLogo, setActiveLogo] = useState<{ src: string; alt: string } | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    },
    [rawX, rawY]
  );

  const handleEnter = useCallback((partner: Partner) => {
    if (partner.logo) {
      setActiveLogo({ src: partner.logo, alt: partner.name });
    }
  }, []);

  const handleLeave = useCallback(() => {
    setActiveLogo(null);
  }, []);

  return (
    <>
      {/* ── Floating logo (rendered at root, above all stacking contexts) ── */}
      <AnimatePresence>
        {activeLogo && (
          <FloatingImage key={activeLogo.src} src={activeLogo.src} alt={activeLogo.alt} x={springX} y={springY} />
        )}
      </AnimatePresence>

      <div className="relative w-full bg-beige" onMouseMove={handleMouseMove}>
        {/* Ambient depth — same treatment as the Team page */}
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
              Our Partners
            </p>
            <h2
              className="font-display font-bold leading-none tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              <span className="text-teal-deep">Serious intellectual work</span>{" "}
              <span className="text-black">is rarely built alone.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base text-ink-muted">
              We seek relationships with universities, research institutes,
              libraries, archives, cultural institutions, publishers, civil
              society organizations, foundations, and communities across Africa
              and beyond.
            </p>
          </motion.div>

          {/* ── Current Partners ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="border-b border-ink/10 pb-3">
              <p className="font-mono-ledger text-xs uppercase tracking-widest text-ink-muted/60">
                Current Partners
              </p>
            </div>
            {isEmpty
              ? placeholders.map((idx, i) => (
                  <PlaceholderRow key={idx} index={idx} isLast={i === placeholders.length - 1} />
                ))
              : partners.map((partner, i) => (
                  <PartnerRow
                    key={partner.name}
                    partner={partner}
                    index={String(i + 1).padStart(2, "0")}
                    isLast={i === partners.length - 1}
                    onEnter={handleEnter}
                    onLeave={handleLeave}
                  />
                ))}
            {isEmpty && (
              <p className="mt-3 font-mono-ledger text-xs text-ink-muted">
                partner institutions haven&rsquo;t been confirmed yet; no
                names, logos, or affiliations are invented for this build.
              </p>
            )}
          </motion.div>

          {/* ── Partnership Areas ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
            className="mt-14"
          >
            <div className="border-b border-ink/10 pb-3">
              <p className="font-mono-ledger text-xs uppercase tracking-widest text-ink-muted/60">
                Partnership Areas
              </p>
            </div>
            {areas.map((area, i) => (
              <AreaRow
                key={area.title}
                area={area}
                index={String(i + 1).padStart(2, "0")}
                isLast={i === areas.length - 1}
              />
            ))}
          </motion.div>

          {/* ── Enquiries CTA ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 border-t border-ink/10 pt-10"
          >
            <p className="font-mono-ledger text-xs uppercase tracking-widest text-ink-muted/60">
              Partnership Enquiries
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Interested in partnering with us?
            </h2>
            <p className="mt-3 max-w-lg text-base text-ink-muted">
              If your institution or organization is interested in exploring a
              partnership with the Institute, we would welcome that
              conversation.
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
