import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRight, BookOpen, Users, Mic, Lightbulb, GraduationCap, UsersRound, LibraryBig, Music } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ubuntu | Community Cohort",
  description: "Join the Mikaelson Institute's Community Cohort for African History Education.",
};

const programmes = [
  {
    label: "Reading Groups",
    description: "Small, recurring groups working through shared texts on history, decolonization, and society.",
    icon: BookOpen,
  },
  {
    label: "Public Lectures",
    description: "Open lectures bringing scholars, writers, and thinkers into conversation with the public.",
    icon: Mic,
  },
  {
    label: "Seminars",
    description: "Scholars presenting their work and taking questions in a recurring, open seminar series.",
    icon: UsersRound,
  },
  {
    label: "Research Conversations",
    description: "Structured discussions among researchers and scholars working on related questions.",
    icon: Lightbulb,
  },
  {
    label: "Fellowships",
    description: "Opportunities for scholars to engage deeply with the Institute's community and intellectual life.",
    icon: GraduationCap,
  },
  {
    label: "Student Programmes",
    description: "Pathways into serious African scholarship for emerging researchers and students.",
    icon: Users,
  },
  {
    label: "Community Archives",
    description: "Working with communities to document and preserve their own knowledge and histories.",
    icon: LibraryBig,
  },
  {
    label: "Cultural Conversations",
    description: "Recognizing that art, music, literature, and lived culture are crucial forms of knowing.",
    icon: Music,
  },
];

export default function UbuntuPage() {
  return (
    <div className="bg-[#faf9f8] text-ink pb-24">
      <PageHero
        eyebrow="Community"
        title="Ubuntu"
        lede="I Am Because We Are."
      />

      <div className="mx-auto max-w-6xl space-y-32 px-4 pt-16 sm:px-6">
        
        {/* Core Philosophy */}
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-medium leading-tight text-ink sm:text-5xl lg:leading-tight">
              Ubuntu is more than a phrase. <br className="hidden sm:block"/>
              <span className="text-[#a0948e]">It represents an understanding of human life rooted in relationship, dignity, and community.</span>
            </h2>
            <p className="mt-8 text-lg text-ink-muted">
              At Mikaelson Institute for African Studies, Ubuntu informs how we understand intellectual life. Knowledge does not exist only for the person who discovers it—it must strengthen the community.
            </p>
          </Reveal>
        </div>

        {/* Knowledge statements grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Strengthen", desc: "Knowledge can strengthen a community and build collective power." },
            { title: "Preserve", desc: "It can preserve a memory that institutions have tried to erase." },
            { title: "Challenge", desc: "It can challenge an institution and demand systemic change." },
            { title: "Language", desc: "It gives language to an experience that was previously unutterable." },
            { title: "Understand", desc: "It helps a generation understand itself and its place in history." },
            { title: "Carry Forward", desc: "Scholarship is carried forward into the relationships that give it meaning." },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="group relative overflow-hidden rounded-[2rem] bg-white p-8 border border-ink/5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1">
                <div className="absolute -top-2 -right-2 p-6 opacity-0 transition-all duration-300 group-hover:opacity-10 text-teal-deep translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                  <ArrowRight className="h-16 w-16 -rotate-45" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-ink relative z-10">{item.title}</h3>
                <p className="mt-4 text-ink-muted relative z-10">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Cohort Offerings */}
        <div className="space-y-16">
          <Reveal>
            <div className="text-center">
              <span className="text-sm font-semibold tracking-widest text-teal-deep uppercase">The Program</span>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">Cohort Offerings</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-muted">
                We are building a community of scholars, readers, and practitioners who believe African intellectual life deserves serious, generous attention.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programmes.map((programme, i) => {
              const Icon = programme.icon;
              return (
                <Reveal key={programme.label} delay={i * 0.05}>
                  <div className="group relative h-full rounded-[2rem] border border-ink/5 bg-white p-6 transition-all duration-300 hover:border-teal-deep hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf9f8] text-teal-deep transition-all duration-300 group-hover:bg-teal-deep group-hover:text-white group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-ink">{programme.label}</h3>
                    <p className="mt-3 text-sm text-ink-muted leading-relaxed">{programme.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Massive CTA */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[3rem] bg-[#1a2d2a] px-6 py-20 text-center sm:px-12 sm:py-32">
            {/* Background decorative elements */}
            <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-[#2e4b46] blur-[100px] mix-blend-screen" />
            <div className="absolute -right-1/4 -bottom-1/4 h-1/2 w-1/2 rounded-full bg-[#1e3b36] blur-[100px] mix-blend-screen" />
            
            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm">
                Applications Open
              </span>
              <h2 className="font-display text-5xl font-medium tracking-tight text-white sm:text-7xl">
                Join Cohort 01.
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-lg text-white/70 sm:text-xl">
                Knowledge carried forward because we carry one another. Embark on a transformative journey into African history.
              </p>
              <div className="mt-12 flex justify-center">
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#1a2d2a] transition-all duration-300 hover:scale-105 hover:bg-[#faf9f8] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1a2d2a]"
                >
                  Join the Cohort
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
