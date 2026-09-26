# How the Mikaelson Institute Website & Ubuntu Learning Platform Works

*A plain-language guide for non-technical staff. No coding knowledge required to read this — just patience.*

*Last updated: 26 September 2026.*

---

## Part 1 — The Big Picture

Think of everything as **two connected buildings**:

1. **The Institute site** (`institute.mikaelsoninitiative.org`) — the public-facing building. This is where anyone lands when they hear about MIAS: the homepage, About, Team, Partners, Library, the Ubuntu program pitch, Contact, the volunteer application, and the Cohort application form.
2. **The Learning Platform, "Ubuntu"** (`learn.mikaelsoninitiative.org/ubuntu`) — a separate wing, reserved only for people who've been *admitted* into a cohort. This is where actual studying happens: modules, weeks, videos, readings, quizzes, masterclasses, progress tracking.

They live on different web addresses on purpose, so that later, if the Institute builds a *second* learning program (say, a Fellows program or a Research Methods course), it can live at `learn.mikaelsoninitiative.org/fellows` right alongside Ubuntu — same "campus," different "classroom door." Right now, the `learn.` address only opens one door: Ubuntu. Anything else typed into that address bar bounces you straight into Ubuntu, rather than accidentally showing the main homepage twice on two different addresses.

Everything on both sites is powered by one shared, invisible filing cabinet: a **database**. Think of the database as the actual source of truth — every team member's bio, every partner logo, every book recommendation, every cohort application, every module's video and quiz — all of it lives in that one filing cabinet. The website is just the "front window display" that reads from it and shows it nicely.

There are two ways content gets into that filing cabinet:

- **The Admin Dashboard** (`/admin`) — a proper point-and-click staff tool, for the things staff touch often (approving applications, adding team members, uploading gallery photos, marking messages resolved, attaching a PDF to a lesson).
- **Prisma Studio** — a more "raw" spreadsheet-style tool, direct access to the filing cabinet itself, for the things that don't have a polished staff tool yet (building the actual cohort curriculum — modules, weeks, lessons, videos, quizzes, masterclasses, and scheduled events). This is covered in detail in Part 5.

---

## Part 2 — The Journey of a Student, Start to Finish

Walking through one person's path makes the whole system click into place:

