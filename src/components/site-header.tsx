"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavDropdown } from "@/components/nav-dropdown";
import { Button } from "@/components/ui/button";
import { aboutDropdownLinks, primaryNavLinks } from "@/lib/nav-links";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-beige text-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight sm:text-xl"
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
          <span className="sr-only">Mikaelson Institute for African Studies</span>
          <span aria-hidden="true" className="text-teal-deep">
            MIAS
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNavLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded px-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                      active ? "text-teal-deep" : "text-ink/70 hover:text-teal-deep"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <NavDropdown label="About" links={aboutDropdownLinks} />
            </li>
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
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-ink/10 lg:hidden">
          <ul className="flex flex-col px-4 py-2">
            {[...primaryNavLinks, ...aboutDropdownLinks].map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center text-base font-medium ${
                      active ? "text-teal-deep" : "text-ink/70"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="py-2">
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
