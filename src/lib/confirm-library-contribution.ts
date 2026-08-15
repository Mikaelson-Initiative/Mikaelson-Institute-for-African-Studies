import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { escapeHtml, renderEmail } from "@/lib/email-template";
import { formatNaira } from "@/lib/library-contribution-tiers";
import { verifyTransaction } from "@/lib/paystack";

export type ConfirmResult = "completed" | "already-completed" | "failed" | "not-found" | "mismatch";

// Shared by both the Paystack webhook and the /library/support/callback page
// — the webhook is the authoritative source in production, the callback
// gives an immediate result in the browser and covers local/test setups
// where a webhook URL isn't reachable. Both paths verify directly against
// Paystack's API rather than trusting the reference alone, and re-check the
// charged amount against what we recorded before marking a pledge completed.
export async function confirmLibraryContributionPayment(reference: string): Promise<ConfirmResult> {
  const contribution = await prisma.libraryContribution.findFirst({ where: { reference } });
  if (!contribution) return "not-found";
  if (contribution.status === "completed") return "already-completed";

  const verification = await verifyTransaction(reference);

  if (verification.status !== "success") {
    await prisma.libraryContribution.update({
      where: { id: contribution.id },
      data: { status: "failed" },
    });
    return "failed";
  }

  if (verification.currency !== "NGN" || verification.amountKobo !== contribution.amount * 100) {
    return "mismatch";
  }

  await prisma.libraryContribution.update({
    where: { id: contribution.id },
    data: { status: "completed" },
  });

  await sendEmail({
    to: contribution.email,
    subject: "Your contribution to the Institute's library is confirmed",
    html: renderEmail({
      preheader: "Your payment has been confirmed. Thank you for supporting our library.",
      heading: "Your contribution to the Institute's library is confirmed",
      sections: [
        { type: "paragraph", text: `Hi ${escapeHtml(contribution.name)},` },
        { type: "paragraph", text: `Your payment of ${formatNaira(contribution.amount)} toward the 1,000,000 Books Project${contribution.tier ? ` (${escapeHtml(contribution.tier)} tier)` : ""} has been confirmed. Thank you for supporting our library.` },
      ],
    }),
  });

  return "completed";
}
