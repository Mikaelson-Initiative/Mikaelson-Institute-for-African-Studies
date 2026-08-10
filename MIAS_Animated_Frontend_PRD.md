# Frontend Build PRD
## Mikaelson Institute for African Studies — Animated Web Frontend

**Companion documents:** MIAS_PRD.md (product/technical requirements), MIAS_Design_PRD.md (visual design brief)
**Purpose:** This document specifies how the frontend should be *built* — using the `ui-ux-pro-max` design-intelligence skill as the active reference during implementation — with a particular focus on animation and motion, which the other two PRDs mention but don't fully specify.

---

## 1. Why This Document Exists

The Design PRD covers what the site should *look like*. The Engineering PRD covers *architecture and pages*. Neither fully specifies *how it should move* — and for an academic institute, animation is easy to get wrong in both directions: too much reads as unserious, too little reads as unfinished. This PRD exists to set that bar precisely, using `ui-ux-pro-max` as the working reference throughout build.

**Ground rule inherited from the skill:** every animation must express cause-and-effect, not decorate. If a motion can't be explained in one sentence as "this happens *because* the user did that," cut it. For an academic institute specifically, motion should communicate structure and hierarchy (this reveals in relation to that) — not liveliness for its own sake.

---

## 2. Tech Stack (frontend-specific)

