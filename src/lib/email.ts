import { Resend } from "resend";

// Mirrors the env-gated fallback already used in prisma.config.ts: with no
// RESEND_API_KEY (e.g. local dev, or before a sending domain is verified),
// fall back to logging instead of throwing — real sends require real
// credentials that aren't fabricated here. See .env.example.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// The address transactional email sends "from" — must be on a domain
// verified with Resend before real sends will succeed.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

// Where staff-facing notifications (e.g. a submitted contact message) land —
// confirmed with the Institute 2026-08-13.
const NOTIFICATION_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL ?? "institute@mikaelsoninitiative.org";

// Email is a best-effort notification, not the source of truth — the
// caller has already committed the real data (ContactMessage/Submission row)
// to Postgres before this runs. A Resend failure (e.g. the 403 Resend
// returns for any recipient besides the account owner's own email, until a
// sending domain is verified) must not fail the whole request and make a
// successfully-saved submission look like it errored to the user.
export async function sendEmail(params: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log(`[dev-email] Would send "${params.subject}" to ${params.to}.`);
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: `Mikaelson Institute for African Studies <${FROM_EMAIL}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error(`[email] Failed to send "${params.subject}" to ${params.to}:`, error);
    }
  } catch (error) {
    // The SDK itself can throw (network failure, malformed response) rather
    // than resolve with { error } — must still not propagate, per the note
    // above.
    console.error(`[email] Failed to send "${params.subject}" to ${params.to}:`, error);
  }
}

export function notificationRecipient() {
  return NOTIFICATION_EMAIL;
}
