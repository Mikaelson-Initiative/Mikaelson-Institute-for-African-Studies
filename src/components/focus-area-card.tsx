import Link from "next/link";
import { BookOpen, Landmark, Palette, Scale } from "lucide-react";
import type { FocusArea } from "@/lib/focus-areas";

const icons = {
  landmark: Landmark,
  scale: Scale,
  palette: Palette,
  "book-open": BookOpen,
} as const;

/**
 * Card hover is a background-color shift only — no scale/transform, so
 * hovering never shifts layout (MIAS_Animated_Frontend_PRD.md Sec. 4).
 */
export function FocusAreaCard({ area }: { area: FocusArea }) {
  const Icon = icons[area.icon];

  return (
    <Link
      href={`/focus-areas#${area.slug}`}
      className="group block rounded-lg border border-ink/10 bg-paper p-6 transition-colors duration-200 hover:bg-beige-panel"
    >
      <Icon aria-hidden="true" className="h-8 w-8 text-teal-deep" />
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">{area.title}</h3>
      <p className="mt-2 text-sm text-ink-muted">{area.summary}</p>
    </Link>
  );
}
