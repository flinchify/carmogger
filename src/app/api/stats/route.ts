import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await sql`
      SELECT
        (SELECT COUNT(*) FROM cars) as total_cars,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COALESCE(SUM(total_views), 0) FROM cars) as total_views,
        (SELECT COALESCE(ROUND(AVG(carmog_score)), 0) FROM cars WHERE carmog_score > 0) as avg_score
    `;
    const stats = result[0];
    return NextResponse.json({
      totalCars: Number(stats.total_cars),
      totalUsers: Number(stats.total_users),
      totalViews: Number(stats.total_views),
      avgScore: Number(stats.avg_score),
    });
  } catch {
    return NextResponse.json({ totalCars: 0, totalUsers: 0, totalViews: 0, avgScore: 0 });
  }
}
