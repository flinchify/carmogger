import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getScoreColor, getScoreLabel } from "@/lib/ai-scoring";

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const format = req.nextUrl.searchParams.get("format") || "svg";

  try {
    const users = await sql`SELECT * FROM users WHERE username = ${username} LIMIT 1`;
    if (users.length === 0) {
      return new NextResponse("User not found", { status: 404 });
    }

    const user = users[0];
    const cars = await sql`SELECT * FROM cars WHERE user_id = ${user.id} ORDER BY carmog_score DESC LIMIT 1`;
    const bestCar = cars.length > 0 ? cars[0] : null;
    const score = bestCar ? Number(bestCar.carmog_score) : 0;
    const color = getScoreColor(score);
    const label = getScoreLabel(score);
    const carName = bestCar ? `${bestCar.year} ${bestCar.brand} ${bestCar.model}` : "No cars rated";

    // Track embed view for XP
    if (bestCar) {
      try {
        await sql`UPDATE cars SET total_views = total_views + 1 WHERE id = ${bestCar.id}`;
      } catch { /* ignore */ }
    }

    if (format === "redirect") {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/${username}`);
    }

    // Return SVG card
    const svg = `
<svg width="400" height="120" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0c1018"/>
      <stop offset="100%" style="stop-color:#0f1420"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#60a5fa"/>
    </linearGradient>
  </defs>
  
  <rect width="400" height="120" rx="16" fill="url(#bg)" stroke="#1e293b" stroke-width="1"/>
  
  <!-- Score circle -->
  <circle cx="60" cy="60" r="36" fill="none" stroke="#1e293b" stroke-width="4"/>
  <circle cx="60" cy="60" r="36" fill="none" stroke="${color}" stroke-width="4" 
    stroke-dasharray="${2 * Math.PI * 36}" 
    stroke-dashoffset="${2 * Math.PI * 36 * (1 - score / 100)}"
    stroke-linecap="round" transform="rotate(-90 60 60)"/>
  <text x="60" y="56" text-anchor="middle" fill="${color}" font-family="system-ui" font-weight="900" font-size="22">${score}</text>
  <text x="60" y="72" text-anchor="middle" fill="#64748b" font-family="system-ui" font-weight="700" font-size="7" letter-spacing="1">${label}</text>
  
  <!-- Info -->
  <text x="115" y="38" fill="#f0f2f5" font-family="system-ui" font-weight="800" font-size="14">@${user.username}</text>
  <text x="115" y="58" fill="#8892a4" font-family="system-ui" font-weight="500" font-size="11">${carName}</text>
  <text x="115" y="78" fill="#4a5568" font-family="system-ui" font-weight="500" font-size="10">Lv.${user.level} · ${user.league.charAt(0).toUpperCase() + user.league.slice(1)} League</text>
  
  <!-- Branding -->
  <rect x="115" y="90" width="60" height="18" rx="9" fill="url(#accent)" opacity="0.15"/>
  <text x="145" y="103" text-anchor="middle" fill="#3b82f6" font-family="system-ui" font-weight="700" font-size="9">carmogger</text>
  
  <!-- CTA arrow -->
  <text x="370" y="64" text-anchor="middle" fill="#334155" font-family="system-ui" font-size="18">→</text>
</svg>`.trim();

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Embed error:", err);
    return new NextResponse("Error generating embed", { status: 500 });
  }
}
