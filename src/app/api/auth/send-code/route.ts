import { NextResponse } from "next/server";
import { sendLoginCode } from "@/lib/otp";
import { sendCodeSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const fields = sendCodeSchema.safeParse(body);

  if (!fields.success) {
    return NextResponse.json(
      { error: "validation", fieldErrors: fields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const result = await sendLoginCode(fields.data.email);

  if (!result.ok) {
    return NextResponse.json(
      { error: "cooldown", message: "A code was already sent — check your inbox, or try again in a minute." },
      { status: 429 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
