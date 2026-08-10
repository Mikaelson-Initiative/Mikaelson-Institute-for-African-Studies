# Product Requirements Document
## Mikaelson Institute for African Studies — Website

**Version:** 0.1 (Draft for review)
**Prepared for:** Mikaelson Community Development and Tech Initiative
**Status:** Pre-development — for team review and scoping

---

## 1. Overview

The Mikaelson Institute for African Studies (MIAS) is a new pan-African academic research initiative under the Mikaelson Community Development and Tech Initiative, focused on the study of pre-colonial civilization, colonialism and imperialism, religion, and decolonization across the African continent.

This document defines the requirements for the Institute's website: a public-facing academic platform that establishes credibility, communicates the Institute's mission and research focus, and — from launch — accepts and manages paper submissions for publication. It is written to support a TypeScript-based frontend and backend build.

### 1.1 Goals
- Establish MIAS as a credible academic institute to scholars, universities, grant bodies, and the public.
- Provide a real (not simulated) submission pipeline: authors submit papers, editors review and manage them, without email being the system of record.
- Give the Institute a foundation that can grow from "informational site + submissions" into a publishing platform (volumes, an archive, author/reviewer accounts) without a rebuild.
- Keep Mikaelson Initiative branding present but secondary — MIAS should read as its own credible entity.

### 1.2 Non-goals (for this version)
- No peer-review scoring/rubric system — initial review is editorial (accept/reject/revise), not a formal double-blind academic review workflow. That can be a later phase.
- No multi-language site (English only for v1; translated submissions are accepted as file uploads, not a localized UI).
- No payment processing (the Institute is not charging submission or publication fees at this stage).

---

## 2. Users & Roles

| Role | Description | Access |
|---|---|---|
| **Visitor** | General public, prospective partners, students | Read-only site access |
| **Author** | Submits a paper for consideration | Submission form; optional account to track status |
| **Editor** | Reviews submissions, manages content (team bios, news, events) | Authenticated dashboard |
| **Admin** | Editor permissions + user management, publishing volumes, site settings | Authenticated dashboard, elevated permissions |

For v1, Author accounts are **optional** — a submission can be made without registering (guest submission + email tracking token), but registered authors can log in and see submission status without needing an email thread.

---

## 3. Proposed Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend framework | **Next.js (App Router) + TypeScript** | SSR/SSG for SEO on public pages, client-side interactivity where needed |
| Styling | **Tailwind CSS** | Fast iteration, easy to encode the design tokens from the brand system below |
| Backend | **TypeScript API route handlers (Next.js `app/api/*`)** | Keeps frontend and backend in one deployable codebase and one language; can be split into a standalone service later if traffic/complexity demands it |
| Database | **PostgreSQL** | Relational data (submissions, users, volumes) fits Postgres well |
| ORM | **Prisma** | Type-safe database access matching the TypeScript stack |
| Auth | **NextAuth.js (Auth.js)** | Email/password or magic-link login for editors/admins and optional author accounts |
| File storage | **S3-compatible object storage** (e.g., AWS S3 or Cloudflare R2) | For submitted paper files (PDF/DOCX) |
| Email | **Resend or SendGrid** | Submission confirmations, status updates, editor notifications |
| Hosting | **Vercel** (frontend + API routes) + managed Postgres (e.g., Supabase, Neon, or Railway) | Matches the Next.js stack with minimal DevOps overhead |

