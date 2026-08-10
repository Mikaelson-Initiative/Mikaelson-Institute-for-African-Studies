import type { Metadata } from "next";
import { Baloo_2, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Grift is the brand-official header font; the license/webfont files have not
// been provided yet (MIAS_PRD.md Sec. 10, Q1). Baloo 2 is the documented
// placeholder — swap this import for Grift the moment files are available.
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Supplementary archival/ledger utility face for labels and citations
// (MIAS_Design_PRD.md Sec. 3) — not brand-specified, flagged for confirmation.
const ledgerMono = IBM_Plex_Mono({
  variable: "--font-ledger-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Mikaelson Institute for African Studies",
    template: "%s — Mikaelson Institute for African Studies",
  },
  description:
    "A pan-African academic research institute, publishing scholarship across history and decolonization, society and politics, arts and culture, and religion and philosophy.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${inter.variable} ${ledgerMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-beige text-ink">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded focus-visible:bg-paper focus-visible:px-4 focus-visible:py-2 focus-visible:text-ink"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
