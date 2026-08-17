import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLoginCode } from "@/lib/otp";
import { sendCodeSchema } from "@/lib/validation/auth";

// Same OTP mechanics as /api/auth/send-code (used by the public /signup
// flow, and deliberately left open to any email there) but gated: a code is
// only sent if this email belongs to a User with an admitted
// CohortApplication. Checked here (pre-session) and again by
// requireCohortAccess() on every /ubuntu/(protected) page load — never
// trusted from the session alone, since admission can be revoked after a
// code was already sent.
export async function POST(request: Request) {
  const body = await request.json();
  const fields = sendCodeSchema.safeParse(body);

  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: fields.data.email },
    include: { cohortApplication: true },
  });

  if (user?.cohortApplication?.status !== "admitted") {
    return NextResponse.json(
      { error: "not_admitted", message: "This email isn't registered for an active cohort." },
      { status: 403 },
    );
  }

  const result = await sendLoginCode(fields.data.email);

  if (!result.ok) {
    return NextResponse.json(
      { error: "cooldown", message: "A code was already sent, check your inbox, or try again in a minute." },
      { status: 429 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
