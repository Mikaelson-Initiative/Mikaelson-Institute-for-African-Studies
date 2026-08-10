"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactFields } from "@/lib/validation/contact";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFields>({ resolver: zodResolver(contactSchema), mode: "onBlur" });

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
      <div role="status" className="flex items-start gap-3 rounded-lg border border-teal-deep bg-paper p-6">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-teal-deep" />
        <p className="text-ink">Message sent — we&rsquo;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          aria-invalid={Boolean(errors.name)}
          className={inputClasses(Boolean(errors.name))}
        />
        {errors.name && <FieldError message={errors.name.message} />}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          aria-invalid={Boolean(errors.email)}
          className={inputClasses(Boolean(errors.email))}
        />
        {errors.email && <FieldError message={errors.email.message} />}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          aria-invalid={Boolean(errors.message)}
          className={inputClasses(Boolean(errors.message))}
        />
        {errors.message && <FieldError message={errors.message.message} />}
      </div>

      {submitError && (
        <p role="alert" className="flex items-center gap-2 text-sm font-medium text-ink">
          <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

function inputClasses(hasError: boolean) {
  return `w-full rounded border bg-paper px-3 py-2 text-ink transition-colors duration-150 focus:outline-none focus-visible:outline-2 focus-visible:outline-turquoise ${
    hasError ? "border-2 border-ink" : "border-ink/20 focus:border-teal-deep"
  }`;
}

function FieldError({ message }: { message?: string }) {
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-ink">
      <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}