**Why this stack:** it's fully TypeScript end-to-end as requested, keeps the team's surface area small (one language, one deployable app for v1), and every piece can scale or be swapped independently later (e.g., splitting the API into its own service, or moving to a dedicated search/index tool for the archive once there's real volume of papers).

---

## 4. Branding & Color Direction (for ideation)

The homepage prototype already built established a direction: a **palimpsest** concept (older history layered beneath the new) as the Institute's visual signature, distinct from generic African-diaspora resonance is welcome, since this can also visually echo the parent Initiative

**Confirmed — per the Mikaelson Initiative Brand Guidelines.** MIAS's palette is built entirely from official Mikaelson Initiative brand colors, with roles reassigned to read as scholarly rather than promotional:

| Token | Hex | Source | Role in MIAS |
|---|---|---|---|
| Deep Teal | `#003E45` | Official secondary color | Primary dark — hero, nav, dark section backgrounds |
| Turquoise Blue | `#5CE1E6` | Official primary color | Primary accent — links, CTAs, highlights |
| Light Beige | `#E9E1D8` | Official secondary color | Background — replaces a generic "parchment" cream |
| Dark Grey Brown | `#201D16` | Official primary color | Body text |
| Light Yellow | `#FFE665` | Official secondary color | Sparing highlight only (borders, badges) — **never used as text color**, since it fails contrast requirements against the beige background |
| Pure White | `#FFFFFF` | Official primary color | Card/surface backgrounds |

**Why Deep Teal over Turquoise as the primary dark tone:** the bright turquoise is energetic and promotional — right for Mikaelson's general brand presence, but it would undercut MIAS's academic credibility if used as the dominant color. Deep Teal is already in the official secondary palette and carries the same brand DNA while reading as serious and institutional. Turquoise remains prominent as the accent color, so the connection to Mikaelson is still immediately visible.

**Typography (confirmed from brand guidelines):**
- **Grift** — brand header font. Not available through free font distribution; the design/dev team will need the actual font files (or a webfont license) from whoever holds the Grift license. Until then, **Baloo 2** is used as a placeholder in the prototype — it has a similar rounded, chunky character, but is not brand-approved and must be swapped before launch.
- **Inter** — brand body/subheader font. Freely available and used exactly as specified.

**A note on computed tints:** a few lighter/darker variants of the official colors are used for hover states and secondary panels (e.g., a lightened Deep Teal for secondary dark panels). These are mathematical tints of the exact official hex values, not new colors — but should be confirmed with whoever owns brand approval before this goes further, since the guidelines don't explicitly address tinting.

---

## 5. Sitemap — Full Page List

### Public pages
1. **Home** — mission statement, focus areas summary, latest news/volume, CTA to submit a paper
2. **About** — full mission, methodology ("On method / On scope / On name" style content), relationship to the Mikaelson Initiative
3. **Research Focus Areas** — the five (or six) focus area descriptions, each potentially with its own anchor/section
4. **Framework / Approach** — the chronological framework (pre-colonial → contact → colonial → independence → contemporary)
5. **Publications / Archive** — list of published volumes and papers (empty/placeholder state until Volume 1 exists; built to scale)
6. **Publication Detail** — individual paper page (title, author, abstract, PDF download/view) — *needed once Volume 1 publishes, but the template should exist at launch*
7. **Call for Papers** — current CFP details and guidelines
8. **Submit a Paper** — the actual submission form/flow (see Section 6)
9. **Submission Status** *(authenticated or token-based)* — for authors to check where their paper is in review
10. **Team / Fellows** — bios of editorial board, founding team, research fellows
11. **News / Updates** — announcements, event recaps, new volume releases
12. **Events** *(optional for v1, structure it in)* — talks, seminars, calls for panels
13. **Partners & Affiliations** — Mikaelson Initiative relationship, any university/org partnerships
14. **Contact** — general inquiries form
15. **Privacy Policy**
16. **Terms of Submission** *(authorship/copyright terms for submitted work)*
17. **404 / Not Found**

### Authenticated pages (Editor/Admin)
18. **Editor Login**
19. **Dashboard (Editor/Admin home)** — overview of pending submissions, recent activity
20. **Submissions Queue** — list/filter/search all submissions by status (new, in review, accepted, rejected, published)
21. **Submission Review Detail** — view a single submission, download the file, leave internal notes, change status, message the author
22. **Volumes Management** — create a new volume/issue, assign accepted papers to it, publish it live
23. **Team Management** *(Admin only)* — add/edit/remove team/fellow bios shown publicly
24. **News/Events Management** *(Editor)* — create/edit/publish news posts and events
25. **User Management** *(Admin only)* — manage editor/admin accounts and roles
26. **Site Settings** *(Admin only)* — CFP deadline text, submission email templates, general site content that shouldn't require a code deploy to change

### Optional authenticated pages (Author, if account system is enabled)
27. **Author Login / Register**
28. **Author Dashboard** — view your own submission(s) and their status, message the editorial team

---

## 6. Core Feature: Submission Pipeline (replaces the mailto-based prototype)

This is the most important functional upgrade from the static prototype, where "submission" only opened an email client. The real system should:

1. **Author submits** via a form: name, email, focus area, abstract, and a file upload (PDF/DOCX, size-limited).
2. **System stores** the submission in the database (status: `submitted`) and the file in object storage, and sends the author a confirmation email with a status-tracking link (or login, if they registered).
3. **Editors receive** a notification (email + dashboard) and can move the submission through statuses: `submitted → in review → revisions requested → accepted → published` or `rejected`, with internal notes at each stage.
4. **Author is notified** by email automatically on any status change, with an optional message from the editor.
5. **On acceptance**, an editor can assign the paper to a **Volume**, and publishing that volume makes the paper's detail page live on the public Publications/Archive section.

This replaces "email is the database" with an actual system of record — which matters both for not losing submissions and for being able to report submission volume/outcomes to funders later.

---

## 7. Data Model (high-level)

```
User
 - id, name, email, passwordHash, role (author | editor | admin), createdAt

Submission
 - id, title, abstract, focusArea, authorName, authorEmail, authorId (nullable, if guest),
   fileUrl, status (submitted | in_review | revisions_requested | accepted | rejected | published),
   internalNotes[], volumeId (nullable), createdAt, updatedAt

Volume
 - id, title (e.g. "Volume 1, 2026"), description, publishedAt (nullable = unpublished/draft), coverImageUrl

FocusArea
 - id, title, description, sortOrder

TeamMember
 - id, name, role, bio, photoUrl, sortOrder, isFellow (bool)

NewsPost
 - id, title, body, publishedAt, authorId

Event
 - id, title, description, date, location (or "virtual"), registrationUrl
```

---

## 8. Non-Functional Requirements

- **SEO:** Public pages (Home, About, Publications, individual papers) must be server-rendered for indexing — academic papers being discoverable via search is a core value of the archive.
- **Accessibility:** WCAG AA minimum — this is an academic institution; screen-reader and keyboard navigability are not optional.
- **Performance:** Public pages should load fast on low-bandwidth connections, given the target audience includes students and researchers across Africa, not just well-connected institutions.
- **Mobile-first:** Given the audience will include people first encountering the Institute via a shared social link on mobile.
- **File security:** Uploaded submissions are not publicly accessible until explicitly published; unpublished submissions and internal review notes must be access-controlled server-side, not just hidden in the UI.
- **Data ownership:** Author-submitted content and personal data (email, name) should have a clear retention/deletion policy — worth deciding before launch, not after.

---

## 9. Build Order

Build sequence, not a schedule — each phase should be functionally complete before starting the next, since later phases depend on the data models and infrastructure the earlier ones establish.

**Phase 1 — Core site**
Home, About, Focus Areas, Framework, Call for Papers, working Submission form (with real backend + database, not mailto), Contact, Team, Privacy/Terms.

**Phase 2 — Editorial operations**
Editor/Admin login, Submissions Queue, Submission Review Detail, email notifications on status change.

**Phase 3 — Publishing**
Volumes Management, Publications/Archive public pages, Publication Detail pages, first volume goes live.

**Phase 4 — Growth**
Author accounts + Submission Status page, News/Events sections and management, Site Settings for non-developer content edits.

---

## 10. Open Questions (need answers before/while development starts)

1. **Grift font files** — who holds the license/files for the brand's header font, so the prototype's Baloo 2 placeholder can be replaced before launch?
2. Who are the initial editorial board / team members to list at launch — do we have bios and photos ready, or does Team launch as a placeholder?
3. What's the actual submission email/domain setup timeline (`mikaelsoninstitute.org`) — is DNS/hosting being handled by the team or does Michael want a recommendation?
4. Should authors be required to create an account to submit, or should guest submission (with an emailed tracking link) be the default to reduce friction?
5. Any existing legal/copyright language the Institute wants for the "Terms of Submission" page, or should that be drafted from scratch?

---

*This PRD is a working draft. Sections 4 and 10 in particular need your input before this is ready to hand to a developer for estimation.*
