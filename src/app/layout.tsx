import type { Metadata } from "next";
import Script from "next/script";
import { Baloo_2, IBM_Plex_Mono, Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

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

const SITE_NAME = "Mikaelson Institute for African Studies";
const SITE_DESCRIPTION =
  "A pan-African academic research institute, publishing scholarship across history and decolonization, society and politics, arts and culture, and religion and philosophy.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s - Mikaelson Institute for African Studies",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "African studies",
    "Africana studies",
    "African studies institute",
    "African studies research",
    "pan-African research institute",
    "African history",
    "decolonization studies",
    "African society and politics",
    "African arts and culture",
    "African religion and philosophy",
    "African studies scholarship",
    "African studies journal",
    "African studies education",
    "African studies university",
    "Ubuntu philosophy",
    "African diaspora studies",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "CyGGGZptjbYyyiMNb0mi9frcF1QKDTWZm2rYwfNXD_o",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "MIAS",
  url: SITE_URL,
  logo: `${SITE_URL}/logos/png/mark-primary-dark-on-teal-512.png`,
  description: SITE_DESCRIPTION,
  sameAs: [] as string[],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${inter.variable} ${ledgerMono.variable} h-full antialiased`}
    >
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-F7L3H5ZV9X" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-F7L3H5ZV9X');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-beige text-ink">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
