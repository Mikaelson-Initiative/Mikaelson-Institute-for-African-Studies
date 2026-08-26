import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SectionLabel } from "@/components/section-label";
import { Reveal } from "@/components/motion/reveal";
import { SetBreadcrumb } from "@/components/learn/breadcrumb-context";
import { LessonViewer, type NextModuleInfo } from "@/components/learn/lesson-viewer";
import type { StepContentData } from "@/components/learn/step-content";
import { prisma } from "@/lib/prisma";
import { requireCohortAccess } from "@/lib/require-cohort-access";
import { sanitizeQuizForClient, type QuizData } from "@/lib/quiz";

export const metadata: Metadata = {
  title: "Module",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

export default async function LearnModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { session, application, error } = await requireCohortAccess();
  if (error || !session?.user?.id || !application) redirect("/ubuntu/login?denied=1");

  const learningModule = application.cohort!.modules.find((m) => m.id === id);

  // A module belonging to a different cohort, or not yet unlocked, is
  // treated as not existing — a 404 doesn't leak whether the ID is valid
  // elsewhere or unlock at a different time, unlike a distinct redirect would.
  if (!learningModule || learningModule.unlockDate > new Date()) {
    notFound();
  }

  const stepIds = learningModule.steps.map((s) => s.id);
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
        unlocked: nextModuleRaw.unlockDate <= new Date(),
        unlockDate: nextModuleRaw.unlockDate,
      }
    : null;

  // Land on the first not-yet-done step; if everything is already complete,
  // land on the last one so the footer's "Next Step"/"Go to Next Module"
  // control is immediately available on a revisit.
  const firstIncomplete = learningModule.steps.find((s) => !completedStepIdSet.has(s.id));
  const initialActiveStepId = (firstIncomplete ?? learningModule.steps[learningModule.steps.length - 1])?.id ?? null;

  const scoresByStepId: Record<string, number | null> = {};
  const answersByStepId: Record<string, Record<string, string> | null> = {};
  for (const step of learningModule.steps) {
    const progress = progressByStepId.get(step.id);
    scoresByStepId[step.id] = progress?.score ?? null;
    answersByStepId[step.id] = (progress?.answers as Record<string, string> | null) ?? null;
  }

  const stepsForViewer = learningModule.steps.map((step) => ({
    id: step.id,
    type: step.type,
    title: step.title,
    videoProvider: step.videoProvider,
    videoId: step.videoId,
    videoUrl: step.videoUrl,
    audioUrl: step.audioUrl,
    contentMarkdown: step.contentMarkdown,
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
          <p className="mt-3 max-w-3xl text-lg text-ink-muted">{learningModule.description}</p>
        )}
      </Reveal>

      <div className="mt-8">
        <LessonViewer
          steps={stepsForViewer}
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
