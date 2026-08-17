import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SectionLabel } from "@/components/section-label";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { requireCohortAccess } from "@/lib/require-cohort-access";
import { GENDER_OPTIONS } from "@/lib/validation/auth";
import { updateProfile } from "./actions";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

const GENDER_LABELS: Record<string, string> = {
  female: "Female",
  male: "Male",
  "non-binary": "Non-binary",
  "prefer-not-to-say": "Prefer not to say",
};

export default async function LearnProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { session, application, error } = await requireCohortAccess();
  if (error || !session?.user || !application) redirect("/learn/login?denied=1");

  const { saved, error: hasError } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-4 pt-10 pb-20 sm:px-6">
      <Reveal>
        <SectionLabel>Your Profile</SectionLabel>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Profile</h1>
        <p className="mt-3 text-base text-ink-muted">{session.user.email}</p>
      </Reveal>

      {saved === "1" && (
        <p role="status" className="mt-6 rounded-xl border border-teal-deep/20 bg-teal-deep/5 px-4 py-3 text-sm text-teal-deep">
          Your profile has been updated.
        </p>
      )}
      {hasError === "1" && (
        <p role="alert" className="mt-6 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink-muted">
          Please fill in every field correctly and try again.
        </p>
      )}

      <Reveal delay={0.1}>
        <form action={updateProfile} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={session.user.name ?? ""}
              required
              className="mt-1.5 w-full rounded-full border border-teal-deep/20 bg-white px-5 py-3 text-sm text-ink focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Phone number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              defaultValue={application.phoneNumber ?? ""}
              required
              className="mt-1.5 w-full rounded-full border border-teal-deep/20 bg-white px-5 py-3 text-sm text-ink focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="gender" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Gender</label>
            <select
              id="gender"
              name="gender"
              defaultValue={application.gender ?? ""}
              required
              className="mt-1.5 w-full rounded-full border border-teal-deep/20 bg-white px-5 py-3 text-sm text-ink focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
            >
              <option value="" disabled>Select an option</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option} value={option}>{GENDER_LABELS[option]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="nationality" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Nationality</label>
            <input
              id="nationality"
              name="nationality"
              type="text"
              defaultValue={application.nationality ?? ""}
              required
              className="mt-1.5 w-full rounded-full border border-teal-deep/20 bg-white px-5 py-3 text-sm text-ink focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="stateOfOrigin" className="text-xs font-semibold uppercase tracking-wide text-ink-muted">State of origin</label>
            <input
              id="stateOfOrigin"
              name="stateOfOrigin"
              type="text"
              defaultValue={application.stateOfOrigin ?? ""}
              required
              className="mt-1.5 w-full rounded-full border border-teal-deep/20 bg-white px-5 py-3 text-sm text-ink focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
            />
          </div>
          <Button type="submit" variant="primary">Save Changes</Button>
        </form>
      </Reveal>
    </div>
  );
}
