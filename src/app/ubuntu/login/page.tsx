"use client";

import { Suspense, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Step = "email" | "code";

function LearnLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const denied = searchParams.get("denied") === "1";

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/ubuntu/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.message ?? "Couldn't send a code, try again.");
        return;
      }
      setStep("code");
    } catch {
      setError("Couldn't send a code, check your connection and try again.");
    } finally {
      setPending(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setError(null);
    setPending(true);
    try {
      const result = await signIn("email-code", { email, code, redirect: false });
      if (!result || result.error) {
        setError("That code is incorrect or expired.");
        return;
      }
      router.push("/ubuntu/space");
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f8] p-4 text-ink overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    >
      <div className="relative w-full max-w-sm px-4">
        {/* Deliberately no mode="wait" — same reasoning as /signup: async-
            triggered step transitions never fire mode="wait"'s exit-complete
            callback, permanently stalling the flow. Steps cross-fade instead
            of strictly sequencing. */}
        <AnimatePresence>

          {step === "email" && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <div className="mb-10 text-center">
                <h2 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                  Welcome<br />back.
                </h2>
                <p className="mt-4 text-base text-ink-muted">
                  We&rsquo;ll email you a sign-in code, no password needed.
                </p>
              </div>

              {denied && (
                <p role="alert" className="mb-6 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink-muted">
                  This email isn&rsquo;t registered for an active cohort.
                </p>
              )}

              <form className="mt-4 w-full" noValidate onSubmit={handleSubmitEmail}>
                <div className="flex flex-col gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    autoComplete="email"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-center text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                  <Button
                    type="submit"
                    disabled={!email.includes("@") || pending}
                    className={`mt-2 w-full ${email.includes("@") ? "shadow-[0_0_20px_rgba(46,75,70,0.6)]" : ""}`}
                  >
                    Send Code
                  </Button>
                </div>
                {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
              </form>
            </motion.div>
          )}

          {step === "code" && (
            <motion.div
              key="step-code"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => { setError(null); setStep("email"); }} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <h2 className="font-display text-4xl font-medium tracking-tight text-ink">Check your inbox.</h2>
                <p className="mt-4 text-base text-ink-muted">
                  We&rsquo;ve sent a temporary login code to <strong className="font-medium text-ink">{email}</strong>.
                </p>
              </div>
              <form className="mt-2 w-full" onSubmit={handleVerifyCode}>
                <label htmlFor="learn-login-code" className="sr-only">Login Code</label>
                <input
                  id="learn-login-code"
                  type="text"
                  placeholder="000 000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-2xl border border-teal-deep/20 bg-white px-5 py-4 text-center text-3xl tracking-widest text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-2 focus:ring-teal-deep focus:outline-none"
                />
                <Button
                  type="submit"
                  disabled={code.length !== 6 || pending}
                  className={`mt-6 w-full ${code.length === 6 ? "shadow-[0_0_20px_rgba(46,75,70,0.6)]" : ""}`}
                >
                  Verify Code
                </Button>
                {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LearnLoginPage() {
  return (
    <Suspense>
      <LearnLoginForm />
    </Suspense>
  );
}
