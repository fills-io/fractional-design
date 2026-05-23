/**
 * Database connection.
 *
 * Uses the Supabase connection-pooler URL (`DATABASE_URL`) so Vercel's
 * serverless functions don't exhaust Postgres' connection limit.
 *
 * Usage:
 *   import { db } from "@/db";
 *   const briefs = await db.select().from(concepts);
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it in Vercel → Settings → Environment Variables, " +
      "or in a local .env.local file for development.",
  );
}

// `prepare: false` is required when using Supabase's transaction pooler
// (which is what our DATABASE_URL points at).
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });

// Re-export schema for convenience: `import { db, concepts } from "@/db";`
export * from "./schema";