1. **They discover the Institute.** They land on the homepage, browse Team/Partners/Library, and see a "Join Ubuntu" button (in the nav bar, and on the homepage). That button sends them to `/ubuntu-program` — a public marketing page about the philosophy and structure of the program. **There is no public link into the learning platform itself anywhere on the site** — the only way in is the email in step 5.
2. **They apply.** From that marketing page, "Join Ubuntu" leads to `/signup` — a multi-step form:
   - They sign in, either with **Google** or by typing their email and entering a **6-digit code** we email them.
   - They give their name (skipped for Google sign-ins, which already have one).
   - They fill in some personal details: phone number, gender, nationality, state of origin, and anything else they'd like to add.
   - They answer two quick questions (is this their first time studying African history? what's their main goal?), then two free-text questions (a bit about themselves, and their motivation).
   - Once submitted, they get a confirmation email, and staff get a notification email with their answers.
   - They're then offered an **optional** chance to support the program with a small donation through Paystack. This is entirely skippable, and **nothing in the admission process ever looks at whether someone donated** — it cannot help or hurt an application.
3. **Their application lands in the Admin Dashboard**, under the "Applications" tab, as **Pending**.
4. **Staff review it** — read their answers, then set two things: a **Status** (Pending → Admitted, Rejected, or Waitlisted) and, if admitting them, which **Cohort** they belong to. **Always pick the Cohort before (or at the same time as) setting Admitted** — someone marked Admitted without a cohort still receives the "You're in" email, but will be turned away when they try to sign in.
5. **The moment Status is set to "Admitted,"** the site automatically emails them a "You're in" message with a **Sign in to Ubuntu** button — this email is the *only* place that link ever appears. They click it, type their email again, get a 6-digit sign-in code (a "magic code," no password to remember), and they're in. Only admitted emails can even request a code on the Ubuntu sign-in page.
6. **Inside, they see "My Space"** — their cohort, their overall progress, and any upcoming live sessions or deadlines you've scheduled. From there, "Go to Modules" takes them to the actual curriculum: a list of modules in order, each broken into weeks, some locked (not open yet), one "in progress," some marked done.
7. **Opening a module** shows all its lesson steps, grouped under week headings, with a sidebar showing what they've completed. They move through the steps one at a time — a reading, a video, a reflection, a quiz — clicking **"Mark as Complete & Next"** as they go (quizzes are completed by submitting them instead). When they finish the last step, they're offered the next module if it's already open, or told the date it unlocks.

Students stay signed in for up to 90 days on the same device, so they won't need a new code on every visit.

Everything from step 3 onward is exactly what the next few parts explain how to control.

---

## Part 3 — The Admin Dashboard, Tab by Tab

Go to `institute.mikaelsoninitiative.org/admin` and sign in with **Google** — but only email addresses on an approved list can get in (see Part 7 for how that list is set). Once inside, there's a row of sections along the bottom of the screen:

- **Overview** — a dashboard of counters (unread messages, pending submissions, pending applications, etc.) — click any card to jump straight to that section.
- **Messages** — everything submitted through the Contact form. You can only mark each one **Resolved** once you've dealt with it; there's no editing.
- **Submissions** — papers submitted through "Submit a Paper." Each has a status dropdown you move through the review pipeline: Submitted → In Review → Revisions Requested → Accepted / Rejected → Published.
- **Applications** — this is the Cohort application review queue described in Part 2. Set **Cohort** and **Status**, and toggle **Reviewed** once you've looked at it.
- **Team** — your team roster shown on the Team page. Full control here: add a new person (name, role, category — Board/Faculty/Scholars —, an optional affiliation line, and a photo you upload directly from your computer), or edit/delete an existing entry. Editing someone keeps their position in the list.
- **Partners** — same idea, for the Partners page: name, type, and a logo you upload directly.
- **Library** — the Library's book/archive recommendations. Here's the one place you *do* need to paste a web address yourself rather than upload a file: you'll need an image URL for the cover (the form suggests using Open Library's cover service) and a link to where the book/paper can be found.
- **Gallery** — photos on the public Gallery page. Upload directly, with a title and optional description.
- **Library Support** — pledges from the "1,000,000 Books Project" support page. When someone pays through Paystack, their pledge is **confirmed and marked Completed automatically** — you don't need to do anything. The status dropdown is there for the rare case you need to correct one by hand (for example, a payment you confirmed some other way). Only "Completed" pledges count toward the public fundraising tracker and leaderboard.
- **Team Applications** — volunteer applications from "Join Our Team." Each one shows the role they applied for, their availability, experience, motivation, LinkedIn, and a link to their CV. Read through and mark **Reviewed**.
- **LMS Content** — a small editor for lesson steps. Pick a module, then a week, then a step, and you can edit its **intro text** and **attach, replace, or remove a PDF** that shows inside the lesson. This is handy for swapping out a licensed reading at the end of a cohort without touching anything else. Note that the intro and PDF only appear on `text` (reading) steps, and a PDF is hidden if that step uses the richer "Living Canvas" layout (see Part 4).

**What's deliberately *not* here yet:** creating Cohorts, Modules, Weeks, and new Steps, writing quizzes, scheduling masterclasses, and scheduled cohort events (deadlines, office hours). Those live one level "closer to the filing cabinet," in Prisma Studio — covered in Part 5.

---

## Part 4 — How the Learning Platform Is Structured

Everything in Ubuntu nests inside four layers, like a set of folders inside folders:

```
Cohort  (e.g. "Cohort 01")
 └── Module  (e.g. "Welcome to Ubuntu", "Module 1" ... "Final Assessment")
      └── Week  (e.g. "Week 1: Origins")
           └── Step  (a video, a reading, a quiz — the actual lesson content)
                └── (a student's progress is tracked per Step, automatically)
```

**A Cohort** is one full "run" of the program — it has a title, a description, a start date and end date, and it's what a student is admitted *into*.

