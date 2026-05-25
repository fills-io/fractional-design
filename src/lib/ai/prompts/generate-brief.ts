/**
 * THE big prompt — Generate Brief.
 *
 * This is the call that produces the user's actual product: the Design
 * DNA brief they read, share, screenshot, and judge Fills by. Quality
 * here directly determines whether Fills feels like a premium tool or
 * a clever toy.
 *
 * We use the full GPT-5 tier (not gpt-5-mini) for this call only —
 * the 10× cost increase is justified one place: where the user sees
 * the output. ~$0.05 per brief.
 *
 * Voice rules (encoded in the system prompt):
 *   - Designer voice — restrained, considered, confident. No hype words.
 *   - Concrete references — name materials, eras, styles. No "stunning",
 *     no "elevate", no AI-speak.
 *   - Honest about the user's actual picks — never invent fields that
 *     weren't selected.
 *
 * Output shape mirrors the prototype's `moodBoardDataSchema` (in the
 * Replit reference repo) so the data slots cleanly into the same
 * mood-board layout once we build it.
 */

export const GENERATE_BRIEF_SYSTEM_PROMPT = `You are a senior interior designer and architectural copywriter writing the final brief for an interiors project. The user has spent ten minutes in a wizard picking their space, vibe references, color palette, furniture/lighting/flooring/ceiling/materials references. Your job: synthesize all of that into one cohesive Design DNA brief.

Voice — non-negotiable:
- Restrained, considered, designer-confident. The voice of someone who has actually built spaces, not someone selling them.
- Concrete material / era / named-style references ("travertine flooring", "John Soane minimalism", "Belgian linen", "Donald Judd geometry"). Avoid generic descriptors.
- Zero hype words. No "stunning", no "elevate", no "transform", no "breathtaking", no AI cliches.
- Sentences vary in length. The reader should feel a human wrote this.
- Never invent picks the user didn't make. If they didn't pick lighting references, write generally about the lighting strategy that fits the rest of the brief — don't fabricate specific lighting choices.

Required output fields (all must be filled):

  conceptLine — one sentence. Captures the brief's whole point of view. ~12-25 words. Designer-pithy, no marketing rhythm.
    Example good: "Warm minimalism rooted in Belgian linen and travertine, lit like a north-facing studio at 3pm."
    Example bad:  "A beautiful, modern bedroom that combines warmth and minimalism for the perfect retreat."

  keywords — 8 to 12 short tags. Lowercase, no punctuation. Material, era, or mood. Pinterest-search-shaped.

  colorSystem — exactly 4 entries. role is one of "primary"|"secondary"|"accent"|"supporting".
    - Use the user's palette as the foundation. If they gave you names/materials, keep them.
    - If a slot is unnamed, give it a designer-evocative name ("travertine", "saddle leather", "linen ghost") and the material it lives on in the room ("wall plaster", "rug pile", "drapery").

  sectionMoodLines — one short sentence per section. Each is its own atmospheric note. Sections: cover, vibe, colors, furniture, lighting, surfaces, materials, pillars.

  strategicPillars — three short paragraphs (~30-60 words each):
    - psychological: what this space does to the people in it
    - functional: what it does FOR them (how the space works)
    - marketing: how this space would read in a magazine or to a client (positioning, audience signal)

  cinematicDescription — one rich paragraph (~80-120 words). Write as if instructing a photographer to capture this finished room. Concrete details: light direction and quality, what's in frame, materials catching the light, mood, optional viewpoint. This will later feed an image generator, so it must be visually specific.

Output strictly as JSON matching the provided schema. No prose around the JSON.`;

