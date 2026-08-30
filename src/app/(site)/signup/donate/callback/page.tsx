import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmCohortDonationPayment } from "@/lib/confirm-cohort-donation";

export const metadata: Metadata = {
  title: "Confirming your contribution | Mikaelson Institute",
  robots: { index: false },
};

// Mirrors /library/support/callback: Paystack redirects the browser here
// after checkout. Verifies directly against Paystack rather than waiting on
// the webhook — reliable in local/test setups and harmless in production
// since confirmCohortDonationPayment is idempotent.
export default async function CohortDonationCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  let outcome: Awaited<ReturnType<typeof confirmCohortDonationPayment>> | "no-reference" = "no-reference";
  if (reference) {
    try {
      outcome = await confirmCohortDonationPayment(reference);
    } catch {
      outcome = "mismatch";
    }
  }

  const content = {
    completed: {
      icon: <CheckCircle2 className="h-12 w-12 text-emerald-600" />,
      title: "You're part of the story now.",
      body: "Your contribution has been confirmed. We've emailed you a receipt, thank you for being part of Cohort 01.",
    },
    "already-completed": {
      icon: <CheckCircle2 className="h-12 w-12 text-emerald-600" />,
      title: "This contribution is already confirmed.",
      body: "Thank you for being part of this.",
    },
    failed: {
      icon: <XCircle className="h-12 w-12 text-red-600" />,
      title: "Payment wasn't completed.",
      body: "Your card wasn't charged. Your application is still submitted either way, feel free to try again anytime.",
    },
    "not-found": {
      icon: <HelpCircle className="h-12 w-12 text-ink-muted" />,
      title: "We couldn't find that contribution.",
      body: "If you completed a payment, contact us and we'll sort it out.",
    },
    mismatch: {
      icon: <HelpCircle className="h-12 w-12 text-ink-muted" />,
      title: "We couldn't confirm this payment automatically.",
      body: "If you completed a payment, contact us and we'll verify it manually.",
    },
    "no-reference": {
      icon: <HelpCircle className="h-12 w-12 text-ink-muted" />,
      title: "No payment reference was provided.",
      body: "If you completed a payment, contact us and we'll verify it manually.",
    },
  }[outcome];

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#faf9f8] px-4 py-24 text-center text-ink">
      <div className="mb-6">{content.icon}</div>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{content.title}</h1>
      <p className="mt-4 max-w-md text-base text-ink-muted">{content.body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/">
          <Button variant="primary">Return Home</Button>
        </Link>
        <Link href="/contact">
          <Button variant="ghost">Contact Us</Button>
        </Link>
      </div>
    </div>
  );
}
