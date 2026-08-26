import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { notificationRecipient, sendEmail } from "@/lib/email";
import { escapeHtml, renderEmail } from "@/lib/email-template";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/cohort-donation-tiers";
import { initializeTransaction } from "@/lib/paystack";
import { getClientIp, formIpLimiter, rateLimitOrResponse } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";
import { cohortDonationSchema } from "@/lib/validation/cohort-donation";

// Mirrors /api/library-support: records a "pending" row, then initializes a
// Paystack transaction and returns its authorization_url for the client to
// redirect to. Unlike library-support, this requires a signed-in session —
// it only ever appears right after a Cohort application submission — and
// takes the donor's name/email from that session rather than the request
// body, so a payment record can't be attributed to an identity the client
// made up.
export async function POST(request: Request) {
  const limited = await rateLimitOrResponse(formIpLimiter, getClientIp(request));
  if (limited) return limited;

  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const fields = cohortDonationSchema.safeParse(body);

  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { amount, tier } = fields.data;
  const name = session.user.name ?? "there";
  const email = session.user.email;

  const donation = await prisma.cohortDonation.create({
    data: { userId: session.user.id, name, email, amount, tier },
  });

  const reference = `mias-cohort-donation-${donation.id}`;

  let authorizationUrl: string;
  try {
    const transaction = await initializeTransaction({
      email,
      amountNaira: amount,
      reference,
      callbackUrl: `${SITE_URL}/signup/donate/callback`,
      metadata: { donationId: donation.id, tier: tier ?? null },
    });
    authorizationUrl = transaction.authorizationUrl;
  } catch {
    return NextResponse.json(
      { error: "payment", message: "Couldn't start the payment. Try again in a moment." },
      { status: 502 },
    );
  }

  await prisma.cohortDonation.update({
    where: { id: donation.id },
    data: { reference },
  });

  const tierSuffix = tier ? ` (${escapeHtml(tier)})` : "";

  await sendEmail({
    to: email,
    subject: "Complete your contribution to Cohort 01",
    html: renderEmail({
      preheader: `Complete your payment to confirm your contribution of ${formatNaira(amount)}.`,
      heading: `You're becoming part of Cohort 01's story`,
      sections: [
        { type: "paragraph", text: `Hi ${escapeHtml(name)},` },
        {
          type: "paragraph",
          text: `Thank you for choosing to support Cohort 01 and the Institute's library with ${formatNaira(amount)}${tierSuffix}. Complete your payment to confirm it.`,
        },
        { type: "button", label: "Complete Payment", url: authorizationUrl },
      ],
    }),
  });

  await sendEmail({
    to: notificationRecipient(),
    subject: `New Cohort 01 donation pledge: ${name}`,
    html: renderEmail({
      preheader: `${name} pledged ${formatNaira(amount)}.`,
      heading: `New Cohort 01 donation pledge: ${name}`,
      sections: [
        {
          type: "paragraph",
          text: `<strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) pledged ${formatNaira(amount)}${tierSuffix} after submitting their Cohort 01 application.`,
        },
      ],
    }),
  });

  return NextResponse.json({ id: donation.id, authorizationUrl }, { status: 201 });
}
