import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { SectionLabel } from "@/components/section-label";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { requireCohortAccess } from "@/lib/require-cohort-access";
import { computeModuleProgress, describeSteps, findResumeModule, getCompletedStepIds } from "@/lib/module-progress";

export const metadata: Metadata = {
  title: "Modules",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function LearnModulesPage() {
  const { session, application, error } = await requireCohortAccess();
  if (error || !session?.user?.id || !application) redirect("/learn/login?denied=1");

  const cohort = application.cohort!;
  const modules = cohort.modules;

  const completedStepIds = await getCompletedStepIds(session.user.id, modules.map((m) => m.id));
  const resumeModule = findResumeModule(modules, completedStepIds);
  const now = new Date();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-16 sm:px-6">
      <SectionLabel>{cohort.title}</SectionLabel>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Modules</h1>
      <p className="mt-3 text-lg text-ink-muted">Your cohort&rsquo;s curriculum, in order.</p>

      <StaggerGroup className="relative mt-10 space-y-4 pl-6" staggerChildren={0.05}>
        <div aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-ink/10" />

        {modules.length === 0 && (
          <StaggerItem>
            <p className="rounded-xl border border-ink/10 bg-paper p-4 text-sm text-ink-muted">
              No modules have been published for this cohort yet.
            </p>
          </StaggerItem>
        )}

        {modules.map((moduleItem, index) => {
          const locked = moduleItem.unlockDate > now;
          const { completedSteps, totalSteps, status } = computeModuleProgress(moduleItem, completedStepIds);
          const isCurrent = !locked && resumeModule?.id === moduleItem.id && status !== "done";
          const meta = describeSteps(moduleItem.steps);

          const dotClass = locked
            ? "border-ink/20 bg-paper"
            : status === "done"
              ? "border-teal-deep bg-teal-deep"
              : isCurrent
                ? "border-teal-deep bg-paper"
                : "border-ink/20 bg-paper";

          const cardClass = locked
            ? "border-ink/10 bg-paper/60 opacity-60"
            : status === "done"
              ? "border-ink/10 bg-beige-panel/70"
              : isCurrent
                ? "border-2 border-teal-deep bg-paper shadow-sm"
                : "border-ink/10 bg-paper";

          const card = (
            <div className={`relative rounded-xl border p-5 transition-colors ${cardClass}`}>
              <span
                aria-hidden="true"
                className={`absolute top-6 -left-[29px] h-3.5 w-3.5 rounded-full border-2 ${dotClass}`}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-ledger text-xs text-ink/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {isCurrent && (
                      <span className="rounded-full bg-teal-deep px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white uppercase">
                        {status === "in_progress" ? "In Progress" : "Up Next"}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate font-display text-xl font-semibold text-ink">{moduleItem.title}</p>
                  {locked ? (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                      <Lock aria-hidden="true" className="h-3 w-3" />
                      Unlocks {formatDate(moduleItem.unlockDate)}
                    </p>
                  ) : (
                    <div className="mt-1">
                      <p className="font-mono-ledger text-xs text-ink-muted">
                        {completedSteps} / {totalSteps} steps{meta ? ` • ${meta}` : ""}
                      </p>
                      <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-ink/10">
                        <div
                          className="h-full bg-teal-deep transition-all duration-500 ease-out"
                          style={{ width: `${Math.round((completedSteps / (totalSteps || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {!locked && (
                  <div className="shrink-0">
                    {status === "done" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-deep/30 px-3 py-1.5 text-xs font-semibold text-teal-deep">
                        <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                        Review
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-deep px-3.5 py-1.5 text-xs font-semibold text-white">
                        {status === "in_progress" ? "Continue" : "Start"}
                        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-teal-deep/30 px-3 py-1.5 text-xs font-semibold text-teal-deep">
                        Start
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );

          return (
            <StaggerItem key={moduleItem.id}>
              {locked ? (
                <div aria-disabled="true">{card}</div>
              ) : (
                <Link href={`/learn/modules/${moduleItem.id}`} className="block">
                  {card}
                </Link>
              )}
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </div>
  );
}
