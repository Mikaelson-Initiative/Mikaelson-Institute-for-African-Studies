"use client";

import dynamic from "next/dynamic";

const GlobeScene = dynamic(
  () => import("@/components/globe/globe-scene").then((mod) => mod.GlobeScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center font-mono-ledger text-sm text-ink-muted">
        Loading globe…
      </div>
    ),
  },
);

/**
 * Isolated test route for the pinned-scroll-globe feature (Step 2: static
 * empire markers added, still auto-rotating, no scroll yet). Not linked from
 * nav — verify here before touching the real homepage, per the build brief.
 */
export default function GlobeTestPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Globe test: Step 2</h1>
      <p className="mt-2 text-sm text-ink-muted">
        15 empire markers as static glowing points, still auto-rotating, no
        scroll or labels yet. Check that markers sit on the surface (not
        floating off it or sunk inside it) and land in roughly the right
        regions as the globe turns.
      </p>
      <div className="mt-8 h-[70vh] w-full overflow-hidden rounded-lg border border-ink/10">
        <GlobeScene />
      </div>
    </div>
  );
}
