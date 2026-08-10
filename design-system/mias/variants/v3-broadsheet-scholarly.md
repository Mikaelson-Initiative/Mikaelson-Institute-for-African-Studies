# V3 — Broadsheet Scholarly

**Dials:** Variance 4/10 · Motion 2/10 · Density 6/10 (dense)
**Base pattern:** Newspaper/journal column layout, hairline rules — matches the skill's "Feature-Rich Showcase" + Swiss Modernism 2.0 pairing, tuned denser.

## What's different from MASTER.md

**Hero:** No big isolated hero block — instead a **masthead treatment**: institution name set large in Grift/Baloo 2 at the top like a journal's title, immediately followed by a two-column layout (mission statement in one column, a "latest volume / CFP deadline" ticker in the other) below a single hairline rule in Deep Teal. Gets the CTA and credibility signal above the fold without a full-bleed hero.

**Layout:** Uses `--space-2xl` (48px) between sections instead of MASTER.md's 96px — noticeably denser, more content visible per scroll. Focus areas render as a **numbered list with hairline dividers**, not cards (fits, since focus areas genuinely are a fixed, ordered set per the PRD — satisfies `frontend-design`'s rule that numbered markers should only appear when order carries real information).

**Palimpsest treatment:** Minimal — a single ghosted place-name watermark behind the masthead only, not full-hero. The density and column structure carry the "archival" feeling instead.

**Risk profile:** Medium. This is the direction closest to the "AI-generated design default #3" the `frontend-design` skill warns about (broadsheet, hairline rules, dense columns) — it's a legitimate choice for this specific brief (a real academic journal look), but if chosen, lean harder into the numbered-focus-areas-as-real-sequence detail and the Deep Teal/Turquoise brand accents so it doesn't read as generic. Best if you want the site to feel like it already has editorial substance before Volume 1 exists.
