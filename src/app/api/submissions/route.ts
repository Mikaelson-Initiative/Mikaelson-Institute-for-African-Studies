import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { escapeHtml, renderEmail } from "@/lib/email-template";
import { prisma } from "@/lib/prisma";
import { getClientIp, formIpLimiter, rateLimitOrResponse } from "@/lib/rate-limit";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
  submissionFieldsSchema,
} from "@/lib/validation/submission";

// With BLOB_READ_WRITE_TOKEN set, uploads go to Vercel Blob. Without it
// (local dev with no token provisioned yet), falls back to the local
// filesystem — see .env.example. That fallback only works under
// `npm run dev`; Vercel Functions have an ephemeral, read-only filesystem
// outside /tmp, so BLOB_READ_WRITE_TOKEN must be set before deploying.
//
// NOTE ON ACCESS CONTROL: the provisioned Blob store is public-access only
// (Vercel Blob's private-access mode is a separate store configuration,
// opted into at store creation — this store wasn't). `put(..., {access:
// "private"})` fails with "Cannot use private access on a public store"
// against it. Filenames are still an unguessable UUID (no directory
// listing, no public page links to them), but the URL is fetchable by
// anyone who obtains it — this is weaker than the old local-disk behavior,
// where files sat entirely outside any served route. If tighter access
// control matters before Phase 3's admin/download gating exists, provision
// a dedicated private-access Blob store instead.
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "submissions");

// Extension is derived from the already-validated MIME type, never from the
// client-supplied file.name — using the raw filename here let a crafted name
// (e.g. one whose "extension" contains "../") escape UPLOAD_DIR via path.join.
const EXTENSION_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

async function storeSubmissionFile(file: File): Promise<string> {
  const extension = EXTENSION_BY_MIME[file.type] ?? "bin";
  const storedFileName = `${randomUUID()}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`submissions/${storedFileName}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const storedPath = path.join(UPLOAD_DIR, storedFileName);
  await writeFile(storedPath, Buffer.from(await file.arrayBuffer()));
  return storedPath;
}

export async function POST(request: Request) {
  const limited = await rateLimitOrResponse(formIpLimiter, getClientIp(request));
  if (limited) return limited;

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

  const fileUrl = await storeSubmissionFile(file);

  const submission = await prisma.submission.create({
    data: {
      ...fields.data,
      fileUrl,
      fileName: file.name,
    },
  });

  await sendEmail({
    to: submission.authorEmail,
    subject: "We received your submission",
    html: renderEmail({
      preheader: `Your submission "${submission.title}" has been received.`,
      heading: "We received your submission",
      sections: [
        { type: "paragraph", text: `Thank you for submitting "${escapeHtml(submission.title)}" to Mikaelson Institute for African Studies.` },
        { type: "details", rows: [{ label: "Tracking reference", value: submission.id }] },
      ],
    }),
  });

  return NextResponse.json({ id: submission.id }, { status: 201 });
}
