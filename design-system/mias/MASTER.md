# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/mias/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** MIAS — Mikaelson Institute for African Studies
**Category:** Academic Research Institute (not a nonprofit-marketing site — see `MIAS_Design_PRD.md` §1)
**Scope:** Home page only, per the PRD's required review order (design system + Home → remaining public pages → authenticated pages). Do not extend this system to other pages until Home is explicitly approved.
**Design Dials:** Variance 2/10 (centered/minimal) | Motion 2/10 (subtle) | Density 5/10 (standard)

Sources reconciled here: `MIAS_PRD.md`, `MIAS_Design_PRD.md` (locked brand constraints) + `ui-ux-pro-max` skill's `product`/`style`/`landing`/`ux` domain data (pattern selection, accessibility rules) + manual WCAG contrast verification (the skill's palette generator does not accept a custom input palette, so colors below are the **actual locked brand hexes**, not the tool's generic suggestion).

---

## Global Rules

### Color Palette — LOCKED (official Mikaelson Initiative brand hexes; no substitutions)

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary (dark) | `#003E45` Deep Teal | `--color-primary` | Hero bg, nav, dark section backgrounds — dominant tone |
| Accent | `#5CE1E6` Turquoise Blue | `--color-accent` | Links/CTAs/highlights **on dark (`--color-primary`) backgrounds only** — see contrast note below |
| Background | `#E9E1D8` Light Beige | `--color-background` | Page background |
| Foreground | `#201D16` Dark Grey Brown | `--color-foreground` | Body text |
| Highlight (non-text) | `#FFE665` Light Yellow | `--color-highlight` | Borders, badge fills, small accents only — **never text, never as a fill under 3:1-checked size** |
| Surface | `#FFFFFF` Pure White | `--color-surface` | Card/panel backgrounds |

**⚠️ Contrast findings (WCAG 2.1, computed against the actual hexes above — flag to brand owner before build):**

| Pair | Ratio | AA text (4.5:1) | AA UI/large (3:1) |
|---|---|---|---|
| Foreground on Background (`#201D16` / `#E9E1D8`) | 12.99:1 | ✅ | ✅ |
| Foreground on Surface (`#201D16` / `#FFFFFF`) | 16.82:1 | ✅ | ✅ |
| Surface text on Primary (`#FFFFFF` / `#003E45`) | 11.83:1 | ✅ | ✅ |
| **Accent on Primary (`#5CE1E6` / `#003E45`)** | 7.53:1 | ✅ | ✅ |
| Primary text on Background (`#003E45` / `#E9E1D8`) | 9.14:1 | ✅ | ✅ |
| **Accent on Background (`#5CE1E6` / `#E9E1D8`)** | **1.21:1** | ❌ | ❌ |
| **Accent on Surface (`#5CE1E6` / `#FFFFFF`)** | **1.57:1** | ❌ | ❌ |
| Highlight on Primary (`#FFE665` / `#003E45`) | 9.44:1 | ✅ (non-text use only) | ✅ |
| **Highlight on Background (`#FFE665` / `#E9E1D8`)** | **1.03:1** | ❌ | ❌ |

**Rule this drives:** Turquoise (`--color-accent`) is only legible as **text or a thin element** against the Deep Teal primary. On the beige/white sections of the Home page (which is most of the page — hero aside), turquoise **cannot** be used for link text or outlined buttons; it reads as nearly invisible (1.2–1.6:1). Same problem for the Light Yellow highlight against beige — even its intended non-text "borders/badges" role fails 3:1 there, so any yellow badge or border sitting directly on the beige background needs a dark (`#201D16` or `#003E45`) outline or backing shape to remain perceivable, not just yellow-on-beige.

**Practical resolution for Home:** reserve turquoise for (a) text/icons/links on Deep Teal sections (hero, footer, dark CTA band) and (b) small non-text accents on light sections sized/framed to only need 3:1 against an adjacent dark edge (e.g., a turquoise underline on a dark-outlined tab, not turquoise text on beige). Primary links in body copy on the beige background should use Deep Teal, not Turquoise. Flag this to whoever owns brand sign-off — it's a real constraint the brand guideline didn't anticipate.

### Typography — LOCKED

