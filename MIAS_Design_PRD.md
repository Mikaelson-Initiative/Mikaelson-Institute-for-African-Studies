# Design Brief & PRD
## Mikaelson Institute for African Studies — Visual Design

**Prepared for:** Design agent / designer
**Companion document:** MIAS_PRD.md (product/technical requirements)
**Purpose:** This document defines what needs to be *designed* before the engineering PRD is built out in code. The output of this brief should be a full set of page mockups and a design system, not working code.

---

## 1. What This Institute Is

The Mikaelson Institute for African Studies (MIAS) is a pan-African academic research institute studying the continent's history as one continuous record: pre-colonial civilizations, colonialism and imperialism, religion, and decolonization. It is a new initiative of the Mikaelson Community Development and Tech Initiative (a Nigeria-based tech/community organization), but MIAS needs to read as a credible, independent academic body in its own right — think "a real research institute a university would take seriously," not "a nonprofit's blog."

**Primary audiences, in order of importance:**
1. Scholars and researchers deciding whether to submit a paper
2. Universities, grant bodies, and potential academic partners evaluating credibility
3. Students and the general public interested in African history

**The one thing the design must get right:** credibility. Every visual choice should be judged against "would a historian respect this?" before "does this look good?"

---

## 2. Brand Inheritance

MIAS is not a standalone brand — it should feel like a serious, scholarly offshoot of the Mikaelson Initiative, the way a university's research institute feels connected to the university but has its own visual seniority (e.g., a law review vs. the university's general marketing site).

**Confirmed brand colors (from the Mikaelson Initiative Brand Guidelines):**

| Color | Hex | Guideline role |
|---|---|---|
| Turquoise Blue | `#5CE1E6` | Primary |
| Dark Grey Brown | `#201D16` | Primary |
| Pure White | `#FFFFFF` | Primary |
| Light Beige | `#E9E1D8` | Secondary |
| Deep Teal | `#003E45` | Secondary |
| Light Yellow | `#FFE665` | Secondary |

**Design task for MIAS specifically:** use only these six official colors, but reassign their weight so the result reads as scholarly rather than promotional:
- Lead with **Deep Teal** as the dominant tone (not the brighter Turquoise) — it's already brand-official, but darker and calmer, which matters for academic credibility.
- Keep **Turquoise** present but secondary — enough for someone familiar with Mikaelson to recognize the family resemblance immediately, without it dominating.
- Use **Light Yellow** narrowly (small accents, borders, badges) — it fails WCAG contrast as a text color against the beige background, so it must never carry text.
- **Do not introduce new colors outside this set.** Tints/shades of the official hex values are acceptable for hover and secondary-panel states, but should be flagged for brand-team sign-off since the guidelines don't explicitly address tinting.

**Typography (confirmed):**
- **Grift** — official header font. The design agent should request the actual font files or webfont license from whoever holds them; do not substitute a "similar-looking" font in final designs without flagging it as a placeholder.
- **Inter** — official body/subheader font, freely available.

**Logo:** the Mikaelson "M" mark (two figures forming an M, holding hands, in a turquoise square) should appear in the footer or a low-key header credit line, per the earlier decision to mention the parent organization briefly rather than prominently. Do not resize, recolor, rotate, or apply effects to the logo, per the brand guidelines' explicit Do's/Don'ts.

---

## 3. Existing Directional Reference (not final — a starting point)

A working prototype already exists, now updated to use the confirmed brand colors and fonts above, and can be referenced for tone. It explores:

- **A "palimpsest" concept** — the idea that African history is layered, not replaced (older civilizations still visible "beneath" colonial and post-colonial history). This showed up as ghosted historical place-names in a hero background, and marginalia-style side notes echoing manuscript annotations.
- **Deep Teal / Turquoise / Light Beige** as the working palette, per the confirmed brand system above, with a rounded display face (Baloo 2, as a placeholder for Grift) and Inter for body text, plus a monospace utility face for labels and citations (evoking archival/ledger material — this mono face is not brand-specified and should be confirmed as acceptable supplementary use).
- **A muted, editorial tone** rather than a bright nonprofit-marketing tone, achieved by leading with Deep Teal rather than the brighter Turquoise.

