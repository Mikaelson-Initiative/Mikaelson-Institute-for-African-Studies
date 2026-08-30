"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Lock } from "lucide-react";

export type ModuleOption = { id: string; title: string; locked: boolean };

// The Modules list's "which module am I looking at" control — a styled
// dropdown rather than the page's whole content, so switching modules is
// one click and doesn't require a full list of every module on screen at
// once (see the design reference this mirrors).
export function ModuleSelect({ modules, selectedId }: { modules: ModuleOption[]; selectedId: string }) {
  const router = useRouter();

  return (
    <div className="max-w-md">
      <label htmlFor="module-select" className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-muted uppercase">
        Modules
      </label>
      <div className="relative">
        <select
          id="module-select"
          value={selectedId}
          onChange={(e) => router.push(`/ubuntu/modules?module=${e.target.value}`)}
          className="w-full appearance-none rounded-xl border border-teal-deep/30 bg-white px-4 py-3 pr-10 font-display text-lg font-medium text-ink focus:border-teal-deep focus:ring-1 focus:ring-teal-deep focus:outline-none"
        >
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
              {m.locked ? " (locked)" : ""}
            </option>
          ))}
        </select>
        {modules.find((m) => m.id === selectedId)?.locked ? (
          <Lock aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-ink/40" />
        ) : (
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-ink/40" />
        )}
      </div>
    </div>
  );
}