**A Module** is one chapter of the curriculum — a title, an optional description, and — importantly — an **unlock date**. A module stays locked to students until that date arrives; this is how you schedule a whole curriculum in advance and let it "drip" open without touching anything again.

**A Week** is a group of steps inside a module. It has a title, an optional description, and optional **start and end dates**. If a week has a start date, it stays locked until that date (even if its module is already open), and its date range shows as a badge. If you leave the start date empty, the week opens as soon as its module does — most weeks are set up this way.

**A Step** is one actual piece of content inside a week — and this is the part you'll create most often. Each step has a **type**, and depending on the type, different fields matter:

| Step type | What it is | Fields that matter |
|---|---|---|
| `video` | A YouTube video embedded right on the page (or a direct video file) | `videoProvider` = `youtube` and `videoId` = the 11-character video ID (Part 5 explains how to find it). Optionally `audioUrl` for an audio version. |
| `text` | A reading | `introMarkdown` (a short intro, always shown at the top), then either `contentBlocks` (the rich "Living Canvas" layout) **or** `contentMarkdown` (plain formatted text) plus an optional PDF (`pdfUrl`, `pdfName`) shown right inside the page |
| `file` | A downloadable resource (a worksheet, a handout) | `fileUrl` = the file's web address, `fileName` = what to call it |
| `quiz` | A short multiple-choice quiz, checked automatically | `quizData` = a block of structured data (Part 5 has a copy-paste template) |
| `masterclass` | One or more scheduled live sessions with a guest speaker | `masterclassData` = a block of structured data (Part 5 has a template) |

**The "Living Canvas."** Instead of one long wall of text, a reading can be built from a stack of designed blocks — a proverb with its translations in other African languages, a set of "pillar" cards, a before/after comparison, a timeline/roadmap, an FAQ, a table, a clickable map of Africa, and so on. Two block types save the student's own input: a **reflection** (they write a response and/or tick pledges) and a **poll** (they pick one answer — there's no right or wrong). Living Canvas content is written as structured data in the step's `contentBlocks` field. It's more involved to write by hand than the other fields, so ask a developer for help the first time; Part 5 includes a short example to show the shape.

Steps within a week have an **order** — the module's sidebar shows them top to bottom — and each one gets its own completion checkmark once a student finishes it.

Separately, a **Cohort Event** is something *live* — a masterclass, an office-hours session, or a deadline reminder — that shows up in a student's "Upcoming Milestones" panel on their Space page. It's not part of a module; it's scheduling information layered on top. (A `masterclass` *step* and a masterclass *Cohort Event* are separate things: the step lives inside the curriculum, the event appears on the Space page. If you want a masterclass in both places, add both.)

---

## Part 5 — Adding & Editing Content Yourself (Prisma Studio)

This is the part that lets you add a whole new module, week, lesson, video, quiz, or masterclass **without asking a developer**.

### What Prisma Studio actually is

Picture a big spreadsheet program, except instead of an Excel file, it's connected directly to the live website's real database. Every "sheet" (called a **table**) is one of the layers from Part 4 — `Cohort`, `Module`, `Week`, `ModuleStep`, `CohortEvent`, and so on. You click a table, see every row, and can add a new row, edit a cell, or delete a row — and the moment you save, students see the change on the actual live site. There's no "publish" button to remember — saving *is* publishing.

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
   - `unlockDate` — the date/time it should open to students. Set this in the future to schedule it ahead of time.
   - `orderIndex` — a plain number controlling its position in the list (e.g. if "Final Assessment" is currently `6`, and you want your new module *before* it, use `6` and bump Final Assessment to `7`).
4. Click **Save**.

A new module is empty until you give it at least one Week, and that week at least one Step.

### Adding a Week to a Module

1. Click the **Week** table, then **Add record**.
2. Fill in:
   - `moduleId` — pick the module (from the picker).
   - `title` — e.g. `Week 1: The Nile Valley`.
   - `description` — optional.
   - `orderIndex` — its position within the module (0 is first).
   - `startDate` / `endDate` — **leave both empty** unless you want this week to stay locked until a specific date. If you set `startDate`, the week stays locked until then.
3. Click **Save**.

### Adding a Step (the actual lesson content) to a Week

