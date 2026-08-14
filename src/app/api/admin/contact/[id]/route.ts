import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { resolved } = await request.json();

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { resolved: Boolean(resolved) },
  });

  return NextResponse.json(message);
}