- **Display/Headings:** Grift (placeholder: **Baloo 2** until licensed webfont files arrive — flag every Baloo 2 usage as provisional in code comments/PR description)
- **Body/UI:** **Inter**
- **Utility (tentative, needs sign-off):** a monospace face for citation/archival-style labels (e.g., IBM Plex Mono or JetBrains Mono) — used sparingly for eyebrows, dates, submission-status labels. Not brand-specified; confirm before shipping broadly.

**Type scale (desktop / mobile):**

| Level | Font | Weight | Desktop | Mobile | Line-height |
|---|---|---|---|---|---|
| Display (hero headline) | Grift/Baloo 2 | 700 | 56px | 34px | 1.1 |
| H1 (page/section title) | Grift/Baloo 2 | 700 | 40px | 28px | 1.15 |
| H2 (subsection) | Grift/Baloo 2 | 600 | 28px | 22px | 1.2 |
| H3 (card title) | Grift/Baloo 2 | 600 | 20px | 18px | 1.3 |
| H4 (small heading/label group) | Inter | 600 | 16px | 15px | 1.4 |
| Body | Inter | 400 | 17px | 16px | 1.6 |
| Caption/meta | Inter | 400 | 14px | 13px | 1.5 |
| Utility label (mono, if approved) | Mono | 500 | 13px | 12px | 1.4, uppercase, +0.03em tracking |

Never go below 16px body on mobile (avoids iOS auto-zoom on form inputs, matters directly for the Submit-a-Paper form later).

### Spacing Variables (standard density — Home is content-rich, not a dashboard)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps (icon-to-label) |
| `--space-sm` | `8px` | Inline spacing |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Card padding |
| `--space-xl` | `32px` | Component gaps |
| `--space-2xl` | `48px` | Section internal spacing |
| `--space-3xl` | `96px` | Between major sections (hero, focus areas, news, CTA) |

### Shadow Depths

| Level | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(32,29,22,0.08)` | Subtle lift on interactive surfaces |
| `--shadow-md` | `0 4px 6px rgba(32,29,22,0.10)` | Cards |
| `--shadow-lg` | `0 10px 15px rgba(32,29,22,0.12)` | Dropdowns, sticky nav on scroll |

(Shadows tinted from Dark Grey Brown, not pure black — keeps the muted/editorial tone the PRD asks for rather than a generic SaaS drop-shadow.)

---

## Page Pattern — Home

The skill's `product` domain match for this category is **"Research Lab / University Department"** (style: Swiss Modernism 2.0 + Minimalism; secondary: Trust & Authority, Accessible & Ethical; pattern: *Overview + People + Publications*). Its generic `landing` patterns don't have a direct academic-institute entry, so Home synthesizes two of its closer matches — **Trust & Authority** (credibility-led hero → proof → CTA path) for the overall shape, and **Feature-Rich Showcase** (card-grid section) for the Focus Areas block — rather than either generic SaaS pattern used as-is (their default `--design-system` recommendation, "Vibrant & Block-based" with a big-number/gradient hero, was rejected as wrong for this audience: bright/energetic reads as promotional, not scholarly, and directly conflicts with the PRD's credibility mandate).

**Section order:**
1. **Hero** — mission statement (1–2 sentences max), no big-number stat blocks (the anti-pattern list explicitly flags "no impact data" for this category — a research institute isn't proving ROI). Palimpsest treatment lives here (see below). Primary CTA: "Submit a Paper" or "Read the Call for Papers," not a generic "Get Started."
2. **Focus Areas** — card grid (5–6 cards matching the PRD's focus areas), each a short label + 1-line description, linking to the Focus Areas page. This is the "feature grid" borrowed from Feature-Rich Showcase, restyled as scholarly categories, not product features.
3. **Framework preview** — a condensed version of the chronological framework (pre-colonial → contact → colonial → independence → contemporary), teasing the full Framework/Approach page.
4. **Latest volume / news** — this is the "Proof" slot from Trust & Authority, but proof here means *scholarly activity* (latest publication, latest news item), not logos/testimonials. Must have a real empty state for pre-launch (no Volume 1 yet) — don't fake activity.
5. **CTA band** — Deep Teal background, white/turquoise text (this is the one place turquoise text is safe per the contrast table above), reiterating the submission CTA.
6. **Footer** — Mikaelson "M" mark credit line (unmodified, per brand guideline), secondary nav, contact.

**Anti-patterns for this category (from skill data + PRD):**
- ❌ Fabricated impact numbers/stats ("500+ papers reviewed") before they're real
- ❌ Hidden/vague affiliation info — the Mikaelson Initiative relationship should be findable, just not dominant
- ❌ Generic SaaS hero (gradient + big number + "Get Started") — wrong register entirely for this audience
- ❌ Image-heavy or video hero — PRD explicitly rules this out for low-bandwidth users

---

## Palimpsest Concept — UX Review

The layered-history hero concept (ghosted place-names + marginalia annotations) is a strong, subject-specific signature and should stay, but three things need care so it doesn't fight the skill's accessibility/performance rules:

1. **Implement ghosted text as real DOM text (low-opacity, e.g. `color: #003E45` at 8–12% opacity, or an SVG `<text>` layer) — not a background image.** A raster background image of text is both a performance cost (conflicts with the low-bandwidth requirement) and invisible to screen readers either way; real text/SVG keeps the file light and lets you explicitly mark it `aria-hidden="true"` (it's decorative) without losing anything.
2. **Keep it decorative-only and behind foreground content** — the ghosted layer must never reduce the foreground headline's contrast ratio. Test contrast with the ghost layer present, not just the flat background color.
3. **If any part of the palimpsest treatment animates** (e.g., marginalia fading in on scroll), it must respect `prefers-reduced-motion` and use opacity/transform only, per the skill's motion rules — same subtle scroll-reveal treatment as the rest of the page (below), not a separate heavier effect.

