import type { Metadata } from "next";

// Applies to every /admin/* route, including /admin/login — that page is a
// client component ("use client"), which can't export metadata itself, so
// without this it would have no noindex directive at all.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
