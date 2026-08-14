"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Compass,
  FileText,
  Loader2,
  type LucideIcon,
  Mail,
  Type,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { focusAreas } from "@/lib/focus-areas";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
  submissionFieldsSchema,
  type SubmissionFields,
} from "@/lib/validation/submission";

const AUTOSAVE_KEY = "mias-submit-paper-draft";
const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];

function validateFile(file: File): string | null {
  const hasAcceptedExtension = ACCEPTED_EXTENSIONS.some((ext) =>
    file.name.toLowerCase().endsWith(ext),
  );
  if (!ACCEPTED_FILE_TYPES.includes(file.type) && !hasAcceptedExtension) {
    return "File must be a PDF or DOCX.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File must be under 20MB.";
  }
  return null;
}

export function SubmitPaperForm() {
  const shouldReduceMotion = useReducedMotion();
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

  const [focused, setFocused] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const abstract = watch("abstract") ?? "";

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

  function handleFile(candidate: File | null) {
    if (!candidate) {
      setFile(null);
      return;
    }
    const error = validateFile(candidate);
    setFileError(error);
    setFile(error ? null : candidate);
  }

  const onSubmit = async (data: SubmissionFields) => {
    setSubmitError(null);

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
      <motion.div
        role="status"
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-teal-deep/20 bg-paper p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-deep/10"
        >
          <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-teal-deep" />
        </motion.div>
        <div>
          <p className="font-display text-xl font-semibold text-ink">Submission received.</p>
          <p className="mt-1 text-ink-muted">
            Your reference number is{" "}
            <span className="font-mono-ledger text-ink">{submittedId}</span>. A confirmation
            email is on its way — keep it for your records.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <AnimatedField
        index={0}
        label="Title"
        htmlFor="title"
        icon={Type}
        focused={focused === "title"}
        error={errors.title?.message}
      >
        <input
          id="title"
          type="text"
          {...register("title", { onBlur: () => setFocused(null) })}
          onFocus={() => setFocused("title")}
          aria-invalid={Boolean(errors.title)}
          className={inputClasses(Boolean(errors.title))}
        />
      </AnimatedField>

      <div className="grid gap-5 sm:grid-cols-2">
        <AnimatedField
          index={1}
          label="Your name"
          htmlFor="authorName"
          icon={User}
          focused={focused === "authorName"}
          error={errors.authorName?.message}
        >
          <input
            id="authorName"
            type="text"
            autoComplete="name"
            {...register("authorName", { onBlur: () => setFocused(null) })}
            onFocus={() => setFocused("authorName")}
            aria-invalid={Boolean(errors.authorName)}
            className={inputClasses(Boolean(errors.authorName))}
          />
        </AnimatedField>

        <AnimatedField
          index={1}
          label="Email"
          htmlFor="authorEmail"
          icon={Mail}
          focused={focused === "authorEmail"}
          error={errors.authorEmail?.message}
        >
          <input
            id="authorEmail"
            type="email"
            autoComplete="email"
            {...register("authorEmail", { onBlur: () => setFocused(null) })}
            onFocus={() => setFocused("authorEmail")}
            aria-invalid={Boolean(errors.authorEmail)}
            className={inputClasses(Boolean(errors.authorEmail))}
          />
        </AnimatedField>
      </div>

      <AnimatedField
        index={2}
        label="Focus area"
        htmlFor="focusArea"
        icon={Compass}
        focused={focused === "focusArea"}
        error={errors.focusArea?.message}
      >
        <select
          id="focusArea"
          defaultValue=""
          {...register("focusArea", { onBlur: () => setFocused(null) })}
          onFocus={() => setFocused("focusArea")}
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
      </AnimatedField>

      <AnimatedField
        index={3}
        label="Abstract"
        htmlFor="abstract"
        icon={FileText}
        focused={focused === "abstract"}
        error={errors.abstract?.message}
        hint={`${abstract.length}/3000`}
      >
        <textarea
          id="abstract"
          rows={6}
          {...register("abstract", { onBlur: () => setFocused(null) })}
          onFocus={() => setFocused("abstract")}
          aria-invalid={Boolean(errors.abstract)}
          className={inputClasses(Boolean(errors.abstract))}
        />
      </AnimatedField>

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Paper file (PDF or DOCX, up to 20MB)
        </label>
        <label
          htmlFor="file"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingFile(true);
          }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingFile(false);
            handleFile(e.dataTransfer.files?.[0] ?? null);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors duration-150 ${
            fileError
              ? "border-ink bg-paper"
              : isDraggingFile
                ? "border-teal-deep bg-teal-deep/5"
                : "border-ink/20 bg-paper hover:border-teal-deep/50"
          }`}
        >
          <input
            id="file"
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            aria-invalid={Boolean(fileError)}
            className="sr-only"
          />
          {file ? (
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-teal-deep" />
              <span className="max-w-[220px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleFile(null);
                }}
                className="rounded-full p-0.5 text-ink-muted hover:text-ink"
                aria-label="Remove file"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud aria-hidden="true" className="h-6 w-6 text-ink/30" />
              <p className="text-sm text-ink-muted">
                <span className="font-semibold text-teal-deep">Choose a file</span> or drag it here
              </p>
            </>
          )}
        </label>
        {fileError && (
          <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-ink">
            <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            {fileError}
          </p>
        )}
      </motion.div>

      <AnimatePresence>
        {submitError && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-sm font-medium text-ink"
          >
            <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
            {submitError}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          )}
          {isSubmitting ? "Submitting…" : "Submit Paper"}
        </Button>
      </motion.div>
    </form>
  );
}

// Errors are marked by border weight/darkness + an icon + a text label, not by
// a hue shift — the six official brand colors don't include a red, and
// MIAS_Animated_Frontend_PRD.md Sec. 5's `color-not-only` rule applies here
// regardless (MIAS_Design_PRD.md Sec. 2).
function inputClasses(hasError: boolean) {
  return `w-full rounded-lg border bg-paper py-2.5 pl-10 pr-3 text-ink transition-colors duration-150 focus:outline-none ${
    hasError ? "border-2 border-ink" : "border-ink/20 focus:border-teal-deep"
  }`;
}

function AnimatedField({
  index,
  label,
  htmlFor,
  icon: Icon,
  focused,
  error,
  hint,
  children,
}: {
  index: number;
  label: string;
  htmlFor: string;
  icon: LucideIcon;
  focused: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
          {label}
        </label>
        {hint && <span className="font-mono-ledger text-xs text-ink/40">{hint}</span>}
      </div>
      <div className="relative">
        <Icon
          aria-hidden="true"
          className={`pointer-events-none absolute left-3 top-3.5 h-4 w-4 transition-colors duration-200 ${
            focused ? "text-teal-deep" : "text-ink/30"
          }`}
        />
        {children}
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
          className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-teal-deep"
        />
      </div>
      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-ink">
          <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </motion.div>
  );
}
