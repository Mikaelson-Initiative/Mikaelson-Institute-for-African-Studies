"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitQuiz, type SubmitQuizState } from "@/app/ubuntu/(protected)/modules/[id]/actions";
import type { SanitizedQuizData } from "@/lib/quiz";

export function QuizStep({
  stepId,
  quizData,
  previousScore,
  previousAnswers,
  onGraded,
}: {
  stepId: string;
  quizData: SanitizedQuizData;
  previousScore: number | null;
  previousAnswers: Record<string, string> | null;
  onGraded?: (result: { score: number; total: number }) => void;
}) {
  const boundAction = submitQuiz.bind(null, stepId);
  const initialState: SubmitQuizState =
    previousScore !== null && previousAnswers
      ? { score: previousScore, total: quizData.questions.length, perQuestion: [], answers: previousAnswers }
      : null;
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  // Only fires for a fresh submission this session (perQuestion is only
  // populated then, never on the reconstructed "previously completed" initial
  // state) — tells the lesson viewer this step is now complete so it can
  // update the sidebar checkmark and offer the "Next" control.
  const lastReportedScoreRef = useRef<number | null>(null);
  useEffect(() => {
    if (state && state.perQuestion.length > 0 && lastReportedScoreRef.current !== state.score) {
      lastReportedScoreRef.current = state.score;
      onGraded?.({ score: state.score, total: state.total });
    }
  }, [state, onGraded]);

  const displayAnswers = state?.answers ?? {};

  return (
    <form action={formAction} className="space-y-6">
      {quizData.questions.map((question, questionIndex) => {
        // Only populated right after a fresh submission this session — a
        // revisit shows the prior score/selections but not per-question
        // correctness, since recomputing that safely needs the server (the
        // answer key is never sent to the client).
        const questionResult = state?.perQuestion.find((result) => result.questionId === question.id);

        return (
          <fieldset key={question.id} className="space-y-2">
            <legend className="font-semibold text-ink">
              {questionIndex + 1}. {question.prompt}
            </legend>
            <div className="space-y-1.5">
              {question.options.map((option) => (
                <label key={option.id} className="flex items-center gap-2 text-sm text-ink-muted">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    defaultChecked={displayAnswers[question.id] === option.id}
                    className="h-4 w-4 accent-teal-deep"
                  />
                  {option.text}
                </label>
              ))}
            </div>
            {questionResult && (
              <p
                className={`flex items-center gap-1.5 text-xs font-semibold ${
                  questionResult.correct ? "text-teal-deep" : "text-red-600"
                }`}
              >
                {questionResult.correct ? (
                  <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                ) : (
                  <XCircle aria-hidden="true" className="h-3.5 w-3.5" />
                )}
                {questionResult.correct ? "Correct" : "Incorrect"}
              </p>
            )}
          </fieldset>
        );
      })}

      {state && (
        <p className="font-semibold text-ink">
          You scored {state.score} / {state.total}.
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Submitting…" : state ? "Submit Again" : "Submit Quiz"}
      </Button>
    </form>
  );
}
