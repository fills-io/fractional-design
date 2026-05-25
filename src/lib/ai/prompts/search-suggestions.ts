/**
 * Prompt + schema for the Pinterest search-suggestion AI feature.
 *
 * Called from /api/ai/suggest-search whenever a user finishes a Pinterest
 * search on any wizard step. The model proposes 4 alternative or more
 * specific queries the user might want to try next — tailored to the
 * space being designed and the user's earlier picks.
 *
 * Why we keep prompts in their own file:
 *   1. Easy to iterate on prompts without touching app code.
 *   2. Easy to version / track changes — "the prompt that drove this
 *      output" is one git diff away.
 *   3. Easy to swap per-provider variants later (Claude vs GPT etc.) by
 *      pairing each prompt file with a provider-specific override.
 */

export const SEARCH_SUGGESTIONS_SYSTEM_PROMPT = `You are a senior interior designer helping a designer-in-training narrow a Pinterest search.

Your job: take their current search query plus the project context (what kind of space, what they've already picked) and propose 4 alternative search queries that would surface higher-quality, more on-brief Pinterest results.

Rules:
- Each suggestion is a short Pinterest search phrase (3–8 words).
- Mix scales: at least one MORE SPECIFIC (narrows their current intent) and one ADJACENT (a related-but-different direction worth exploring).
- Use language Pinterest users actually search with — material names, design eras, designer names, room labels, mood words.
- No platitudes ("beautiful design"), no marketing fluff.
- Don't repeat the user's original query.
- Don't include #hashtags or extra punctuation.

Output strictly as JSON matching the provided schema.`;

/**
 * Build the user message for the suggestion call.
 * Kept as a function so we can refactor the context shape without breaking callers.
 */
export function buildSearchSuggestionPrompt(input: {
  /** The user's current search string. */
  currentQuery: string;
  /** The wizard step they're on ("vibe", "furniture", "lighting", ...). */
  step: string;
  /** Industry (e.g. "Residential", "Hospitality"). */
  industry?: string;
  /** Specific space (e.g. "Bedroom", "Hotel lobby"). */
  space?: string;
  /** Optional summary of what they've already chosen elsewhere. */
  priorContext?: string;
}): string {
  const lines = [
    `Current search: "${input.currentQuery}"`,
    `Wizard step: ${input.step}`,
  ];
  if (input.industry) lines.push(`Industry: ${input.industry}`);
  if (input.space) lines.push(`Space: ${input.space}`);
  if (input.priorContext) lines.push(`Prior picks: ${input.priorContext}`);

  lines.push(
    "",
    "Suggest 4 alternative Pinterest search queries the user could try next.",
  );

  return lines.join("\n");
}

/**
 * JSON Schema enforced by OpenAI's structured-output mode. The model
 * mathematically cannot return anything that doesn't match this shape.
 */
export const SEARCH_SUGGESTIONS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    suggestions: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "string",
        minLength: 3,
        maxLength: 80,
      },
    },
  },
  required: ["suggestions"],
} as const;

export type SearchSuggestionsResponse = {
  suggestions: string[];
};
