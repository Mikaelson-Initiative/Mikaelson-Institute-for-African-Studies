import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Always fresh — this is an internal staff tool, not public content that
// benefits from ISR.
export const revalidate = 0;

export default async function AdminPage() {
  const [contactMessages, submissions, applications] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.submission.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.cohortApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return (
    <AdminDashboardClient
      contactMessages={contactMessages}
      submissions={submissions}
      applications={applications}
    />
  );
}
