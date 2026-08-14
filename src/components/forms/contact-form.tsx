"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Mail, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactFields } from "@/lib/validation/contact";

const fieldMeta = [
  { name: "name" as const, label: "Name", type: "text", icon: User, autoComplete: "name" },
  { name: "email" as const, label: "Email", type: "email", icon: Mail, autoComplete: "email" },
];

export function ContactForm() {
  const shouldReduceMotion = useReducedMotion();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFields>({ resolver: zodResolver(contactSchema), mode: "onBlur" });

  const [focused, setFocused] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: ContactFields) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        setSubmitError("Fix the highlighted fields and try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Couldn't reach the server. Check your connection and try again.");
    }
  };

  if (submitted) {
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
          <p className="font-display text-xl font-semibold text-ink">Message sent.</p>
          <p className="mt-1 text-ink-muted">We&rsquo;ll be in touch soon.</p>
        </div>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 text-sm font-semibold text-teal-deep hover:underline focus:outline-none"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {fieldMeta.map((field, i) => {
        const Icon = field.icon;
        const hasError = Boolean(errors[field.name]);
        return (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-ink">
              {field.label}
            </label>
            <div className="relative">
              <Icon
                aria-hidden="true"
                className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                  focused === field.name ? "text-teal-deep" : "text-ink/30"
                }`}
              />
              <input
                id={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                {...register(field.name, {
                  onBlur: () => setFocused(null),
                })}
                onFocus={() => setFocused(field.name)}
                aria-invalid={hasError}
                className={`w-full rounded-lg border bg-paper py-2.5 pl-10 pr-3 text-ink transition-colors duration-150 focus:outline-none ${
                  hasError ? "border-2 border-ink" : "border-ink/20 focus:border-teal-deep"
                }`}
              />
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{ scaleX: focused === field.name ? 1 : 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0 }}
                className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-teal-deep"
              />
            </div>
            <AnimatePresence>
              {errors[field.name] && <FieldError message={errors[field.name]?.message} />}
            </AnimatePresence>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          Message
        </label>
        <div className="relative">
          <MessageSquare
            aria-hidden="true"
            className={`pointer-events-none absolute left-3 top-3 h-4 w-4 transition-colors duration-200 ${
              focused === "message" ? "text-teal-deep" : "text-ink/30"
            }`}
          />
          <textarea
            id="message"
            rows={5}
            {...register("message", { onBlur: () => setFocused(null) })}
            onFocus={() => setFocused("message")}
            aria-invalid={Boolean(errors.message)}
            className={`w-full rounded-lg border bg-paper py-2.5 pl-10 pr-3 text-ink transition-colors duration-150 focus:outline-none ${
              errors.message ? "border-2 border-ink" : "border-ink/20 focus:border-teal-deep"
            }`}
          />
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{ scaleX: focused === "message" ? 1 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-teal-deep"
          />
        </div>
        <AnimatePresence>
          {errors.message && <FieldError message={errors.message.message} />}
        </AnimatePresence>
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
        transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
      >
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          )}
          {isSubmitting ? "Sending…" : "Send Message"}
        </Button>
      </motion.div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  return (
    <motion.p
      role="alert"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-ink"
    >
      <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {message}
    </motion.p>
  );
}
