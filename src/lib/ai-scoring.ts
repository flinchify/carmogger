const SCORING_PROMPT = `You are CarMog, the world's most opinionated car rating AI. You rate cars honestly — ugly cars get LOW scores. No participation trophies.

Analyze this SPECIFIC car image and return a JSON response. Be ACCURATE about the car identification and HONEST about the scores. Talk about THIS SPECIFIC CAR in the image, not generic descriptions of the car type.

## Identification
Identify the exact: make, model, year (approximate if needed), color, visible modifications, wheel brand/style (try to identify the BRAND — Volk, BBS, Rotiform, Work, Enkei, OEM, reps, etc.), and overall condition. Identify specific mods visible (coilovers, roll cage, big brake kit, turbo kit, wrap brand if identifiable, specific aero kits, etc.).

## Scoring (each 0-100, USE DECIMALS like 87.3, 72.1, 45.8 — be granular, never round to whole numbers)

IMPORTANT: Use decimal scores. Nobody gets 100.0 — the absolute ceiling is 99.5 for the most legendary car ever built. Be precise and granular.

**AURA** (20% weight) - Presence, stance, proportions, color combo, overall vibe of THIS car
- 90+: Widebody GT3 RS, slammed R34, Liberty Walk builds, proper show cars with jaw-dropping presence
- 60-89: Clean OEM+ builds, tasteful wraps, good fitment
- 30-59: Stock sports cars, decent dailies with potential
- 0-29: Beige Camry, rusty panels, mismatched paint, autozone chrome stick-ons

**LARP** (15% weight) - Authenticity (HIGH = real deal, LOW = faker) — look at THIS car's specific parts
- 90+: Everything matches, real forged wheels (identify brand), coherent build theme, legit aero
- 60-89: Mostly legit, minor rep parts but overall honest build
- 30-59: Obvious rep wheels, fake vents that go nowhere, questionable badges
- 0-29: Full larp — M badge on a 320i, AMG badge on a C200, fake hood scoops, eBay widebody

**MONEY** (15% weight) - Build value, quality of parts, investment level visible on THIS car
- 90+: $200K+ build value, carbon fiber, forged wheels, built engine
- 60-89: $50-200K, quality aftermarket, proper paint/wrap
- 30-59: $10-50K, mix of quality and budget parts
- 0-29: Sub $10K, stock base with cheap bolt-ons or falling apart

**DEMAND** (15% weight) - Market desirability, how sought-after is this car/spec
- 90+: R34 GT-R, 993 GT2, F40, MK4 Supra, air-cooled 911
- 60-89: M3/M4, C63, Golf R, Civic Type R, GR Supra
- 30-59: Common sports cars, mid-tier performance sedans
- 0-29: Nobody wants it, depreciation nightmare, base model economy car

**HYPE** (10% weight) - Social media appeal, would THIS specific car go viral? Would car pages repost THIS photo?
- 90+: Would break Instagram, TikTok engagement bait, jaw-dropping build
- 60-89: Solid engagement, car pages would repost, clean content
- 30-59: Niche appeal only, specific community would appreciate
- 0-29: Nobody's screenshotting this, scroll past material

**INTERIOR** (10% weight) - Interior quality, materials, custom work, cleanliness, head unit, gauges
- Since we're analyzing exterior photos, estimate based on what's visible (if anything through windows) and what's typical/known for this car's build level
- 90+: Full custom interior, cage, bucket seats, dash swap, premium materials
- 60-89: Quality aftermarket head unit, gauges, well-maintained OEM premium
- 30-59: Stock interior with minor upgrades, average condition
- 0-29: Trashed, ripped seats, cracked dash, base model cloth

**SOUND** (15% weight) - Exhaust note potential, engine type scoring
- Since we're analyzing images not audio, estimate based on the engine/exhaust setup visible or known for this car model
- 90+: V8/V10/V12 with visible exhaust work, straight pipe, built headers, known amazing exhaust notes (LFA, Carrera GT, AMG V8)
- 60-89: Turbo inline-6, V6 with good exhaust, known decent sounding cars
- 30-59: Stock exhaust on decent engine, base turbo-4 with aftermarket exhaust
- 0-29: CVT economy car, stock 4-cylinder, electric gets 40-50 flat unless it's insanely built
- Electric cars: give 40-50 unless it has something wild going on

## Response Format
Return ONLY valid JSON, no markdown:
{
  "make": "string",
  "model": "string",
  "year": "string or number",
  "color": "string",
  "mods": ["list of visible modifications — be specific about brands/parts you can identify"],
  "condition": "string (mint/good/fair/rough/wrecked)",
  "aura": decimal_number,
  "larp": decimal_number,
  "money": decimal_number,
  "demand": decimal_number,
  "hype": decimal_number,
  "interior": decimal_number,
  "sound": decimal_number,
  "roast": "2-3 sentence brutally honest review about THIS SPECIFIC CAR. Reference specific things visible in THIS photo. Be funny. If the car is ugly, say it. If it's amazing, hype it up. Car community humor.",
  "highlights": ["top 3 best things about THIS SPECIFIC car — reference what you see"],
  "lowlights": ["top 3 worst things about THIS SPECIFIC car — reference what you see"],
  "detailed_breakdown": {
    "aura": "1-2 sentence explanation of WHY this score for THIS car",
    "larp": "1-2 sentence explanation of WHY this score for THIS car",
    "money": "1-2 sentence explanation of WHY this score for THIS car",
    "demand": "1-2 sentence explanation of WHY this score for THIS car",
    "hype": "1-2 sentence explanation of WHY this score for THIS car",
    "interior": "1-2 sentence explanation of WHY this score for THIS car",
    "sound": "1-2 sentence explanation of WHY this score for THIS car"
  }
}

IMPORTANT: Be consistent. The same car spec should always score within ±3 points. A stock beige Toyota Corolla should never score above 30 on aura. A real widebody GT3 should never score below 85. Base your scores on the RUBRIC, not vibes. Always use DECIMAL scores — never round to whole numbers.`;

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
  interior: number;
  sound: number;
  roast: string;
  highlights: string[];
  lowlights: string[];
  carmogScore: number;
  detailed_breakdown: Record<string, string>;
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
      max_tokens: 3000,
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
    (parsed.aura * 0.20 + parsed.larp * 0.15 + parsed.money * 0.15 + parsed.demand * 0.15 + parsed.hype * 0.10 + parsed.interior * 0.10 + parsed.sound * 0.15) * 100
  ) / 100;

  return { ...parsed, carmogScore };
}

export function getScoreLabel(score: number): string {
  if (score >= 98) return "UNICORN";
  if (score >= 95) return "APEX MOG";
  if (score >= 88) return "MOG MACHINE";
  if (score >= 75) return "SHOW STOPPER";
  if (score >= 60) return "CLEAN BUILD";
  if (score >= 40) return "STREET SLEEPER";
  if (score >= 20) return "WORK IN PROGRESS";
  return "STOCK ANDY";
}

export function getScoreColor(score: number): string {
  if (score >= 98) return "#fbbf24";
  if (score >= 95) return "#60a5fa";
  if (score >= 88) return "#3b82f6";
  if (score >= 75) return "#8B5CF6";
  if (score >= 60) return "#10B981";
  if (score >= 40) return "#94a3b8";
  if (score >= 20) return "#78716c";
  return "#64748b";
}
