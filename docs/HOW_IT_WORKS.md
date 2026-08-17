# How the Mikaelson Institute Website & Ubuntu Learning Platform Works

*A plain-language guide for non-technical staff. No coding knowledge required to read this — just patience.*

---

## Part 1 — The Big Picture

Think of everything as **two connected buildings**:

1. **The Institute site** (`institute.mikaelsoninitiative.org`) — the public-facing building. This is where anyone lands when they hear about MIAS: the homepage, About, Team, Partners, Library, the Ubuntu program pitch, Contact, and the application form.
2. **The Learning Platform, "Ubuntu"** (`learn.mikaelsoninitiative.org/ubuntu`) — a separate wing, reserved only for people who've been *admitted* into a cohort. This is where actual studying happens: modules, videos, readings, quizzes, progress tracking.

They live on different web addresses on purpose, so that later, if the Institute builds a *second* learning program (say, a Fellows program or a Research Methods course), it can live at `learn.mikaelsoninitiative.org/fellows` right alongside Ubuntu — same "campus," different "classroom door." Right now, the `learn.` address only opens one door: Ubuntu. Anything else typed into that address bar bounces you straight into Ubuntu, rather than accidentally showing the main homepage twice on two different addresses.

Everything on both sites is powered by one shared, invisible filing cabinet: a **database**. Think of the database as the actual source of truth — every team member's bio, every partner logo, every book recommendation, every cohort application, every module's video and quiz — all of it lives in that one filing cabinet. The website is just the "front window display" that reads from it and shows it nicely.

There are two ways content gets into that filing cabinet:

- **The Admin Dashboard** (`/admin`) — a proper point-and-click staff tool, for the things staff touch often (approving applications, adding team members, uploading gallery photos, marking messages resolved).
- **Prisma Studio** — a more "raw" spreadsheet-style tool, direct access to the filing cabinet itself, for the things that don't have a polished staff tool yet (the actual cohort curriculum — modules, lessons, videos, quizzes, and scheduled events). This is the one you'll use to add lesson content yourself, and it's covered in detail in Part 5.

---

## Part 2 — The Journey of a Student, Start to Finish

Walking through one person's path makes the whole system click into place:

