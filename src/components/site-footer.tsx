import Image from "next/image";
import Link from "next/link";
import { footerNavLinks } from "@/lib/nav-links";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-teal-deep-panel text-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="flex items-center gap-2.5 font-display text-lg font-semibold">
              <Image
                src="/logos/svg/mark-primary-dark.svg"
                alt=""
                width={64}
                height={64}
                className="h-6 w-6 shrink-0"
              />
              Mikaelson Institute for African Studies
            </p>
            <p className="mt-2 max-w-sm text-sm text-paper/70">
              A pan-African academic research institute, publishing
              scholarship in history and decolonization, society and
              politics, arts and culture, and religion and philosophy.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-paper/80 transition-colors duration-200 hover:text-turquoise"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-paper/15 pt-6 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Mikaelson Institute for African Studies.</p>
          {/*
            The mark above is MIAS's own logomark (public/logos/), confirmed
            separately from the parent Mikaelson Initiative's "M" mark (two
            figures forming an M), which still hasn't been provided — this
            text line is that low-key parent credit per Design PRD Sec. 2.
          */}
          <p>Part of the Mikaelson Community Development and Tech Initiative.</p>
        </div>
      </div>
    </footer>
  );
}
