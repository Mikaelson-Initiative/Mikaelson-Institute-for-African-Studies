# MIAS Home — 5 Design System Variants

All five share the same **locked constraints** from `design-system/mias/MASTER.md`: the six official Mikaelson hexes (Deep Teal `#003E45`, Turquoise `#5CE1E6`, Light Beige `#E9E1D8`, Dark Grey Brown `#201D16`, Light Yellow `#FFE665`, White `#FFFFFF`), Grift/Baloo 2 + Inter typography, and the accessibility fixes already found (turquoise/yellow text only on Deep Teal, never on beige/white). What differs is **structure, density, motion, and how hard each one leans into the palimpsest concept** — that's the actual decision to make.

| # | Name | Signature move | Density | Motion | Best if... |
|---|------|----------------|---------|--------|-----------|
| 1 | [Swiss Ledger](v1-swiss-ledger.md) | Marginal annotation rail as a literal footnote system | Standard | Subtle | You want the safest, most "a historian would respect this" option |
| 2 | [Layered Palimpsest](v2-layered-palimpsest.md) | Frosted Deep-Teal glass panel over ghosted place-names, subtle parallax | Standard | Standard | You want the palimpsest concept pushed as far as it can go — highest signature value |
| 3 | [Broadsheet Scholarly](v3-broadsheet-scholarly.md) | Newspaper-column grid, denser, content-forward | Dense | Subtle | You want the site to read as already substantial, even pre-Volume-1 |
| 4 | [Manuscript Warm](v4-manuscript-warm.md) | Parchment texture, mono archival labels, rounded warmth | Standard | Standard | You're weighting the student/public audience more, not just scholars/funders |
| 5 | [Institutional Trust](v5-institutional-trust.md) | Minimal ornament, proof-band structure, conservative | Standard | Subtle | You want to optimize hardest for university/grant-body credibility, least risk |

**Recommendation:** V1 (Swiss Ledger) or V5 (Institutional Trust) are the lowest-risk choices given the PRD's explicit priority order (scholars → universities/grants → public). **V2 (Layered Palimpsest)** is the one with real "this could not be mistaken for anyone else's site" potential, per the `frontend-design` skill's guidance — worth serious consideration if you're willing to take that one calculated risk in the hero, since everything else about the system is still deliberately restrained.

Pick one (or ask for a hybrid — e.g., V1's marginalia rail + V2's hero treatment) and I'll build out the full MASTER.md + actual Home page from it.
