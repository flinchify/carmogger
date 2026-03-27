import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=token_exchange`);
    }

    const tokens = await tokenRes.json();

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=user_info`);
    }

    const googleUser = await userRes.json();
    const { id: googleId, email, name, picture } = googleUser;

    // Check if user exists
    let users = await sql`SELECT * FROM users WHERE google_id = ${googleId} LIMIT 1`;

    if (users.length === 0 && email) {
      // Check by email
      users = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
      if (users.length > 0) {
        // Link Google account
        await sql`UPDATE users SET google_id = ${googleId}, avatar_url = ${picture} WHERE id = ${users[0].id}`;
      }
    }

    if (users.length === 0) {
      // Create new user
      const username = generateUsername(name || email?.split("@")[0] || "user");

      users = await sql`
        INSERT INTO users (username, email, display_name, avatar_url, google_id)
        VALUES (${username}, ${email}, ${name}, ${picture}, ${googleId})
        RETURNING *
      `;
    }

    const user = users[0];

    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await sql`INSERT INTO auth_sessions (user_id, token, expires_at) VALUES (${user.id}, ${token}, ${expiresAt.toISOString()})`;

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("carmog_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/${user.username}`);
  } catch (err) {
    console.error("OAuth error:", err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=oauth_failed`);
  }
}

function generateUsername(base: string): string {
  const clean = base.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${clean || "user"}_${suffix}`;
}
