// Admin identity is a plain env var, not a DB role — cheap to change,
// no migration needed. Defaults to the two real, already-established
// identities in this codebase (see src/lib/email.ts's notification
// recipient, and the founder's own Google account already in the User
// table) so this isn't inventing a new concept, just gating on it.
const DEFAULT_ADMIN_EMAILS = "institute@mikaelsoninitiative.org,olukayodesegunmichael@gmail.com";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? DEFAULT_ADMIN_EMAILS)
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}