1. **They discover the Institute.** They land on the homepage, browse Team/Partners/Library, and see a "Join Ubuntu" button (in the nav bar, and on the homepage). That button sends them to `/ubuntu-program` — a public marketing page about the philosophy and structure of the program. **There is no public link into the learning platform itself anywhere on the site** — the only way in is the email in step 5.
2. **They apply.** From that marketing page, "Join Ubuntu" leads to `/signup` — a multi-step form: verify their email with a 6-digit code, give their name, some personal details, answer a couple of quick questions (first time studying African history? what's their goal?), then two free-text questions (a bit about themselves, and their motivation).
3. **Their application lands in the Admin Dashboard**, under the "Applications" tab, as **Pending**.
4. **Staff review it** — read their answers, then set two things: a **Status** (Pending → Admitted, Rejected, or Waitlisted) and, if admitting them, which **Cohort** they belong to.
5. **The moment Status is set to "Admitted,"** the site automatically emails them a "You're in" message with a **Sign in to Ubuntu** button — this email is the *only* place that link ever appears. They click it, type their email again, get a 6-digit sign-in code (a "magic code," no password to remember), and they're in.
6. **Inside, they see "My Space"** — their cohort, their overall progress, and any upcoming live sessions or deadlines you've scheduled. From there, "Go to Modules" takes them to the actual curriculum: a list of modules in order, some locked (not open yet), one "in progress," some marked done.
7. **Opening a module** shows them its lesson steps one at a time — a reading, a video, another reading, a quiz — with a sidebar showing what they've completed. When they finish the last step, they're offered the next module (if it's unlocked yet) or told it opens on a specific date.

Everything from step 3 onward is exactly what the next two parts explain how to control.

---

## Part 3 — The Admin Dashboard, Tab by Tab

Go to `institute.mikaelsoninitiative.org/admin` and sign in with **Google** — but only email addresses on an approved list can get in (see Part 7 for how that list is set). Once inside, there's a row of sections:

- **Overview** — a dashboard of counters (unread messages, pending submissions, pending applications, etc.) — click any card to jump straight to that section.
- **Messages** — everything submitted through the Contact form. You can only mark each one **Resolved** once you've dealt with it; there's no editing.
- **Submissions** — papers submitted through "Submit a Paper." Each has a status dropdown you move through the review pipeline: Submitted → In Review → Revisions Requested → Accepted / Rejected → Published.
- **Applications** — this is the Cohort application review queue described in Part 2. Set **Status** and **Cohort**, and toggle **Reviewed** once you've looked at it.
- **Team** — your team roster shown on the Team page. Full control here: add a new person (name, role, category — Board/Faculty/Scholars —, an optional affiliation line, and a photo you upload directly from your computer), or edit/delete an existing entry.
- **Partners** — same idea, for the Partners page: name, type, and a logo you upload directly.
- **Books** — the Library's book/archive recommendations. Here's the one place you *do* need to paste a web address yourself rather than upload a file: you'll need an image URL for the cover (the form suggests using Open Library's cover service) and a link to where the book/paper can be found.
- **Gallery** — photos on the public Gallery page. Upload directly, with a title and optional description.
- **Library Support** — pledges from the "1,000,000 Books Project" support page. Mark a pledge **Completed** once you've actually confirmed the payment came through — only "Completed" pledges count toward the public fundraising tracker.
- **Team Applications** — volunteer applications from "Join Our Team." Read through and mark **Reviewed**.

**What's deliberately *not* here yet:** Cohorts, Modules, individual lesson Steps, and scheduled cohort events (masterclasses, deadlines, office hours). Those live one level "closer to the filing cabinet," in Prisma Studio — covered next.

---

## Part 4 — How the Learning Platform Is Structured

Everything in Ubuntu nests inside four layers, like a set of folders inside folders:

```
Cohort  (e.g. "Cohort 01")
 └── Module  (e.g. "Welcome to Ubuntu", "Module 1", "Module 2" ... "Final Assessment")
      └── Step  (e.g. a video, a reading, a quiz — the actual lesson content)
           └── (a student's progress is tracked per Step, automatically)
```

**A Cohort** is one full "run" of the program — it has a title, a description, a start date and end date, and it's what a student is admitted *into*.

**A Module** is one chapter of the curriculum — a title, an optional description, and — importantly — an **unlock date**. A module stays invisible/locked to students until that date arrives; this is how you schedule a whole curriculum in advance and let it "drip" open week by week without touching anything again.

**A Step** is one actual piece of content inside a module — and this is the part you'll create most often. Each step has a **type**, and depending on the type, different fields matter:

| Step type | What it is | Fields that matter |
|---|---|---|
| `video` | A YouTube video embedded right on the page | `videoProvider` = `youtube`, `videoId` = the 11-character video ID (see Part 5 for exactly how to find this) |
| `text` | A reading — plain writing, shown nicely formatted | `contentMarkdown` = the actual text |
| `file` | A downloadable resource (a PDF, a worksheet) | `fileUrl` = the file's web address, `fileName` = what to call it |
| `quiz` | A short graded quiz, checked automatically | `quizData` = a specific block of structured data (Part 5 has a copy-paste template) |

Steps within a module have an **order** — the module's sidebar shows them top to bottom in that order — and each one gets its own completion checkmark once a student finishes it.

Separately, a **Cohort Event** is something *live* — a masterclass, an office-hours session, or a deadline reminder — that shows up in a student's "Upcoming Milestones" panel on their Space page. It's not part of a module; it's scheduling information layered on top.

---

## Part 5 — Adding & Editing Content Yourself (Prisma Studio)

This is the part that lets you add a whole new module, lesson, video, or quiz **without asking a developer**.

### What Prisma Studio actually is

Picture a big spreadsheet program, except instead of an Excel file, it's connected directly to the live website's real database. Every "sheet" (called a **table**) is one of the models from Part 4 — `Cohort`, `Module`, `ModuleStep`, `CohortEvent`, and so on. You click a table, see every row, and can add a new row, edit a cell, or delete a row — and the moment you save, students see the change on the actual live site. There's no "publish" button to remember — saving *is* publishing.

### Opening it

You'll need the project code on your computer with its connection settings already in place (this is normally a one-time setup a developer does with you). Once that's done:

1. Open **Terminal** (on a Mac, search for "Terminal" in Spotlight).
2. Type `cd` followed by a space, then drag the project folder into the Terminal window (this fills in the path for you), and press **Enter**.
3. Type exactly: `npx prisma studio` and press **Enter**.
4. Wait a few seconds — it will automatically open a new browser tab at `http://localhost:5555`. That's Prisma Studio.

Leave that Terminal window open in the background while you work — closing it closes Prisma Studio too.

### Adding a brand-new Module to an existing cohort

1. Click the **Module** table on the left.
2. Click **Add record**.
3. Fill in:
   - `cohortId` — pick the cohort this module belongs to (there's a picker; you don't need to type the ID by hand).
   - `title` — e.g. `Module 6`.
   - `description` — a one-line summary (optional).
   - `unlockDate` — the date/time it should become visible to students. Set this in the future to schedule it ahead of time.
   - `orderIndex` — a plain number controlling its position in the list (e.g. if "Final Assessment" is currently `6`, and you want your new module *before* it, use `6` and bump Final Assessment to `7`).
4. Click **Save**.

### Adding a Step (the actual lesson content) to a Module

1. Click the **ModuleStep** table.
2. Click **Add record**.
3. Always fill in: `moduleId` (pick from the list), `title` (e.g. "Reading: The Nile Valley"), `orderIndex` (its position within that module — 0 is first), and `type` — type **exactly** one of: `video`, `text`, `file`, or `quiz` (lowercase, no quotation marks).
4. Then fill in *only* the fields that match that type:

**For a `text` step** — just fill in `contentMarkdown` with the reading itself. You can use simple formatting: `**bold**` for bold text, blank lines between paragraphs, `1.` at the start of a line for a numbered list.

**For a `video` step** — set `videoProvider` to `youtube`, and `videoId` to the video's ID. **This is the single most common mistake, so slow down here:**

> A YouTube video ID is **exactly 11 characters** — letters, numbers, dashes, and underscores only. It is **not** the whole web address.
>
> - If the address looks like `https://youtu.be/TTIAqeoduP0?si=STogeTofCunAcelj` — the ID is only the part right after `youtu.be/` and **before** the `?`: `TTIAqeoduP0`. Everything after `?si=` is just a tracking code YouTube adds — ignore it entirely, don't paste it.
> - If the address looks like `https://www.youtube.com/watch?v=TTIAqeoduP0` — the ID is the part right after `v=`: `TTIAqeoduP0`.
>
> If you want to test with a video that's already known to work, `jNQXAC9IVRw` is a real, public, always-embeddable one (it's the first video ever uploaded to YouTube).
>
> The video must be set to **Public** or **Unlisted** on YouTube — a **Private** video will fail to play no matter what ID you enter.

