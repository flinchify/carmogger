import sql from "./db";
import { getLeague, getLevel, getDivision } from "./leagues";

export const XP_SOURCES = {
  UPLOAD: 50,
  VIEW: 1, // per unique daily view, capped at 500/day
  LEADERBOARD_TOP_10: 100, // per day
  LEADERBOARD_TOP_3: 250, // per day (replaces top 10)
  EMBED_CLICK: 5,
  VIEW_DAILY_CAP: 500,
} as const;

export async function awardXp(userId: number, source: string, amount: number, metadata?: Record<string, unknown>) {
  // Insert XP event
  await sql`INSERT INTO xp_events (user_id, source, amount, metadata) VALUES (${userId}, ${source}, ${amount}, ${JSON.stringify(metadata || {})})`;

  // Update user totals
  await sql`UPDATE users SET 
    lifetime_xp = lifetime_xp + ${amount},
    seasonal_xp = seasonal_xp + ${amount},
    updated_at = NOW()
    WHERE id = ${userId}`;

  // Recalculate league + level
  const user = await sql`SELECT lifetime_xp, seasonal_xp FROM users WHERE id = ${userId}`;
  if (user.length === 0) return;

  const lifetimeXp = user[0].lifetime_xp;
  const seasonalXp = user[0].seasonal_xp;
  const league = getLeague(seasonalXp);
  const level = getLevel(lifetimeXp);
  const division = getDivision(seasonalXp, league);

  await sql`UPDATE users SET 
    league = ${league.name},
    division = ${division},
    level = ${level}
    WHERE id = ${userId}`;

  return { league: league.name, division, level, lifetimeXp, seasonalXp };
}

export async function getViewXpToday(userId: number): Promise<number> {
  const result = await sql`SELECT COALESCE(SUM(amount), 0) as total 
    FROM xp_events 
    WHERE user_id = ${userId} 
    AND source = 'view' 
    AND created_at >= CURRENT_DATE`;
  return Number(result[0].total);
}
