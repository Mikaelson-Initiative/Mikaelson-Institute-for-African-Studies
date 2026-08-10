import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
  submissionFieldsSchema,
} from "@/lib/validation/submission";

// Dev stand-in for S3/Cloudflare R2 (MIAS_PRD.md Sec. 3) — files land outside
// /public so they're never publicly reachable by URL, matching the
// non-functional requirement that unpublished submissions stay access-controlled.
//
// LOCAL DEV ONLY: this writes to the local filesystem, which works under
// `npm run dev` but NOT once deployed — Vercel Functions have an ephemeral,
// read-only filesystem outside /tmp, so writes here would silently vanish in
// production. This must be swapped for Vercel Blob (or S3/R2) before deploy;
// no storage credentials exist yet to wire that up (see MIAS_PRD.md Sec. 3).
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "submissions");

export async function POST(request: Request) {
  const formData = await request.formData();

  const fields = submissionFieldsSchema.safeParse({
    title: formData.get("title"),
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
    focusArea: formData.get("focusArea"),
    abstract: formData.get("abstract"),
  });

  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "validation", fieldErrors: { file: ["Attach a PDF or DOCX file."] } },
      { status: 400 },
    );
  }
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "validation", fieldErrors: { file: ["File must be a PDF or DOCX."] } },
      { status: 400 },
    );
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "validation", fieldErrors: { file: ["File must be under 20MB."] } },
      { status: 400 },
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const extension = file.name.split(".").pop();
  const storedFileName = `${randomUUID()}.${extension}`;
  const storedPath = path.join(UPLOAD_DIR, storedFileName);
  await writeFile(storedPath, Buffer.from(await file.arrayBuffer()));

  const submission = await prisma.submission.create({
    data: {
      ...fields.data,
      fileUrl: storedPath,
      fileName: file.name,
    },
  });

  // Dev stand-in for Resend/SendGrid (MIAS_PRD.md Sec. 3) — logs instead of
  // sending until real email credentials exist.
  console.log(
    `[dev-email] Confirmation for ${submission.authorEmail}: submission ${submission.id} received.`,
  );

  return NextResponse.json({ id: submission.id }, { status: 201 });
}
