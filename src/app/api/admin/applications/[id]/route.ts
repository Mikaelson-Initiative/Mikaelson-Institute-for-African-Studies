import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { reviewed } = await request.json();

  const application = await prisma.cohortApplication.update({
    where: { id },
    data: { reviewed: Boolean(reviewed) },
  });

  return NextResponse.json(application);
}
