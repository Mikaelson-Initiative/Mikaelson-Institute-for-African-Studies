import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRight, Beaker, Network, Microscope, UploadCloud, Users, Trophy } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "STEM & Metaphysics | Research Community",
  description: "Submit research papers, partner with tech communities, and discover top researchers in STEM and Metaphysics.",
};

export default function StemAndMetaphysicsPage() {
  return (
    <div className="bg-[#faf9f8] text-ink pb-24">
      <PageHero
        eyebrow="Research Community"
        title="STEM & Metaphysics"
        lede="Bridging technological advancement with deep philosophical inquiry. A space for scientists and technologists to publish, partner, and study."
      />

      <div className="mx-auto max-w-6xl space-y-32 px-4 pt-16 sm:px-6">
        
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-medium leading-tight text-ink sm:text-5xl lg:leading-tight">
              A Hub for Scientific and Philosophical <br className="hidden sm:block"/>
              <span className="text-[#a0948e]">Innovation and Collaboration.</span>
            </h2>
            <p className="mt-8 text-lg text-ink-muted">
              We partner with tech communities and research organizations to study and publish groundbreaking work. This is where scientists submit research papers, and where we highlight the top researchers pushing the boundaries of African knowledge.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Publish Papers", desc: "Submit your research papers to be peer-reviewed and published in our academic archives.", icon: UploadCloud },
            { title: "Partner Organizations", desc: "We collaborate with tech communities and global research organizations to study emerging paradigms.", icon: Network },
            { title: "Top Researchers", desc: "We actively highlight and fund top researchers who are making significant contributions to their fields.", icon: Trophy },
            { title: "Scientific Inquiry", desc: "Rigorous scientific methodologies applied to modern African challenges and technological development.", icon: Microscope },
            { title: "Metaphysical Studies", desc: "Exploring indigenous knowledge systems, ontology, and the philosophical implications of new technologies.", icon: Beaker },
            { title: "Community Building", desc: "Join a growing network of technologists and scientists dedicated to internally-driven African research.", icon: Users },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={i} delay={i * 0.05}>
                <div className="group relative overflow-hidden rounded-[2rem] bg-white p-8 border border-ink/5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf9f8] text-teal-deep transition-all duration-300 group-hover:bg-teal-deep group-hover:text-white group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-ink relative z-10">{item.title}</h3>
                  <p className="mt-4 text-ink-muted relative z-10">{item.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Massive CTA */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[3rem] bg-[#1a2d2a] px-6 py-20 text-center sm:px-12 sm:py-32">
            <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-[#2e4b46] blur-[100px] mix-blend-screen" />
            <div className="absolute -right-1/4 -bottom-1/4 h-1/2 w-1/2 rounded-full bg-[#1e3b36] blur-[100px] mix-blend-screen" />
            
            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm">
                Open for Submissions
              </span>
              <h2 className="font-display text-5xl font-medium tracking-tight text-white sm:text-7xl">
                Submit Your Research
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-lg text-white/70 sm:text-xl">
                Join our network of researchers and technologists. Submit your papers for publication and study.
              </p>
              <div className="mt-12 flex justify-center">
                <Link
                  href="/submit"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#1a2d2a] transition-all duration-300 hover:scale-105 hover:bg-[#faf9f8] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1a2d2a]"
                >
                  Go to Submissions
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
