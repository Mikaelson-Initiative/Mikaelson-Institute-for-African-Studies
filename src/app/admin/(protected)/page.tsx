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
  const [
    contactMessages,
    submissions,
    applications,
    teamMembers,
    partners,
    books,
    galleryItems,
  ] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.submission.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.cohortApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.teamMember.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] }),
    prisma.partner.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.bookRecommendation.findMany({ orderBy: [{ genre: "asc" }, { sortOrder: "asc" }] }),
    prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <AdminDashboardClient
      contactMessages={contactMessages}
      submissions={submissions}
      applications={applications}
      teamMembers={teamMembers}
      partners={partners}
      books={books}
      galleryItems={galleryItems}
    />
  );
}
