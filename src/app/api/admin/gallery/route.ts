import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const formData = await request.formData();
    
    let imageUrl = formData.get("imageUrl") as string | null;
    const file = formData.get("file") as File | null;
    
    if (file && file.size > 0) {
      const blob = await put(`gallery/${Date.now()}-${file.name}`, file, { access: "public" });
      imageUrl = blob.url;
    }

    if (!imageUrl) {
      throw new Error("Image is required");
    }

    const item = await prisma.galleryItem.create({
      data: {
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || null,
        imageUrl,
        sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10),
      },
    });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to create gallery item" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    
    if (!id) throw new Error("Missing ID");

    let imageUrl = formData.get("imageUrl") as string | null;
    const file = formData.get("file") as File | null;
    
    if (file && file.size > 0) {
      const blob = await put(`gallery/${Date.now()}-${file.name}`, file, { access: "public" });
      imageUrl = blob.url;
    }

    if (!imageUrl) {
      throw new Error("Image is required");
    }

    const item = await prisma.galleryItem.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || null,
        imageUrl,
        sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10),
      },
    });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to update gallery item" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) throw new Error("Missing ID");

    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to delete gallery item" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}
