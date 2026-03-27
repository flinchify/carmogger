import { NextResponse } from "next/server";
import { ensureTables } from "@/lib/db";

export async function POST() {
  try {
    await ensureTables();
    return NextResponse.json({ ok: true, message: "Tables created successfully" });
  } catch (err: unknown) {
    console.error("Init error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to init DB" }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
