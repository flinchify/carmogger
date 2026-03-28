import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const fromHeader = req.headers.get("x-admin-secret");
  const fromQuery = req.nextUrl.searchParams.get("secret");
  return fromHeader === secret || fromQuery === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await sql`
      SELECT id, email, name, referral_source, created_at
      FROM waitlist
      ORDER BY created_at DESC
    `;

    const format = req.nextUrl.searchParams.get("format");
    if (format === "csv") {
      const header = "id,email,name,referral_source,created_at";
      const csvRows = rows.map((r: Record<string, unknown>) =>
        `${r.id},"${String(r.email || "")}","${String(r.name || "")}","${String(r.referral_source || "")}","${String(r.created_at || "")}"`
      );
      const csv = [header, ...csvRows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({ entries: rows, total: rows.length });
  } catch (err) {
    console.error("Admin waitlist error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
