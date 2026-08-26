"use client";

import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { Calendar, Paperclip, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markdownComponents } from "@/components/learn/markdown-components";
import { isValidYouTubeId } from "@/lib/youtube";
import { QuizStep } from "@/components/learn/quiz-step";
import type { SanitizedQuizData } from "@/lib/quiz";

const YouTubePlayer = dynamic(() =>
  import("@/components/learn/youtube-player").then((mod) => mod.YouTubePlayer),
);

export type MasterclassSession = {
  startsAt: string;
  title: string;
  speakerName: string;
  speakerAffiliation?: string | null;
  speakerBio?: string | null;
  meetingUrl?: string | null;
};

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
  masterclassData: MasterclassSession[] | null;
};

function formatSessionTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

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

    case "masterclass":
      return step.masterclassData && step.masterclassData.length > 0 ? (
        <div className="max-w-3xl space-y-4">
          {step.masterclassData.map((session, i) => (
            <div key={i} className="rounded-2xl border border-ink/10 bg-white p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-teal-deep">
                <Calendar aria-hidden="true" className="h-4 w-4" />
                {formatSessionTime(session.startsAt)}
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">{session.title}</h3>
              <div className="mt-3 flex items-center gap-2 text-sm text-ink">
                <User aria-hidden="true" className="h-4 w-4 text-ink-muted" />
                <span className="font-medium">{session.speakerName}</span>
                {session.speakerAffiliation && (
                  <span className="text-ink-muted">— {session.speakerAffiliation}</span>
                )}
              </div>
              {session.speakerBio && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{session.speakerBio}</p>}
              {session.meetingUrl && (
                <Button href={session.meetingUrl} variant="secondary" className="mt-4">
                  Join Masterclass
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-muted">No masterclass has been scheduled for this step yet.</p>
      );

    default:
      return null;
  }
}
