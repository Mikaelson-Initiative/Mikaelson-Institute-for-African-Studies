import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { ACCEPTED_PDF_TYPES, MAX_PDF_FILE_SIZE_BYTES } from "@/lib/validation/admin-upload";

// Lets staff attach/replace/remove a text step's inline PDF material and
// edit its intro, without Prisma Studio. Mirrors src/app/api/admin/gallery/
// route.ts's upload shape — same admin gate, same Vercel Blob call.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const removePdf = formData.get("removePdf") === "true";
  const introMarkdownRaw = formData.get("introMarkdown");
  const introMarkdown = typeof introMarkdownRaw === "string" && introMarkdownRaw.trim() ? introMarkdownRaw.trim() : null;

  let pdfUrl: string | null | undefined;
  let pdfName: string | null | undefined;

  if (file && file.size > 0) {
    if (!ACCEPTED_PDF_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "validation", fieldErrors: { file: ["File must be a PDF."] } },
        { status: 400 },
      );
    }
    if (file.size > MAX_PDF_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "validation", fieldErrors: { file: ["PDF must be under 20MB."] } },
        { status: 400 },
      );
    }
    const blob = await put(`module-steps/${randomUUID()}.pdf`, file, { access: "public" });
    pdfUrl = blob.url;
    pdfName = file.name;
  } else if (removePdf) {
    pdfUrl = null;
    pdfName = null;
  }

  try {
    const step = await prisma.moduleStep.update({
      where: { id },
      data: { introMarkdown, ...(pdfUrl !== undefined ? { pdfUrl, pdfName } : {}) },
    });
    return NextResponse.json(step);
  } catch (err) {
    console.error("admin/module-steps update failed", err);
    return NextResponse.json({ error: "Failed to update step." }, { status: 500 });
  }
}
