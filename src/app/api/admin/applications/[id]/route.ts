import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { reviewed } = await request.json();

  const application = await prisma.cohortApplication.update({
    where: { id },
    data: { reviewed: Boolean(reviewed) },
  });

  return NextResponse.json(application);
}
