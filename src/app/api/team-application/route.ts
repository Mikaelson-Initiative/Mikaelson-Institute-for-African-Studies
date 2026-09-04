import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { notificationRecipient, sendEmail } from "@/lib/email";
import { escapeHtml, renderEmail, safeHref } from "@/lib/email-template";
import { prisma } from "@/lib/prisma";
import { getClientIp, formIpLimiter, rateLimitOrResponse } from "@/lib/rate-limit";
import {
  ACCEPTED_CV_FILE_TYPES,
  MAX_CV_FILE_SIZE_BYTES,
  teamApplicationFieldsSchema,
} from "@/lib/validation/team-application";

const ROLE_INTEREST_LABELS: Record<string, string> = {
  "curriculum-historian": "Curriculum Historian / Content Lead",
  "instructional-designer": "Instructional Designer",
  "fullstack-engineer": "Full-Stack Engineer",
  "community-cohort-manager": "Community & Cohort Manager",
  "operations-program-lead": "Operations & Program Lead",
  "social-media-manager": "Social Media Manager",
  "academic-partnerships-lead": "Academic Partnerships Lead",
  other: "Other",
};

// Same Vercel Blob / local-disk fallback pattern as paper submissions
// (see src/app/api/submissions/route.ts) — Vercel Functions have a
// read-only filesystem outside /tmp, so BLOB_READ_WRITE_TOKEN must be
// set before deploying.
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "team-applications");

// Extension is derived from the already-validated MIME type, never from the
// client-supplied file.name — see the matching comment in
// src/app/api/submissions/route.ts.
const EXTENSION_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

async function storeCvFile(file: File): Promise<string> {
  const extension = EXTENSION_BY_MIME[file.type] ?? "bin";
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
  const limited = await rateLimitOrResponse(formIpLimiter, getClientIp(request));
  if (limited) return limited;

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
    html: renderEmail({
      preheader: "We've received your volunteer application and will be in touch.",
      heading: "We've received your volunteer application",
      sections: [
        { type: "paragraph", text: `Hi ${escapeHtml(name)},` },
        { type: "paragraph", text: "Thank you for applying to volunteer with the Mikaelson Institute for African Studies. We've received your application and will be in touch." },
      ],
    }),
  });

  const roleLabel = roleInterest === "other" && customRole
    ? customRole
    : ROLE_INTEREST_LABELS[roleInterest] ?? roleInterest;

  const linkedinHref = safeHref(linkedinUrl);
  const cvHref = safeHref(cvUrl);

  await sendEmail({
    to: notificationRecipient(),
    subject: `New volunteer application: ${name}`,
    html: renderEmail({
      preheader: `${name} applied to volunteer.`,
      heading: `New volunteer application: ${name}`,
      sections: [
        { type: "paragraph", text: `<strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) applied to volunteer.` },
        { type: "details", rows: [
          { label: "Phone", value: escapeHtml(phoneNumber) },
          { label: "City", value: escapeHtml(location) },
          { label: "Area of interest", value: escapeHtml(roleLabel) },
          { label: "Availability", value: `${escapeHtml(availability)} (${hoursPerWeek} hrs/week)` },
          { label: "Volunteered before", value: volunteeredBefore ? "Yes" : "No" },
          { label: "LinkedIn", value: linkedinHref ? `<a href="${linkedinHref}">${escapeHtml(linkedinUrl)}</a>` : escapeHtml(linkedinUrl) },
          { label: "CV", value: cvHref ? `<a href="${cvHref}">${escapeHtml(cv.name)}</a>` : escapeHtml(cv.name) },
        ] },
        { type: "divider" },
        { type: "paragraph", text: `<strong>Experience:</strong> ${escapeHtml(experience)}` },
        { type: "paragraph", text: `<strong>Motivation:</strong> ${escapeHtml(motivation)}` },
      ],
    }),
  });

  return NextResponse.json({ id: application.id }, { status: 201 });
}
