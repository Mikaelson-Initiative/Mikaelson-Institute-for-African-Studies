import { NextResponse } from "next/server";
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

  // Dev stand-in for Resend/SendGrid — see src/app/api/submissions/route.ts.
  console.log(`[dev-email] Contact message ${message.id} from ${message.email} logged.`);

  return NextResponse.json({ id: message.id }, { status: 201 });
}
