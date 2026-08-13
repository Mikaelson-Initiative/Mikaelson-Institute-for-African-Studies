"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { NavDropdown } from "@/components/nav-dropdown";
import { Button } from "@/components/ui/button";
import { navGroups } from "@/lib/nav-links";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-beige text-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xs font-semibold tracking-tight sm:gap-2.5 sm:text-lg lg:text-xl"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logos/svg/mark-primary-light.svg"
            alt=""
            width={64}
            height={64}
            className="h-7 w-7 shrink-0"
            priority
          />
          <span className="text-teal-deep">Mikaelson Institute for African Studies</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navGroups.map((group) => (
              <li key={group.label}>
                <NavDropdown label={group.label} links={group.links} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Button href="/submit">Submit a Paper</Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => {
            setMenuOpen((open) => !open);
            setOpenGroup(null);
          }}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-ink/10 lg:hidden">
          <ul className="flex flex-col px-4 py-2">
            {navGroups.map((group) => {
              const expanded = openGroup === group.label;
              return (
                <li key={group.label} className="border-b border-ink/10 last:border-b-0">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`mobile-group-${group.label}`}
                    onClick={() => setOpenGroup(expanded ? null : group.label)}
                    className="flex min-h-11 w-full items-center justify-between py-2 text-left text-base font-semibold text-ink"
                  >
                    {group.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <ul id={`mobile-group-${group.label}`} className="pb-2">
                      {group.links.map((link) => {
                        const active = pathname === link.href;
                        return (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              aria-current={active ? "page" : undefined}
                              className={`flex min-h-11 items-center pl-3 text-base font-medium ${
                                active ? "text-teal-deep" : "text-ink/70"
                              }`}
                              onClick={() => setMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
            <li className="py-3">
              <Button href="/submit" className="w-full" onClick={() => setMenuOpen(false)}>
                Submit a Paper
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
