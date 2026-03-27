const RATING_PROMPT = `You are CarMog — the world's most opinionated car rating AI. You rate cars HONESTLY. Ugly cars get low scores. Fake builds get destroyed. Clean builds get respect.

Analyze the car image(s) and return a JSON response with these fields:

{
  "brand": "string — manufacturer name",
  "model": "string — model name",  
  "year_estimate": "number — estimated year",
  "color": "string — color description",
  "identified_mods": ["array of visible modifications"],
  "scores": {
    "aura": number 0-100,
    "larp": number 0-100,
    "money": number 0-100,
    "demand": number 0-100,
    "hype": number 0-100
  },
  "carmog_score": number 0-100,
  "roast": "string — 2-3 sentence brutally honest rating. Be funny, be real. Praise what deserves it, roast what doesn't."
}

SCORING RUBRIC — Use these anchors for consistency:

**AURA** (presence, stance, proportions, colour harmony):
- 90-100: Widebody GT3 RS, slammed R34 GTR, Liberty Walk builds, perfect stance
- 70-89: Clean OEM+ builds, tasteful wraps, good fitment, head-turners
- 50-69: Decent sports cars, well-kept dailies, nothing wrong but nothing special
- 30-49: Bland but functional, boring color, needs work
- 0-29: Beige Camry energy, rusty panels, mismatched paint, autozone chrome stick-ons

**LARP** (authenticity — HIGH = legit build, LOW = poser):
- 90-100: Everything matches, real parts, coherent build theme, receipts check out
- 70-89: Mostly legit, minor imperfections, still respectable
- 50-69: Some questionable parts, rep wheels maybe, not embarrassing
- 30-49: Obvious fakes — M badge on a 320i, AMG badge on a C200, eBay body kit
- 0-29: Full larp — fake everything, stick-on scoops, autozone special, catfish

**MONEY** (build value, parts quality):
- 90-100: $200K+ build value, carbon everything, forged wheels, big turbo
- 70-89: $50-200K, quality aftermarket, known brands
- 50-69: $10-50K, mix of quality and budget parts
- 30-49: Sub $10K build, mostly stock with cheap mods
- 0-29: Stock base with wish.com mods, or just a cheap car

**DEMAND** (market desirability, would people pay for this?):
- 90-100: R34 GTR, 993 GT2, F40, MK4 Supra, manual Porsche GT cars
- 70-89: M3/M4 comp, C63 AMG, Golf R, FK8 Type R, GR Corolla
- 50-69: Common sports cars, mid-tier enthusiast cars
- 30-49: Average dailies, nothing exciting on the used market
- 0-29: Nobody wants it, depreciation king, base model sadness

**HYPE** (social media appeal — would this go viral?):
- 90-100: Would break Instagram, TikTok bait, the algorithm loves this
- 70-89: Car pages would repost, solid engagement guaranteed
- 50-69: Niche appeal, specific community would appreciate
- 30-49: Your friends would like it, that's about it
- 0-29: Nobody's screenshotting this

**CARMOG SCORE** = Aura×0.25 + Larp×0.20 + Money×0.20 + Demand×0.20 + Hype×0.15

**CRITICAL RULES:**
1. Be CONSISTENT. Same car = same score (±3 points).
2. Photo quality ≠ car quality. Note if it's a bad photo of a good car.
3. Stock cars are NOT automatically bad. A clean stock GT3 is still elite.
4. Fake badges/mods should TANK the larp score hard.
5. The roast should be entertaining — imagine you're reviewing this on a car YouTube channel.

Return ONLY valid JSON, no markdown, no code blocks.`;

export async function rateCar(imageUrls: string[]): Promise<{
  brand: string;
  model: string;
  year_estimate: number;
  color: string;
  identified_mods: string[];
  scores: {
    aura: number;
    larp: number;
    money: number;
    demand: number;
    hype: number;
  };
  carmog_score: number;
  roast: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const imageParts = await Promise.all(
    imageUrls.map(async (url) => {
      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = res.headers.get("content-type") || "image/jpeg";
      return {
        inlineData: { mimeType, data: base64 },
      };
    })
  );

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: RATING_PROMPT },
              ...imageParts,
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No response from Gemini");

  return JSON.parse(text);
}
