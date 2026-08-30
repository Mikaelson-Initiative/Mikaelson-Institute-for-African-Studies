"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cohortDonationTiers, formatNaira } from "@/lib/cohort-donation-tiers";

type Step = "email" | "code" | "name" | "details" | "q1" | "q2" | "about" | "motivation" | "donate" | "success" | "login" | "already_applied";
type FlowType = "signup" | "login";

const GENDER_CHOICES = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

async function decideNextStep(): Promise<Step> {
  const response = await fetch("/api/cohort-application");
  if (!response.ok) return "email";
  const data = (await response.json()) as { hasApplication: boolean; name: string | null };
  if (data.hasApplication) return "already_applied";
  return data.name ? "details" : "name";
}

export default function SignupClient() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState<Step>("email");
  const [flowType, setFlowType] = useState<FlowType>("signup");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Application data
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [nationality, setNationality] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [firstTimeStudying, setFirstTimeStudying] = useState<string | null>(null);
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);
  const [about, setAbout] = useState("");
  const [motivation, setMotivation] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  // Google sign-in is a full-page redirect back to /signup — once the
  // session lands, decide whether this is a first-time applicant (skip
  // straight to the "about" question, no name step, since Google already
  // gives us a real name) or a returning member.
  useEffect(() => {
    if (status !== "authenticated") return;
    decideNextStep().then(setStep);
  }, [status]);

  const requestCode = async (nextFlowType: FlowType) => {
    setError(null);
    setPending(true);
    setFlowType(nextFlowType);
    try {
      const response = await fetch("/api/auth/send-code", {
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

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) requestCode("signup");
  };

  const handleSubmitLoginEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) requestCode("login");
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
      setStep(await decideNextStep());
    } finally {
      setPending(false);
    }
  };

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setStep("details");
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim() && gender && nationality.trim() && stateOfOrigin.trim()) {
      setStep("q1");
    }
  };

  const handleQ1 = (answer: string) => {
    setFirstTimeStudying(answer);
    setStep("q2");
  };

  const handleQ2 = (answer: string) => {
    setPrimaryGoal(answer);
    setStep("about");
  };

  const handleSubmitAbout = (e: React.FormEvent) => {
    e.preventDefault();
    if (about.trim().length >= 20) setStep("motivation");
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (motivation.trim().length < 20 || !firstTimeStudying || !primaryGoal) return;
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/cohort-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          phoneNumber,
          gender,
          nationality,
          stateOfOrigin,
          additionalInfo: additionalInfo || undefined,
          firstTimeStudying,
          primaryGoal,
          about,
          motivation,
        }),
      });
      if (!response.ok) {
        setError("Couldn't submit your application, try again.");
        return;
      }
      setStep("donate");
    } finally {
      setPending(false);
    }
  };

  const handleSelectDonationTier = async (tier: string, amount: number) => {
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/cohort-donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, tier }),
      });
      const body = await response.json();
      if (!response.ok || !body.authorizationUrl) {
        setError("Couldn't start the payment, try again.");
        return;
      }
      window.location.assign(body.authorizationUrl);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
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
      {/* Sign In Content Container */}
      <div className="relative w-full max-w-sm px-4">
        {/* Deliberately no mode="wait" — every step transition here is
            triggered from an async handler (after an awaited fetch/signIn
            call), not synchronously inside the click handler. With
            mode="wait", AnimatePresence waits on the exiting child's
            animation-complete callback before mounting the next step; that
            callback reliably never fired for these async-triggered
            transitions, permanently stalling the flow (confirmed via React
            fiber inspection: state updated correctly, DOM never did).
            Steps briefly cross-fade instead of strictly sequencing, which is
            an acceptable tradeoff for a flow that actually completes. */}
        <AnimatePresence>

          {/* STEP 1: EMAIL */}
          {step === "email" && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-10 text-center">
                <h2 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                  Begin your journey<br />to African History.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => signIn("google", { redirectTo: "/signup" })}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-ink/20 bg-white px-4 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-black/5 focus:ring-2 focus:ring-teal focus:outline-none"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M21.805 12.23c0-.68-.061-1.333-.174-1.96H12v3.705h5.498a4.702 4.702 0 0 1-2.037 3.083v2.561h3.294c1.928-1.774 3.05-4.39 3.05-7.389Z" fill="#4285F4" />
                  <path d="M12 22c2.76 0 5.077-.915 6.769-2.481l-3.294-2.561c-.914.613-2.083.975-3.475.975-2.67 0-4.931-1.803-5.739-4.225H2.855v2.642A9.997 9.997 0 0 0 12 22Z" fill="#34A853" />
                  <path d="M6.261 13.708A5.996 5.996 0 0 1 5.94 11.999c0-.593.102-1.17.32-1.709V7.648H2.855a9.994 9.994 0 0 0 0 8.701l3.406-2.641Z" fill="#FBBC05" />
                  <path d="M12 6.067c1.5 0 2.847.516 3.91 1.528l2.934-2.934C17.072 3.014 14.755 2 12 2a9.997 9.997 0 0 0-9.145 5.648l3.406 2.642C7.069 7.87 9.33 6.067 12 6.067Z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#e4d4cb]"></div>
                <span className="text-[11px] font-semibold tracking-wider text-[#a0948e] uppercase">or use email</span>
                <div className="h-px flex-1 bg-[#e4d4cb]"></div>
              </div>
              <form className="mt-4" noValidate onSubmit={handleSubmitEmail}>
                <div className="relative flex items-center">
                  <label htmlFor="magic-link-email" className="sr-only">Email</label>
                  <input
                    id="magic-link-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 pl-5 pr-14 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Send sign-in code"
                    disabled={pending}
                    className={`absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-teal-deep text-white transition-all duration-300 hover:bg-teal focus:ring-2 focus:ring-teal-deep focus:outline-none disabled:opacity-50 ${email.includes('@') ? 'shadow-[0_0_15px_rgba(46,75,70,0.5)]' : ''}`}
                  >
                    {pending ? (
                      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
              </form>

              <div className="mt-8 text-center">
                <span className="text-sm text-ink-muted">Already have an account? </span>
                <button type="button" onClick={() => { setError(null); setStep("login"); setFlowType("login"); }} className="text-sm font-semibold text-teal-deep hover:underline focus:outline-none">
                  Log in
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP: LOGIN */}
          {step === "login" && (
            <motion.div
              key="step-login"
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
                  We&apos;ll email you a sign-in code, no password needed.
                </p>
              </div>

              <form className="mt-4 w-full" noValidate onSubmit={handleSubmitLoginEmail}>
                <div className="flex flex-col gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-center text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                  <Button
                    type="submit"
                    disabled={!email.includes('@') || pending}
                    className={`mt-2 w-full ${email.includes('@') ? 'shadow-[0_0_20px_rgba(46,75,70,0.6)]' : ''}`}
                  >
                    {pending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
                    {pending ? "Sending…" : "Send Code"}
                  </Button>
                </div>
                {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
              </form>

              <div className="mt-8 text-center">
                <span className="text-sm text-ink-muted">Don&apos;t have an account? </span>
                <button type="button" onClick={() => { setError(null); setStep("email"); setFlowType("signup"); }} className="text-sm font-semibold text-teal-deep hover:underline focus:outline-none">
                  Sign up
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP: CODE VERIFICATION */}
          {step === "code" && (
            <motion.div
              key="step-code"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => { setError(null); setStep(flowType === "login" ? "login" : "email"); }} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <h2 className="font-display text-4xl font-medium tracking-tight text-ink">Check your inbox.</h2>
                <p className="mt-4 text-base text-ink-muted">
                  We&apos;ve sent a temporary login code to <strong className="font-medium text-ink">{email}</strong>.
                </p>
              </div>
              <form className="mt-2 w-full" onSubmit={handleVerifyCode}>
                <label htmlFor="login-code" className="sr-only">Login Code</label>
                <input
                  id="login-code"
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
                  className={`mt-6 w-full ${code.length === 6 ? 'shadow-[0_0_20px_rgba(46,75,70,0.6)]' : ''}`}
                >
                  {pending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
                  {pending ? "Verifying…" : "Verify Code"}
                </Button>
                {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
              </form>
            </motion.div>
          )}

          {/* STEP: NAME (email-code signups only — Google already provides a name) */}
          {step === "name" && (
            <motion.div
              key="step-name"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Cohort 01 Application</span>
                <h2 className="font-display text-4xl font-medium tracking-tight text-ink leading-tight">
                  What is your name?
                </h2>
              </div>
              <form className="mt-4 w-full" noValidate onSubmit={handleSubmitName}>
                <div className="relative flex items-center">
                  <label htmlFor="user-name" className="sr-only">Name</label>
                  <input
                    id="user-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 pl-5 pr-14 text-sm text-center text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Continue"
                    disabled={!name.trim()}
                    className={`absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-teal-deep text-white transition-all duration-300 hover:bg-teal focus:ring-2 focus:ring-teal-deep focus:outline-none disabled:opacity-50 ${name.trim().length > 2 ? 'shadow-[0_0_15px_rgba(46,75,70,0.5)]' : ''}`}
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP: DETAILS — single page collecting phone/gender/nationality/
              state of origin/optional extra info, in one go rather than one
              question per step like Q1/Q2/about/motivation below. */}
          {step === "details" && (
            <motion.div
              key="step-details"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => setStep("name")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Cohort 01 Application</span>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink leading-tight">
                  A little more about you.
                </h2>
              </div>
              <form className="w-full space-y-4 text-left" noValidate onSubmit={handleSubmitDetails}>
                <div>
                  <label htmlFor="phone-number" className="sr-only">Phone number</label>
                  <input
                    id="phone-number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone number"
                    autoComplete="tel"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                </div>

                <div>
                  <span className="mb-2 block px-1 text-xs font-medium text-ink-muted">Gender</span>
                  <div className="grid grid-cols-2 gap-2">
                    {GENDER_CHOICES.map((choice) => (
                      <button
                        key={choice.value}
                        type="button"
                        onClick={() => setGender(choice.value)}
                        className={`rounded-xl border px-3 py-3 text-center text-sm font-medium transition-all focus:outline-none ${
                          gender === choice.value
                            ? "border-teal-deep bg-teal-deep/10 text-ink"
                            : "border-ink/10 bg-white text-ink-muted hover:border-teal-deep/40"
                        }`}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="nationality" className="sr-only">Nationality</label>
                  <input
                    id="nationality"
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Nationality"
                    autoComplete="country-name"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="state-of-origin" className="sr-only">State of origin</label>
                  <input
                    id="state-of-origin"
                    type="text"
                    value={stateOfOrigin}
                    onChange={(e) => setStateOfOrigin(e.target.value)}
                    placeholder="State of origin"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="additional-info" className="sr-only">Any other relevant information (optional)</label>
                  <textarea
                    id="additional-info"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Anything else relevant to your application? (optional)"
                    rows={3}
                    className="w-full rounded-2xl border border-teal-deep/20 bg-white px-5 py-4 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!phoneNumber.trim() || !gender || !nationality.trim() || !stateOfOrigin.trim()}
                  className="w-full"
                >
                  Continue
                </Button>
              </form>
            </motion.div>
          )}

          {/* STEP: Q1 — fixed-choice, quick filter */}
          {step === "q1" && (
            <motion.div
              key="step-q1"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => setStep("details")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Question 1 of 4</span>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink leading-tight">
                  Is this your first time studying African history in a formal setting?
                </h2>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <button onClick={() => handleQ1("yes")} className="w-full rounded-xl border border-ink/10 bg-white px-5 py-4 text-center font-medium text-ink transition-all hover:border-teal-deep hover:bg-teal-deep/5 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none">
                  Yes, I&apos;m completely new to this
                </button>
                <button onClick={() => handleQ1("some")} className="w-full rounded-xl border border-ink/10 bg-white px-5 py-4 text-center font-medium text-ink transition-all hover:border-teal-deep hover:bg-teal-deep/5 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none">
                  I&apos;ve done some independent reading
                </button>
                <button onClick={() => handleQ1("no")} className="w-full rounded-xl border border-ink/10 bg-white px-5 py-4 text-center font-medium text-ink transition-all hover:border-teal-deep hover:bg-teal-deep/5 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none">
                  No, I have formal academic experience
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP: Q2 — fixed-choice, quick filter */}
          {step === "q2" && (
            <motion.div
              key="step-q2"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => setStep("q1")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Question 2 of 4</span>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink leading-tight">
                  What is your primary goal for joining this cohort?
                </h2>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <button onClick={() => handleQ2("academic")} className="w-full rounded-xl border border-ink/10 bg-white px-5 py-4 text-center font-medium text-ink transition-all hover:border-teal-deep hover:bg-teal-deep/5 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none">
                  Academic research & publishing
                </button>
                <button onClick={() => handleQ2("professional")} className="w-full rounded-xl border border-ink/10 bg-white px-5 py-4 text-center font-medium text-ink transition-all hover:border-teal-deep hover:bg-teal-deep/5 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none">
                  Professional development
                </button>
                <button onClick={() => handleQ2("personal")} className="w-full rounded-xl border border-ink/10 bg-white px-5 py-4 text-center font-medium text-ink transition-all hover:border-teal-deep hover:bg-teal-deep/5 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none">
                  Personal knowledge & unlearning
                </button>
                <button onClick={() => handleQ2("community")} className="w-full rounded-xl border border-ink/10 bg-white px-5 py-4 text-center font-medium text-ink transition-all hover:border-teal-deep hover:bg-teal-deep/5 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none">
                  Community engagement
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP: ABOUT — open-ended, added alongside the fixed-choice questions above */}
          {step === "about" && (
            <motion.div
              key="step-about"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => setStep("q2")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Question 3 of 4</span>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink leading-tight">
                  Tell us a bit about yourself.
                </h2>
                <p className="mt-3 text-sm text-ink-muted">
                  Background, what you do, whatever feels relevant.
                </p>
              </div>
              <form className="mt-2 w-full" noValidate onSubmit={handleSubmitAbout}>
                <label htmlFor="about" className="sr-only">About you</label>
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="I'm a..."
                  rows={5}
                  className="w-full rounded-2xl border border-teal-deep/20 bg-white px-5 py-4 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                />
                <Button
                  type="submit"
                  disabled={about.trim().length < 20}
                  className={`mt-6 w-full ${about.trim().length >= 20 ? 'shadow-[0_0_20px_rgba(46,75,70,0.6)]' : ''}`}
                >
                  Continue
                </Button>
              </form>
            </motion.div>
          )}

          {/* STEP: MOTIVATION — final question, submits the application */}
          {step === "motivation" && (
            <motion.div
              key="step-motivation"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => setStep("about")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Question 4 of 4</span>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink leading-tight">
                  Why African history, and why now?
                </h2>
                <p className="mt-3 text-sm text-ink-muted">
                  What draws you to this cohort, and what do you hope to get out of it?
                </p>
              </div>
              <form className="mt-2 w-full" noValidate onSubmit={handleSubmitApplication}>
                <label htmlFor="motivation" className="sr-only">Motivation</label>
                <textarea
                  id="motivation"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="I'm interested because..."
                  rows={5}
                  className="w-full rounded-2xl border border-teal-deep/20 bg-white px-5 py-4 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                />
                <Button
                  type="submit"
                  disabled={motivation.trim().length < 20 || pending}
                  className={`mt-6 w-full ${motivation.trim().length >= 20 ? 'shadow-[0_0_20px_rgba(46,75,70,0.6)]' : ''}`}
                >
                  {pending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
                  {pending ? "Submitting…" : "Submit Application"}
                </Button>
                {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
              </form>
            </motion.div>
          )}

          {/* STEP: ALREADY APPLIED — returning member who's already submitted */}
          {step === "already_applied" && (
            <motion.div
              key="step-already-applied"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal/10">
                <CheckCircle2 className="h-10 w-10 text-teal-deep" />
              </div>
              <h2 className="font-display text-4xl font-medium tracking-tight text-ink">
                Welcome back.
              </h2>
              <p className="mt-4 text-base text-ink-muted">
                You&apos;ve already applied to Cohort 01, we&apos;ll be in touch.
              </p>
              <Link href="/" className="mt-8">
                <Button>Return Home</Button>
              </Link>
            </motion.div>
          )}

          {/* STEP: DONATE — optional, shown right after the application is
              submitted; skippable, and never read anywhere admission is
              decided (see CohortDonation's schema comment). */}
          {step === "donate" && (
            <motion.div
              key="step-donate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
                <CheckCircle2 className="h-8 w-8 text-teal-deep" />
              </div>
              <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
                You&apos;re one of us now.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Your application is in, that part&apos;s done. But Cohort 01 is more than an admission, it&apos;s a
                library still being built, one shelf at a time. If you&apos;d like, you can be part of building it too.
              </p>

              <div className="mt-8 flex w-full flex-col gap-3">
                {cohortDonationTiers.map((level) => {
                  const Icon = level.icon;
                  return (
                    <button
                      key={level.tier}
                      type="button"
                      disabled={pending}
                      onClick={() => handleSelectDonationTier(level.tier, level.amount)}
                      className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4 text-left transition-colors hover:border-teal-deep/40 hover:bg-teal-deep/5 disabled:opacity-60"
                    >
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${level.bg} ${level.color}`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="font-display text-base font-semibold text-ink">{level.tier}</span>
                          <span className="text-sm font-semibold text-teal-deep">{formatNaira(level.amount)}</span>
                        </span>
                        <span className="mt-1 block text-xs text-ink-muted">{level.impact}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 w-full">
                <p className="mb-2 text-xs font-medium text-ink-muted">Or give any amount you'd like:</p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink/40">₦</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="10,000"
                      className="w-full rounded-full border border-teal-deep/20 bg-white py-3 pl-8 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                    />
                  </div>
                  <Button
                    type="button"
                    disabled={pending || !Number.isInteger(Number(customAmount)) || Number(customAmount) < 1}
                    onClick={() => handleSelectDonationTier("Custom Amount", Number(customAmount))}
                  >
                    Contribute
                  </Button>
                </div>
              </div>

              {pending && (
                <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Starting payment…
                </p>
              )}
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <button
                type="button"
                onClick={() => { setError(null); setStep("success"); }}
                className="mt-6 text-sm font-medium text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Not right now
              </button>
            </motion.div>
          )}

          {/* STEP: SUCCESS */}
          {step === "success" && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal/10">
                <CheckCircle2 className="h-10 w-10 text-teal-deep" />
              </div>
              <h2 className="font-display text-4xl font-medium tracking-tight text-ink">
                {`Thank you, ${(name || session?.user?.name || 'friend').split(' ')[0]}.`}
              </h2>
              <p className="mt-4 text-base text-ink-muted">
                Your Cohort 01 application has been received. We&apos;ll email you once it&apos;s been reviewed.
              </p>
              <Link
                href="/"
                className="mt-8"
              >
                <Button>Return Home</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