1. Click the **ModuleStep** table.
2. Click **Add record**.
3. Always fill in: `weekId` (pick the week from the list), `title` (e.g. "Reading: The Nile Valley"), `orderIndex` (its position within that week — 0 is first), and `type` — type **exactly** one of: `video`, `text`, `file`, `quiz`, or `masterclass` (lowercase, no quotation marks).
4. Then fill in *only* the fields that match that type:

**For a `text` step** — the simplest version is to fill in `contentMarkdown` with the reading itself. You can use simple formatting: `**bold**` for bold text, blank lines between paragraphs, `1.` at the start of a line for a numbered list. Optionally add a short `introMarkdown` to show at the top. To show a PDF inside the page, it's easiest to use the Admin Dashboard's **LMS Content** tab (Part 3), which uploads the file for you.

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
      ],
      "feedback": "Optional: a sentence shown only after the student gets this one right."
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
- `"feedback"` is optional — delete that line (and the comma before it) if you don't want it.
- Every `"id"` you use (for questions and for options) just needs to be unique *within that quiz* — `q1`/`q2`/`q3` and `a`/`b`/`c`/`d` is a fine, simple convention to reuse every time.
- Don't remove any of the curly braces `{ }`, square brackets `[ ]`, or commas — if Prisma Studio shows an error saving it, the most common cause is a missing comma between two items, or a stray one after the very last item in a list.
- Students never see which answer is correct before they submit — the grading happens invisibly, on the server, so there's no way to "peek." After submitting, they see their score and which questions they got right or wrong.
- **Be aware of how quizzes currently behave:** submitting a quiz marks the step complete **whatever the score**, and students can resubmit as many times as they like. `passingScore` is stored but not yet enforced. Treat quizzes as self-checks for now, not as a gate.

**For a `masterclass` step** — set `masterclassData` to a list of one or more sessions, using this template:

```json
[
  {
    "startsAt": "2026-10-15T16:00:00Z",
    "title": "Title of the session",
    "speakerName": "Dr. Speaker Name",
    "speakerAffiliation": "University or organisation (optional)",
    "speakerBio": "A sentence or two about the speaker (optional).",
    "meetingUrl": "https://link-to-the-video-call (optional)"
  }
]
```

- `startsAt` is the date and time in **UTC** (the `Z` at the end means UTC), written as year-month-day, then `T`, then hours:minutes:seconds. Students see it as a readable date **shown in UTC** (e.g. "October 15, 4:00 PM UTC") — not converted to their own time zone — so mention the local time in the `title` or `speakerBio` if that helps. For example, 5pm in Lagos (UTC+1) is `16:00:00Z`.
- The three "optional" lines can be deleted (along with the comma before each) if you don't have that information. Without a `meetingUrl`, there's simply no "Join Masterclass" button.
- For more than one session, add another `{ ... }` block inside the square brackets, separated by a comma.

**Living Canvas (`contentBlocks`)** — for a richly laid-out reading, instead of `contentMarkdown` you set `contentBlocks` to a list of blocks. Here's a tiny example, just to show the shape — a paragraph, a proverb, and a one-question poll:

```json
[
  { "type": "prose", "markdown": "An opening paragraph. **Bold** works here too." },
  { "type": "quote", "quote": "Umuntu ngumuntu ngabantu", "translation": "A person is a person through other people", "attribution": "Zulu proverb" },
  { "type": "poll", "prompt": "How familiar were you with this idea?", "options": ["Very", "A little", "Not at all"] }
]
```

There are 17 block types in total (prose, quote, pillars, reflection, callout, comparison, poll, banner, roadmap, manifesto, template, action card, FAQ, links, image, table, map), each with its own fields. Ask a developer before writing a larger one — a small mistake here can stop the whole step from displaying. Two things to know:
- Once `contentBlocks` has anything in it, it **replaces** `contentMarkdown` and the PDF on that step (the `introMarkdown` still shows at the top).
- Only put **one** reflection *or* poll block on a given step — a second one on the same step would overwrite the student's first answer.

### Adding a live event (masterclass, office hours, or a deadline reminder)

