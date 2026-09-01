import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SectionLabel } from "@/components/section-label";
import { Reveal } from "@/components/motion/reveal";
import { SetBreadcrumb } from "@/components/learn/breadcrumb-context";
import { LessonViewer, type NextModuleInfo } from "@/components/learn/lesson-viewer";
import type { StepContentData } from "@/components/learn/step-content";
import { prisma } from "@/lib/prisma";
import { isWeekLocked } from "@/lib/module-progress";
import { requireCohortAccess } from "@/lib/require-cohort-access";
import { sanitizeQuizForClient, type QuizData } from "@/lib/quiz";
import type { StepBlock } from "@/lib/step-blocks";

export const metadata: Metadata = {
  title: "Module",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

export default async function LearnModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ week?: string }>;
}) {
  const { id } = await params;
  const { week: requestedWeekId } = await searchParams;
  const { session, application, hasPreviewAccess, error } = await requireCohortAccess();
  if (error || !session?.user?.id || !application) redirect("/ubuntu/login?denied=1");

  const learningModule = application.cohort!.modules.find((m) => m.id === id);

  // A module belonging to a different cohort, or not yet unlocked, is
  // treated as not existing — a 404 doesn't leak whether the ID is valid
  // elsewhere or unlock at a different time, unlike a distinct redirect would.
  // hasPreviewAccess (LMS_PREVIEW_EMAILS) bypasses the unlock gate entirely.
  if (!learningModule || (!hasPreviewAccess && learningModule.unlockDate > new Date())) {
    notFound();
  }

  // Steps stay a flat, ordered list across weeks — the lesson viewer's
  // single-active-step navigation is unchanged; weeks only add a group
  // label per step for the sidebar. A week whose startDate hasn't arrived
  // yet locks its own steps even though the module itself is unlocked —
  // hasPreviewAccess bypasses this the same way it bypasses module locks.
  const weeks = learningModule.weeks;
  const allSteps = weeks.flatMap((w) => w.steps);
  const weekLabelByStepId: Record<string, string> = {};
  const lockedStepIds: string[] = [];
  const weekUnlockDateByStepId: Record<string, Date | null> = {};
  weeks.forEach((w, weekIndex) => {
    // Only calendar-paced modules (real startDate) get a "Week N" prefix —
    // "Welcome to Ubuntu" is a one-time onboarding flow, not a weekly
    // curriculum, so its sections stay plain titles.
    const label = w.startDate ? `Week ${weekIndex + 1}: ${w.title}` : w.title;
    const locked = isWeekLocked(w, hasPreviewAccess);
    for (const s of w.steps) {
      weekLabelByStepId[s.id] = label;
      if (locked) {
        lockedStepIds.push(s.id);
        weekUnlockDateByStepId[s.id] = w.startDate;
      }
    }
  });
  const lockedStepIdSet = new Set(lockedStepIds);

  const stepIds = allSteps.map((s) => s.id);
  const stepProgress = await prisma.stepProgress.findMany({
    where: { userId: session.user.id, stepId: { in: stepIds } },
  });
  const progressByStepId = new Map(stepProgress.map((p) => [p.stepId, p]));

  const completedStepIds = stepProgress.filter((p) => p.completed).map((p) => p.stepId);
  const completedStepIdSet = new Set(completedStepIds);

  const nextModuleRaw = application.cohort!.modules.find((m) => m.orderIndex > learningModule.orderIndex);
  const nextModule: NextModuleInfo = nextModuleRaw
    ? {
        id: nextModuleRaw.id,
        title: nextModuleRaw.title,
        unlocked: hasPreviewAccess || nextModuleRaw.unlockDate <= new Date(),
        unlockDate: nextModuleRaw.unlockDate,
      }
    : null;

  // A "?week=" link from the Modules list lands on that week's first
  // incomplete step; otherwise land on the first not-yet-done step in the
  // whole module, or the last one if everything is already complete, so the
  // footer's "Next Step"/"Go to Next Module" control is immediately
  // available on a revisit.
  const requestedWeek = requestedWeekId ? weeks.find((w) => w.id === requestedWeekId) : null;
  const searchScope = requestedWeek?.steps ?? allSteps;
  const firstAccessibleIncomplete = searchScope.find(
    (s) => !completedStepIdSet.has(s.id) && !lockedStepIdSet.has(s.id),
  );
  const lastAccessible = [...searchScope].reverse().find((s) => !lockedStepIdSet.has(s.id));
  const initialActiveStepId = (firstAccessibleIncomplete ?? lastAccessible ?? searchScope[0])?.id ?? null;

  const scoresByStepId: Record<string, number | null> = {};
  const answersByStepId: Record<string, Record<string, string> | null> = {};
  for (const step of allSteps) {
    const progress = progressByStepId.get(step.id);
    scoresByStepId[step.id] = progress?.score ?? null;
    answersByStepId[step.id] = (progress?.answers as Record<string, string> | null) ?? null;
  }

  const stepsForViewer = allSteps.map((step) => ({
    id: step.id,
    type: step.type,
    title: step.title,
    videoProvider: step.videoProvider,
    videoId: step.videoId,
    videoUrl: step.videoUrl,
    audioUrl: step.audioUrl,
    introMarkdown: step.introMarkdown,
    contentMarkdown: step.contentMarkdown,
    contentBlocks: step.contentBlocks as StepBlock[] | null,
    pdfUrl: step.pdfUrl,
    pdfName: step.pdfName,
    fileUrl: step.fileUrl,
    fileName: step.fileName,
    quizData: step.quizData ? sanitizeQuizForClient(step.quizData as unknown as QuizData) : null,
    masterclassData: step.masterclassData as StepContentData["masterclassData"],
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-16 sm:px-6">
      <SetBreadcrumb trail={[{ label: application.cohort!.title }, { label: learningModule.title }]} />

      <Reveal>
        <SectionLabel>{application.cohort!.title}</SectionLabel>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">{learningModule.title}</h1>
        {learningModule.description && (
          <p className="mt-3 max-w-3xl whitespace-pre-line text-lg text-ink-muted">{learningModule.description}</p>
        )}
      </Reveal>

      <div className="mt-8">
        <LessonViewer
          steps={stepsForViewer}
          weekLabelByStepId={weekLabelByStepId}
          lockedStepIds={lockedStepIds}
          weekUnlockDateByStepId={weekUnlockDateByStepId}
          initialCompletedStepIds={completedStepIds}
          scoresByStepId={scoresByStepId}
          answersByStepId={answersByStepId}
          initialActiveStepId={initialActiveStepId}
          nextModule={nextModule}
        />
      </div>
    </div>
  );
}
