"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type Step = "name" | "contact" | "role" | "availability" | "experience" | "motivation" | "success";

const ROLE_CHOICES = [
  { value: "research-editorial", label: "Research & Editorial" },
  { value: "design-technology", label: "Design & Technology" },
  { value: "community-outreach", label: "Community & Outreach" },
  { value: "operations-admin", label: "Operations & Administration" },
  { value: "other", label: "Other" },
];

export default function JoinTeamClient() {
  const [step, setStep] = useState<Step>("name");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [roleInterest, setRoleInterest] = useState<string | null>(null);
  const [customRole, setCustomRole] = useState("");
  const [availability, setAvailability] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [volunteeredBefore, setVolunteeredBefore] = useState<"true" | "false" | null>(null);
  const [experience, setExperience] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [motivation, setMotivation] = useState("");

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setStep("contact");
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@") && phoneNumber.trim() && location.trim()) setStep("role");
  };

  const handleRole = (value: string) => {
    setRoleInterest(value);
    if (value === "other") {
      setCustomRole("");
      return;
    }
    setStep("availability");
  };

  const handleSubmitAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      availability.trim() &&
      Number(hoursPerWeek) > 0 &&
      volunteeredBefore !== null &&
      (roleInterest !== "other" || customRole.trim())
    ) {
      setStep("experience");
    }
  };

  const handleSubmitExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (experience.trim().length >= 20 && linkedinUrl.trim() && cvFile) setStep("motivation");
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (motivation.trim().length < 20 || !roleInterest || !cvFile || volunteeredBefore === null) return;
    setError(null);
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("email", email);
      formData.set("phoneNumber", phoneNumber);
      formData.set("location", location);
      formData.set("roleInterest", roleInterest);
      if (roleInterest === "other") formData.set("customRole", customRole);
      formData.set("availability", availability);
      formData.set("hoursPerWeek", hoursPerWeek);
      formData.set("volunteeredBefore", volunteeredBefore);
      formData.set("experience", experience);
      formData.set("linkedinUrl", linkedinUrl);
      formData.set("cv", cvFile);
      formData.set("motivation", motivation);

      const response = await fetch("/api/team-application", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        setError("Couldn't submit your application, try again.");
        return;
      }
      setStep("success");
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
      <div className="relative w-full max-w-sm px-4">
        {/* No mode="wait" — same reasoning as /signup: state updates that
            happen after an awaited fetch never trigger the exit-complete
            callback mode="wait" depends on, permanently stalling the flow.
            Steps cross-fade instead of strictly sequencing. */}
        <AnimatePresence>

          {/* STEP: NAME */}
          {step === "name" && (
            <motion.div
              key="step-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-10 text-center">
                <span className="mb-3 inline-block rounded-full border border-teal-deep/20 bg-teal-deep/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-deep">
                  Volunteer Application
                </span>
                <h2 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                  Let&rsquo;s build<br />together.
                </h2>
                <p className="mt-4 text-base text-ink-muted">
                  This is a volunteer role, unpaid, and open to anyone who wants to
                  help build the Mikaelson Institute for African Studies.
                </p>
              </div>
              <form className="mt-4 w-full" noValidate onSubmit={handleSubmitName}>
                <div className="relative flex items-center">
                  <label htmlFor="applicant-name" className="sr-only">Name</label>
                  <input
                    id="applicant-name"
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
                    className={`absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-teal-deep text-white transition-all duration-300 hover:bg-teal focus:ring-2 focus:ring-teal-deep focus:outline-none disabled:opacity-50 ${name.trim().length > 2 ? "shadow-[0_0_15px_rgba(46,75,70,0.5)]" : ""}`}
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP: CONTACT — email/phone/city in one go */}
          {step === "contact" && (
            <motion.div
              key="step-contact"
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
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Volunteer Application</span>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink leading-tight">
                  How can we reach you?
                </h2>
              </div>
              <form className="w-full space-y-4 text-left" noValidate onSubmit={handleSubmitContact}>
                <div>
                  <label htmlFor="applicant-email" className="sr-only">Email</label>
                  <input
                    id="applicant-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    autoComplete="email"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="applicant-phone" className="sr-only">Phone number</label>
                  <input
                    id="applicant-phone"
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
                  <label htmlFor="applicant-location" className="sr-only">City of residence</label>
                  <input
                    id="applicant-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City of residence"
                    autoComplete="address-level2"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!email.includes("@") || !phoneNumber.trim() || !location.trim()}
                  className="w-full"
                >
                  Continue
                </Button>
              </form>
            </motion.div>
          )}

          {/* STEP: ROLE — fixed-choice, "Other" reveals a free-text field */}
          {step === "role" && (
            <motion.div
              key="step-role"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => setStep("contact")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Question 1 of 4</span>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink leading-tight">
                  Where would you like to contribute?
                </h2>
              </div>
              <div className="flex flex-col gap-3 w-full">
                {ROLE_CHOICES.map((choice) => (
                  <button
                    key={choice.value}
                    onClick={() => handleRole(choice.value)}
                    className={`w-full rounded-xl border px-5 py-4 text-center font-medium text-ink transition-all hover:border-teal-deep hover:bg-teal-deep/5 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none ${roleInterest === choice.value ? "border-teal-deep bg-teal-deep/5" : "border-ink/10 bg-white"}`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
              {roleInterest === "other" && (
                <form className="mt-4 w-full" noValidate onSubmit={(e) => { e.preventDefault(); if (customRole.trim()) setStep("availability"); }}>
                  <label htmlFor="applicant-custom-role" className="sr-only">Role you&rsquo;d like to join us in</label>
                  <input
                    id="applicant-custom-role"
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="What role would you like to join us in?"
                    autoFocus
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                  <Button type="submit" disabled={!customRole.trim()} className="mt-4 w-full">
                    Continue
                  </Button>
                </form>
              )}
            </motion.div>
          )}

          {/* STEP: AVAILABILITY — general availability, hours/week, prior volunteering */}
          {step === "availability" && (
            <motion.div
              key="step-availability"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => setStep("role")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Question 2 of 4</span>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink leading-tight">
                  What&rsquo;s your availability?
                </h2>
              </div>
              <form className="mt-2 w-full space-y-4 text-left" noValidate onSubmit={handleSubmitAvailability}>
                <div>
                  <label htmlFor="applicant-availability" className="sr-only">Availability</label>
                  <input
                    id="applicant-availability"
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="e.g. weekday evenings, weekends"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="applicant-hours" className="sr-only">Hours you can commit per week</label>
                  <input
                    id="applicant-hours"
                    type="number"
                    min={1}
                    max={168}
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    placeholder="Hours you can realistically commit per week"
                    required
                    className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-ink-muted">Have you volunteered before?</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setVolunteeredBefore("true")}
                      className={`flex-1 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${volunteeredBefore === "true" ? "border-teal-deep bg-teal-deep/5 text-ink" : "border-ink/10 bg-white text-ink-muted hover:border-teal-deep"}`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolunteeredBefore("false")}
                      className={`flex-1 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${volunteeredBefore === "false" ? "border-teal-deep bg-teal-deep/5 text-ink" : "border-ink/10 bg-white text-ink-muted hover:border-teal-deep"}`}
                    >
                      No
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={!availability.trim() || !(Number(hoursPerWeek) > 0) || volunteeredBefore === null}
                  className="w-full"
                >
                  Continue
                </Button>
              </form>
            </motion.div>
          )}

          {/* STEP: EXPERIENCE — open-ended + mandatory LinkedIn + mandatory CV upload */}
          {step === "experience" && (
            <motion.div
              key="step-experience"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center items-center"
            >
              <button onClick={() => setStep("availability")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Question 3 of 4</span>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink leading-tight">
                  Tell us about your experience.
                </h2>
                <p className="mt-3 text-sm text-ink-muted">
                  Relevant work, research, or projects, whatever feels relevant.
                </p>
              </div>
              <form className="mt-2 w-full space-y-4 text-left" noValidate onSubmit={handleSubmitExperience}>
                <label htmlFor="applicant-experience" className="sr-only">Experience</label>
                <textarea
                  id="applicant-experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="I've worked on..."
                  rows={5}
                  className="w-full rounded-2xl border border-teal-deep/20 bg-white px-5 py-4 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                />
                <label htmlFor="applicant-linkedin" className="sr-only">LinkedIn profile URL</label>
                <input
                  id="applicant-linkedin"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="LinkedIn profile link"
                  required
                  className="w-full rounded-full border border-teal-deep/20 bg-white py-3.5 px-5 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                />
                <div>
                  <label
                    htmlFor="applicant-cv"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-dashed border-teal-deep/30 bg-white py-3.5 px-5 text-sm text-ink-muted transition-colors hover:border-teal-deep hover:text-ink"
                  >
                    <Upload aria-hidden="true" className="h-4 w-4" />
                    {cvFile ? cvFile.name : "Upload your CV (PDF or Word)"}
                  </label>
                  <input
                    id="applicant-cv"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    required
                    onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={experience.trim().length < 20 || !linkedinUrl.trim() || !cvFile}
                  className={`w-full ${experience.trim().length >= 20 && linkedinUrl.trim() && cvFile ? "shadow-[0_0_20px_rgba(46,75,70,0.6)]" : ""}`}
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
              <button onClick={() => setStep("experience")} className="mb-4 rounded-full p-2 text-ink/40 transition-colors hover:bg-black/5 hover:text-ink" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#a0948e]">Question 4 of 4</span>
                <h2 className="font-display text-3xl font-medium tracking-tight text-ink leading-tight">
                  Why do you want to join us?
                </h2>
                <p className="mt-3 text-sm text-ink-muted">
                  What draws you to the Institute, and what would you bring to the team?
                </p>
              </div>
              <form className="mt-2 w-full" noValidate onSubmit={handleSubmitApplication}>
                <label htmlFor="applicant-motivation" className="sr-only">Motivation</label>
                <textarea
                  id="applicant-motivation"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="I'm interested because..."
                  rows={5}
                  className="w-full rounded-2xl border border-teal-deep/20 bg-white px-5 py-4 text-sm text-ink placeholder:text-ink/40 focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
                />
                <Button
                  type="submit"
                  disabled={motivation.trim().length < 20 || pending}
                  className={`mt-6 w-full ${motivation.trim().length >= 20 ? "shadow-[0_0_20px_rgba(46,75,70,0.6)]" : ""}`}
                >
                  {pending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
                  {pending ? "Submitting Application…" : "Submit Application"}
                </Button>
                {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
              </form>
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
                {`Thank you, ${name.split(" ")[0] || "friend"}.`}
              </h2>
              <p className="mt-4 text-base text-ink-muted">
                Your volunteer application has been received. We&rsquo;ll email you once it&rsquo;s been reviewed.
              </p>
              <Link href="/" className="mt-8">
                <Button>Return Home</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