**For a `file` step** — set `fileUrl` to a direct web address where the file lives, and `fileName` to whatever you want displayed (e.g. `Reading Guide.pdf`).

**For a `quiz` step** — set `quizData` to a block of structured data. Prisma Studio will show this field as a text box — copy the template below, then edit the words in it (keep everything else, including the punctuation, exactly as-is):

```json
{
  "passingScore": 1,
  "questions": [
    {
      "id": "q1",
      "prompt": "Type your question here?",
      "options": [
        { "id": "a", "text": "First answer choice", "isCorrect": true },
        { "id": "b", "text": "Second answer choice", "isCorrect": false },
        { "id": "c", "text": "Third answer choice", "isCorrect": false },
        { "id": "d", "text": "Fourth answer choice", "isCorrect": false }
      ]
    },
    {
      "id": "q2",
      "prompt": "A second question, if you want one?",
      "options": [
        { "id": "a", "text": "Choice one", "isCorrect": false },
        { "id": "b", "text": "Choice two", "isCorrect": true }
      ]
    }
  ]
}
```

A few rules for this template:
- Exactly one option per question should say `"isCorrect": true` — the rest must say `false`.
- You can have as many questions as you like (just copy a whole `{ "id": ..., "prompt": ..., "options": [...] }` block and change the `id` to `q3`, `q4`, and so on), and each question can have as many options as you like.
- Every `"id"` you use (for questions and for options) just needs to be unique *within that quiz* — `q1`/`q2`/`q3` and `a`/`b`/`c`/`d` is a fine, simple convention to reuse every time.
- Don't remove any of the curly braces `{ }`, square brackets `[ ]`, or commas — if Prisma Studio shows an error saving it, the most common cause is a missing comma between two items, or a stray one after the very last item in a list.
- Students never see which answer is correct until *after* they submit — the grading happens invisibly, on the server, so there's no way to "peek."

### Adding a live event (masterclass, office hours, or a deadline reminder)

1. Click the **CohortEvent** table, then **Add record**.
2. Fill in `cohortId` (pick the cohort), `title`, an optional `description`, and `startsAt` (the date and time).
3. Set `type` to **exactly** one of: `masterclass`, `office_hours`, or `deadline` (lowercase, with the underscore in `office_hours`).
4. If it's a live session, put the video-call link in `meetingUrl`. Leave it blank for a deadline reminder.

### Reordering or rescheduling something that already exists

You don't need to delete and recreate anything — just click into the existing row (Module, ModuleStep, or CohortEvent), change the field you need (a date, the order number, the title), and save.

### A few safety notes

- **Never delete a `Cohort`, `Module`, or `ModuleStep` that students have already made progress on** unless you genuinely mean to erase that progress — deleting one of these also deletes everyone's completion records tied to it, permanently.
- Changing a module's `unlockDate` to the past makes it visible to students **immediately** — useful if you want to open something early.
- If something looks broken after an edit, the most common cause is a typo in a `type` field (it must be *exactly* `video`, `text`, `file`, or `quiz` — not `Video` or `videos`) or a broken bracket/comma in a quiz's JSON.

---

## Part 6 — The Two Web Addresses, Explained Simply

