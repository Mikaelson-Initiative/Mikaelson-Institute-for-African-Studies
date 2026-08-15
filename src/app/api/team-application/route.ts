import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { notificationRecipient, sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import {
  ACCEPTED_CV_FILE_TYPES,
  MAX_CV_FILE_SIZE_BYTES,
  teamApplicationFieldsSchema,
} from "@/lib/validation/team-application";

const ROLE_INTEREST_LABELS: Record<string, string> = {
  "research-editorial": "Research & Editorial",
  "design-technology": "Design & Technology",
  "community-outreach": "Community & Outreach",
  "operations-admin": "Operations & Administration",
  other: "Other",
};

// Same Vercel Blob / local-disk fallback pattern as paper submissions
// (see src/app/api/submissions/route.ts) — Vercel Functions have a
// read-only filesystem outside /tmp, so BLOB_READ_WRITE_TOKEN must be
// set before deploying.
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "team-applications");

async function storeCvFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop();
  const storedFileName = `${randomUUID()}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`team-applications/${storedFileName}`, file, {
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
  const formData = await request.formData();

  const fields = teamApplicationFieldsSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    location: formData.get("location"),
    roleInterest: formData.get("roleInterest"),
    customRole: formData.get("customRole") || undefined,
    availability: formData.get("availability"),
    hoursPerWeek: formData.get("hoursPerWeek"),
    volunteeredBefore: formData.get("volunteeredBefore"),
    experience: formData.get("experience"),
    linkedinUrl: formData.get("linkedinUrl"),
    motivation: formData.get("motivation"),
  });

  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const cv = formData.get("cv");
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json(
      { error: "validation", fieldErrors: { cv: ["Attach your CV."] } },
      { status: 400 },
    );
  }
  if (!ACCEPTED_CV_FILE_TYPES.includes(cv.type)) {
    return NextResponse.json(
      { error: "validation", fieldErrors: { cv: ["CV must be a PDF or Word document."] } },
      { status: 400 },
    );
  }
  if (cv.size > MAX_CV_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "validation", fieldErrors: { cv: ["CV must be under 10MB."] } },
      { status: 400 },
    );
  }

  const cvUrl = await storeCvFile(cv);

  const {
    name,
    email,
    phoneNumber,
    location,
    roleInterest,
    customRole,
    availability,
    hoursPerWeek,
    volunteeredBefore,
    experience,
    linkedinUrl,
    motivation,
  } = fields.data;

  const application = await prisma.teamApplication.create({
    data: {
      name,
      email,
      phoneNumber,
      location,
      roleInterest,
      customRole: roleInterest === "other" ? customRole || null : null,
      availability,
      hoursPerWeek,
      volunteeredBefore,
      experience,
      linkedinUrl,
      cvUrl,
      cvFileName: cv.name,
      motivation,
    },
  });

  await sendEmail({
    to: email,
    subject: "We've received your volunteer application",
    html: `<p>Hi ${name},</p><p>Thank you for applying to volunteer with the Mikaelson Institute for African Studies. We've received your application and will be in touch.</p>`,
  });

  const roleLabel = roleInterest === "other" && customRole
    ? customRole
    : ROLE_INTEREST_LABELS[roleInterest] ?? roleInterest;

  await sendEmail({
    to: notificationRecipient(),
    subject: `New volunteer application: ${name}`,
    html: `<p><strong>${name}</strong> (${email}) applied to volunteer.</p><p><strong>Phone:</strong> ${phoneNumber} &middot; <strong>City:</strong> ${location}</p><p><strong>Area of interest:</strong> ${roleLabel}</p><p><strong>Availability:</strong> ${availability} (${hoursPerWeek} hrs/week)</p><p><strong>Volunteered before:</strong> ${volunteeredBefore ? "Yes" : "No"}</p><p><strong>LinkedIn:</strong> ${linkedinUrl}</p><p><strong>CV:</strong> <a href="${cvUrl}">${cv.name}</a></p><p><strong>Experience:</strong> ${experience}</p><p><strong>Motivation:</strong> ${motivation}</p>`,
  });

  return NextResponse.json({ id: application.id }, { status: 201 });
}
