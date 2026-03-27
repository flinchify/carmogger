import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import sql from "@/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("carmog_session")?.value;

  if (token) {
    await sql`DELETE FROM auth_sessions WHERE token = ${token}`;
    cookieStore.delete("carmog_session");
  }

  return NextResponse.json({ ok: true });
}