---

## Motion

**Scroll Reveal** (Subtle, matches PRD's "muted, editorial tone" — this is the one motion pattern for the whole Home page, used consistently, not varied per section):

```js
gsap.from(el, { opacity: 0, y: 12, duration: 0.35, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
```

- ✅ Keep the y-offset small (8–16px) — reads as a fade, not a slide
- ✅ Wrap in a `prefers-reduced-motion` check; render content fully visible with no transform if set
- ❌ Don't hide below-the-fold content (focus areas, latest volume) as invisible-until-JS with no fallback — hurts both SEO and users with JS disabled/slow connections, both real concerns per the PRD

---

## Component Specs (tokens only — see per-component files as they're built)

```css
.btn-primary {
  background: var(--color-primary);      /* #003E45 */
  color: var(--color-surface);           /* #FFFFFF */
  padding: 12px 24px;
  border-radius: 4px;                    /* restrained, not the pill/oversized-radius default */
  font: 600 16px Inter, sans-serif;
  transition: background 200ms ease;
  cursor: pointer;
}
.btn-primary:hover { background: #05555e; } /* computed tint of Deep Teal — flag for brand sign-off per PRD §4 note */

.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  padding: 12px 24px;
  border-radius: 4px;
  font: 600 16px Inter, sans-serif;
}

.card {
  background: var(--color-surface);
  border-radius: 4px;
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
}

.badge-highlight {
  background: var(--color-highlight);    /* #FFE665 */
  border: 1px solid var(--color-foreground); /* required — raw yellow fails 3:1 on beige, see contrast table */
  color: var(--color-foreground);        /* text sits on the yellow chip itself, not on beige through it */
  padding: 2px 8px;
  border-radius: 3px;
  font: 500 13px Inter, sans-serif;
}
```

---

## Pre-Delivery Checklist (Home page)

- [ ] No emojis as icons — SVG only (Heroicons/Lucide or a custom archival-style icon set)
- [ ] Turquoise text/links only appear on Deep Teal backgrounds — verified, not assumed
- [ ] Yellow highlight elements always paired with a dark border/text, never floating on beige alone
- [ ] Ghosted palimpsest text implemented as real text/SVG, not a raster image; `aria-hidden` applied
- [ ] Hero has no heavy image/video asset
- [ ] `cursor-pointer` on all clickable elements
- [ ] Focus states visible on every interactive element (nav, cards, CTA)
- [ ] `prefers-reduced-motion` respected for all scroll-reveal animations
- [ ] Body text ≥16px on mobile
- [ ] Responsive check: 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile
- [ ] Empty state designed for "Latest volume/news" section (no Volume 1 yet)
