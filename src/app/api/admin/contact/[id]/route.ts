import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { resolved } = await request.json();

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { resolved: Boolean(resolved) },
  });

  return NextResponse.json(message);
}
