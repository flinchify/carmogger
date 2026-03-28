import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, referralSource } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    try {
      const result = await sql`
        INSERT INTO waitlist (email, name, referral_source)
        VALUES (${trimmed}, ${name?.trim() || null}, ${referralSource?.trim() || null})
        RETURNING id
      `;
      const count = await sql`SELECT COUNT(*) as count FROM waitlist`;
      return NextResponse.json({
        success: true,
        message: "You're on the list!",
        position: Number(count[0].count),
        id: result[0].id,
      });
    } catch (err: unknown) {
      const pgErr = err as { code?: string };
      if (pgErr.code === "23505") {
        const count = await sql`SELECT COUNT(*) as count FROM waitlist`;
        return NextResponse.json({
          success: true,
          message: "You're already on the list!",
          position: Number(count[0].count),
          duplicate: true,
        });
      }
      throw err;
    }
  } catch (err) {
    console.error("Waitlist POST error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM waitlist`;
    return NextResponse.json({ count: Number(result[0].count) });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
