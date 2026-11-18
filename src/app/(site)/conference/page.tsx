import type { Metadata } from "next";
import { ArrowRight, BedDouble, MapPin, Mic, Plane, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { SectionLabel } from "@/components/section-label";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { focusAreas } from "@/lib/focus-areas";
import {
  CONFERENCE_CONTACT_EMAIL,
  CONFERENCE_INTEREST_MAILTO,
  CONFERENCE_NAME,
  CONFERENCE_THEME,
  CONFERENCE_THEME_TEXT,
  CONFERENCE_YEAR,
} from "@/lib/conference";

export const metadata: Metadata = {
  title: `Research Conference ${CONFERENCE_YEAR}`,
  description: `${CONFERENCE_THEME_TEXT}. An in-person research conference in Nigeria in ${CONFERENCE_YEAR}, hosted by the Mikaelson Institute for African Studies, for scholars presenting new work on Africa across history, society and politics, arts and culture, religion and philosophy, and the sciences.`,
  keywords: [
    "African studies conference",
    "African studies conference Nigeria",
    "academic conference Africa",
    "call for abstracts African studies",
    "knowledge production in Africa",
    "African knowledge production",
  ],
  alternates: { canonical: "/conference" },
};

// Every fact below that the Institute hasn't confirmed reads "To be
// announced" and is flagged with a PlaceholderNotice, per
// MIAS_Design_PRD.md Sec. 7 — don't fill these in with invented dates,
// venues or fees. In-person in Nigeria with its own call for papers is
// confirmed (2026-11-16); the theme and year are confirmed (2026-11-18).
const TBA = "To be announced";

const keyFacts = [
  { label: "Dates", value: `${CONFERENCE_YEAR}, dates to be announced` },
  { label: "Venue", value: "Nigeria, city to be confirmed" },
  { label: "Format", value: "In person" },
  { label: "Call for Papers", value: "Not yet open" },
];

// Genuinely chronological, so rendered as an ordered list.
const keyDates = [
  { milestone: "Call for abstracts opens", date: TBA },
  { milestone: "Abstract submission deadline", date: TBA },
  { milestone: "Notification of acceptance", date: TBA },
  { milestone: "Registration opens", date: TBA },
  { milestone: "Programme published", date: TBA },
  { milestone: "Conference days", date: `${CONFERENCE_YEAR}, to be announced` },
];

const practicalities = [
  {
    icon: MapPin,
    title: "Venue",
    body: "The host city and venue in Nigeria will be published here, with directions and a map.",
  },
  {
    icon: Plane,
    title: "Travel & visas",
    body: "Guidance for delegates travelling from outside Nigeria, including visas and invitation letters, will be published here.",
  },
  {
    icon: BedDouble,
    title: "Accommodation",
    body: "Recommended places to stay near the venue will be listed here once the venue is confirmed.",
  },
  {
    icon: Ticket,
    title: "Registration",
    body: "How to register to attend or present, and what registration includes, will be published here.",
  },
];

export default function ConferenceHomePage() {
  return (
    <>
      <section id="top" className="relative overflow-hidden bg-teal-deep text-paper">
        {/* Faint ledger grid: the archival device from the main site, kept
            decorative so the hero doesn't depend on media we don't have. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,var(--mias-turquoise)_1px,transparent_1px),linear-gradient(to_bottom,var(--mias-turquoise)_1px,transparent_1px)] [background-size:64px_64px]"
        />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20">
          <StaggerGroup staggerChildren={0.12}>
            <StaggerItem>
              <SectionLabel tone="inverse">{`${CONFERENCE_NAME} ${CONFERENCE_YEAR}`}</SectionLabel>
            </StaggerItem>
            <StaggerItem>
              {/* The theme is the headline; the conference name sits in the
                  label above and in the page <title>. */}
              <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                <span className="block text-turquoise">{CONFERENCE_THEME.lead}:</span>
                <span className="block">{CONFERENCE_THEME.subject}</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 max-w-2xl text-lg text-paper/80">
                An in-person gathering in Nigeria for scholars presenting new
                work on Africa: its histories, societies, cultures, beliefs
                and sciences, argued over in the same room.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="#call-for-papers" variant="primary">
                  Submit an Abstract
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
                <Button href={CONFERENCE_INTEREST_MAILTO} variant="ghost-inverse">
                  Register Interest
                </Button>
              </div>
            </StaggerItem>
          </StaggerGroup>

          <Reveal delay={0.4}>
            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-turquoise/40 pt-8 lg:grid-cols-4">
              {keyFacts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono-ledger text-xs tracking-widest text-turquoise uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 font-display text-lg font-semibold sm:text-xl">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
        <PlaceholderNotice>
          the conference dates, host city and venue go here once confirmed
          by the Institute, not invented for this build.
        </PlaceholderNotice>
      </div>

      <section id="about" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-20 sm:px-6">
        <Reveal>
          <SectionLabel className="mb-4">The Theme</SectionLabel>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Knowledge about Africa, produced from Africa.
          </h2>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            Much of what the world takes as authoritative knowledge about the
            continent is still written, funded and judged elsewhere. This
            year&rsquo;s theme, <em>{CONFERENCE_THEME_TEXT}</em>, asks what
            changes when the questions, sources and methods start here: who
            sets the research agenda, what counts as evidence, and how work
            made on the continent reaches the rest of the world.
          </p>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            Nigeria has stood at this frontier before. In the 1950s and
            1960s, historians at the University of Ibadan, led by Kenneth
            Onwuka Dike, helped change how African history is written by
            treating oral tradition as serious evidence. The {CONFERENCE_NAME}{" "}
            brings researchers, independent scholars, graduate students and
            practitioners together in Nigeria to continue that work.
          </p>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            It follows the Institute&rsquo;s view of Africa as one connected
            field. Papers are welcome across all five of our research areas,
            and the programme is meant to put a historian, a political
            economist and a philosopher working on the same question in
            conversation with each other, not in separate silos.
          </p>
        </Reveal>
      </section>

      <section id="dates" className="scroll-mt-20 bg-paper py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <SectionLabel className="mb-4">Key Dates</SectionLabel>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              The road to the conference.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ol className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {keyDates.map((item) => (
                <li
                  key={item.milestone}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="text-base font-semibold text-ink">{item.milestone}</span>
                  <span className="font-mono-ledger text-sm text-ink-muted">{item.date}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-6">
              <PlaceholderNotice>
                each milestone&rsquo;s date goes here once the Institute sets
                the conference calendar.
              </PlaceholderNotice>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="call-for-papers" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-20 sm:px-6">
        <Reveal>
          <SectionLabel className="mb-4">Call for Papers</SectionLabel>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Present your research.
          </h2>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            The conference will open its own call for abstracts. We are
            looking for original, rigorous work that asks difficult
            questions, recovers neglected histories, or offers new ways of
            understanding African societies, from established academics and
            emerging researchers alike. Papers in any track are welcome to
            take up the theme: how knowledge about Africa is made, by whom,
            and from where.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h3 className="mt-12 font-display text-lg font-semibold text-ink">
            Conference tracks
          </h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {focusAreas.map((area) => (
              <li key={area.slug} className="rounded-lg border border-ink/10 bg-paper p-5">
                <p className="font-display text-base font-semibold text-ink">{area.title}</p>
                <p className="mt-2 text-sm text-ink-muted">{area.summary}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <PlaceholderNotice>
              abstract length, submission format and portal, who is eligible
              to submit, the review process, and presentation format (panel,
              roundtable, poster) go here once confirmed for this call.
            </PlaceholderNotice>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 rounded-lg border border-dashed border-ink/20 bg-paper p-8 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              Abstract submissions are not open yet.
            </p>
            <p className="mx-auto mt-3 max-w-md text-base text-ink-muted">
              Register your interest and we&rsquo;ll write to you when the
              call opens.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button href={CONFERENCE_INTEREST_MAILTO}>
                Register Interest
              </Button>
            </div>
            <p className="mt-6 text-sm text-ink-muted">
              Looking to publish rather than present?{" "}
              <a
                href="/call-for-papers"
                className="font-semibold text-teal-deep underline underline-offset-4"
              >
                See the Institute&rsquo;s publications call
              </a>
              .
            </p>
          </div>
        </Reveal>
      </section>

      <section id="programme" className="scroll-mt-20 bg-beige-panel py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <SectionLabel className="mb-4">Programme & Speakers</SectionLabel>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Built from the papers you send.
            </h2>
            <p className="mt-4 text-base text-ink-muted sm:text-lg">
              The programme is assembled after abstracts are reviewed, so the
              sessions reflect the strongest work submitted rather than a
              fixed list of topics.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 flex items-start gap-4 rounded-lg border border-ink/10 bg-paper p-6">
              <Mic aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-teal-deep" />
              <div>
                <p className="font-display text-base font-semibold text-ink">
                  Keynote speakers and full programme
                </p>
                <p className="mt-1 text-sm text-ink-muted">{TBA}.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="venue" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-20 sm:px-6">
        <Reveal>
          <SectionLabel className="mb-4">Venue & Travel</SectionLabel>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            In person, in Nigeria.
          </h2>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            The conference is held in person only. Everything you need to
            plan your trip will be gathered here.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {practicalities.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-lg border border-ink/10 bg-paper p-6">
                <Icon aria-hidden="true" className="h-6 w-6 text-teal-deep" />
                <p className="mt-3 font-display text-base font-semibold text-ink">{title}</p>
                <p className="mt-1 text-sm text-ink-muted">{body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="bg-teal-deep py-20 text-paper">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <SectionLabel tone="inverse" className="mb-4 justify-center">
              Stay Informed
            </SectionLabel>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Be first to hear when the call opens.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-paper/80">
              Questions about presenting, partnering or attending? Write to{" "}
              <a
                href={`mailto:${CONFERENCE_CONTACT_EMAIL}`}
                className="font-semibold text-turquoise underline underline-offset-4 hover:text-turquoise-hover"
              >
                {CONFERENCE_CONTACT_EMAIL}
              </a>
              .
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href={CONFERENCE_INTEREST_MAILTO}>
                Register Interest
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
