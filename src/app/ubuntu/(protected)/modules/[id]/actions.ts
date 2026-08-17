"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCohortAccess } from "@/lib/require-cohort-access";
import { gradeQuiz, type QuizData } from "@/lib/quiz";

async function loadStepForAccessCheck(stepId: string) {
  const { session, application, error } = await requireCohortAccess();
  if (error || !session?.user?.id || !application) {
    redirect("/ubuntu/login?denied=1");
  }

  const step = await prisma.moduleStep.findUnique({
    where: { id: stepId },
    include: { module: true },
  });

  if (!step || step.module.cohortId !== application.cohort!.id || step.module.unlockDate > new Date()) {
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
  revalidatePath(`/ubuntu/modules/${step.moduleId}`);
}

export type SubmitQuizState = {
  score: number;
  total: number;
  perQuestion: { questionId: string; correct: boolean }[];
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
    redirect(`/ubuntu/modules/${step.moduleId}`);
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
  revalidatePath(`/ubuntu/modules/${step.moduleId}`);

  return { score: result.score, total: result.total, perQuestion: result.perQuestion, answers };
}
