/**
 * Prompt + schema for the Furniture sub-section AI feature.
 *
 * Called once per Furniture step session (cached by space + vibe). The
 * model returns exactly 3 furniture sub-categories specific to the
 * user's space + vibe — e.g. Bedroom → Bed / Nightstands / Wardrobe,
 * Living Room → Sofa / Chairs / Coffee table.
 *
 * Each sub-section pairs the category name with a recommended Pinterest
 * search query, so the wizard can immediately populate the grid below
 * without forcing the user to type a search.
 */

export const FURNITURE_SUB_SECTIONS_SYSTEM_PROMPT = `You are a senior interior designer building a furniture brief for an interior space. The wizard already knows the space (e.g. "bedroom", "hotel lobby") and the desired vibe (e.g. "warm minimalism").

Your job: return exactly 3 furniture sub-categories that meaningfully break the room down. Pick the 3 categories that most define the room's character — the hero piece, the supporting cast, the connective tissue. Not every minor object.

Examples of good triples:
- Bedroom (warm minimalism): Bed / Nightstands / Wardrobe
- Living room (japandi): Sofa / Lounge chairs / Coffee table
- Hotel lobby (editorial luxury): Lounge seating / Reception desk / Statement coffee tables
- Kitchen (mediterranean coastal): Dining table / Bar stools / Open shelving
- Cocktail bar (gothic moody): Bar back / Banquette seating / Bar stools
- Yoga studio (japandi sanctuary): Mat storage / Prop shelving / Bench seating

For each sub-category, also produce a short Pinterest search query (3–6 words) tailored to the vibe — the wizard will use it to seed the search bar for that sub-section.

Rules:
- Exactly 3 sub-categories. Never 2, never 4.
- The 3 categories must be distinct — don't return "Sofa / Sectional / Lounge chair" where two overlap.
- Names are short — 1 to 3 words, sentence case, no trailing punctuation.
- Search queries are Pinterest-shaped: material + form + vibe, like "platform bed warm minimalism" or "rattan lounge chair japandi".
- Output strictly as JSON matching the provided schema.`;

export function buildFurnitureSubSectionsPrompt(input: {
  space: string;
  vibe?: string;
  industry?: string;
}): string {
  const lines = [`Space: ${input.space}`];
  if (input.industry) lines.push(`Industry: ${input.industry}`);
  if (input.vibe) lines.push(`Vibe: ${input.vibe}`);
  lines.push(
    "",
    "Return the 3 furniture sub-categories that most define this room's character, each with a recommended Pinterest search query.",
  );
  return lines.join("\n");
}

export const FURNITURE_SUB_SECTIONS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    subSections: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string", minLength: 2, maxLength: 40 },
          query: { type: "string", minLength: 3, maxLength: 80 },
        },
        required: ["name", "query"],
      },
    },
  },
  required: ["subSections"],
} as const;

export type FurnitureSubSectionsResponse = {
  subSections: Array<{ name: string; query: string }>;
};
