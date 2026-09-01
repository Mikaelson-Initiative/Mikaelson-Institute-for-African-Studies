import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { SectionLabel } from "@/components/section-label";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { ModuleSelect } from "@/components/learn/module-select";
import { requireCohortAccess } from "@/lib/require-cohort-access";
import {
  computeWeekProgress,
  describeSteps,
  findResumeModule,
  flattenModuleWeeks,
  getCompletedStepIds,
  isWeekLocked,
} from "@/lib/module-progress";

export const metadata: Metadata = {
  title: "Modules",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatDateRange(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const startStr = start.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const endStr = end.toLocaleDateString("en-US", sameMonth ? { day: "numeric" } : { month: "long", day: "numeric" });
  return `${startStr} - ${endStr}`;
}

export default async function LearnModulesPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string }>;
}) {
  const { module: requestedModuleId } = await searchParams;
  const { session, application, hasPreviewAccess, error } = await requireCohortAccess();
  if (error || !session?.user?.id || !application) redirect("/ubuntu/login?denied=1");

  const cohort = application.cohort!;
  const modules = cohort.modules;
  const flatModules = modules.map(flattenModuleWeeks);

  const completedStepIds = await getCompletedStepIds(session.user.id, modules.map((m) => m.id));
  const resumeModule = findResumeModule(flatModules, completedStepIds, hasPreviewAccess);
  const now = new Date();

  if (modules.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-32 pt-16 sm:px-6">
        <SectionLabel>{cohort.title}</SectionLabel>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Modules</h1>
        <p className="mt-6 rounded-xl border border-ink/10 bg-paper p-4 text-lg text-ink-muted">
          No modules have been published for this cohort yet.
        </p>
      </div>
    );
  }

  const selectedId = requestedModuleId && modules.some((m) => m.id === requestedModuleId)
    ? requestedModuleId
    : resumeModule?.id ?? modules[0].id;
  const selectedModule = modules.find((m) => m.id === selectedId)!;
  const selectedLocked = !hasPreviewAccess && selectedModule.unlockDate > now;

  const currentWeekId = !selectedLocked
    ? selectedModule.weeks.find(
        (w) => !isWeekLocked(w, hasPreviewAccess) && computeWeekProgress(w, completedStepIds).status !== "done",
      )?.id ?? selectedModule.weeks[selectedModule.weeks.length - 1]?.id
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-16 sm:px-6">
      <SectionLabel>{cohort.title}</SectionLabel>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Modules</h1>
      <p className="mt-3 text-lg text-ink-muted">Your cohort&rsquo;s curriculum, in order.</p>

      <div className="mt-8">
        <ModuleSelect
          modules={modules.map((m) => ({ id: m.id, title: m.title, locked: !hasPreviewAccess && m.unlockDate > now }))}
          selectedId={selectedId}
        />
      </div>

      {selectedLocked ? (
        <p className="mt-8 flex items-center gap-2 rounded-xl border border-ink/10 bg-paper/60 p-5 text-lg text-ink-muted">
          <Lock aria-hidden="true" className="h-4 w-4" />
          Unlocks {formatDate(selectedModule.unlockDate)}
        </p>
      ) : (
        <StaggerGroup className="mt-8 space-y-4" staggerChildren={0.05}>
          {selectedModule.weeks.length === 0 && (
            <StaggerItem>
              <p className="rounded-xl border border-ink/10 bg-paper p-4 text-lg text-ink-muted">
                No content has been added to this module yet.
              </p>
            </StaggerItem>
          )}

          {selectedModule.weeks.map((week, index) => {
            const { completedSteps, totalSteps, status } = computeWeekProgress(week, completedStepIds);
            const weekLocked = isWeekLocked(week, hasPreviewAccess);
            const isCurrent = !weekLocked && week.id === currentWeekId && status !== "done";
            const meta = describeSteps(week.steps);
            const hasDateRange = week.startDate && week.endDate;
            // Only calendar-paced modules get a "Week N" label — "Welcome to
            // Ubuntu" is a one-time onboarding flow, not a weekly curriculum.
            const weekLabel = week.startDate ? `Week ${index + 1}` : null;

            const cardClass = weekLocked
              ? "border-ink/10 bg-paper/60"
              : status === "done"
                ? "border-ink/10 bg-beige-panel/70"
                : isCurrent
                  ? "border-2 border-teal-deep bg-paper shadow-sm"
                  : "border-ink/10 bg-paper";

            return (
              <StaggerItem key={week.id}>
                <div className={`rounded-2xl border p-6 transition-colors ${cardClass}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      {(weekLabel || hasDateRange) && (
                        <p className="font-mono-ledger text-xs text-ink-muted">
                          {weekLabel}
                          {weekLabel && hasDateRange && " • "}
                          {hasDateRange && formatDateRange(week.startDate!, week.endDate!)}
                        </p>
                      )}
                      <p className="mt-1 font-display text-xl font-semibold text-ink">{week.title}</p>
                      {week.description && <p className="mt-2 text-lg text-ink-muted">{week.description}</p>}

                      {weekLocked ? (
                        <p className="mt-4 flex items-center gap-1.5 font-mono-ledger text-xs text-ink-muted">
                          <Lock aria-hidden="true" className="h-3 w-3" />
                          Unlocks {formatDate(week.startDate!)}
                        </p>
                      ) : (
                        <>
                          <p className="mt-4 font-mono-ledger text-xs text-ink-muted">
                            {completedSteps} / {totalSteps} steps{meta ? ` • ${meta}` : ""}
                          </p>
                          <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-ink/10">
                            <div
                              className="h-full bg-teal-deep transition-all duration-500 ease-out"
                              style={{ width: `${Math.round((completedSteps / (totalSteps || 1)) * 100)}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="shrink-0">
                      {weekLocked ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold text-ink-muted">
                          <Lock aria-hidden="true" className="h-3.5 w-3.5" />
                          Locked
                        </span>
                      ) : (
                        <Link
                          href={`/ubuntu/modules/${selectedModule.id}?week=${week.id}`}
                          className={
                            status === "done"
                              ? "inline-flex items-center gap-1.5 rounded-full border border-teal-deep/30 px-3 py-1.5 text-xs font-semibold text-teal-deep"
                              : "inline-flex items-center gap-1 rounded-full bg-teal-deep px-3.5 py-1.5 text-xs font-semibold text-white"
                          }
                        >
                          {status === "done" ? (
                            <>
                              <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                              Review
                            </>
                          ) : (
                            <>
                              {status === "in_progress" ? "Resume" : "Start"}
                              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                            </>
                          )}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      )}
    </div>
  );
}
