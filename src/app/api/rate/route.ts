import { NextRequest, NextResponse } from "next/server";
import { scoreCarImage } from "@/lib/ai-scoring";
import { getSession } from "@/lib/auth";
import sql from "@/lib/db";
import { awardXp, XP_SOURCES } from "@/lib/xp";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    if (files.length > 4) {
      return NextResponse.json({ error: "Maximum 4 images allowed" }, { status: 400 });
    }

    // Validate file types
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Each image must be under 10MB" }, { status: 400 });
      }
    }

    // Use the first image for scoring
    const primaryImage = files[0];
    const buffer = await primaryImage.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Generate image hash for dedup/consistency
    const imageHash = crypto.createHash("sha256").update(Buffer.from(buffer)).digest("hex").slice(0, 16);

    const result = await scoreCarImage(base64, primaryImage.type);

    // If user is logged in, save to DB
    const user = await getSession();
    let carId: number | null = null;

    if (user) {
      // TODO: Upload images to blob storage — for now store as base64 data URIs temporarily
      // In production, integrate Vercel Blob or S3
      const imageUrls: string[] = [];

      const inserted = await sql`
        INSERT INTO cars (user_id, images, brand, model, year, color, mods_description, carmog_score, aura, larp, money, demand, hype, ai_analysis, ai_roast, image_hash)
        VALUES (
          ${user.id},
          ${imageUrls},
          ${result.make},
          ${result.model},
          ${typeof result.year === 'string' ? parseInt(result.year) || 2024 : result.year},
          ${result.color},
          ${result.mods.join(', ')},
          ${result.carmogScore},
          ${result.aura},
          ${result.larp},
          ${result.money},
          ${result.demand},
          ${result.hype},
          ${JSON.stringify(result)},
          ${result.roast},
          ${imageHash}
        )
        RETURNING id
      `;

      carId = inserted[0]?.id;

      // Award XP for upload
      await awardXp(user.id, "upload", XP_SOURCES.UPLOAD, { carId });
    }

    return NextResponse.json({ ...result, carId, saved: !!user });
  } catch (err: unknown) {
    console.error("Rating error:", err);
    const message = err instanceof Error ? err.message : "Failed to rate car";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
