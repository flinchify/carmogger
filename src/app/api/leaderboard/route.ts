import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const sort = req.nextUrl.searchParams.get("sort") || "score";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") || 50), 100);

  try {
    let entries;

    if (sort === "views") {
      entries = await sql`
        SELECT c.id, c.images, c.brand, c.model, c.year, c.carmog_score, c.total_views,
               u.username, u.avatar_url, u.league, u.division, u.level
        FROM cars c
        JOIN users u ON u.id = c.user_id
        ORDER BY c.total_views DESC
        LIMIT ${limit}
      `;
    } else if (sort === "xp") {
      entries = await sql`
        SELECT c.id, c.images, c.brand, c.model, c.year, c.carmog_score, c.total_views,
               u.username, u.avatar_url, u.league, u.division, u.level, u.lifetime_xp
        FROM cars c
        JOIN users u ON u.id = c.user_id
        ORDER BY u.lifetime_xp DESC
        LIMIT ${limit}
      `;
    } else {
      entries = await sql`
        SELECT c.id, c.images, c.brand, c.model, c.year, c.carmog_score, c.total_views,
               u.username, u.avatar_url, u.league, u.division, u.level
        FROM cars c
        JOIN users u ON u.id = c.user_id
        ORDER BY c.carmog_score DESC
        LIMIT ${limit}
      `;
    }

    return NextResponse.json({ entries });
  } catch (err: unknown) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ entries: [] });
  }
}
