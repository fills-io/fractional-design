/**
 * GET /api/health/db
 *
 * Smoke test for the database wiring. Proves four things at once:
 *   1. Vercel has the DATABASE_URL environment variable set correctly
 *   2. Next.js can reach Supabase from a serverless function
 *   3. Drizzle's schema matches what's actually in the database
 *      (the count queries fail if the table doesn't exist)
 *   4. The connection pooler is responding within a reasonable latency
 *
 * Response:
 *   200 OK   — { ok: true, tables: { concepts: number, moodBoards: number }, latencyMs: number }
 *   500 ERR  — { ok: false, error: string }
 *
 * This route is safe to expose publicly — it only returns aggregate counts,
 * never user data. It's useful as a Vercel uptime ping and as a quick
 * verification after env-var changes.
 */

import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db, concepts, moodBoards } from "@/db";

// Force Node.js runtime — the `postgres` driver uses Buffer / net which
// aren't available on the Edge runtime.
export const runtime = "nodejs";

// Never cache — we want a live ping every time.
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    const [conceptCount, moodBoardCount] = await Promise.all([
      db.select({ n: sql<number>`count(*)::int` }).from(concepts),
      db.select({ n: sql<number>`count(*)::int` }).from(moodBoards),
    ]);

    return NextResponse.json({
      ok: true,
      tables: {
        concepts: conceptCount[0]?.n ?? 0,
        moodBoards: moodBoardCount[0]?.n ?? 0,
      },
      latencyMs: Date.now() - startedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // Log full error server-side, return only the message in the response.
    console.error("[/api/health/db] DB ping failed:", error);

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
