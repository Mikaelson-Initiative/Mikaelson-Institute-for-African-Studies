import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { sendEmail } from "@/lib/email";
import { escapeHtml, renderEmail } from "@/lib/email-template";

const VALID_STATUSES = ["pending", "admitted", "rejected", "waitlisted"];

// The one and only place the LMS sign-in link is ever sent — Ubuntu has no
// public "sign in" link anywhere on the site, deliberately (see nav-links.ts
// and the homepage/coming-soon CTAs, which all point at the public /ubuntu-program
// marketing page instead). An admitted applicant only learns this address
// from this email.
const LMS_SIGN_IN_URL = "https://learn.mikaelsoninitiative.org/ubuntu";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  // Built conditionally — each field is independently optional (the admin
  // dashboard sends one field at a time: reviewed, status, or cohortId), so
  // an absent field must not overwrite what's already stored.
  const data: {
    reviewed?: boolean;
    status?: "pending" | "admitted" | "rejected" | "waitlisted";
    cohortId?: string | null;
  } = {};

  if (typeof body.reviewed === "boolean") {
    data.reviewed = body.reviewed;
  }
  if (typeof body.status === "string") {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "validation", message: "Invalid status." }, { status: 400 });
    }
    data.status = body.status as "pending" | "admitted" | "rejected" | "waitlisted";
  }
  if (typeof body.cohortId === "string") {
    data.cohortId = body.cohortId || null;
  }

  // Read the prior status before applying the update — the admission email
  // only fires on the transition *into* "admitted", not on every later PATCH
  // (e.g. toggling "reviewed" or reassigning a cohort) while already admitted.
  const before = await prisma.cohortApplication.findUnique({
    where: { id },
    select: { status: true },
  });

  const application = await prisma.cohortApplication.update({
    where: { id },
    data,
    include: { user: { select: { email: true, name: true } } },
  });

  if (data.status === "admitted" && before?.status !== "admitted" && application.user.email) {
    const applicantName = application.user.name ?? "there";
    await sendEmail({
      to: application.user.email,
      subject: "You're in, welcome to Cohort 01",
      html: renderEmail({
        preheader: "Your Cohort 01 application has been admitted, here's how to sign in.",
        heading: "You've been admitted to Cohort 01",
        sections: [
          { type: "paragraph", text: `Hi ${escapeHtml(applicantName)},` },
          {
            type: "paragraph",
            text: "Good news, your application to Mikaelson Institute's Cohort 01 has been admitted. You can sign in to the learning platform any time using this email address.",
          },
          { type: "button", label: "Sign in to Ubuntu", url: LMS_SIGN_IN_URL },
          {
            type: "paragraph",
            text: "We'll email you a one-time code each time you sign in, no password to remember.",
          },
        ],
      }),
    });
  }

  return NextResponse.json(application);
}
