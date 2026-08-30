import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CalendarClock, CheckCircle2, ExternalLink, Flag, GraduationCap, Users, Video } from "lucide-react";
import { SectionLabel } from "@/components/section-label";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireCohortAccess } from "@/lib/require-cohort-access";
import { computeCohortStatus, flattenModuleWeeks, getCompletedStepIds, type ModuleProgressStatus } from "@/lib/module-progress";

export const metadata: Metadata = {
  title: "Space",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

const STATUS_META: Record<ModuleProgressStatus, { label: string; dotClass: string; textClass: string }> = {
  done: { label: "Completed", dotClass: "bg-teal-deep", textClass: "text-teal-deep" },
  in_progress: { label: "In Progress", dotClass: "bg-amber-500", textClass: "text-ink" },
  not_started: { label: "Not Started", dotClass: "bg-ink/20", textClass: "text-ink-muted" },
};

const EVENT_ICONS: Record<string, typeof Video> = {
  masterclass: Video,
  office_hours: Users,
  deadline: Flag,
};

const EVENT_LABELS: Record<string, string> = {
  masterclass: "Masterclass",
  office_hours: "Office Hours",
  deadline: "Deadline",
};

export default async function LearnSpacePage() {
  const { session, application, error } = await requireCohortAccess();
  if (error || !session?.user?.id || !application) redirect("/ubuntu/login?denied=1");

  const cohort = application.cohort!;
  const modules = cohort.modules.map(flattenModuleWeeks);

  const completedStepIds = await getCompletedStepIds(session.user.id, modules.map((m) => m.id));
  const status = computeCohortStatus(modules, completedStepIds);
  const statusMeta = STATUS_META[status];

  const events = await prisma.cohortEvent.findMany({
    where: { cohortId: cohort.id, startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    take: 6,
  });

  const firstName = session.user.name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-16 sm:px-6">
      <Reveal>
        {firstName ? (
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Welcome, {firstName}!
          </h1>
        ) : (
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Welcome!
          </h1>
        )}
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">My Cohorts</h2>
      </Reveal>

      <StaggerGroup className="mt-8 grid gap-6 sm:grid-cols-2" staggerChildren={0.05}>
        <StaggerItem>
          <div className="relative rounded-2xl border border-ink/10 bg-paper p-6 sm:p-8">
            <span className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-teal-deep text-white">
              {status === "done" ? (
                <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
              ) : (
                <GraduationCap aria-hidden="true" className="h-5 w-5" />
              )}
            </span>

            <p className="max-w-[85%] font-display text-3xl font-semibold text-ink">{cohort.title}</p>

            <div className="mt-3 flex items-center gap-2">
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${statusMeta.dotClass}`} />
              <span className={`text-sm font-semibold ${statusMeta.textClass}`}>{statusMeta.label}</span>
            </div>

            <p className="mt-6 border-b border-ink/10 pb-1.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">
              Program Dates
            </p>
            <p className="mt-1.5 font-mono-ledger text-sm text-ink-muted">
              {formatDate(cohort.startDate)} to {formatDate(cohort.endDate)}
            </p>

            <div className="mt-6">
              <Button href="/ubuntu/modules" variant="primary" className="w-full justify-center">
                Go to Modules
              </Button>
            </div>
          </div>
        </StaggerItem>
      </StaggerGroup>

      <Reveal delay={0.15}>
        <div className="mt-6 rounded-2xl border border-ink/10 bg-paper p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">Cohort Activity</p>
          <h2 className="mt-1.5 font-display text-lg font-semibold text-ink">Upcoming Milestones</h2>

          {events.length === 0 ? (
            <p className="mt-5 text-sm text-ink-muted">
              No upcoming sessions or deadlines scheduled yet &mdash; check back soon.
            </p>
          ) : (
            <ul className="mt-5 space-y-4">
              {events.map((event) => {
                const Icon = EVENT_ICONS[event.type] ?? CalendarClock;
                return (
                  <li key={event.id} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-deep/10 text-teal-deep">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono-ledger text-[11px] font-semibold tracking-wide text-ink-muted uppercase">
                        {EVENT_LABELS[event.type] ?? event.type} &middot; {formatDateTime(event.startsAt)}
                      </p>
                      <p className="mt-0.5 truncate font-semibold text-ink">{event.title}</p>
                      {event.description && <p className="mt-0.5 text-sm text-ink-muted">{event.description}</p>}
                      {event.meetingUrl && (
                        <a
                          href={event.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-teal-deep hover:underline"
                        >
                          Join link
                          <ExternalLink aria-hidden="true" className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Reveal>
    </div>
  );
}
