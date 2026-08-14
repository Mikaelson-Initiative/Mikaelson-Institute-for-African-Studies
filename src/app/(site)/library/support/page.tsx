import type { Metadata } from "next";
import Image from "next/image";
import { Medal, HeartHandshake } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ContributionSection } from "@/components/forms/contribution-section";
import { prisma } from "@/lib/prisma";
import { COST_PER_BOOK_NAIRA, TARGET_BOOKS, formatNaira } from "@/lib/library-contribution-tiers";

export const metadata: Metadata = {
  title: "Support Our Library | Mikaelson Institute",
  description: "Help us bring 1,000,000 African books to Africa. Support our library initiative today.",
};

// Revalidate periodically instead of caching at build time — otherwise a
// contribution marked "completed" in the admin dashboard wouldn't move the
// progress tracker or leaderboard until the next deploy.
export const revalidate = 60;

export default async function SupportLibraryPage() {
  const completed = await prisma.libraryContribution.findMany({
    where: { status: "completed" },
    orderBy: { amount: "desc" },
  });

  const totalRaised = completed.reduce((sum, c) => sum + c.amount, 0);
  const currentBooks = Math.floor(totalRaised / COST_PER_BOOK_NAIRA);
  const progressPercentage = Math.min(100, (currentBooks / TARGET_BOOKS) * 100);
  const topContributors = completed.slice(0, 10);

  return (
    <div className="bg-[#faf9f8] min-h-screen text-ink pb-24">
      {/* ── Cinematic Hero ──────────────────────────────────────────────── */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-[#1a2d2a]">
        <Image
          src="/images/library/support-hero.png"
          alt="African Library"
          fill
          className="object-cover object-center opacity-50 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2d2a]/60 via-transparent to-[#faf9f8]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-md mb-6">
              <HeartHandshake className="h-4 w-4 text-amber-400" /> Bring African Books to Africa
            </div>
            <h1 className="font-display text-5xl font-medium tracking-tight text-white sm:text-7xl drop-shadow-lg">
              The 1,000,000 Books Project
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl drop-shadow">
              We are on a mission to build the most comprehensive, accessible library of African knowledge on the continent. Join us in bringing a million books home.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-24 relative z-10 space-y-24">

        {/* Progress Tracker */}
        <Reveal delay={0.1}>
          <div className="rounded-[2.5rem] bg-white p-8 sm:p-12 border border-ink/5 shadow-[0_8px_40px_rgb(0,0,0,0.06)] backdrop-blur-xl">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-semibold text-ink">Our Progress</h2>
              <p className="text-ink-muted mt-2">Every contribution brings us closer to our goal.</p>
            </div>

            <div className="relative pt-4">
              <div className="flex mb-4 items-center justify-between">
                <div>
                  <span className="text-4xl font-display font-bold inline-block text-teal-deep">
                    {currentBooks.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider ml-2">Books Secured</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-display font-semibold inline-block text-ink">
                    {TARGET_BOOKS.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider ml-2">Target</span>
                </div>
              </div>
              <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-teal-deep/10">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-teal-500 to-teal-deep transition-all duration-1000 ease-out"
                ></div>
              </div>
              <p className="text-center text-sm font-medium text-teal-deep">{progressPercentage.toFixed(3)}% funded</p>
            </div>
          </div>
        </Reveal>

        {/* Where the books go */}
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Where your books go</h2>
            <p className="mt-4 text-lg text-ink-muted leading-relaxed">
              Every book funded here becomes part of a growing collection built for Ubuntu,
              the Institute&rsquo;s cohort-based learning community of young African history
              learners meeting their own history for the first time, often in a formal
              setting. Your contribution puts a real book in a real learner&rsquo;s hands.
            </p>
          </div>
        </Reveal>

        {/* Contribution Levels */}
        <div className="space-y-12">
          <Reveal>
            <div className="text-center">
              <h2 className="font-display text-4xl font-semibold text-ink">Contribution Levels</h2>
              <p className="mt-4 text-lg text-ink-muted max-w-2xl mx-auto">
                Choose your level of impact. 100% of your contribution goes directly to acquiring, shipping, and cataloging books for the physical and digital archives.
              </p>
            </div>
          </Reveal>

          <ContributionSection />
        </div>

        {/* Top Contributors Rankings */}
        <Reveal>
          <div className="rounded-[2.5rem] bg-[#1a2d2a] p-8 sm:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="font-display text-4xl font-semibold text-white">Top Contributors</h2>
                <p className="mt-4 text-lg text-white/70">Honoring those who are making the library a reality.</p>
              </div>

              {topContributors.length === 0 ? (
                <div className="mx-auto max-w-3xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm p-12 text-center">
                  <Medal className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white/50">The leaderboard is currently empty.</h3>
                  <p className="mt-2 text-white/40">Be the first to make a major contribution and secure your spot!</p>
                </div>
              ) : (
                <div className="mx-auto max-w-3xl divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  {topContributors.map((contributor, i) => (
                    <div key={contributor.id} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="flex items-center gap-4">
                        <span className="font-mono-ledger text-sm text-white/40">{String(i + 1).padStart(2, "0")}</span>
                        <div>
                          <p className="font-semibold text-white">{contributor.name}</p>
                          {contributor.tier && <p className="text-xs text-white/50">{contributor.tier}</p>}
                        </div>
                      </div>
                      <p className="font-display text-lg font-semibold text-teal-300">{formatNaira(contributor.amount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
