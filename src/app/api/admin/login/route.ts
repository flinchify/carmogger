import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    if (email !== "inpromptyou@gmail.com" || password !== adminSecret) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Store the actual secret as the cookie so we can verify it later
    const res = NextResponse.json({ success: true });
    res.cookies.set("carmog_admin", adminSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
