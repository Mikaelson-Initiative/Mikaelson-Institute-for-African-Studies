import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const formData = await request.formData();
    
    let imageUrl = formData.get("image") as string | null;
    const file = formData.get("file") as File | null;
    
    if (file && file.size > 0) {
      const blob = await put(`team/${Date.now()}-${file.name}`, file, { access: "public" });
      imageUrl = blob.url;
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        category: formData.get("category") as string,
        displayIndex: formData.get("displayIndex") as string,
        affiliation: (formData.get("affiliation") as string) || null,
        image: imageUrl || null,
        sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10),
      },
    });
    return NextResponse.json(teamMember);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to create team member" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    
    if (!id) throw new Error("Missing ID");

    let imageUrl = formData.get("image") as string | null;
    const file = formData.get("file") as File | null;
    
    if (file && file.size > 0) {
      const blob = await put(`team/${Date.now()}-${file.name}`, file, { access: "public" });
      imageUrl = blob.url;
    }

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        category: formData.get("category") as string,
        displayIndex: formData.get("displayIndex") as string,
        affiliation: (formData.get("affiliation") as string) || null,
        image: imageUrl || null,
        sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10),
      },
    });
    return NextResponse.json(teamMember);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to update team member" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) throw new Error("Missing ID");

    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "failed to delete team member" }, { status: error.message === "unauthorized" ? 401 : 400 });
  }
}