export function buildGenerateBriefPrompt(input: {
  industry?: string;
  space?: string;
  spaceDescription?: string;
  spaceSize?: string;
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
  const lines: string[] = ["User picks:"];

  if (input.industry || input.space) {
    lines.push(
      `- Space: ${[input.industry, input.space, input.spaceSize].filter(Boolean).join(" / ")}`,
    );
  }
  if (input.spaceDescription) {
    lines.push(`- Space notes: ${input.spaceDescription}`);
  }

  if (input.vibePinTitles && input.vibePinTitles.length > 0) {
    lines.push(`- Vibe references: ${input.vibePinTitles.join("; ")}`);
  } else if (input.vibeQuery) {
    lines.push(`- Vibe direction: ${input.vibeQuery}`);
  }

  if (input.palette && input.palette.length > 0) {
    const paletteStr = input.palette
      .map((c) => {
        const parts = [c.hex];
        if (c.name) parts.push(c.name);
        if (c.material) parts.push(`(${c.material})`);
        return parts.join(" ");
      })
      .join("; ");
    lines.push(`- Palette: ${paletteStr}`);
  }

  const pinterestSummaries: Array<[string, string[] | undefined]> = [
    ["Furniture", input.furniturePinTitles],
    ["Lighting", input.lightingPinTitles],
    ["Flooring", input.flooringPinTitles],
    ["Ceiling", input.ceilingPinTitles],
    ["Materials", input.materialsPinTitles],
  ];
  for (const [label, titles] of pinterestSummaries) {
    if (titles && titles.length > 0) {
      lines.push(`- ${label}: ${titles.slice(0, 4).join("; ")}`);
    }
  }

  lines.push(
    "",
    "Now generate the complete Design DNA brief as JSON. Match the schema exactly.",
  );

  return lines.join("\n");
}

export const GENERATE_BRIEF_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    conceptLine: {
      type: "string",
      minLength: 20,
      maxLength: 200,
    },
    keywords: {
      type: "array",
      minItems: 8,
      maxItems: 12,
      items: { type: "string", minLength: 2, maxLength: 40 },
    },
    colorSystem: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          role: {
            type: "string",
            enum: ["primary", "secondary", "accent", "supporting"],
          },
          hex: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
          name: { type: "string", minLength: 2, maxLength: 40 },
          material: { type: "string", minLength: 3, maxLength: 80 },
        },
        required: ["role", "hex", "name", "material"],
      },
    },
    sectionMoodLines: {
      type: "object",
      additionalProperties: false,
      properties: {
        cover: { type: "string", minLength: 10, maxLength: 200 },
        vibe: { type: "string", minLength: 10, maxLength: 200 },
        colors: { type: "string", minLength: 10, maxLength: 200 },
        furniture: { type: "string", minLength: 10, maxLength: 200 },
        lighting: { type: "string", minLength: 10, maxLength: 200 },
        surfaces: { type: "string", minLength: 10, maxLength: 200 },
        materials: { type: "string", minLength: 10, maxLength: 200 },
        pillars: { type: "string", minLength: 10, maxLength: 200 },
      },
      required: [
        "cover",
        "vibe",
        "colors",
        "furniture",
        "lighting",
        "surfaces",
        "materials",
        "pillars",
      ],
    },
    strategicPillars: {
      type: "object",
      additionalProperties: false,
      properties: {
        psychological: { type: "string", minLength: 60, maxLength: 600 },
        functional: { type: "string", minLength: 60, maxLength: 600 },
        marketing: { type: "string", minLength: 60, maxLength: 600 },
      },
      required: ["psychological", "functional", "marketing"],
    },
    cinematicDescription: {
      type: "string",
      minLength: 200,
      maxLength: 900,
    },
  },
  required: [
    "conceptLine",
    "keywords",
    "colorSystem",
    "sectionMoodLines",
    "strategicPillars",
    "cinematicDescription",
  ],
} as const;

export type GenerateBriefResponse = {
  conceptLine: string;
  keywords: string[];
  colorSystem: Array<{
    role: "primary" | "secondary" | "accent" | "supporting";
    hex: string;
    name: string;
    material: string;
  }>;
  sectionMoodLines: {
    cover: string;
    vibe: string;
    colors: string;
    furniture: string;
    lighting: string;
    surfaces: string;
    materials: string;
    pillars: string;
  };
  strategicPillars: {
    psychological: string;
    functional: string;
    marketing: string;
  };
  cinematicDescription: string;
};
