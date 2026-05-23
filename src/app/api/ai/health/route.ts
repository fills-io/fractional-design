/**
 * GET /api/ai/health
 *
 * Smoke test for the Gemini wiring. Confirms that:
 *   1. GEMINI_API_KEY is set on the server
 *   2. The server can reach Google's API
 *   3. The model returns a sane response
 *
 * Response:
 *   200 OK   — { ok: true, model: string, reply: string, latencyMs: number }
 *   500 ERR  — { ok: false, error: string }
 *
 * Cheap, but not free — every call burns one tiny Gemini request. Use
 * sparingly (don't put this in a uptime monitor).
 */

import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    const reply = await generateText(
      "Respond with the single word OK to confirm you received this.",
      { temperature: 0 },
    );
    return NextResponse.json({
      ok: true,
      model: "gemini-2.0-flash",
      reply: reply.trim(),
      latencyMs: Date.now() - startedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[/api/ai/health] Gemini ping failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: message,
        latencyMs: Date.now() - startedAt,
      },
      { status: 500 },
    );
  }
}
