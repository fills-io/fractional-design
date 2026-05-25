/**
 * GET /api/ai/health
 *
 * Smoke test for the AI wiring. Confirms:
 *   1. The configured TEXT_PROVIDER's API key is set
 *   2. The provider's API is reachable
 *   3. The model responds with a sane reply
 *
 * Response:
 *   200 OK   — { ok: true, provider: string, model: string, reply: string, latencyMs: number }
 *   500 ERR  — { ok: false, error: string }
 *
 * Cheap (one tiny call per ping) but not free — don't put this on a
 * 5-second uptime monitor. For manual verification after deploys.
 */

import { NextResponse } from "next/server";
import { aiText } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    const result = await aiText({
      prompt: "Respond with the single word OK to confirm you received this.",
      tier: "mini",
      temperature: 0,
      maxOutputTokens: 8,
    });

    return NextResponse.json({
      ok: true,
      provider: result.provider,
      model: result.model,
      reply: result.text.trim(),
      latencyMs: Date.now() - startedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[/api/ai/health] AI ping failed:", error);
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
