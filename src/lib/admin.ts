// Admin identity is a plain env var, not a DB role — cheap to change, no
// migration needed. Deliberately fails closed: if ADMIN_EMAILS isn't set,
// nobody is an admin, rather than silently trusting a hardcoded fallback
// baked into source control.
function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}
