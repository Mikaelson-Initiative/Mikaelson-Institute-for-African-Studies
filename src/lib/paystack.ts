import { createHmac, timingSafeEqual } from "node:crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set.");
  return key;
}

type InitializeTransactionArgs = {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

type InitializeTransactionResult = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

export async function initializeTransaction({
  email,
  amountNaira,
  reference,
  callbackUrl,
  metadata,
}: InitializeTransactionArgs): Promise<InitializeTransactionResult> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountNaira * 100), // kobo
      reference,
      callback_url: callbackUrl,
      currency: "NGN",
      metadata,
    }),
  });

  const body = await response.json();
  if (!response.ok || !body.status) {
    throw new Error(body.message || "Paystack failed to initialize the transaction.");
  }

  return {
    authorizationUrl: body.data.authorization_url,
    accessCode: body.data.access_code,
    reference: body.data.reference,
  };
}

export type VerifyTransactionResult = {
  status: string; // "success" | "failed" | "abandoned" | ...
  reference: string;
  amountKobo: number;
  currency: string;
};

export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey()}` } },
  );

  const body = await response.json();
  if (!response.ok || !body.status) {
    throw new Error(body.message || "Paystack failed to verify the transaction.");
  }

  return {
    status: body.data.status,
    reference: body.data.reference,
    amountKobo: body.data.amount,
    currency: body.data.currency,
  };
}

export function isValidWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const signatureBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== signatureBuf.length) return false;
  return timingSafeEqual(expectedBuf, signatureBuf);
}
