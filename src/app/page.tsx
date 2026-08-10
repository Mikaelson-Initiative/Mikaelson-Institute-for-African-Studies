import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { PalimpsestNames } from "@/components/hero/palimpsest-names";
import { RotatingWord } from "@/components/hero/rotating-word";
import { FocusAreaCard } from "@/components/focus-area-card";
import { focusAreas } from "@/lib/focus-areas";
import { heroConcernWords } from "@/lib/hero-concerns";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-teal-deep text-paper">
        <PalimpsestNames />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <StaggerGroup staggerChildren={0.12}>
            <StaggerItem>
              <p className="font-mono-ledger text-xs tracking-widest text-turquoise uppercase">
                Pan-African Academic Research
              </p>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
                African scholarship on{" "}
                <RotatingWord words={heroConcernWords} className="text-turquoise" />.
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-paper/80">
                The Mikaelson Institute for African Studies is a general
                academic research institute — publishing scholarship in
                history and decolonization, society and politics, arts and
                culture, and religion and philosophy.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button href="/submit" variant="primary">
                  Submit a Paper
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
                <Button href="/call-for-papers" variant="ghost-inverse">
                  Read the Call for Papers
                </Button>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            A credible, independent research institute.
          </h2>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            MIAS is a new initiative of the Mikaelson Community Development
            and Tech Initiative, built to stand on its own as an academic
            body — a home for rigorous, peer-reviewed scholarship on Africa,
            written for scholars, universities, and the public alike.
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
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Research Focus Areas
            </h2>
            <p className="mt-2 max-w-2xl text-ink-muted">
              Four themes anchor the Institute&rsquo;s current research agenda.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((area) => (
              <FocusAreaCard key={area.slug} area={area} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            History & Decolonization, understood chronologically.
          </h2>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            Our History &amp; Decolonization research follows a chronological
            throughline — from pre-colonial societies, through contact and
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
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Call for Papers is open.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-paper/80">
              We welcome submissions from scholars and researchers across all
              four focus areas.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/call-for-papers" variant="primary">
                View Guidelines
              </Button>
              <Button href="/submit" variant="ghost-inverse">
                Submit a Paper
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