The design agent should treat this as a working direction already aligned to the brand, not a locked template — refinement and divergence are welcome, but any departure from the confirmed brand colors/fonts above should be flagged explicitly rather than assumed.

---

## 4. Design Deliverables Needed

For **each page** in the sitemap below, the design agent should produce a desktop and mobile mockup:

**Public pages (priority — design these first):**
1. Home
2. About
3. Research Focus Areas
4. Framework / Approach (chronological timeline)
5. Call for Papers
6. Submit a Paper (form states: empty, filled, submitted/confirmation)
7. Publications / Archive (including an empty state, since there will be no published volumes at launch)
8. Publication Detail (individual paper page)
9. Team / Fellows
10. News / Updates (list + individual post)
11. Contact
12. 404 / Not Found

**Authenticated pages (design after public pages are approved):**
13. Editor/Admin Login
14. Dashboard (overview)
15. Submissions Queue (list/filter/search view)
16. Submission Review Detail (with status controls and internal notes)
17. Volumes Management
18. Team Management
19. User Management

Authenticated pages should look distinctly more utilitarian/functional than the public academic pages — they're internal tools, not the Institute's public face. A different, simpler visual treatment (e.g., a standard dashboard layout) is appropriate and expected here; don't force the same ornamental design language onto admin screens.

---

## 5. Required Design System Documentation

Alongside the page mockups, deliver:

- **Color tokens** — every color used, named (not just hex values), with usage notes (primary, accent, background, text, border, error/success states)
- **Type scale** — display, heading levels (H1–H4), body, caption/label, with font family, weight, and size for each, for both desktop and mobile
- **Component library** — buttons (primary/secondary/ghost, all states: default/hover/focus/disabled), form fields (input, textarea, select, file upload), cards, navigation (desktop + mobile menu), footer, status badges (for submission statuses), tables (for admin views)
- **Spacing/grid system** — base unit and layout grid used across pages
- **Responsive breakpoints** — how each page's layout changes at mobile, tablet, and desktop widths

---

## 6. Constraints the Design Must Respect

- **Accessibility:** WCAG AA contrast minimum on all text; visible focus states on every interactive element; the design should not rely on color alone to convey status (e.g., submission status badges need a label, not just a color).
- **Real content, not lorem ipsum:** Use the actual focus area names, mission language, and CFP details already drafted for MIAS (available on request) so stakeholders are evaluating the design against real content, not placeholder text that hides layout problems.
- **Low-bandwidth performance:** Avoid designs that depend on heavy imagery or video hero sections — audience includes users on slower connections across the continent. Typography- and layout-driven design is preferred over image-heavy design.
- **No implementation-specific assumptions:** Design should not assume any specific frontend framework's default components — this is a from-scratch visual system, not a customization of an existing UI kit.

---

## 7. Explicitly Out of Scope for This Design Phase

- No copywriting — use provided content; flag if something is missing, but don't invent institutional claims
- No engineering/implementation — deliverables are visual designs (e.g., Figma files or equivalent), not code
- No logo design — unless the design agent identifies that MIAS needs a distinct mark separate from a wordmark; flag this as a recommendation if so, rather than assuming it's in scope

---

## 8. Review Process

Design should be reviewed in this order to catch problems early and cheaply:

1. **Design system + Home page only** — confirm palette, type, and overall tone before extending to other pages
2. **Remaining public pages**
3. **Authenticated/admin pages**

Do not proceed to step 2 until step 1 is explicitly approved — the palette and type decisions made in step 1 apply everywhere, so revisions are far more expensive once they've propagated across a full page set.

---

## 9. Open Questions for the Design Agent to Resolve with Michael Before Starting

1. **Grift font files** — who holds the license, and can webfont files be provided for production use?
2. Should MIAS have its own distinct logo, or use a wordmark treatment of its name in Grift/Baloo 2, alongside a small credit to the existing Mikaelson "M" mark?
3. Is tinting/shading the official brand colors (for hover states, secondary panels) acceptable, or does every color used need to be one of the six exact official hex values with no variation?
