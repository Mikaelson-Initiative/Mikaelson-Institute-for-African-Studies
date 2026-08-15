import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmLibraryContributionPayment } from "@/lib/confirm-library-contribution";

export const metadata: Metadata = {
  title: "Confirming your contribution | Mikaelson Institute",
  robots: { index: false },
};

// Paystack redirects the browser here after checkout. This calls Paystack's
// verify endpoint directly rather than waiting on the webhook — reliable in
// local/test setups where Paystack can't reach a webhook URL, and harmless
// in production since confirmLibraryContributionPayment is idempotent.
export default async function LibrarySupportCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  let outcome: Awaited<ReturnType<typeof confirmLibraryContributionPayment>> | "no-reference" = "no-reference";
  if (reference) {
    try {
      outcome = await confirmLibraryContributionPayment(reference);
    } catch {
      outcome = "mismatch";
    }
  }

  const content = {
    completed: {
      icon: <CheckCircle2 className="h-12 w-12 text-emerald-600" />,
      title: "Thank you for your contribution.",
      body: "Your payment has been confirmed. We've emailed you a receipt.",
    },
    "already-completed": {
      icon: <CheckCircle2 className="h-12 w-12 text-emerald-600" />,
      title: "This contribution is already confirmed.",
      body: "Thank you for your support.",
    },
    failed: {
      icon: <XCircle className="h-12 w-12 text-red-600" />,
      title: "Payment wasn't completed.",
      body: "Your card wasn't charged. Feel free to try again.",
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
        <Link href="/library/support">
          <Button variant="primary">Back to Library Support</Button>
        </Link>
        <Link href="/contact">
          <Button variant="ghost">Contact Us</Button>
        </Link>
      </div>
    </div>
  );
}
