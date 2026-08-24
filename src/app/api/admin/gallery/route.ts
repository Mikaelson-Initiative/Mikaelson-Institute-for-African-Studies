import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  ACCEPTED_IMAGE_TYPES,
  IMAGE_EXTENSION_BY_MIME,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from "@/lib/validation/admin-upload";
import { galleryItemFieldsSchema } from "@/lib/validation/admin-content";

async function resolveImageUrl(formData: FormData, existingImageUrl: string | null) {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { imageUrl: existingImageUrl, error: null as NextResponse | null };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      imageUrl: null,
      error: NextResponse.json(
        { error: "validation", fieldErrors: { file: ["Image must be PNG, JPEG, WEBP, or GIF."] } },
        { status: 400 },
      ),
    };
  }
  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return {
      imageUrl: null,
      error: NextResponse.json(
        { error: "validation", fieldErrors: { file: ["Image must be under 5MB."] } },
        { status: 400 },
      ),
    };
  }

  const extension = IMAGE_EXTENSION_BY_MIME[file.type];
  const blob = await put(`gallery/${randomUUID()}.${extension}`, file, { access: "public" });
  return { imageUrl: blob.url, error: null as NextResponse | null };
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await request.formData();
  const { imageUrl, error: uploadError } = await resolveImageUrl(formData, formData.get("imageUrl") as string | null);
  if (uploadError) return uploadError;
  if (!imageUrl) {
    return NextResponse.json({ error: "validation", fieldErrors: { file: ["Image is required."] } }, { status: 400 });
  }

  const fields = galleryItemFieldsSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    sortOrder: formData.get("sortOrder") || "0",
  });
  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const item = await prisma.galleryItem.create({ data: { ...fields.data, imageUrl } });
    return NextResponse.json(item);
  } catch (err) {
    console.error("admin/gallery create failed", err);
    return NextResponse.json({ error: "Failed to create gallery item." }, { status: 500 });
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

  const { imageUrl, error: uploadError } = await resolveImageUrl(formData, formData.get("imageUrl") as string | null);
  if (uploadError) return uploadError;
  if (!imageUrl) {
    return NextResponse.json({ error: "validation", fieldErrors: { file: ["Image is required."] } }, { status: 400 });
  }

  const fields = galleryItemFieldsSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    sortOrder: formData.get("sortOrder") || "0",
  });
  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const item = await prisma.galleryItem.update({ where: { id }, data: { ...fields.data, imageUrl } });
    return NextResponse.json(item);
  } catch (err) {
    console.error("admin/gallery update failed", err);
    return NextResponse.json({ error: "Failed to update gallery item." }, { status: 500 });
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
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("admin/gallery delete failed", err);
    return NextResponse.json({ error: "Failed to delete gallery item." }, { status: 500 });
  }
}
