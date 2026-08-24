import { NextResponse } from "next/server";
import { confirmLibraryContributionPayment } from "@/lib/confirm-library-contribution";
import { isValidWebhookSignature } from "@/lib/paystack";

// Paystack calls this on charge events. Must read the raw body (not
// request.json()) since the signature is computed over the exact bytes sent.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!isValidWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  if (event.event === "charge.success") {
    const reference = event.data?.reference;
    if (typeof reference === "string" && reference.startsWith("mias-library-")) {
      try {
        await confirmLibraryContributionPayment(reference);
      } catch (err) {
        console.error("paystack webhook: confirmLibraryContributionPayment failed", err);
        return NextResponse.json({ error: "processing failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
