import { NextResponse } from "next/server";
import { notificationRecipient, sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation/contact";

export async function POST(request: Request) {
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
    html: `<p><strong>From:</strong> ${message.name} (${message.email})</p><p>${message.message}</p>`,
  });

  return NextResponse.json({ id: message.id }, { status: 201 });
}
