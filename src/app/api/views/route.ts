import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { awardXp, getViewXpToday, XP_SOURCES } from "@/lib/xp";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { carId, profileUserId } = await req.json();
    if (!carId) return NextResponse.json({ error: "carId required" }, { status: 400 });

    // Hash viewer IP for privacy
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const viewerHash = crypto.createHash("sha256").update(ip + carId).digest("hex").slice(0, 16);

    // Try insert unique view (will fail silently on duplicate)
    try {
      await sql`INSERT INTO daily_views (car_id, profile_user_id, viewer_hash, view_date)
        VALUES (${carId}, ${profileUserId || null}, ${viewerHash}, CURRENT_DATE)
        ON CONFLICT (car_id, viewer_hash, view_date) DO NOTHING`;
    } catch {
      // Duplicate view, ignore
    }

    // Increment car total views
    await sql`UPDATE cars SET total_views = total_views + 1 WHERE id = ${carId}`;

    // Award XP to car owner if under daily cap
    if (profileUserId) {
      const todayViewXp = await getViewXpToday(profileUserId);
      if (todayViewXp < XP_SOURCES.VIEW_DAILY_CAP) {
        await awardXp(profileUserId, "view", XP_SOURCES.VIEW, { carId });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("View tracking error:", err);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