- `institute.mikaelsoninitiative.org` — the public Institute site. Anyone can browse it. This is where you manage everything through `/admin`.
- `learn.mikaelsoninitiative.org/ubuntu` — the actual classroom. Only reachable this way; nothing else lives at `learn.mikaelsoninitiative.org` right now on purpose, so it can't be confused with the main site. If someone types the old institute-domain address for Ubuntu, it now automatically forwards them to the correct `learn.` address.
- **This address is never linked anywhere on the public site.** The **"Ubuntu" button** in the site's navigation and the homepage both go to `/ubuntu-program` (the pitch page below), not the learning platform. The only way anyone ever learns the `learn.mikaelsoninitiative.org/ubuntu` address is the admission email described in Part 2, step 5 — deliberately, so the login page is never something a random visitor stumbles onto.
- The **program's pitch page** (the philosophy, "I am because we are," the list of programme offerings) lives at `institute.mikaelsoninitiative.org/ubuntu-program` — the marketing page explaining what Ubuntu *is*, before someone applies. It links to `/signup` to apply — never straight to the learning platform.

When a second learning program eventually exists, it gets its own path — e.g. `learn.mikaelsoninitiative.org/fellows` — sitting right alongside Ubuntu, on the very same `learn.` address.

---

## Part 7 — Behind-the-Scenes Settings, Plain-English Glossary

The site relies on a handful of outside services, each configured with a setting most people never need to touch. Here's what each one actually does, in case it ever comes up:

| Setting | What it really is |
|---|---|
| **Database (Neon)** | The actual filing cabinet described in Part 1 — every table Prisma Studio shows you lives here. |
| **Resend** | The email-sending service — every sign-in code, contact-form confirmation, and staff notification email goes out through it. It has a daily sending limit on the free tier, which is why sign-in codes have a short cooldown between resends. |
| **Vercel Blob** | Where uploaded files actually live — team photos, partner logos, gallery art, submitted papers, and CVs. When you upload something in the admin dashboard, this is where it's stored; the database just remembers the web address of the file. |
| **Google Sign-In** | Powers the "Continue with Google" button on the admin login page. |
| **Admin email list** | A specific list of email addresses (kept in the site's private settings, not visible in the code) that are allowed into `/admin`. If someone new needs admin access, their email has to be added to that list by whoever manages the site's hosting (Vercel) settings — being logged into Google isn't enough on its own. |
| **Paystack** | The payment processor behind the Library Support pledge page. |
| **The site's real web address setting** | Tells the site what its own official address is, so things like the sitemap and shared-link previews point at the right place. |

You'll almost never need to touch any of these directly — they're listed here so that if a developer ever mentions one of these names, you know roughly what part of the site they're talking about.

---

## Part 8 — Common Hiccups (and Why They're Not Actually Broken)

- **"Couldn't send a code, try again" on the sign-in page.** The database occasionally "falls asleep" after a period of no traffic (this saves cost on the hosting plan) and takes a few seconds to "wake up" on the very first request after a quiet spell. Waiting 5–10 seconds and trying again almost always fixes it. It is not data loss and nothing is broken.
- **A page won't load on a phone/computer right after a DNS change.** Web addresses are cached by your computer and browser for a while after being set up. If something was *just* configured (a new subdomain, for instance) and doesn't load, try it on mobile data first — if it works there, it's purely a local caching delay on your Wi-Fi/computer, not a real problem, and it clears itself within a few hours at most.
- **A quiz or video doesn't show up correctly.** Almost always one of: a typo in the step's `type` field, a YouTube video ID that isn't exactly 11 characters (see Part 5), or a small formatting mistake in a quiz's JSON template (a missing comma is the usual culprit).

---

## Part 9 — Quick Reference Cheat Sheet

- **To approve a new student:** Admin Dashboard → Applications → set Status to Admitted, pick their Cohort. This immediately emails them their one-and-only sign-in link — nothing further to do.
- **To add a team member, partner, or gallery photo:** Admin Dashboard → the matching tab → Add New, upload the photo directly.
- **To add a book recommendation:** Admin Dashboard → Books → Add New (you'll need to paste a cover image URL yourself here — no upload button for this one).
- **To add a new module, lesson, video, or quiz:** Prisma Studio (`npx prisma studio` in Terminal) → the matching table (`Module` or `ModuleStep`) → Add record.
- **To schedule when a module opens:** Prisma Studio → `Module` → set `unlockDate` to the date/time you want it to appear.
- **To schedule a masterclass, office hours, or deadline:** Prisma Studio → `CohortEvent` → Add record.
- **To find a YouTube video's ID:** it's the 11 characters right after `v=` or right after `youtu.be/` — stop at the first `?`.

---

*This document describes the site as it exists today. If new features are added later (a real content-authoring screen for modules, for instance), ask whoever built it to update this guide alongside the change.*
