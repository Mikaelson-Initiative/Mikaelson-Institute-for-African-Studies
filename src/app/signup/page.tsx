"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type Step = "email" | "code" | "name" | "q1" | "q2" | "success" | "login" | "forgot_password";
type FlowType = "signup" | "login" | "reset";

export default function SignupPage() {
  const [step, setStep] = useState<Step>("email");
  const [flowType, setFlowType] = useState<FlowType>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  
  // Data collection state
  const [name, setName] = useState("");
  const [firstTime, setFirstTime] = useState<string | null>(null);
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setStep("code");
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) setStep("name");
  };

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setStep("q1");
  };

  const handleQ1 = (answer: string) => {
    setFirstTime(answer);
    setStep("q2");
  };

  const handleQ2 = (answer: string) => {
    setPrimaryGoal(answer);
    setStep("success");
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
        <AnimatePresence mode="wait">
          
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
                  Start learning<br />today.
                </h2>
              </div>
              <button
                type="button"
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
                    aria-label="Send sign-in link" 
                    className={`absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-teal-deep text-white transition-all duration-300 hover:bg-teal focus:ring-2 focus:ring-teal-deep focus:outline-none ${email.includes('@') ? 'shadow-[0_0_15px_rgba(46,75,70,0.5)]' : ''}`}
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <span className="text-sm text-ink-muted">Already have an account? </span>
                <button type="button" onClick={() => { setStep("login"); setFlowType("login"); }} className="text-sm font-semibold text-teal-deep hover:underline focus:outline-none">
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
              </div>
              
              <form className="mt-4 w-full" noValidate onSubmit={(e) => { e.preventDefault(); setFlowType("login"); setStep("success"); }}>
                <div className="flex flex-col gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-center text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-center text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                  <div className="flex justify-end px-2">
                    <button type="button" onClick={() => setStep("forgot_password")} className="text-xs font-medium text-ink-muted hover:text-teal-deep transition-colors focus:outline-none">
                      Forgot password?
                    </button>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!email || !password}
                    className={`mt-2 w-full ${email && password ? 'shadow-[0_0_20px_rgba(46,75,70,0.6)]' : ''}`}
                  >
                    Log In
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <span className="text-sm text-ink-muted">Don&apos;t have an account? </span>
                <button type="button" onClick={() => { setStep("email"); setFlowType("signup"); }} className="text-sm font-semibold text-teal-deep hover:underline focus:outline-none">
                  Sign up
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP: FORGOT PASSWORD */}
          {step === "forgot_password" && (
            <motion.div
              key="step-forgot"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => setStep("login")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <h2 className="font-display text-4xl font-medium tracking-tight text-ink">
                  Reset Password
                </h2>
                <p className="mt-4 text-base text-ink-muted">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>
              
              <form className="mt-2 w-full" noValidate onSubmit={(e) => { e.preventDefault(); setFlowType("reset"); setStep("success"); }}>
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
                    disabled={!email.includes('@')}
                    className={`mt-4 w-full ${email.includes('@') ? 'shadow-[0_0_20px_rgba(46,75,70,0.6)]' : ''}`}
                  >
                    Send Reset Link
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2: CODE VERIFICATION */}
          {step === "code" && (
            <motion.div
              key="step-code"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => setStep("email")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
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
                  disabled={code.length !== 6} 
                  className={`mt-6 w-full ${code.length === 6 ? 'shadow-[0_0_20px_rgba(46,75,70,0.6)]' : ''}`}
                >
                  Verify Code
                </Button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: NAME */}
          {step === "name" && (
            <motion.div
              key="step-name"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => setStep("code")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Question 1 of 3</span>
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

          {/* STEP 4: QUESTION 1 */}
          {step === "q1" && (
            <motion.div
              key="step-q1"
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
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Question 2 of 3</span>
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

          {/* STEP 5: QUESTION 2 */}
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
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Question 3 of 3</span>
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

          {/* STEP 6: SUCCESS */}
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
                {flowType === "signup" ? `Welcome, ${name ? name.split(' ')[0] : 'friend'}.` : 
                 flowType === "login" ? "Welcome back." : "Check your inbox."}
              </h2>
              <p className="mt-4 text-base text-ink-muted">
                {flowType === "signup" ? "Your application has been received. We're thrilled to have you join our community." :
                 flowType === "login" ? "You have successfully logged in to your account." : "We've sent a secure password reset link to your email."}
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
