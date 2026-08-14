import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const formData = await request.formData();
    
    let logoUrl = formData.get("logo") as string | null;
    const file = formData.get("file") as File | null;
    
    if (file && file.size > 0) {
      const blob = await put(`partners/${Date.now()}-${file.name}`, file, { access: "public" });
      logoUrl = blob.url;
    }

    const partner = await prisma.partner.create({
      data: {
        name: formData.get("name") as string,
        type: (formData.get("type") as string) || null,
        logo: logoUrl || null,
        sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10),
      },
    });
    return NextResponse.json(partner);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to create partner" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    
    if (!id) throw new Error("Missing ID");

    let logoUrl = formData.get("logo") as string | null;
    const file = formData.get("file") as File | null;
    
    if (file && file.size > 0) {
      const blob = await put(`partners/${Date.now()}-${file.name}`, file, { access: "public" });
      logoUrl = blob.url;
    }

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        type: (formData.get("type") as string) || null,
        logo: logoUrl || null,
        sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10),
      },
    });
    return NextResponse.json(partner);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to update partner" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) throw new Error("Missing ID");

    await prisma.partner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to delete partner" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}
