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
import { teamMemberFieldsSchema } from "@/lib/validation/admin-content";

async function resolveImageUrl(formData: FormData, existingImage: string | null) {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { imageUrl: existingImage, error: null as NextResponse | null };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      imageUrl: null,
      error: NextResponse.json(
        { error: "validation", fieldErrors: { file: ["Photo must be PNG, JPEG, WEBP, or GIF."] } },
        { status: 400 },
      ),
    };
  }
  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return {
      imageUrl: null,
      error: NextResponse.json(
        { error: "validation", fieldErrors: { file: ["Photo must be under 5MB."] } },
        { status: 400 },
      ),
    };
  }

  const extension = IMAGE_EXTENSION_BY_MIME[file.type];
  const blob = await put(`team/${randomUUID()}.${extension}`, file, { access: "public" });
  return { imageUrl: blob.url, error: null as NextResponse | null };
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await request.formData();
  const { imageUrl, error: uploadError } = await resolveImageUrl(formData, formData.get("image") as string | null);
  if (uploadError) return uploadError;

  const fields = teamMemberFieldsSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    category: formData.get("category"),
    displayIndex: formData.get("displayIndex") || "",
    affiliation: formData.get("affiliation") || null,
    sortOrder: formData.get("sortOrder") || "0",
  });
  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const teamMember = await prisma.teamMember.create({ data: { ...fields.data, image: imageUrl || null } });
    return NextResponse.json(teamMember);
  } catch (err) {
    console.error("admin/team create failed", err);
    return NextResponse.json({ error: "Failed to create team member." }, { status: 500 });
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

  const { imageUrl, error: uploadError } = await resolveImageUrl(formData, formData.get("image") as string | null);
  if (uploadError) return uploadError;

  const fields = teamMemberFieldsSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    category: formData.get("category"),
    displayIndex: formData.get("displayIndex") || "",
    affiliation: formData.get("affiliation") || null,
    sortOrder: formData.get("sortOrder") || "0",
  });
  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const teamMember = await prisma.teamMember.update({ where: { id }, data: { ...fields.data, image: imageUrl || null } });
    return NextResponse.json(teamMember);
  } catch (err) {
    console.error("admin/team update failed", err);
    return NextResponse.json({ error: "Failed to update team member." }, { status: 500 });
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
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("admin/team delete failed", err);
    return NextResponse.json({ error: "Failed to delete team member." }, { status: 500 });
  }
}
