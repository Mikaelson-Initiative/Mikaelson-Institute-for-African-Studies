import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * Flags a page whose core action (submitting a paper, a new call for
 * papers) isn't the Institute's current priority — Ubuntu, the cohort-based
 * learning programme, is. The page and its form/links stay fully intact;
 * this only adds context above them.
 */
export function ComingSoonNotice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-teal-deep/30 bg-teal-deep/5 p-6 text-center sm:p-8">
      <p className="font-mono-ledger text-xs tracking-widest text-teal-deep uppercase">
        Coming Soon
      </p>
      <p className="mx-auto mt-3 max-w-xl text-base text-ink-muted">{children}</p>
      <div className="mt-6 flex justify-center">
        <Button href="https://learn.mikaelsoninitiative.org/ubuntu">Join Ubuntu</Button>
      </div>
    </div>
  );
}
