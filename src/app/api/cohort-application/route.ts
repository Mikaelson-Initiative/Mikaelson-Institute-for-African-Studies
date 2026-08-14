import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { notificationRecipient, sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { cohortApplicationSchema } from "@/lib/validation/auth";

// Used by /signup on mount to decide where a signed-in user lands: already
// applied → straight to success; not yet → application questions (skipping
// the name step entirely for Google sign-ins, which already have a name).
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const application = await prisma.cohortApplication.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    hasApplication: Boolean(application),
    name: session.user.name ?? null,
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const fields = cohortApplicationSchema.safeParse(body);

  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, firstTimeStudying, primaryGoal, about, motivation } = fields.data;

  if (name) {
    await prisma.user.update({ where: { id: session.user.id }, data: { name } });
  }

  await prisma.cohortApplication.upsert({
    where: { userId: session.user.id },
    update: { firstTimeStudying, primaryGoal, about, motivation },
    create: { userId: session.user.id, firstTimeStudying, primaryGoal, about, motivation },
  });

  const applicantName = name ?? session.user.name ?? "there";

  await sendEmail({
    to: session.user.email,
    subject: "We've received your Cohort 01 application",
    html: `<p>Hi ${applicantName},</p><p>Thank you for applying to Mikaelson Institute's Cohort 01. We've received your application and will be in touch.</p>`,
  });

  await sendEmail({
    to: notificationRecipient(),
    subject: `New Cohort 01 application: ${applicantName}`,
    html: `<p><strong>${applicantName}</strong> (${session.user.email}) applied to Cohort 01.</p><p><strong>First time studying African history:</strong> ${firstTimeStudying}</p><p><strong>Primary goal:</strong> ${primaryGoal}</p><p><strong>About:</strong> ${about}</p><p><strong>Motivation:</strong> ${motivation}</p>`,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
