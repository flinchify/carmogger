import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cars = await sql`
      SELECT c.*, u.username, u.display_name, u.avatar_url, u.league, u.level
      FROM cars c
      JOIN users u ON u.id = c.user_id
      WHERE c.featured = true
      ORDER BY c.carmog_score DESC
      LIMIT 8
    `;
    return NextResponse.json({ cars });
  } catch {
    return NextResponse.json({ cars: [] });
  }
}
