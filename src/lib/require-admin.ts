import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Single source of truth for the "is this request from an admin" check —
// every /api/admin/* route should call this instead of re-checking
// session.user.isAdmin inline, so the rule only has to be right in one place.
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return { session: null, error: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}
