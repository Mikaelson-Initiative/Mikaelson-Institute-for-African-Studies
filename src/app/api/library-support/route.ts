import { NextResponse } from "next/server";
import { notificationRecipient, sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/library-contribution-tiers";
import { libraryContributionSchema } from "@/lib/validation/library-support";

// Records a pledge as "pending" — the payment integration (out of scope
// here) is what actually charges the card and flips status to "completed",
// whether via a future Paystack webhook or a staff member confirming it
// manually from the admin dashboard.
export async function POST(request: Request) {
  const body = await request.json();
  const fields = libraryContributionSchema.safeParse(body);

  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, amount, tier } = fields.data;

  const contribution = await prisma.libraryContribution.create({
    data: { name, email, amount, tier },
  });

  await sendEmail({
    to: email,
    subject: "Thank you for supporting the Institute's library",
    html: `<p>Hi ${name},</p><p>Thank you for pledging ${formatNaira(amount)} toward the 1,000,000 Books Project${tier ? ` (${tier} tier)` : ""}. We'll follow up with details to complete your contribution.</p>`,
  });

  await sendEmail({
    to: notificationRecipient(),
    subject: `New library contribution pledge: ${name}`,
    html: `<p><strong>${name}</strong> (${email}) pledged ${formatNaira(amount)}${tier ? ` (${tier} tier)` : ""}.</p>`,
  });

  return NextResponse.json({ id: contribution.id }, { status: 201 });
}
