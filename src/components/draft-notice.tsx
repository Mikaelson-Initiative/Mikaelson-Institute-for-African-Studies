import type { ReactNode } from "react";

/**
 * Distinct from PlaceholderNotice: this flags real drafted copy that exists
 * but hasn't been formally reviewed/adopted (legal pages, policy language)
 * — content is present, just provisional. Don't conflate with "nothing has
 * been written yet."
 */
export function DraftNotice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded border border-turquoise bg-paper px-4 py-3 font-mono-ledger text-xs text-ink-muted">
      <span className="font-semibold text-ink">Draft -</span> {children}
    </p>
  );
}
