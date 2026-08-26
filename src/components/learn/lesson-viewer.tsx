"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileText,
  HelpCircle,
  Lock,
  Menu,
  Mic,
  Paperclip,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepContent, type StepContentData } from "@/components/learn/step-content";
import { markStepComplete } from "@/app/ubuntu/(protected)/modules/[id]/actions";

const TYPE_ICONS = {
  video: Video,
  text: FileText,
  file: Paperclip,
  quiz: HelpCircle,
  masterclass: Mic,
} as const;

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export type NextModuleInfo = { id: string; title: string; unlocked: boolean; unlockDate: Date } | null;

// The split-screen lesson reader: a step-tree sidebar plus a single focused
// reading pane for whichever step is active, with a footer action bar that
// marks the active step complete and advances — to the next step, across
// into the next module, or (at the very end) an inline completion banner.
// Completion state lives client-side (seeded from the server) so the
// sidebar checkmarks and step counter update instantly without a reload.
export function LessonViewer({
  steps,
  initialCompletedStepIds,
  scoresByStepId,
  answersByStepId,
  initialActiveStepId,
  nextModule,
}: {
  steps: StepContentData[];
  initialCompletedStepIds: string[];
  scoresByStepId: Record<string, number | null>;
  answersByStepId: Record<string, Record<string, string> | null>;
  initialActiveStepId: string | null;
  nextModule: NextModuleInfo;
}) {
  const router = useRouter();
  const [completedStepIds, setCompletedStepIds] = useState<Set<string>>(new Set(initialCompletedStepIds));
  const [activeStepId, setActiveStepId] = useState<string | null>(initialActiveStepId ?? steps[0]?.id ?? null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [isPending, startTransition] = useTransition();

  const activeIndex = steps.findIndex((s) => s.id === activeStepId);
  const activeStep = activeIndex >= 0 ? steps[activeIndex] : null;
  const completedCount = steps.filter((s) => completedStepIds.has(s.id)).length;
  const isActiveCompleted = activeStep ? completedStepIds.has(activeStep.id) : false;
  const isLastStep = activeIndex === steps.length - 1;

  function goToStep(stepId: string) {
    setActiveStepId(stepId);
    setReachedEnd(false);
    setSidebarOpen(false);
  }

  function advance() {
    const next = steps[activeIndex + 1];
    if (next) {
      setActiveStepId(next.id);
      setSidebarOpen(false);
      return;
    }
    if (nextModule?.unlocked) {
      router.push(`/ubuntu/modules/${nextModule.id}`);
      return;
    }
    setReachedEnd(true);
  }

  function handleMarkComplete(stepId: string) {
    startTransition(async () => {
      await markStepComplete(stepId);
      setCompletedStepIds((prev) => new Set(prev).add(stepId));
      advance();
    });
  }

  if (steps.length === 0) {
    return (
      <p className="rounded-xl border border-ink/10 bg-paper p-4 text-sm text-ink-muted">
        No content has been added to this module yet.
      </p>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
      <button
        type="button"
        onClick={() => setSidebarOpen((value) => !value)}
        className="mb-4 flex w-full items-center justify-between rounded-xl border border-ink/10 bg-paper p-4 text-left lg:hidden"
      >
        <span className="flex items-center gap-2 font-semibold text-ink">
          <Menu aria-hidden="true" className="h-4 w-4" />
          Lesson Contents
        </span>
        <span className="font-mono-ledger text-xs text-ink-muted">
          {completedCount} / {steps.length}
        </span>
      </button>

      <aside
        className={`${sidebarOpen ? "block" : "hidden"} mb-4 lg:sticky lg:top-20 lg:mb-0 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto`}
      >
        <nav aria-label="Lesson steps" className="space-y-1 rounded-xl border border-ink/10 bg-paper p-3">
          {steps.map((step, index) => {
            const Icon = TYPE_ICONS[step.type as keyof typeof TYPE_ICONS] ?? FileText;
            const done = completedStepIds.has(step.id);
            const active = step.id === activeStepId;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => goToStep(step.id)}
                aria-current={active ? "step" : undefined}
                className={`flex w-full items-center gap-2.5 rounded-lg p-2.5 text-left text-sm transition-colors ${
                  active ? "bg-teal-deep/10" : "hover:bg-beige-panel"
                }`}
              >
                <span className="font-mono-ledger text-xs text-ink/40">{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 ${active ? "text-teal-deep" : "text-ink-muted"}`} />
                <span className={`min-w-0 flex-1 truncate ${active ? "font-semibold text-teal-deep" : "text-ink"}`}>
                  {step.title}
                </span>
                {done ? (
                  <CheckCircle2 aria-label="Completed" className="h-4 w-4 shrink-0 text-teal-deep" />
                ) : (
                  <Circle aria-label="Not completed" className="h-4 w-4 shrink-0 text-ink/20" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        <div className="mb-4">
          <Button href="/ubuntu/modules" variant="ghost" className="text-sm -ml-4">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to Modules
          </Button>
        </div>
        <p className="mb-3 hidden font-mono-ledger text-xs text-ink-muted lg:block">
          {completedCount} / {steps.length} steps complete
        </p>

        {activeStep && (
          <div className="rounded-2xl border border-ink/10 bg-paper p-6 sm:p-8">
            <p className="font-mono-ledger text-xs text-ink-muted">
              Step {activeIndex + 1} of {steps.length}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">{activeStep.title}</h2>

            <div className="mt-6">
              <StepContent
                step={activeStep}
                score={scoresByStepId[activeStep.id] ?? null}
                answers={answersByStepId[activeStep.id] ?? null}
                onGraded={() => setCompletedStepIds((prev) => new Set(prev).add(activeStep.id))}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col items-stretch gap-3 rounded-2xl border border-ink/10 bg-paper p-4 sm:flex-row sm:items-center sm:justify-end">

          {activeStep && activeStep.type !== "quiz" && !isActiveCompleted && (
            <Button
              type="button"
              variant="primary"
              disabled={isPending}
              onClick={() => handleMarkComplete(activeStep.id)}
              className="text-sm"
            >
              {isPending ? "Saving…" : "Mark as Complete & Next"}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          )}

          {activeStep && isActiveCompleted && !isLastStep && (
            <Button type="button" variant="primary" onClick={advance} className="text-sm">
              Next Step
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          )}

          {activeStep && isActiveCompleted && isLastStep && !reachedEnd && (
            <Button type="button" variant="primary" onClick={advance} className="text-sm">
              {nextModule?.unlocked ? "Go to Next Module" : "Finish Module"}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          )}
        </div>

        {reachedEnd &&
          (nextModule ? (
            <div className="mt-4 rounded-2xl border border-ink/10 bg-paper p-6 text-center">
              <p className="flex items-center justify-center gap-2 text-sm text-ink-muted">
                <Lock aria-hidden="true" className="h-4 w-4" />
                Next module ({nextModule.title}) unlocks {formatDate(nextModule.unlockDate)}
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-ink/10 bg-paper p-6 text-center">
              <p className="text-sm font-semibold text-teal-deep">
                You&rsquo;ve reached the end of this cohort&rsquo;s curriculum.
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