1. Click the **CohortEvent** table, then **Add record**.
2. Fill in `cohortId` (pick the cohort), `title`, an optional `description`, and `startsAt` (the date and time).
3. Set `type` to **exactly** one of: `masterclass`, `office_hours`, or `deadline` (lowercase, with the underscore in `office_hours`).
4. If it's a live session, put the video-call link in `meetingUrl`. Leave it blank for a deadline reminder.

### Reordering or rescheduling something that already exists

You don't need to delete and recreate anything — just click into the existing row (Module, Week, ModuleStep, or CohortEvent), change the field you need (a date, the order number, the title), and save.

### A few safety notes

- **Never delete a `Cohort`, `Module`, `Week`, or `ModuleStep` that students have already made progress on** unless you genuinely mean to erase that progress — deleting one of these also deletes everything inside it *and* everyone's completion records tied to it, permanently.
- Changing a module's `unlockDate` (or a week's `startDate`) to the past opens it to students **immediately** — useful if you want to open something early.
- If something looks broken after an edit, the most common cause is a typo in a `type` field (it must be *exactly* `video`, `text`, `file`, `quiz`, or `masterclass` — not `Video` or `videos`) or a broken bracket/comma in a block of structured data (`quizData`, `masterclassData`, or `contentBlocks`).
- To check a locked module before it opens without opening it for everyone, ask for your email to be added to the **preview list** (see Part 7).

---

## Part 6 — The Two Web Addresses, Explained Simply

- `institute.mikaelsoninitiative.org` — the public Institute site. Anyone can browse it. This is where you manage everything through `/admin`.
- `learn.mikaelsoninitiative.org/ubuntu` — the actual classroom. Only reachable this way; nothing else lives at `learn.mikaelsoninitiative.org` right now on purpose, so it can't be confused with the main site. If someone types the old institute-domain address for Ubuntu, it automatically forwards them to the correct `learn.` address.
- **This address is never linked anywhere on the public site.** The **"Ubuntu" button** in the site's navigation and the homepage both go to `/ubuntu-program` (the pitch page below), not the learning platform. The only way anyone ever learns the `learn.mikaelsoninitiative.org/ubuntu` address is the admission email described in Part 2, step 5 — deliberately, so the login page is never something a random visitor stumbles onto.
- The **program's pitch page** (the philosophy, "I am because we are," the list of programme offerings) lives at `institute.mikaelsoninitiative.org/ubuntu-program` — the marketing page explaining what Ubuntu *is*, before someone applies. It links to `/signup` to apply — never straight to the learning platform.

When a second learning program eventually exists, it gets its own path — e.g. `learn.mikaelsoninitiative.org/fellows` — sitting right alongside Ubuntu, on the very same `learn.` address.

---

## Part 7 — Behind-the-Scenes Settings, Plain-English Glossary

The site relies on a handful of outside services, each configured with a setting most people never need to touch. Here's what each one actually does, in case it ever comes up:

