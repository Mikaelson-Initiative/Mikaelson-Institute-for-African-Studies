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

// Same fail-closed env-var pattern as ADMIN_EMAILS, but a separate list: lets
// specific accounts preview/test locked LMS modules ahead of their real
// unlockDate, without granting full admin access and without changing
// unlockDate itself (which would unlock the module for the whole cohort).
function lmsPreviewEmails(): string[] {
  const raw = process.env.LMS_PREVIEW_EMAILS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function hasLmsPreviewAccess(email: string | null | undefined): boolean {
  if (!email) return false;
  return lmsPreviewEmails().includes(email.toLowerCase());
}
