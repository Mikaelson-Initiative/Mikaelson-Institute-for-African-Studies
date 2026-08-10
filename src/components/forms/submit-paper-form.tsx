"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { focusAreas } from "@/lib/focus-areas";
import { submissionFieldsSchema, type SubmissionFields } from "@/lib/validation/submission";

const AUTOSAVE_KEY = "mias-submit-paper-draft";

export function SubmitPaperForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFields>({
    resolver: zodResolver(submissionFieldsSchema),
    mode: "onBlur",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Autosave the text fields (not the file) so a long abstract survives an
  // accidental tab close — per MIAS_Animated_Frontend_PRD.md Sec. 3, "autosave
  // for the longer submission form".
  useEffect(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        reset(JSON.parse(saved));
      } catch {
        // ignore malformed draft
      }
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: SubmissionFields) => {
    setSubmitError(null);
    setFileError(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setFileError("Attach a PDF or DOCX file.");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    formData.append("file", file);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });
      const body = await response.json();

      if (!response.ok) {
        setFileError(body.fieldErrors?.file?.[0] ?? null);
        setSubmitError(
          body.fieldErrors ? "Fix the highlighted fields and try again." : "Something went wrong. Please try again.",
        );
        return;
      }

      localStorage.removeItem(AUTOSAVE_KEY);
      setSubmittedId(body.id);
    } catch {
      setSubmitError("Couldn't reach the server. Check your connection and try again.");
    }
  };

  if (submittedId) {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-lg border border-teal-deep bg-paper p-6"
      >
        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-teal-deep" />
        <div>
          <p className="font-display text-lg font-semibold text-ink">Submission received.</p>
          <p className="mt-1 text-ink-muted">
            Your reference number is{" "}
            <span className="font-mono-ledger text-ink">{submittedId}</span>. A confirmation
            email is on its way — keep it for your records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Field label="Title" htmlFor="title" error={errors.title?.message}>
        <input
          id="title"
          type="text"
          {...register("title")}
          aria-invalid={Boolean(errors.title)}
          className={inputClasses(Boolean(errors.title))}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" htmlFor="authorName" error={errors.authorName?.message}>
          <input
            id="authorName"
            type="text"
            {...register("authorName")}
            aria-invalid={Boolean(errors.authorName)}
            className={inputClasses(Boolean(errors.authorName))}
          />
        </Field>

        <Field label="Email" htmlFor="authorEmail" error={errors.authorEmail?.message}>
          <input
            id="authorEmail"
            type="email"
            {...register("authorEmail")}
            aria-invalid={Boolean(errors.authorEmail)}
            className={inputClasses(Boolean(errors.authorEmail))}
          />
        </Field>
      </div>

      <Field label="Focus area" htmlFor="focusArea" error={errors.focusArea?.message}>
        <select
          id="focusArea"
          defaultValue=""
          {...register("focusArea")}
          aria-invalid={Boolean(errors.focusArea)}
          className={inputClasses(Boolean(errors.focusArea))}
        >
          <option value="" disabled>
            Choose one
          </option>
          {focusAreas.map((area) => (
            <option key={area.slug} value={area.slug}>
              {area.title}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Abstract" htmlFor="abstract" error={errors.abstract?.message}>
        <textarea
          id="abstract"
          rows={6}
          {...register("abstract")}
          aria-invalid={Boolean(errors.abstract)}
          className={inputClasses(Boolean(errors.abstract))}
        />
      </Field>

      <Field label="Paper file (PDF or DOCX, up to 20MB)" htmlFor="file" error={fileError ?? undefined}>
        <input
          id="file"
          type="file"
          ref={fileInputRef}
          accept=".pdf,.docx"
          aria-invalid={Boolean(fileError)}
          className={inputClasses(Boolean(fileError))}
        />
      </Field>

      {submitError && (
        <p role="alert" className="flex items-center gap-2 text-sm font-medium text-ink">
          <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
        {isSubmitting ? "Submitting…" : "Submit Paper"}
      </Button>
    </form>
  );
}

// Errors are marked by border weight/darkness + an icon + a text label, not by
// a hue shift — the six official brand colors don't include a red, and
// MIAS_Animated_Frontend_PRD.md Sec. 5's `color-not-only` rule applies here
// regardless (MIAS_Design_PRD.md Sec. 2).
function inputClasses(hasError: boolean) {
  return `w-full rounded border bg-paper px-3 py-2 text-ink transition-colors duration-150 focus:outline-none focus-visible:outline-2 focus-visible:outline-turquoise ${
    hasError ? "border-2 border-ink" : "border-ink/20 focus:border-teal-deep"
  }`;
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-ink">
          <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
