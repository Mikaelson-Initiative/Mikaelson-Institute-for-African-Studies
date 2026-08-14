import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute per email, guards the Resend free-tier daily cap

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export type SendCodeResult = { ok: true } | { ok: false; error: "cooldown" };

export async function sendLoginCode(email: string): Promise<SendCodeResult> {
  const recent = await prisma.verificationToken.findFirst({
    where: { identifier: email },
    orderBy: { createdAt: "desc" },
  });

  if (recent && Date.now() - recent.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    return { ok: false, error: "cooldown" };
  }

  // One live code per email at a time.
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  const code = generateCode();
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: code,
      expires: new Date(Date.now() + CODE_TTL_MS),
    },
  });

  await sendEmail({
    to: email,
    subject: `${code} is your Mikaelson Institute sign-in code`,
    html: `<p>Your sign-in code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:4px;">${code}</p><p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`,
  });

  return { ok: true };
}

/** Consumes a code if valid — returns whether it matched, one-time-use. */
export async function verifyLoginCode(email: string, code: string): Promise<boolean> {
  const token = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: code } },
  });

  if (!token || token.expires < new Date()) return false;

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: code } },
  });

  return true;
}
