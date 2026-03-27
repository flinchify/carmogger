import { NextRequest, NextResponse } from "next/server";
import { scoreCarImage } from "@/lib/ai-scoring";

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

    // Use the first image for scoring (best quality/angle)
    const primaryImage = files[0];
    const buffer = await primaryImage.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const result = await scoreCarImage(base64, primaryImage.type);

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Rating error:", err);
    const message = err instanceof Error ? err.message : "Failed to rate car";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
