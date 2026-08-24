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
import { partnerFieldsSchema } from "@/lib/validation/admin-content";

async function resolveLogoUrl(formData: FormData, existingLogo: string | null) {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { logoUrl: existingLogo, error: null as NextResponse | null };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      logoUrl: null,
      error: NextResponse.json(
        { error: "validation", fieldErrors: { file: ["Logo must be PNG, JPEG, WEBP, or GIF."] } },
        { status: 400 },
      ),
    };
  }
  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return {
      logoUrl: null,
      error: NextResponse.json(
        { error: "validation", fieldErrors: { file: ["Logo must be under 5MB."] } },
        { status: 400 },
      ),
    };
  }

  const extension = IMAGE_EXTENSION_BY_MIME[file.type];
  const blob = await put(`partners/${randomUUID()}.${extension}`, file, { access: "public" });
  return { logoUrl: blob.url, error: null as NextResponse | null };
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await request.formData();
  const { logoUrl, error: uploadError } = await resolveLogoUrl(formData, formData.get("logo") as string | null);
  if (uploadError) return uploadError;

  const fields = partnerFieldsSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type") || null,
    sortOrder: formData.get("sortOrder") || "0",
  });
  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const partner = await prisma.partner.create({ data: { ...fields.data, logo: logoUrl || null } });
    return NextResponse.json(partner);
  } catch (err) {
    console.error("admin/partners create failed", err);
    return NextResponse.json({ error: "Failed to create partner." }, { status: 500 });
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

  const { logoUrl, error: uploadError } = await resolveLogoUrl(formData, formData.get("logo") as string | null);
  if (uploadError) return uploadError;

  const fields = partnerFieldsSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type") || null,
    sortOrder: formData.get("sortOrder") || "0",
  });
  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const partner = await prisma.partner.update({ where: { id }, data: { ...fields.data, logo: logoUrl || null } });
    return NextResponse.json(partner);
  } catch (err) {
    console.error("admin/partners update failed", err);
    return NextResponse.json({ error: "Failed to update partner." }, { status: 500 });
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
    await prisma.partner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("admin/partners delete failed", err);
    return NextResponse.json({ error: "Failed to delete partner." }, { status: 500 });
  }
}
