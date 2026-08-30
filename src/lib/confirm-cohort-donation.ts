import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { escapeHtml, renderEmail } from "@/lib/email-template";
import { formatNaira } from "@/lib/cohort-donation-tiers";
import { verifyTransaction } from "@/lib/paystack";

export type ConfirmResult = "completed" | "already-completed" | "failed" | "not-found" | "mismatch";

// Mirrors confirmLibraryContributionPayment (src/lib/confirm-library-contribution.ts)
// — shared by both the Paystack webhook and /signup/donate/callback, verifies
// directly against Paystack rather than trusting the reference alone, and the
// updateMany's status-not-completed condition keeps a webhook/callback race
// from sending the confirmation email twice.
export async function confirmCohortDonationPayment(reference: string): Promise<ConfirmResult> {
  const donation = await prisma.cohortDonation.findFirst({ where: { reference } });
  if (!donation) return "not-found";
  if (donation.status === "completed") return "already-completed";

  const verification = await verifyTransaction(reference);

  if (verification.status !== "success") {
    await prisma.cohortDonation.update({
      where: { id: donation.id },
      data: { status: "failed" },
    });
    return "failed";
  }

  if (verification.currency !== "NGN" || verification.amountKobo !== donation.amount * 100) {
    return "mismatch";
  }

  const { count } = await prisma.cohortDonation.updateMany({
    where: { id: donation.id, status: { not: "completed" } },
    data: { status: "completed" },
  });
  if (count === 0) return "already-completed";

  await sendEmail({
    to: donation.email,
    subject: "Thank you for becoming part of Cohort 01's story",
    html: renderEmail({
      preheader: "Your contribution has been confirmed. Thank you for being part of this.",
      heading: "You're part of the story now",
      sections: [
        { type: "paragraph", text: `Hi ${escapeHtml(donation.name)},` },
        {
          type: "paragraph",
          text: `Your contribution of ${formatNaira(donation.amount)}${donation.tier ? ` (${escapeHtml(donation.tier)})` : ""} has been confirmed. Cohort 01, and the library it's building toward, carries a little of you in it now. Thank you.`,
        },
      ],
    }),
  });

  return "completed";
}