Extends the stack from MIAS_PRD.md:

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | As specified in MIAS_PRD.md |
| Styling | Tailwind CSS | As specified in MIAS_PRD.md |
| Animation library | **Framer Motion** | Handles enter/exit, scroll-triggered reveal, and shared-layout transitions declaratively in React/TypeScript; integrates cleanly with Next.js and respects `prefers-reduced-motion` when configured correctly |
| Icons | **Lucide** (per `ui-ux-pro-max`'s no-emoji-icons rule) | Consistent stroke width, scalable, themeable — never emoji as structural icons |
| Chart library (Phase 4, if usage stats/analytics pages are ever added) | To be selected against `ui-ux-pro-max`'s Charts & Data guidance (accessible palettes, legends, tooltip-on-interact) if/when that need arises | Not required for v1 |

---

## 3. How `ui-ux-pro-max` Applies to This Build

The skill should be consulted at these specific points, not just once at the start:

- **Before building each page:** query `style-match` guidance for the product type (academic/editorial site, not a SaaS dashboard) to keep style decisions consistent with an institute rather than defaulting to generic startup patterns.
- **Before building any animated component:** check the Animation category rules (Section 4 below is these rules pre-applied to this project).
- **Before building any form (Submit a Paper, Contact):** check the Forms & Feedback category — inline validation on blur, error messages with a stated cause and fix, autosave for the longer submission form, visible labels rather than placeholder-only labels.
- **Before building navigation:** check Navigation Patterns — breadcrumbs for the Publications/Archive hierarchy (Volume → Paper), predictable back behavior, active-state highlighting.
- **Before final delivery of each page:** run the Pre-Delivery Checklist (Section 6 below, adapted for web) before marking any page complete.

---

## 4. Animation Specification, By Rule

Applying `ui-ux-pro-max`'s Animation category (Priority 7, Medium impact but high visibility on a site whose credibility depends on restraint) directly to MIAS's pages:

| Rule (from skill) | Applied to MIAS |
|---|---|
| Duration 150–300ms for micro-interactions, ≤400ms for complex transitions, avoid >500ms | Button/link hover states: 150–200ms. Card hover (Focus Areas grid): 200ms. Page-section reveals: 300–400ms. Nothing on the site should take longer than 400ms to resolve. |
| Transform/opacity only — never animate width/height/top/left | All reveals use `opacity` + `translateY`, never layout-affecting properties. This also protects performance on lower-bandwidth connections. |
| Animate 1–2 key elements per view max | On scroll into a new section, only the section heading and its immediate content reveal — not every card in a grid firing independently and simultaneously (see staggering note below). |
| Ease-out for entering, ease-in for exiting; avoid linear | All Framer Motion transitions use `easeOut` on enter. |
| Every animation must express cause-and-effect, not be decorative | See per-page breakdown below — each animation is tied to a specific user action (scroll, hover, submit), not ambient/looping motion. |
| Respect `prefers-reduced-motion` | Global: wrap all Framer Motion variants so translateY/opacity reveals collapse to a simple, instant opacity fade (or no animation) when reduced motion is requested. This is non-negotiable, not a nice-to-have. |

### Page-by-page animation plan

**Home**
- Hero: headline and lede fade/rise in on page load, staggered by ~120ms each (title → subtext → CTA buttons) — signals reading order, not just liveliness.
- The ghosted palimpsest civilization names in the hero background may have a very slow, subtle opacity drift (a slow multi-second cycle, not a bounce or loop that draws the eye) — this is the one place ambient motion is acceptable, because it reinforces the "layered history" concept rather than decorating it. Must fully respect reduced-motion (freeze to a static state).
- Section-by-section scroll reveal (About, Focus Areas, Framework, CFP) — each section's heading and body fade/rise in once, on first scroll into view, never re-triggering on scroll-up/down.

**Focus Areas grid**
- Cards do not animate on page load beyond the section-level reveal above.
- On hover: subtle background shift only (no scale/transform that shifts layout), 200ms.

**Framework/Timeline**
- Since this is a real chronological sequence, the timeline connecting line can draw in left-to-right (or top-to-bottom on mobile) as the section enters view — this is a justified use of a "sequence" animation because the content itself is sequential (see `ui-ux-pro-max`'s caution against numbered/sequential motifs where content isn't actually ordered — here it genuinely is).

**Call for Papers / Submit form**
- Form field focus states: border/label color transition, 150ms.
- Submission button: loading state (per `loading-buttons` rule) — disable + inline spinner during async submission, never a silent wait.
- Success/error feedback appears inline near the action, not as a disconnected toast the user might miss (per `error-feedback` and `success-feedback` rules).

**Publications/Archive (Phase 3)**
- New entries into the archive list can use a light stagger (40–60ms between items) on initial load — this is the one place staggering across many elements is acceptable, because it's a list, not a set of independent decisions competing for attention.

**Admin/Editor dashboard pages**
- Minimal to no decorative animation. Status changes (e.g., moving a submission from "in review" to "accepted") should have a brief, functional confirmation (a color/label change with a short transition, ~150ms) — clarity over polish here, per the Design PRD's direction that admin pages should read as utilitarian tools.

---

## 5. Non-Animation Guidance from the Skill Still in Scope

Even though this PRD's focus is animation, a few adjacent `ui-ux-pro-max` categories directly affect how the animated components must be built, and are called out so they aren't lost in a frontend-only conversation:

- **Touch targets:** every animated interactive element (buttons, nav links, form fields) must still meet 44×44px minimum tap area on mobile, regardless of how it animates.
- **Performance:** animations must not cause layout shift (CLS) — reinforces the transform/opacity-only rule above, and matters more here because part of the audience is on slower connections (already a constraint in the Design PRD).
- **Color:** animated state changes (hover, focus, error, success) must never rely on color alone — pair with icon, label, or shape change, per `color-not-only`.
- **Reduced motion:** stated above, but worth repeating as its own line item because it's the single most commonly skipped requirement in animated builds — it should be tested explicitly, not assumed to work.

---

## 6. Pre-Delivery Checklist (Web, adapted from the skill's checklist)

Before any page is marked complete, verify:

**Animation**
- [ ] No animation exceeds 400ms
- [ ] Only transform/opacity are animated — no width/height/top/left
- [ ] Every animation ties to a specific cause (load, scroll-into-view, hover, submit) — nothing loops or plays ambiently except the one approved hero exception
- [ ] `prefers-reduced-motion` tested and confirmed working, not assumed
- [ ] No more than 1–2 elements animate simultaneously per view (except the justified list-stagger and timeline-sequence cases above)

**Accessibility**
- [ ] Visible focus states on every interactive element, including ones with custom animated hover states
- [ ] Color contrast 4.5:1 minimum on all text, including text over any animated/gradient backgrounds
- [ ] Keyboard navigation works identically to mouse/touch — nothing is reachable only via hover

**Performance**
- [ ] No layout shift introduced by any animation (CLS check)
- [ ] Images use WebP/AVIF with reserved dimensions
- [ ] Below-the-fold content lazy-loads

**Consistency**
- [ ] Same easing curve and duration scale used across the whole site — no page invents its own animation timing
- [ ] Icons are all from one consistent icon set (Lucide), no emoji

---

## 7. Open Questions

1. Should the "slow ambient drift" on the hero's palimpsest background be treated as a firm requirement, or is it acceptable to cut entirely for a v1 that ships faster and simpler? (Recommend: build it feature-flagged/easy to disable, so it can be evaluated live rather than debated in the abstract.)
2. Do any other Mikaelson properties (e.g., RentalHub, the School Club site) carry existing motion/animation conventions this build should stay consistent with, now that the color and type system is confirmed as shared brand infrastructure?
3. The confirmed brand colors include a bright Light Yellow (`#FFE665`) used narrowly as a highlight accent (see Section 4's per-page plan, e.g., timeline dot markers). Should any hover/transition states involving this color get extra scrutiny, since it's the one official color that fails text-contrast requirements and needs care wherever it's animated (e.g., fading in/out) to avoid a moment of poor legibility mid-transition?

---

## 8. Decisions Locked for This Build (resolved 2026-08-09)

- **Hero ambient drift:** build it, feature-flagged (`NEXT_PUBLIC_ENABLE_HERO_DRIFT`, default on, one-line disable). See Q1.
- **Cross-property motion conventions:** none exist yet — MIAS's motion system is authored fresh and is independent of RentalHub/School Club. See Q2.
- **Light Yellow in transitions:** never animate Light Yellow's opacity/fade in a way that passes through a low-alpha state while any text is overlaid on it; treat it as a solid-or-absent accent (border, dot, badge fill) rather than a fading one. See Q3.
