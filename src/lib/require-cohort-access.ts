import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Single source of truth for "is this request from an admitted cohort
// student" — mirrors requireAdmin()'s shape. Always re-reads the DB fresh
// (never trusts a cached session claim): admission status can change after a
// session was already issued (90-day JWT maxAge), so a stale claim could let
// a rejected/waitlisted applicant keep access for months.
export async function requireCohortAccess() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, application: null, error: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }

  const application = await prisma.cohortApplication.findUnique({
    where: { userId: session.user.id },
    include: {
      cohort: {
        include: {
          modules: {
            orderBy: { orderIndex: "asc" },
            include: {
              weeks: {
                orderBy: { orderIndex: "asc" },
                include: { steps: { orderBy: { orderIndex: "asc" } } },
              },
            },
          },
        },
      },
    },
  });

  if (!application || application.status !== "admitted" || !application.cohort) {
    return { session, application: null, error: NextResponse.json({ error: "not_admitted" }, { status: 403 }) };
  }

  return { session, application, error: null };
}
