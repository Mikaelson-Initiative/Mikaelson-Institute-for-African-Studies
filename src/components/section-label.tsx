type SectionLabelProps = {
  children: string;
  /** Use "inverse" on dark (teal) section backgrounds — hero, CFP band. */
  tone?: "default" | "inverse";
  className?: string;
};

/**
 * Small mono "field label" preceding a section's heading — the archival/
 * ledger device threaded through every section on Home, not just the hero
 * eyebrow. Named for what the section actually is (not a sequence number:
 * these sections aren't ordered content, per ui-ux-pro-max's caution against
 * numbering non-sequential content — MIAS_Design_PRD.md's Focus Areas are
 * explicitly unranked).
 *
 * Color follows the accessibility finding in design-system/mias/MASTER.md:
 * turquoise text is only legible on the Deep Teal background (7.53:1) — on
 * beige/white sections it drops to ~1.2:1, so `default` uses Deep Teal text
 * instead of turquoise.
 */
export function SectionLabel({ children, tone = "default", className = "" }: SectionLabelProps) {
  const toneClasses = tone === "inverse" ? "border-turquoise text-turquoise" : "border-teal-deep text-teal-deep";

  return (
    <p
      className={`font-mono-ledger inline-flex items-center border-l-2 pl-3 text-xs tracking-widest uppercase ${toneClasses} ${className}`}
    >
      {children}
    </p>
  );
}
