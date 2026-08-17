import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const VALID_STATUSES = ["pending", "admitted", "rejected", "waitlisted"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  // Built conditionally — each field is independently optional (the admin
  // dashboard sends one field at a time: reviewed, status, or cohortId), so
  // an absent field must not overwrite what's already stored.
  const data: {
    reviewed?: boolean;
    status?: "pending" | "admitted" | "rejected" | "waitlisted";
    cohortId?: string | null;
  } = {};

  if (typeof body.reviewed === "boolean") {
    data.reviewed = body.reviewed;
  }
  if (typeof body.status === "string") {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "validation", message: "Invalid status." }, { status: 400 });
    }
    data.status = body.status as "pending" | "admitted" | "rejected" | "waitlisted";
  }
  if (typeof body.cohortId === "string") {
    data.cohortId = body.cohortId || null;
  }

  const application = await prisma.cohortApplication.update({
    where: { id },
    data,
  });

  return NextResponse.json(application);
}
