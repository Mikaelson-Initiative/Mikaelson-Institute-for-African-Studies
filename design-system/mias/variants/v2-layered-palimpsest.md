# V2 — Layered Palimpsest

**Dials:** Variance 6/10 · Motion 4/10 · Density 5/10 (standard)
**Base pattern:** Immersive/hero-centric, reinterpreted from the skill's glassmorphism suggestion — but in Deep Teal, not the tool's default pink/black, and with CSS blur only (no image assets, so it stays low-bandwidth safe).

## What's different from MASTER.md

**Hero:** The palimpsest concept pushed to its fullest expression. Ghosted historical place-names (real DOM text, low-opacity Deep Teal, `aria-hidden`) fill the full hero background. Over them sits a **frosted Deep-Teal glass panel** (`backdrop-filter: blur(16px)`, `background: rgba(0,62,69,0.55)`) holding the white headline and turquoise CTA — turquoise-on-glass-teal stays within the validated 7.5:1 pair from MASTER.md, so no new contrast risk. On scroll, the ghosted names drift slightly slower than the foreground panel (a 4-6% parallax offset, GPU-cheap transform-only) — reads as literal depth, "the past moving at a different speed than the present."

**Layout:** Focus-area cards use a subtle asymmetric grid (one card slightly larger — whichever focus area MIAS wants to lead with editorially) rather than V1's strict uniform grid.

**Motion:** The one place in the whole system where motion does real work — the parallax hero. Everything below the hero reverts to MASTER.md's standard subtle scroll-reveal. Must ship a fully-static fallback for `prefers-reduced-motion` (panel and names simply both sit still, no parallax).

**Risk profile:** Highest signature value, moderate implementation risk (the frosted panel + parallax needs real testing across viewport sizes and both themes of "reduced motion on/off" before it ships). This is the one `frontend-design`-style "real aesthetic risk you can justify" — the palimpsest idea stops being a background decoration and becomes the actual mechanism of the hero.
