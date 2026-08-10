"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { NavLink } from "@/lib/nav-links";

/**
 * Click/keyboard-driven dropdown, not hover-only (Pre-Delivery Checklist:
 * "nothing is reachable only via hover"). Closes on Escape, outside click, or
 * link selection; chevron rotation is transform-only, 200ms per the
 * Animation PRD's micro-interaction duration.
 */
export function NavDropdown({ label, links }: { label: string; links: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = links.some((link) => link.href === pathname);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex min-h-11 items-center gap-1 rounded px-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
          active ? "text-teal-deep" : "text-ink/70 hover:text-teal-deep"
        }`}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="menu"
          aria-label={label}
          className="absolute top-full left-0 mt-1 min-w-44 rounded-md border border-ink/10 bg-paper py-1 shadow-lg"
        >
          {links.map((link) => {
            const linkActive = pathname === link.href;
            return (
              <li key={link.href} role="none">
                <Link
                  role="menuitem"
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center px-4 text-sm font-medium whitespace-nowrap ${
                    linkActive ? "text-teal-deep" : "text-ink/70 hover:text-teal-deep"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
