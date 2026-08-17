import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SectionLabel } from "@/components/section-label";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { prisma } from "@/lib/prisma";
import { requireCohortAccess } from "@/lib/require-cohort-access";

export const metadata: Metadata = {
  title: "Discover",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function LearnDiscoverPage() {
  const { application, error } = await requireCohortAccess();
  if (error || !application) redirect("/ubuntu/login?denied=1");

  const now = new Date();

  // Discover is for browsing what's next, not the cohort you're already
  // in — that lives in My Space. Upcoming (not yet started) cohorts surface
  // first; any other cohort the user isn't part of follows.
  const otherCohorts = await prisma.cohort.findMany({
    where: { id: { not: application.cohort!.id } },
    orderBy: { startDate: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-16 sm:px-6">
      <SectionLabel>Discover</SectionLabel>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">New &amp; Upcoming Cohorts</h1>
      <p className="mt-3 text-lg text-ink-muted">
        Your current cohort lives in My Space &mdash; this is where the next ones show up as the Institute opens them.
      </p>

      <StaggerGroup className="mt-8 space-y-3" staggerChildren={0.05}>
        {otherCohorts.length === 0 && (
          <StaggerItem>
            <p className="rounded-xl border border-ink/10 bg-paper p-5 text-sm text-ink-muted">
              No new cohorts open right now &mdash; check back soon.
            </p>
          </StaggerItem>
        )}
        {otherCohorts.map((cohort) => {
          const upcoming = cohort.startDate > now;

          return (
            <StaggerItem key={cohort.id}>
              <div className="rounded-xl border border-ink/10 bg-paper p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl font-semibold text-ink">{cohort.title}</p>
                    {cohort.description && (
                      <p className="mt-1 text-sm text-ink-muted">{cohort.description}</p>
                    )}
                    <p className="mt-2 font-mono-ledger text-xs text-ink/40">
                      {formatDate(cohort.startDate)} &ndash; {formatDate(cohort.endDate)}
                    </p>
                  </div>
                  {upcoming && (
                    <span className="shrink-0 rounded-full border border-ink/20 px-3 py-1 text-xs font-semibold text-ink-muted">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </div>
  );
}
