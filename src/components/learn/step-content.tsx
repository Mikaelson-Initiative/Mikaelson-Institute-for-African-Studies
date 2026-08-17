"use client";

import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markdownComponents } from "@/components/learn/markdown-components";
import { isValidYouTubeId } from "@/lib/youtube";
import { QuizStep } from "@/components/learn/quiz-step";
import type { SanitizedQuizData } from "@/lib/quiz";

const YouTubePlayer = dynamic(() =>
  import("@/components/learn/youtube-player").then((mod) => mod.YouTubePlayer),
);

export type StepContentData = {
  id: string;
  type: string;
  title: string;
  videoProvider: string | null;
  videoId: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  contentMarkdown: string | null;
  fileUrl: string | null;
  fileName: string | null;
  quizData: unknown;
};

// Pure content renderer for a single step, by type — no accordion chrome and
// no "mark complete" control of its own; the lesson viewer owns navigation
// and completion state so a step reads the same whether it's the only thing
// on screen (desktop split-view) or one of several (mobile stacked view).
export function StepContent({
  step,
  score,
  answers,
  onGraded,
}: {
  step: StepContentData;
  score: number | null;
  answers: Record<string, string> | null;
  onGraded?: (result: { score: number; total: number }) => void;
}) {
  switch (step.type) {
    case "video":
      return (
        <div>
          {step.videoProvider === "youtube" && step.videoId && isValidYouTubeId(step.videoId) ? (
            <YouTubePlayer videoId={step.videoId} title={step.title} />
          ) : step.videoUrl ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video controls className="w-full rounded-2xl border border-ink/10" src={step.videoUrl} />
          ) : (
            <p className="text-sm text-ink-muted">No video has been added to this step yet.</p>
          )}
          {step.audioUrl && <audio controls className="mt-4 w-full" src={step.audioUrl} />}
        </div>
      );

    case "text":
      return (
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-ink">
          <ReactMarkdown components={markdownComponents}>
            {step.contentMarkdown || "Content for this module has not been added yet."}
          </ReactMarkdown>
        </div>
      );

    case "file":
      return step.fileUrl ? (
        <Button href={step.fileUrl} variant="secondary">
          <Paperclip aria-hidden="true" className="h-4 w-4" />
          Download {step.fileName ?? "file"}
        </Button>
      ) : (
        <p className="text-sm text-ink-muted">No file has been attached to this step yet.</p>
      );

    case "quiz":
      return (
        <QuizStep
          stepId={step.id}
          quizData={step.quizData as SanitizedQuizData}
          previousScore={score}
          previousAnswers={answers}
          onGraded={onGraded}
        />
      );

    default:
      return null;
  }
}
