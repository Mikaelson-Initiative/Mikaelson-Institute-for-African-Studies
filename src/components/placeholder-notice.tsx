import type { ReactNode } from "react";

/**
 * Flags content that stands in for copy the Institute hasn't provided yet
 * (team bios, legal language, etc.) — per MIAS_Design_PRD.md Sec. 7: "flag if
 * something is missing, but don't invent institutional claims."
 */
export function PlaceholderNotice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded border border-yellow bg-paper px-4 py-3 font-mono-ledger text-xs text-ink-muted">
      <span className="font-semibold text-ink">Placeholder —</span> {children}
    </p>
  );
}
