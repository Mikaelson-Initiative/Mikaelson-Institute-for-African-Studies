# Backend Services Plan

Audit date: 2026-08-13. This maps every part of the site that needs a real backend, what already exists vs. what's still a placeholder, and a phased build order.

## Status: Postgres, Blob, and Email are all live and fully closed out locally

As of 2026-08-13, all three Phase 1 backend dependencies are wired to real infrastructure and verified working end-to-end — not just mocked:

- **Postgres (Neon) is live.** `DATABASE_URL` (pooled) and `DIRECT_URL` (unpooled, migrations only) are set in local `.env`. `prisma migrate dev --name init` ran successfully against the real database — `prisma/migrations/20260813214719_init` is the first tracked migration.
- **Vercel Blob is live**, with one caveat: the provisioned store is **public-access only** (private-access Blob is a separate store configuration chosen at creation time, which this store wasn't). `src/app/api/submissions/route.ts` uses `access: "public"` to match. Filenames are still an unguessable UUID and nothing public links to them, but the URL *is* fetchable by anyone who has it — weaker than the old local-disk behavior where files sat entirely outside any served route. Revisit with a dedicated private-access store if that matters before Phase 3's admin/download gating exists.
- **Resend is live and fully verified.** Domain `institute.mikaelsoninitiative.org` verified with Resend 2026-08-13 — sandbox mode's "only send to the account owner" restriction is confirmed lifted (tested a real send to a different address, `hello@mikaelsoninitiative.org`, which succeeded). `RESEND_FROM_EMAIL=noreply@institute.mikaelsoninitiative.org`. `CONTACT_NOTIFICATION_EMAIL=institute@mikaelsoninitiative.org` confirmed as the **permanent** recipient (also now the code default in `src/lib/email.ts`, not just an env override).
- **Fixed a real bug found during this verification**: `sendEmail()` originally let a Resend failure throw, which would have made the whole API route return a 500 even though the database write (the actual submitted data) had already succeeded — a user would see "something went wrong" on a message that was, in fact, saved. Now catches and logs Resend errors instead of throwing; the DB write remains the source of truth, email is best-effort.
- **End-to-end verified against the real infrastructure, multiple passes**: submitted real contact messages through both the actual browser form and direct requests to the running `/api/contact` route (landed in Neon, real emails sent via Resend — each confirmed with a real Resend message ID), and a real multipart submission via curl against `/api/submissions` (landed in `Submission`, `fileUrl` pointing at a genuine `https://*.public.blob.vercel-storage.com/...` URL). All test rows and the test blob were deleted afterward — nothing test-related was left in the real database/store.
- `src/app/sitemap.ts` / `src/app/robots.ts` — verified rendering correctly at `/sitemap.xml` and `/robots.txt` (14 real routes, `/globe-test` and `/api/*` excluded).

### What's still needed from you

1. The site's confirmed **production domain**, to set as `NEXT_PUBLIC_SITE_URL` (sitemap/robots fall back to the Vercel deployment URL until then).
2. Decide whether the Blob store's public-access mode is acceptable long-term, or whether to provision a private-access store instead.
3. Set `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL` as **Vercel env vars** too (Production + Preview, not just local `.env`) via `vercel env add` or the dashboard, and run `prisma migrate deploy` against them in the deploy step — everything above is only proven locally so far, not yet live in production.

## The big surprise: two forms are already real

Most of the site is static content, but **the Contact form and the Submit a Paper form are not placeholders** — they're fully wired:

- Both use `react-hook-form` + `zod` validation.
- Both POST to real route handlers (`src/app/api/contact/route.ts`, `src/app/api/submissions/route.ts`).
- Both write real rows via Prisma (`ContactMessage`, `Submission` models in `prisma/schema.prisma`).
- The local dev database (`dev.db`) already has real rows in it from testing.

They only break in **two specific ways** once deployed to Vercel:

1. **Email is stubbed.** Both routes `console.log` an "email" instead of sending one — there's a code comment in each: *"Dev stand-in for Resend/SendGrid."* No email package is installed at all.
2. **File storage is stubbed.** The submission route writes uploaded PDFs/DOCX to a local `uploads/submissions/` folder via `node:fs`. Its own comment says this plainly: *"works under `npm run dev` but NOT once deployed — Vercel Functions have an ephemeral, read-only filesystem... This must be swapped for Vercel Blob (or S3/R2) before deploy; no storage credentials exist yet."*
3. The database itself is SQLite (`file:./dev.db`), which doesn't persist on Vercel either — `prisma.config.ts` only falls back to it so `prisma generate` doesn't crash the build when `DATABASE_URL` is unset. Schema comments already anticipate swapping to Postgres.

Everything else on the site — Team, Partners, Library/Books, Library/Archive, Framework, the donation tiers, Call for Papers cycle details — is genuinely static hardcoded content or an honestly-labeled placeholder (e.g. the Library page's `<PlaceholderNotice>` about payments not being wired up yet).

## Systems, in priority order

### P0 — Phase 1: Make the existing real forms actually survive production

| System | What it needs |
|---|---|
| **Core Data Infrastructure** | Provision Postgres (Neon via Vercel Marketplace), set `DATABASE_URL`, swap `schema.prisma` provider from `sqlite` → `postgresql`, swap the `@prisma/adapter-better-sqlite3` adapter to `@prisma/adapter-pg`, run a real `prisma migrate` (currently no migration history — schema was applied via `db push`), add a `.env.example` (none exists). |
| **Transactional Email** | Install Resend, verify a sending domain, replace both `console.log` stubs with real sends — staff notification for Contact, confirmation-with-tracking-link for Submissions (the `/submit` page already promises a tracking link that doesn't exist yet). |
| **File/Object Storage** | Install `@vercel/blob`, swap the `writeFile()` call for Blob `put()`, store the URL in the existing `Submission.fileUrl` field. Decide public vs. private access. |
| **SEO Infrastructure** | Add `src/app/sitemap.ts` and `src/app/robots.ts` — neither exists today despite ~13+ content pages. |

### P1 — Phase 2: Protect the pipeline, add money + editing

| System | What it needs |
|---|---|
| **Abuse Protection / Rate Limiting** | Both POST endpoints currently accept unlimited requests with zero throttling — a real spam/storage-abuse risk once Blob storage is live. Upstash Redis + `@upstash/ratelimit` via Vercel Marketplace. |
| **Donations / Payments** | Turn the ₦10k/₦25k/₦50k/₦100k + custom tiers from `href="/contact"` placeholders into a real flow: new `Donation` model, checkout-initiation route, webhook route, receipt email. **Paystack** recommended (NGN-native) over Flutterwave/Stripe — nothing is installed for any of them yet. |
| **Lightweight Content Management** | Team (5 of 6 categories still empty), Partners (1 real entry, comment explicitly says don't invent more), Library/Books (~34 hardcoded entries), and per-cycle Call for Papers details (deadline/word count/citation style — currently an honest "not confirmed yet" placeholder) all move from hardcoded `.tsx` arrays to DB-backed models so non-technical staff can edit without a deploy. *(Framework timeline and Focus Areas stay as code — they're fixed institutional decisions, not growing lists.)* |

### P1 — Phase 3: Editorial workflow

| System | What it needs |
|---|---|
| **Auth & Admin/Editorial Dashboard** | `Submission.status` enum (`submitted → in_review → revisions_requested → accepted/rejected → published`) already exists in the schema and is unused — nothing reads or writes it. Needs an auth provider (Clerk or Auth.js), protected `/admin` routes, a review UI, and a `User`/reviewer model (none exists). |
| **Public Archive / Publications Listing** | Once papers get accepted, `Library/Archive` should pull real `Submission` rows (`status=published`) instead of only showing the founder's placeholder forthcoming-book entries. |

### P2 — Phase 4: Growth/discovery (optional, lower leverage until real content exists)

- **Site Search** — start with Postgres full-text search, no new service.
- **Newsletter Signup** — genuinely net-new, nothing exists today (not even a gap-fill). Confirm it's actually wanted before building.
- **Analytics** — the privacy policy already claims "may use analytics tools" with zero implementation behind it. Vercel Analytics is the zero-config fit.
- **RSS Feed** — feeds off the same published-Submission query as the Archive listing.

## Full dependency chain

```
Core Data Infrastructure (Postgres)
 ├─→ Transactional Email
 │     ├─→ Donations/Payments
 │     ├─→ Abuse Protection
 │     └─→ Newsletter Signup
 ├─→ File/Object Storage
 │     └─→ Abuse Protection
 ├─→ Lightweight Content Management
 │     └─→ Auth & Admin Dashboard
 │           └─→ Public Archive/Publications Listing
 │                 ├─→ Site Search
 │                 └─→ RSS Feed
 └─→ (SEO Infrastructure — no dependency)
```

## Open questions before implementation starts

These need real answers from the Institute — nothing will be fabricated or defaulted per the project's non-fabrication rule:

1. Is there already a **Paystack or Flutterwave** business account (with bank settlement details), or does one need to be created first?
2. Who should **receive contact/submission notification emails** — one shared inbox, or split by form?
3. Is there a **domain to verify with Resend** for sending email, and a real monitored reply-to inbox?
4. For the admin dashboard: a real **login-gated panel** (Clerk/Auth.js), or is **direct-to-database editing** (Prisma Studio) fine for now given the team is small?
5. Preferred **Postgres provider** — Neon (recommended default) or another Vercel Marketplace option?
6. Donation tiers: **one-time only**, or recurring/subscription support too?
7. Is a **newsletter** actually wanted, or out of scope?
8. Does the Institute have the **real Call for Papers cycle details** yet (deadline, word count, citation format), or should that stay a placeholder?
9. Once papers are published, should PDFs be **fully public**, or abstract-public/full-text-gated?
10. Any **analytics tooling preference**, or is Vercel Analytics fine as the default?
