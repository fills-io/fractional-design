/**
 * GET /api/ai/models
 *
 * Diagnostic route — returns the list of Gemini models the current API key
 * has access to. Useful for picking the right `DEFAULT_MODEL` in lib/gemini.ts
 * after Google deprecates the previous default.
 *
 * Temporary; can be removed once the model lineup stabilizes.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "GEMINI_API_KEY not set" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json(
        { ok: false, status: response.status, body },
        { status: 502 },
      );
    }
    const data = (await response.json()) as {
      models?: Array<{
        name?: string;
        supportedGenerationMethods?: string[];
      }>;
    };
    const usable = (data.models ?? [])
      .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m) => m.name?.replace("models/", ""))
      .filter((n): n is string => !!n);
    return NextResponse.json({ ok: true, models: usable });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
