import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      instagramHandle: user.instagram_handle,
      lifetimeXp: user.lifetime_xp,
      seasonalXp: user.seasonal_xp,
      level: user.level,
      league: user.league,
      division: user.division,
      plan: user.plan,
    },
  });
}
