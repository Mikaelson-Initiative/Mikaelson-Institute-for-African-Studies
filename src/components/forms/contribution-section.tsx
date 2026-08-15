"use client";

import { AlertCircle, ArrowRight, Loader2, Wallet, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import {
  contributionTiers,
  formatNaira,
} from "@/lib/library-contribution-tiers";

type Selection = { tier: string | null; amount: number };

export function ContributionSection() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    setSelection(null);
    setError(null);
    setName("");
    setEmail("");
  };

  useEffect(() => {
    if (!selection) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);

  const selectTier = (tier: string, amount: number) => {
    setError(null);
    setSelection({ tier, amount });
  };

  const selectCustom = () => {
    const amount = parseInt(customAmount, 10);
    if (!amount || amount < 1) {
      setCustomError("Enter a valid amount.");
      return;
    }
    setCustomError(null);
    setError(null);
    setSelection({ tier: null, amount });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selection || !name.trim() || !email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/library-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          amount: selection.amount,
          tier: selection.tier ?? undefined,
        }),
      });
      const body = await response.json();
      if (!response.ok || !body.authorizationUrl) {
        setError("Couldn't start the payment, try again.");
        return;
      }
      // Full-page redirect, not window.open — a popup opened after an
      // awaited fetch falls outside the original click's "user gesture"
      // window and gets silently blocked by most browsers.
      window.location.href = body.authorizationUrl;
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {contributionTiers.map((level, i) => {
          const Icon = level.icon;
          return (
            <Reveal key={level.tier} delay={i * 0.1}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-8 border border-ink/5 transition-all duration-300 hover:border-teal-deep/30 hover:shadow-xl hover:-translate-y-1">
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${level.bg} ${level.color} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold text-ink">{level.tier}</h3>
                <div className="mt-2 text-3xl font-display font-medium text-teal-deep">{formatNaira(level.amount)}</div>
                <p className="mt-4 text-ink-muted flex-grow leading-relaxed">{level.impact}</p>
                <button
                  type="button"
                  onClick={() => selectTier(level.tier, level.amount)}
                  className="mt-8 block text-center w-full rounded-full bg-[#faf9f8] px-6 py-3 font-semibold text-ink transition-colors hover:bg-teal-deep hover:text-white"
                >
                  Contribute
                </button>
              </div>
            </Reveal>
          );
        })}

        {/* Custom Amount as a 6th card */}
        <Reveal delay={0.5}>
          <div className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-8 border border-ink/5 transition-all duration-300 hover:border-teal-deep/30 hover:shadow-xl hover:-translate-y-1">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-transform duration-300 group-hover:scale-110">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink">Custom Amount</h3>
            <div className="mt-2 text-3xl font-display font-medium text-teal-deep">You Choose</div>
            <p className="mt-4 text-ink-muted flex-grow leading-relaxed">Every Naira helps us bring more knowledge home.</p>
            <div className="mt-8 flex flex-col gap-3">
              <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted font-bold">₦</span>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full rounded-full pl-8 pr-4 py-3 bg-[#faf9f8] border border-transparent focus:border-teal-deep focus:ring-1 focus:ring-teal-deep outline-none text-ink"
                />
              </div>
              {customError && (
                <p role="alert" className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  {customError}
                </p>
              )}
              <button
                type="button"
                onClick={selectCustom}
                className="w-full rounded-full bg-[#faf9f8] px-6 py-3 font-semibold text-ink transition-colors hover:bg-teal-deep hover:text-white"
              >
                Contribute
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Popup — collects name/email once a tier or custom amount is chosen,
          then hands off to Paystack on Continue. */}
      {selection && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contribution-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-md rounded-[2rem] border border-teal-deep/20 bg-white p-8 sm:p-10">
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-5 top-5 rounded-full p-1.5 text-ink-muted transition-colors hover:bg-black/5 hover:text-ink"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center">
                <p id="contribution-modal-title" className="font-display text-xl font-semibold text-ink">
                  Contributing {formatNaira(selection.amount)}
                  {selection.tier ? `: ${selection.tier}` : ""}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  We&rsquo;ll take you to Paystack to complete your payment.
                </p>
              </div>
              <div>
                <label htmlFor="contributor-name" className="sr-only">Name</label>
                <input
                  id="contributor-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoFocus
                  required
                  className="w-full rounded-full border border-ink/10 bg-[#faf9f8] px-5 py-3 text-ink placeholder:text-ink-muted focus:border-teal-deep focus:ring-1 focus:ring-teal-deep outline-none"
                />
              </div>
              <div>
                <label htmlFor="contributor-email" className="sr-only">Email</label>
                <input
                  id="contributor-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full rounded-full border border-ink/10 bg-[#faf9f8] px-5 py-3 text-ink placeholder:text-ink-muted focus:border-teal-deep focus:ring-1 focus:ring-teal-deep outline-none"
                />
              </div>
              {error && (
                <p role="alert" className="flex items-center justify-center gap-1.5 text-sm font-medium text-ink">
                  <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting || !name.trim() || !email.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-deep px-6 py-3 font-semibold text-white transition-colors hover:bg-teal disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                )}
                {submitting ? "Recording…" : "Continue"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
