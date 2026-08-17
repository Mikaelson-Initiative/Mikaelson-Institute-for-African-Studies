import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { HeroVideo } from "@/components/hero/hero-video";
import { RotatingWord } from "@/components/hero/rotating-word";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { FocusAreaReader } from "@/components/focus-area-reader";
import { LibraryShowcase } from "@/components/library-showcase";
import { SectionLabel } from "@/components/section-label";
import { focusAreas } from "@/lib/focus-areas";
import { heroConcernWords } from "@/lib/hero-concerns";

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-teal-deep text-paper sm:min-h-[90vh]">
        <HeroVideo />
        <div aria-hidden="true" className="absolute inset-0 bg-teal-deep/55" />
        <div className="relative mx-auto max-w-4xl px-4 pt-24 pb-40 text-center sm:px-6 sm:pt-32 sm:pb-56">
          <StaggerGroup staggerChildren={0.12}>
            <StaggerItem>
              <SectionLabel tone="inverse" className="justify-center">
                Pan-African Academic Research
              </SectionLabel>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                African scholarship on{" "}
                <RotatingWord words={heroConcernWords} className="text-turquoise" />.
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-paper/80">
                The Mikaelson Institute for African Studies is a general
                academic research institute, publishing scholarship in
                history and decolonization, society and politics, arts and
                culture, and religion and philosophy.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-paper/70">
                Ubuntu is the Institute&rsquo;s free, cohort-based learning
                program in African history: no tuition, no application fee.
                Our goal is to reach 10,000,000 students and researchers
                across the continent and its diaspora, building a shared,
                rigorous foundation in African history and thought.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button href="https://learn.mikaelsoninitiative.org/ubuntu" variant="primary">
                  Join Ubuntu
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
                <Button href="/library" variant="ghost-inverse">
                  Browse the Library
                </Button>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionLabel className="mb-4">About</SectionLabel>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Africa, studied as one connected field.
          </h2>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            MIAS is the research body of the Mikaelson Community Development
            and Tech Initiative, built to stand on its own as a credible
            academic initiative. We study the continent across five areas,
            history and decolonization, society and politics, arts and
            culture, religion and philosophy, and the sciences and
            metaphysics, treated as one continuous record, not separate
            disciplines.
          </p>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            Our editorial board is forming now, and Ubuntu, our first cohort
            program, is underway. If you&rsquo;re a scholar, researcher, or
            educator working in any of these areas, we want to hear from you.
          </p>
          <div className="mt-6">
            <Button href="/about" variant="ghost">
              About the Institute
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ContainerScroll
            titleComponent={
              <>
                <SectionLabel className="justify-center">Five focus areas</SectionLabel>
                <h2 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">
                  Research Focus Areas
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-ink-muted">
                  Scroll through the four themes anchoring the Institute&rsquo;s
                  research agenda.
                </p>
              </>
            }
          >
            <FocusAreaReader areas={focusAreas} />
          </ContainerScroll>
        </div>
      </section>

      <section className="bg-beige-panel py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <SectionLabel className="mb-4">Library</SectionLabel>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              A growing library of African scholarship.
            </h2>
            <p className="mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
              Every accepted paper becomes part of a permanent, citable
              archive, published in volumes and freely accessible. The first
              volume is forming now. Submissions are open.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10">
              <LibraryShowcase />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8">
              <Button href="/library" variant="ghost">
                View Library
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionLabel className="mb-4">Method</SectionLabel>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            History & Decolonization, understood chronologically.
          </h2>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            Our History &amp; Decolonization research follows a chronological
            throughline, from pre-colonial societies, through contact and
            colonial rule, to independence and the contemporary continent.
          </p>
          <div className="mt-6">
            <Button href="/framework" variant="ghost">
              Explore the Framework
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </section>

      <section className="bg-teal-deep py-20 text-paper">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <SectionLabel tone="inverse" className="mb-4 justify-center">
              Call for Papers
            </SectionLabel>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Calls for papers coming soon.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-paper/80">
              Join waitlist to be first to be reached when calls for papers are opened.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/call-for-papers" variant="primary">
                View Guidelines
              </Button>
              <Button href="/waitlist" variant="ghost-inverse">
                Join Waitlist
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
