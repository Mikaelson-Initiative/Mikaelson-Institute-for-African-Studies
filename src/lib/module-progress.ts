import { prisma } from "@/lib/prisma";

export type ModuleProgressStatus = "not_started" | "in_progress" | "done";

export type ModuleWithSteps = {
  id: string;
  steps: { id: string }[];
};

export type WeekWithSteps = {
  id: string;
  steps: { id: string }[];
};

export type ModuleWithWeeks = {
  id: string;
  weeks: WeekWithSteps[];
};

// Every module-progress function below still operates on a flat step list —
// callers with the new Module -> Week -> ModuleStep shape flatten through
// this helper rather than each call site reimplementing the flatMap.
export function flattenModuleWeeks<T extends ModuleWithWeeks>(
  moduleItem: T,
): ModuleWithSteps & Omit<T, "weeks"> {
  const { weeks, ...rest } = moduleItem;
  return { ...rest, steps: weeks.flatMap((w) => w.steps) } as ModuleWithSteps & Omit<T, "weeks">;
}

export type ModuleProgress = {
  completedSteps: number;
  totalSteps: number;
  status: ModuleProgressStatus;
};

// A module's "done" state is a derived aggregate over its steps — never
// cached. At this scale (dozens of steps per cohort) recomputing on every
// read is cheap, and a cached flag would just be a second source of truth
// to keep in sync with StepProgress for no real benefit.
export function computeModuleProgress(
  moduleItem: ModuleWithSteps,
  completedStepIds: ReadonlySet<string>,
): ModuleProgress {
  const totalSteps = moduleItem.steps.length;
  const completedSteps = moduleItem.steps.filter((step) => completedStepIds.has(step.id)).length;

  const status: ModuleProgressStatus =
    completedSteps === 0 ? "not_started" : completedSteps === totalSteps && totalSteps > 0 ? "done" : "in_progress";

  return { completedSteps, totalSteps, status };
}

// Same shape as computeModuleProgress — a Week is a { id, steps } list too —
// aliased so call sites read clearly when computing per-week progress for
// the Modules list's week cards.
export const computeWeekProgress = computeModuleProgress;

export async function getCompletedStepIds(userId: string, moduleIds: string[]): Promise<Set<string>> {
  if (moduleIds.length === 0) return new Set();

  const rows = await prisma.stepProgress.findMany({
    where: { userId, completed: true, step: { week: { moduleId: { in: moduleIds } } } },
    select: { stepId: true },
  });

  return new Set(rows.map((row) => row.stepId));
}

// Cohort-wide completion, for the top nav badge and the Space hero card —
// same "all steps done" rule as computeModuleProgress, rolled up across
// every module rather than one.
export function computeCohortPercent(
  modules: ModuleWithSteps[],
  completedStepIds: ReadonlySet<string>,
): number {
  if (modules.length === 0) return 0;
  const doneCount = modules.filter((m) => computeModuleProgress(m, completedStepIds).status === "done").length;
  return (doneCount / modules.length) * 100;
}

// Cohort-level status for the Space card — mirrors computeModuleProgress's
// three states, but "done" only once every module (not just every unlocked
// one) is complete, so a cohort isn't marked Completed while later modules
// are still locked and waiting on their unlock date.
export function computeCohortStatus(
  modules: ModuleWithSteps[],
  completedStepIds: ReadonlySet<string>,
): ModuleProgressStatus {
  if (modules.length === 0) return "not_started";
  const statuses = modules.map((m) => computeModuleProgress(m, completedStepIds).status);
  if (statuses.every((s) => s === "done")) return "done";
  if (statuses.some((s) => s !== "not_started")) return "in_progress";
  return "not_started";
}

export type ModuleWithUnlock = ModuleWithSteps & { unlockDate: Date };

// The module the "Continue Learning" CTA and the Modules list's "current"
// highlight both point to: the first unlocked module that isn't done yet,
// or — once everything unlocked so far is complete — the most recently
// unlocked module, so there's always something sensible to resume/review.
export function findResumeModule<T extends ModuleWithUnlock>(
  modules: T[],
  completedStepIds: ReadonlySet<string>,
): T | null {
  const now = new Date();
  const unlocked = modules.filter((m) => m.unlockDate <= now);
  if (unlocked.length === 0) return null;
  const next = unlocked.find((m) => computeModuleProgress(m, completedStepIds).status !== "done");
  return next ?? unlocked[unlocked.length - 1];
}

const STEP_TYPE_LABELS: Record<string, [singular: string, plural: string]> = {
  video: ["video", "videos"],
  text: ["reading", "readings"],
  file: ["resource", "resources"],
  quiz: ["quiz", "quizzes"],
  masterclass: ["masterclass", "masterclasses"],
};

// A real, derived-from-data summary of a module's contents (e.g. "1 video •
// 2 readings • 1 quiz") for the Modules list — deliberately not an invented
// "45 min read" estimate, since nothing in this schema tracks reading time.
export function describeSteps(steps: { type: string }[]): string {
  const counts = new Map<string, number>();
  for (const step of steps) counts.set(step.type, (counts.get(step.type) ?? 0) + 1);

  const parts: string[] = [];
  for (const [type, count] of counts) {
    const [singular, plural] = STEP_TYPE_LABELS[type] ?? [type, `${type}s`];
    parts.push(`${count} ${count === 1 ? singular : plural}`);
  }
  return parts.join(" • ");
}
