import { NextResponse } from "next/server";
import { notificationRecipient, sendEmail } from "@/lib/email";
import { escapeHtml, renderEmail } from "@/lib/email-template";
import { prisma } from "@/lib/prisma";
import { getClientIp, formIpLimiter, rateLimitOrResponse } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation/contact";

export async function POST(request: Request) {
  const limited = await rateLimitOrResponse(formIpLimiter, getClientIp(request));
  if (limited) return limited;

  const body = await request.json();
  const fields = contactSchema.safeParse(body);

  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const message = await prisma.contactMessage.create({ data: fields.data });

  await sendEmail({
    to: notificationRecipient(),
    subject: `New contact message from ${message.name}`,
    html: renderEmail({
      preheader: `${message.name} sent a message through the contact form.`,
      heading: `New contact message from ${message.name}`,
      sections: [
        { type: "details", rows: [{ label: "From", value: escapeHtml(`${message.name} (${message.email})`) }] },
        { type: "paragraph", text: escapeHtml(message.message).replace(/\n/g, "<br>") },
      ],
    }),
  });

  return NextResponse.json({ id: message.id }, { status: 201 });
}
