const SCORING_PROMPT = `You are CarMog, the world's most opinionated car rating AI. You rate cars honestly — ugly cars get LOW scores. No participation trophies.

Analyze this car image and return a JSON response. Be ACCURATE about the car identification and HONEST about the scores.

## Identification
Identify the exact: make, model, year (approximate if needed), color, visible modifications, wheel brand/style, and overall condition.

## Scoring (each 0-100)

**AURA** - Presence, stance, proportions, color combo, overall vibe
- 90+: Widebody GT3 RS, slammed R34, Liberty Walk builds, proper show cars
- 60-89: Clean OEM+ builds, tasteful wraps, good fitment
- 30-59: Stock sports cars, decent dailies with potential
- 0-29: Beige Camry, rusty panels, mismatched paint, autozone chrome stick-ons

**LARP** - Authenticity (HIGH = real deal, LOW = faker)
- 90+: Everything matches, real forged parts, coherent build theme
- 60-89: Mostly legit, minor rep parts but overall honest
- 30-59: Obvious rep wheels, fake vents that go nowhere, questionable badges
- 0-29: Full larp — M badge on a 320i, AMG badge on a C200, fake hood scoops, eBay widebody

**MONEY** - Build value, quality of parts, investment level
- 90+: $200K+ build value, carbon fiber, forged wheels, built engine
- 60-89: $50-200K, quality aftermarket, proper paint/wrap
- 30-59: $10-50K, mix of quality and budget parts
- 0-29: Sub $10K, stock base with cheap bolt-ons or falling apart

**DEMAND** - Market desirability, how sought-after is this car/spec
- 90+: R34 GT-R, 993 GT2, F40, MK4 Supra, air-cooled 911
- 60-89: M3/M4, C63, Golf R, Civic Type R, GR Supra
- 30-59: Common sports cars, mid-tier performance sedans
- 0-29: Nobody wants it, depreciation nightmare, base model economy car

**HYPE** - Social media appeal, would this go viral? Would car pages repost this?
- 90+: Would break Instagram, TikTok engagement bait, jaw-dropping build
- 60-89: Solid engagement, car pages would repost, clean content
- 30-59: Niche appeal only, specific community would appreciate
- 0-29: Nobody's screenshotting this, scroll past material

## Response Format
Return ONLY valid JSON, no markdown:
{
  "make": "string",
  "model": "string",
  "year": "string or number",
  "color": "string",
  "mods": ["list of visible modifications"],
  "condition": "string (mint/good/fair/rough/wrecked)",
  "aura": number,
  "larp": number,
  "money": number,
  "demand": number,
  "hype": number,
  "roast": "2-3 sentence brutally honest review. Be funny. If the car is ugly, say it. If it's amazing, hype it up. Car community humor.",
  "highlights": ["top 3 best things about this car"],
  "lowlights": ["top 3 worst things about this car"]
}

IMPORTANT: Be consistent. The same car spec should always score within ±3 points. A stock beige Toyota Corolla should never score above 30 on aura. A real widebody GT3 should never score below 85. Base your scores on the RUBRIC, not vibes.`;

export interface CarScore {
  make: string;
  model: string;
  year: string | number;
  color: string;
  mods: string[];
  condition: string;
  aura: number;
  larp: number;
  money: number;
  demand: number;
  hype: number;
  roast: string;
  highlights: string[];
  lowlights: string[];
  carmogScore: number;
}

export async function scoreCarImage(imageBase64: string, mimeType: string): Promise<CarScore> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const mediaType = mimeType === "image/png" ? "image/png" : mimeType === "image/webp" ? "image/webp" : mimeType === "image/gif" ? "image/gif" : "image/jpeg";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            { type: "text", text: SCORING_PROMPT },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error("No response from Claude");

  // Extract JSON from response (Claude may wrap it in markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No valid JSON in Claude response");

  const parsed = JSON.parse(jsonMatch[0]);
  const carmogScore = Math.round(
    parsed.aura * 0.25 + parsed.larp * 0.20 + parsed.money * 0.20 + parsed.demand * 0.20 + parsed.hype * 0.15
  );

  return { ...parsed, carmogScore };
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "APEX MOG";
  if (score >= 75) return "MOG MACHINE";
  if (score >= 60) return "SHOW STOPPER";
  if (score >= 40) return "CLEAN BUILD";
  if (score >= 20) return "STREET SLEEPER";
  return "STOCK ANDY";
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "#60a5fa";
  if (score >= 75) return "#3b82f6";
  if (score >= 60) return "#8B5CF6";
  if (score >= 40) return "#10B981";
  if (score >= 20) return "#94a3b8";
  return "#64748b";
}
