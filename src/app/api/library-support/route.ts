import { NextResponse } from "next/server";
import { notificationRecipient, sendEmail } from "@/lib/email";
import { escapeHtml, renderEmail } from "@/lib/email-template";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/library-contribution-tiers";
import { initializeTransaction } from "@/lib/paystack";
import { getClientIp, formIpLimiter, rateLimitOrResponse } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";
import { libraryContributionSchema } from "@/lib/validation/library-support";

// Records a pledge as "pending", then initializes a Paystack transaction for
// it. The client redirects the browser to the returned authorization_url to
// complete payment; the pledge flips to "completed" once
// /library/support/callback (or the Paystack webhook, in production) verifies
// the charge — see src/lib/confirm-library-contribution.ts.
export async function POST(request: Request) {
  const limited = await rateLimitOrResponse(formIpLimiter, getClientIp(request));
  if (limited) return limited;

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

  const reference = `mias-library-${contribution.id}`;

  let authorizationUrl: string;
  try {
    const transaction = await initializeTransaction({
      email,
      amountNaira: amount,
      reference,
      callbackUrl: `${SITE_URL}/library/support/callback`,
      metadata: { contributionId: contribution.id, tier: tier ?? null },
    });
    authorizationUrl = transaction.authorizationUrl;
  } catch {
    return NextResponse.json(
      { error: "payment", message: "Couldn't start the payment. Try again in a moment." },
      { status: 502 },
    );
  }

  await prisma.libraryContribution.update({
    where: { id: contribution.id },
    data: { reference },
  });

  const tierSuffix = tier ? ` (${escapeHtml(tier)} tier)` : "";

  await sendEmail({
    to: email,
    subject: "Thank you for supporting the Institute's library",
    html: renderEmail({
      preheader: `Complete your payment to confirm your pledge of ${formatNaira(amount)}.`,
      heading: `Thank you for pledging ${formatNaira(amount)}`,
      sections: [
        { type: "paragraph", text: `Hi ${escapeHtml(name)},` },
        { type: "paragraph", text: `Thank you for pledging ${formatNaira(amount)} toward the 1,000,000 Books Project${tierSuffix}. Complete your payment to confirm it.` },
        { type: "button", label: "Complete Payment", url: authorizationUrl },
      ],
    }),
  });

  await sendEmail({
    to: notificationRecipient(),
    subject: `New library contribution pledge: ${name}`,
    html: renderEmail({
      preheader: `${name} pledged ${formatNaira(amount)}.`,
      heading: `New library contribution pledge: ${name}`,
      sections: [
        { type: "paragraph", text: `<strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) pledged ${formatNaira(amount)}${tierSuffix}.` },
      ],
    }),
  });

  return NextResponse.json({ id: contribution.id, authorizationUrl }, { status: 201 });
}
