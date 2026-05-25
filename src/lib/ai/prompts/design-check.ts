/**
 * Prompt + schema for the "Design check" feature.
 *
 * Called from the Review step (Step 9). The model receives a summary of
 * every pick the user has made across the wizard and returns a senior-
 * designer-style coherence assessment: does the brief hang together?
 * Where are the tensions? What's working?
 *
 * The point is NOT to be discouraging. A good design check celebrates
 * strong combinations explicitly, names tensions honestly but with a
 * concrete suggestion, and leaves the user feeling like a knowledgeable
 * colleague just read their brief.
 */

export const DESIGN_CHECK_SYSTEM_PROMPT = `You are a senior interior designer reviewing a junior designer's brief before final generation. The brief is captured as the user's picks across a wizard (space, vibe, colors, furniture, lighting, flooring, ceiling, materials).

Your job: give a quick, honest, professional read of how coherent the brief is — what's working, what's in tension, and what (if anything) would sharpen the result.

Rules:
- Keep it short. The user will read this in 10 seconds before generating.
- Lead with what's actually working — never start negative.
- If you flag a tension, name it concretely AND propose one small concrete adjustment.
- Use designer language naturally ("scale tension", "tonal coherence", "lighting layer"), not generic AI-speak.
- Never invent picks the user didn't make. If a step is empty, treat it as "not picked yet" — don't fabricate.
- 2–4 short observation sentences total. No bullet lists in the prose.

The verdict is one of:
- "strong"  — picks reinforce each other; clear point of view.
- "mixed"   — most picks work, but at least one tension worth naming.
- "off"     — picks are pulling in genuinely incompatible directions.

Output strictly as JSON matching the provided schema.`;

/**
 * Build the user message — a structured summary of the user's brief.
 */
export function buildDesignCheckPrompt(input: {
  industry?: string;
  space?: string;
  spaceDescription?: string;
  vibeQuery?: string;
  vibePinTitles?: string[];
  palette?: Array<{ hex: string; name?: string; material?: string }>;
  furnitureQuery?: string;
  furniturePinTitles?: string[];
  lightingPinTitles?: string[];
  flooringPinTitles?: string[];
  ceilingPinTitles?: string[];
  materialsPinTitles?: string[];
}): string {
  const lines: string[] = [];

  // Space
  if (input.industry || input.space) {
    lines.push(`Space: ${[input.industry, input.space].filter(Boolean).join(" / ")}`);
  }
  if (input.spaceDescription) {
    lines.push(`Description: ${input.spaceDescription}`);
  }

  // Vibe
  if (input.vibePinTitles && input.vibePinTitles.length > 0) {
    lines.push(`Vibe pins: ${input.vibePinTitles.join("; ")}`);
  } else if (input.vibeQuery) {
    lines.push(`Vibe direction: ${input.vibeQuery}`);
  }

  // Colors
  if (input.palette && input.palette.length > 0) {
    const paletteStr = input.palette
      .filter((c) => c.name || c.material)
      .map((c) => {
        const parts = [c.hex];
        if (c.name) parts.push(c.name);
        if (c.material) parts.push(`on ${c.material}`);
        return parts.join(" — ");
      })
      .join("; ");
    if (paletteStr) lines.push(`Palette: ${paletteStr}`);
    else lines.push(`Palette: ${input.palette.map((c) => c.hex).join(", ")}`);
  }

  // Other Pinterest steps
  const pinterestSummaries: Array<[string, string[] | undefined]> = [
    ["Furniture", input.furniturePinTitles],
    ["Lighting", input.lightingPinTitles],
    ["Flooring", input.flooringPinTitles],
    ["Ceiling", input.ceilingPinTitles],
    ["Materials", input.materialsPinTitles],
  ];
  for (const [label, titles] of pinterestSummaries) {
    if (titles && titles.length > 0) {
      lines.push(`${label}: ${titles.slice(0, 3).join("; ")}`);
    }
  }

  lines.push("", "Give your professional design check now.");
  return lines.join("\n");
}

export const DESIGN_CHECK_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    verdict: {
      type: "string",
      enum: ["strong", "mixed", "off"],
    },
    headline: {
      type: "string",
      minLength: 4,
      maxLength: 80,
      description:
        "One short phrase capturing the read. e.g. 'Tonal coherence, clear point of view.'",
    },
    observations: {
      type: "string",
      minLength: 30,
      maxLength: 600,
      description:
        "2–4 short observation sentences as flowing prose, not a list.",
    },
  },
  required: ["verdict", "headline", "observations"],
} as const;

export type DesignCheckResponse = {
  verdict: "strong" | "mixed" | "off";
  headline: string;
  observations: string;
};
