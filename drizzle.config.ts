/**
 * Drizzle Kit config — for generating and running SQL migrations.
 *
 * Commands (defined in package.json):
 *   pnpm db:generate   — diff schema.ts against the DB and write a new migration SQL file
 *   pnpm db:migrate    — apply pending migrations against DATABASE_URL
 *   pnpm db:studio     — open a local web UI to browse the database
 */

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Show every generated SQL statement so we can review what Drizzle is about to run.
  verbose: true,
  // Ask for confirmation before destructive operations.
  strict: true,
});
