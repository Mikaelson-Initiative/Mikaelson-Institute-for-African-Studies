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

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data?.reference;
    if (typeof reference === "string" && reference.startsWith("mias-library-")) {
      await confirmLibraryContributionPayment(reference);
    }
  }

  return NextResponse.json({ received: true });
}
