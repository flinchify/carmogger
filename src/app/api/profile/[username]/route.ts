import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  try {
    // Get user
    const users = await sql`SELECT * FROM users WHERE username = ${username} LIMIT 1`;
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // Get their cars with scores
    const cars = await sql`
      SELECT * FROM cars WHERE user_id = ${user.id} ORDER BY carmog_score DESC
    `;

    // Get total views across all cars
    const viewsResult = await sql`
      SELECT COALESCE(SUM(total_views), 0) as total FROM cars WHERE user_id = ${user.id}
    `;

    // Best score
    const bestScore = cars.length > 0 ? Math.max(...cars.map((c: Record<string, number>) => Number(c.carmog_score))) : 0;

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        instagramHandle: user.instagram_handle,
        lifetimeXp: user.lifetime_xp,
        seasonalXp: user.seasonal_xp,
        level: user.level,
        league: user.league,
        division: user.division,
        plan: user.plan,
        createdAt: user.created_at,
      },
      cars,
      stats: {
        totalCars: cars.length,
        totalViews: Number(viewsResult[0].total),
        bestScore,
        avgScore: cars.length > 0 ? Math.round(cars.reduce((sum: number, c: Record<string, number>) => sum + Number(c.carmog_score), 0) / cars.length) : 0,
      },
    });
  } catch (err) {
    console.error("Profile error:", err);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}
