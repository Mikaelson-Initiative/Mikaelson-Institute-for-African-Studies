import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { notificationRecipient, sendEmail } from "@/lib/email";
import { escapeHtml, renderEmail } from "@/lib/email-template";
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

  const {
    name,
    phoneNumber,
    gender,
    nationality,
    stateOfOrigin,
    additionalInfo,
    firstTimeStudying,
    primaryGoal,
    about,
    motivation,
  } = fields.data;

  if (name) {
    await prisma.user.update({ where: { id: session.user.id }, data: { name } });
  }

  const applicationData = {
    phoneNumber,
    gender,
    nationality,
    stateOfOrigin,
    additionalInfo: additionalInfo || null,
    firstTimeStudying,
    primaryGoal,
    about,
    motivation,
  };

  await prisma.cohortApplication.upsert({
    where: { userId: session.user.id },
    update: applicationData,
    create: { userId: session.user.id, ...applicationData },
  });

  const applicantName = name ?? session.user.name ?? "there";

  await sendEmail({
    to: session.user.email,
    subject: "We've received your Cohort 01 application",
    html: renderEmail({
      preheader: "We've received your Cohort 01 application and will be in touch.",
      heading: "We've received your Cohort 01 application",
      sections: [
        { type: "paragraph", text: `Hi ${escapeHtml(applicantName)},` },
        { type: "paragraph", text: "Thank you for applying to Mikaelson Institute's Cohort 01. We've received your application and will be in touch." },
      ],
    }),
  });

  await sendEmail({
    to: notificationRecipient(),
    subject: `New Cohort 01 application: ${applicantName}`,
    html: renderEmail({
      preheader: `${applicantName} applied to Cohort 01.`,
      heading: `New Cohort 01 application: ${applicantName}`,
      sections: [
        { type: "paragraph", text: `<strong>${escapeHtml(applicantName)}</strong> (${escapeHtml(session.user.email)}) applied to Cohort 01.` },
        { type: "details", rows: [
          { label: "Phone", value: escapeHtml(phoneNumber) },
          { label: "Gender", value: escapeHtml(gender) },
          { label: "Nationality", value: escapeHtml(nationality) },
          { label: "State of origin", value: escapeHtml(stateOfOrigin) },
          ...(additionalInfo ? [{ label: "Additional info", value: escapeHtml(additionalInfo) }] : []),
          { label: "First time studying African history", value: escapeHtml(firstTimeStudying) },
          { label: "Primary goal", value: escapeHtml(primaryGoal) },
        ] },
        { type: "divider" },
        { type: "paragraph", text: `<strong>About:</strong> ${escapeHtml(about)}` },
        { type: "paragraph", text: `<strong>Motivation:</strong> ${escapeHtml(motivation)}` },
      ],
    }),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
