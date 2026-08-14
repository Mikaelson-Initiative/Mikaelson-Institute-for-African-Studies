import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const formData = await request.formData();
    
    const book = await prisma.bookRecommendation.create({
      data: {
        title: formData.get("title") as string,
        category: (formData.get("category") as string) || "Book",
        genre: formData.get("genre") as string,
        imgUrl: formData.get("imgUrl") as string,
        linkUrl: formData.get("linkUrl") as string,
        sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10),
      },
    });
    return NextResponse.json(book);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to create book" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    
    if (!id) throw new Error("Missing ID");

    const book = await prisma.bookRecommendation.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        category: (formData.get("category") as string) || "Book",
        genre: formData.get("genre") as string,
        imgUrl: formData.get("imgUrl") as string,
        linkUrl: formData.get("linkUrl") as string,
        sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10),
      },
    });
    return NextResponse.json(book);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to update book" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) throw new Error("Missing ID");

    await prisma.bookRecommendation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to delete book" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}