| Setting | What it really is |
|---|---|
| **Database (Neon)** | The actual filing cabinet described in Part 1 — every table Prisma Studio shows you lives here. |
| **Resend** | The email-sending service — every sign-in code, application confirmation, admission email, payment receipt, and staff notification goes out through it. It has a daily sending limit on the free tier, which is why sign-in codes have a one-minute cooldown between resends. |
| **Vercel Blob** | Where uploaded files actually live — team photos, partner logos, gallery art, lesson PDFs, submitted papers, and volunteers' CVs. When you upload something in the admin dashboard, this is where it's stored; the database just remembers the web address of the file. |
| **Google Sign-In** | Powers the "Continue with Google" button on the admin login page and on the Cohort application form. |
| **Paystack** | The payment processor behind the Library Support pledge page and the optional donation step after a Cohort application. Payments are confirmed automatically — Paystack notifies the site, and the site double-checks the amount with Paystack before marking anything Completed. |
| **Upstash (rate limiting)** | A spam guard. It limits how many forms, sign-in codes, and code guesses can come from one place in a short window, so nobody can flood the forms or guess a sign-in code. If you see "Too many requests. Try again in a few minutes," this is why. |
| **Google Analytics** | Counts visits to the public site. It only runs on the real live site, never on test versions. |
| **Admin email list** | A specific list of email addresses (kept in the site's private settings on Vercel, not visible in the code) that are allowed into `/admin`. If someone new needs admin access, their email has to be added to that list by whoever manages the site's hosting (Vercel) settings — being logged into Google isn't enough on its own. |
| **Preview email list** | A second, separate list of emails that can open **locked** modules and weeks early, to check content before students see it — without having admin access and without unlocking anything for the rest of the cohort. Also managed in Vercel's settings. |
| **The site's real web address setting** | Tells the site what its own official address is, so things like the sitemap, shared-link previews, and payment "return to site" links point at the right place. |

You'll almost never need to touch any of these directly — they're listed here so that if a developer ever mentions one of these names, you know roughly what part of the site they're talking about.

---

## Part 8 — Common Hiccups (and Why They're Not Actually Broken)

- **"Couldn't send a code, try again" on the sign-in page.** The database occasionally "falls asleep" after a period of no traffic (this saves cost on the hosting plan) and takes a few seconds to "wake up" on the very first request after a quiet spell. Waiting 5–10 seconds and trying again almost always fixes it. It is not data loss and nothing is broken.
- **"A code was already sent" when requesting a sign-in code.** Codes can only be re-sent once a minute per email address. Check the inbox (and spam folder) first; otherwise wait a minute and try again. Each code works once and expires after 10 minutes.
- **"This email isn't registered for an active cohort" on the Ubuntu sign-in page.** That email either hasn't been set to Admitted yet, or the student is typing a different email from the one they applied with.
- **An admitted student can't get in.** Check in the Applications tab that they have both **Status = Admitted** *and* a **Cohort** selected.
- **A page won't load on a phone/computer right after a DNS change.** Web addresses are cached by your computer and browser for a while after being set up. If something was *just* configured (a new subdomain, for instance) and doesn't load, try it on mobile data first — if it works there, it's purely a local caching delay on your Wi-Fi/computer, not a real problem, and it clears itself within a few hours at most.
- **A change in the admin dashboard doesn't show on the public page straight away.** The Team, Partners, Library, Gallery, and Library Support pages refresh their content about once a minute. Wait a minute and reload.
- **A quiz, video, or masterclass doesn't show up correctly.** Almost always one of: a typo in the step's `type` field, a YouTube video ID that isn't exactly 11 characters (see Part 5), or a small formatting mistake in the step's structured data (a missing comma is the usual culprit).
- **A step or module is missing for students.** Check its module's `unlockDate` and its week's `startDate` — if either is in the future, it's still locked.

---

## Part 9 — Quick Reference Cheat Sheet

- **To approve a new student:** Admin Dashboard → Applications → pick their Cohort, then set Status to Admitted. This immediately emails them their one-and-only sign-in link — nothing further to do.
- **To add a team member, partner, or gallery photo:** Admin Dashboard → the matching tab → Add New, upload the photo directly.
- **To add a book recommendation:** Admin Dashboard → Library → Add New (you'll need to paste a cover image URL yourself here — no upload button for this one).
- **To attach or swap a PDF reading on a lesson:** Admin Dashboard → LMS Content → pick module, week, and step → upload the PDF.
- **To add a new module:** Prisma Studio → `Module` → Add record, then add at least one `Week`, then add `ModuleStep`s to that week.
- **To add a new lesson, video, quiz, or masterclass:** Prisma Studio → `ModuleStep` → Add record (pick the `weekId`).
- **To schedule when a module opens:** Prisma Studio → `Module` → set `unlockDate`. For a single week inside an open module → `Week` → set `startDate`.
- **To schedule office hours or a deadline on students' Space page:** Prisma Studio → `CohortEvent` → Add record.
- **To find a YouTube video's ID:** it's the 11 characters right after `v=` or right after `youtu.be/` — stop at the first `?`.
- **To check a locked module before it opens:** ask for your email to be added to the preview list (Part 7).

---

*This document describes the site as it exists today. If new features are added later (a real content-authoring screen for modules, for instance), ask whoever built it to update this guide alongside the change.*
