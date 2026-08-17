"use client";

import { Compass, ChevronRight, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress } from "@/components/ui/circular-progress";
import { useBreadcrumbTrail } from "@/components/learn/breadcrumb-context";

const STATIC_LABELS: Record<string, string> = {
  "/learn/space": "Space",
  "/learn/modules": "Modules",
  "/learn/discover": "Discover",
  "/learn/profile": "Profile",
};

export function LearnTopNav({
  cohortTitle,
  progressPercent,
}: {
  cohortTitle: string;
  progressPercent: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dynamicTrail = useBreadcrumbTrail();

  const trail = dynamicTrail ?? (STATIC_LABELS[pathname] ? [{ label: STATIC_LABELS[pathname] }] : []);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/learn/space")}
            className="shrink-0 font-display text-sm font-semibold text-ink transition-colors hover:text-teal-deep"
          >
            Mikaelson Institute <span className="text-ink-muted">/ Learn</span>
          </button>
          {trail.length > 0 && (
            <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 sm:flex">
              {trail.map((crumb, index) => (
                <span key={index} className="flex min-w-0 items-center gap-1.5 text-sm text-ink-muted">
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ink/25" />
                  <span className="truncate">{crumb.label}</span>
                </span>
              ))}
            </nav>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2.5 rounded-full border border-teal-deep/20 bg-teal-deep/5 py-1 pr-3 pl-1.5 sm:flex">
            <div className="relative flex h-6 w-6 items-center justify-center">
              <CircularProgress value={progressPercent} size={24} strokeWidth={2.5} />
            </div>
            <span className="font-mono-ledger text-[11px] font-semibold tracking-wide text-teal-deep uppercase">
              {cohortTitle}
            </span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-teal-deep/30" />
            <span className="font-mono-ledger text-[11px] font-semibold text-teal-deep">
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
