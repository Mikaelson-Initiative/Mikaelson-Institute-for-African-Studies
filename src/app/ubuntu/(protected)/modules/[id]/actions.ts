"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isWeekLocked } from "@/lib/module-progress";
import { requireCohortAccess } from "@/lib/require-cohort-access";
import { gradeQuiz, type QuizData } from "@/lib/quiz";
import type { PollAnswers, ReflectionAnswers } from "@/lib/step-blocks";

async function loadStepForAccessCheck(stepId: string) {
  const { session, application, hasPreviewAccess, error } = await requireCohortAccess();
  if (error || !session?.user?.id || !application) {
    redirect("/ubuntu/login?denied=1");
  }

  const step = await prisma.moduleStep.findUnique({
    where: { id: stepId },
    include: { week: { include: { module: true } } },
  });

  if (
    !step ||
    step.week.module.cohortId !== application.cohort!.id ||
    (!hasPreviewAccess && step.week.module.unlockDate > new Date()) ||
    isWeekLocked(step.week, hasPreviewAccess)
  ) {
    redirect("/ubuntu/modules");
  }

  return { userId: session.user.id, step };
}

// Never trusts that the page which rendered this form already checked
// access — re-verifies session, cohort match, and unlock date
// independently, since a Server Action is a directly callable endpoint in
// its own right.
//
// Called directly from the client (LessonViewer), not via a form action — it
// no longer redirects; the lesson viewer owns step-to-step navigation
// client-side and only needs the DB write + revalidation here.
export async function markStepComplete(stepId: string) {
  const { userId, step } = await loadStepForAccessCheck(stepId);

  await prisma.stepProgress.upsert({
    where: { userId_stepId: { userId, stepId } },
    create: { userId, stepId, completed: true, completedAt: new Date() },
    update: { completed: true, completedAt: new Date() },
  });

  revalidatePath("/ubuntu/space");
  revalidatePath("/ubuntu/modules");
  revalidatePath(`/ubuntu/modules/${step.week.moduleId}`);
}

export type SubmitQuizState = {
  score: number;
  total: number;
  perQuestion: { questionId: string; correct: boolean; feedback?: string }[];
  answers: Record<string, string>;
} | null;

// Grades server-side from the step's own stored quizData — a client can
// never claim "I got this right"; only the option id it selected is
// trusted, correctness is always re-looked-up here.
export async function submitQuiz(
  stepId: string,
  _prevState: SubmitQuizState,
  formData: FormData,
): Promise<SubmitQuizState> {
  const { userId, step } = await loadStepForAccessCheck(stepId);

  if (step.type !== "quiz" || !step.quizData) {
    redirect(`/ubuntu/modules/${step.week.moduleId}`);
  }

  const quizData = step.quizData as unknown as QuizData;
  const answers: Record<string, string> = {};
  for (const question of quizData.questions) {
    const selected = formData.get(question.id);
    if (typeof selected === "string") answers[question.id] = selected;
  }

  const result = gradeQuiz(quizData, answers);

  await prisma.stepProgress.upsert({
    where: { userId_stepId: { userId, stepId } },
    create: { userId, stepId, completed: true, completedAt: new Date(), score: result.score, answers },
    update: { completed: true, completedAt: new Date(), score: result.score, answers },
  });

  revalidatePath("/ubuntu/space");
  revalidatePath("/ubuntu/modules");
  revalidatePath(`/ubuntu/modules/${step.week.moduleId}`);

  return { score: result.score, total: result.total, perQuestion: result.perQuestion, answers };
}

export type SubmitReflectionState = ReflectionAnswers | null;

// A reflection has no right answer to grade — unlike submitQuiz, this just
// persists what the student typed/checked. Completion is still gated
// client-side (all pledges checked, text non-empty) before the form can
// even submit; see the reflection block component.
export async function submitReflection(
  stepId: string,
  _prevState: SubmitReflectionState,
  formData: FormData,
): Promise<SubmitReflectionState> {
  const { userId, step } = await loadStepForAccessCheck(stepId);

  const text = String(formData.get("reflectionText") ?? "").trim();
  const pledgeCount = Number(formData.get("pledgeCount") ?? 0);
  const pledge = Array.from({ length: pledgeCount }, (_, i) => formData.get(`pledge-${i}`) === "on");
  const answers: ReflectionAnswers = { text, pledge };

  await prisma.stepProgress.upsert({
    where: { userId_stepId: { userId, stepId } },
    create: { userId, stepId, completed: true, completedAt: new Date(), answers },
    update: { completed: true, completedAt: new Date(), answers },
  });

  revalidatePath("/ubuntu/space");
  revalidatePath("/ubuntu/modules");
  revalidatePath(`/ubuntu/modules/${step.week.moduleId}`);

  return answers;
}

export type SubmitPollState = PollAnswers | null;

// An ungraded, single-select self-check — there's no right answer, so this
// just records what the student picked (for their own revisit, not for
// grading) and marks the step complete.
export async function submitPoll(
  stepId: string,
  _prevState: SubmitPollState,
  formData: FormData,
): Promise<SubmitPollState> {
  const { userId, step } = await loadStepForAccessCheck(stepId);

  const selected = String(formData.get("selected") ?? "");
  const answers: PollAnswers = { selected };

  await prisma.stepProgress.upsert({
    where: { userId_stepId: { userId, stepId } },
    create: { userId, stepId, completed: true, completedAt: new Date(), answers },
    update: { completed: true, completedAt: new Date(), answers },
  });

  revalidatePath("/ubuntu/space");
  revalidatePath("/ubuntu/modules");
  revalidatePath(`/ubuntu/modules/${step.week.moduleId}`);

  return answers;
}
