/**
 * POST /api/ai/suggest-search
 *
 * Given the user's current Pinterest search query plus wizard context,
 * returns 4 AI-suggested alternative queries. Powers the "Try also:"
 * row that appears below the search bar on each Pinterest-driven step.
 *
 * Request body:
 *   {
 *     currentQuery: string,         // what they just searched
 *     step: string,                 // "vibe" | "furniture" | "lighting" | ...
 *     industry?: string,            // "Residential" etc.
 *     space?: string,               // "Bedroom" etc.
 *     priorContext?: string         // one-line summary of earlier picks
 *   }
 *
 * Response:
 *   200 OK   — { suggestions: string[] }     (exactly 4)
 *   400 BAD  — { ok: false, error: string }
 *   500 ERR  — { ok: false, error: string }
 *
 * Cached by Next.js based on the JSON-stringified body so identical
 * follow-up calls don't burn tokens.
 */

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { aiText } from "@/lib/ai";
import {
  SEARCH_SUGGESTIONS_SYSTEM_PROMPT,
  SEARCH_SUGGESTIONS_SCHEMA,
  buildSearchSuggestionPrompt,
  type SearchSuggestionsResponse,
} from "@/lib/ai/prompts/search-suggestions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  currentQuery: z.string().min(1).max(200),
  step: z.string().min(1).max(40),
  industry: z.string().max(80).optional(),
  space: z.string().max(80).optional(),
  priorContext: z.string().max(400).optional(),
});

export async function POST(request: NextRequest) {
  let parsed;
  try {
    const body = await request.json();
    parsed = bodySchema.safeParse(body);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.message },
      { status: 400 },
    );
  }

  try {
    const result = await aiText({
      system: SEARCH_SUGGESTIONS_SYSTEM_PROMPT,
      prompt: buildSearchSuggestionPrompt(parsed.data),
      tier: "mini",
      schema: SEARCH_SUGGESTIONS_SCHEMA,
      schemaName: "search_suggestions",
      maxOutputTokens: 1500,
    });

    // Schema-enforced output guarantees this parses, but we still wrap
    // it in try/catch defensively — a future provider swap might be
    // less strict than OpenAI's json_schema mode.
    let payload: SearchSuggestionsResponse;
    try {
      payload = JSON.parse(result.text);
    } catch {
      console.error("[/api/ai/suggest-search] malformed JSON:", result.text);
      return NextResponse.json(
        { ok: false, error: "Model returned malformed JSON" },
        { status: 502 },
      );
    }

    return NextResponse.json(payload, {
      headers: {
        // 24h browser/CDN cache — same inputs always produce same suggestions
        // for the cache window. The wizard context rarely changes during a
        // session so this is mostly a free win.
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[/api/ai/suggest-search] AI call failed:", error);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
