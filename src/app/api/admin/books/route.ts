import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { bookFieldsSchema } from "@/lib/validation/admin-content";

function parseFields(formData: FormData) {
  return bookFieldsSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category") || "Book",
    genre: formData.get("genre"),
    imgUrl: formData.get("imgUrl"),
    linkUrl: formData.get("linkUrl"),
    sortOrder: formData.get("sortOrder") || "0",
  });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await request.formData();
  const fields = parseFields(formData);
  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const book = await prisma.bookRecommendation.create({ data: fields.data });
    return NextResponse.json(book);
  } catch (err) {
    console.error("admin/books create failed", err);
    return NextResponse.json({ error: "Failed to create book." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await request.formData();
  const id = formData.get("id") as string | null;
  if (!id) {
    return NextResponse.json({ error: "Missing ID." }, { status: 400 });
  }

  const fields = parseFields(formData);
  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const book = await prisma.bookRecommendation.update({ where: { id }, data: fields.data });
    return NextResponse.json(book);
  } catch (err) {
    console.error("admin/books update failed", err);
    return NextResponse.json({ error: "Failed to update book." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing ID." }, { status: 400 });
  }

  try {
    await prisma.bookRecommendation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("admin/books delete failed", err);
    return NextResponse.json({ error: "Failed to delete book." }, { status: 500 });
  }
}
