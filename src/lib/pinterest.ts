/**
 * Pinterest scraper wrapper — calls the Apify actor `fatihtahta/pinterest-scraper-search`
 * and normalizes its responses into the `PinterestPin` shape used throughout the app.
 *
 * Cached via Next.js `unstable_cache` for 24 hours per (query, limit, type) combo.
 * That cache is shared across all serverless invocations on Vercel, so repeated
 * searches don't burn Apify credits.
 *
 * Ported from the Replit prototype's `server/routes.ts` (`searchPinterestPins`),
 * with these differences:
 *   - Cache layer: in-memory `Map` -> Next.js `unstable_cache` (works in serverless)
 *   - Hard-coded TTL constants kept in one place
 *   - Strongly typed without `any` for the Apify response (still loose where the
 *     external API is loose, but contained behind a `mapPinResult` boundary)
 */

import { unstable_cache } from "next/cache";
import type { PinterestPin } from "@/db/schema";

const APIFY_ACTOR = "fatihtahta/pinterest-scraper-search";
const APIFY_ACTOR_ID = APIFY_ACTOR.replace("/", "~"); // Apify's URL format
const APIFY_ENDPOINT = `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items`;

const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

/** Pinterest search categories supported by the Apify actor. */
export type PinterestSearchType =
  | "all-pins"
  | "videos"
  | "boards"
  | "profiles";

/**
 * Raw Apify response item shape (loose — we only touch a handful of fields).
 * Defined here so callers can't accidentally depend on the upstream format.
 */
type ApifyResponseItem = {
  id?: string | number;
  url?: string;
  title?: string;
  entity_type?: string;
  pin?: {
    title?: string;
    description?: string;
    closeup_description?: string;
    alt_text?: string;
    dominant_color?: string;
  };
  media?: {
    images?: {
      thumb?: { url?: string };
      small?: { url?: string };
      medium?: { url?: string };
      large?: { url?: string };
    };
  };
  board_ref?: {
    name?: string;
    url?: string;
  };
};

/**
 * Apify returns image URLs in `/236x/` (small) and `/736x/` (high-res) variants.
 * We rewrite the small ones to high-res for crisper grids — the high-res URL is
 * always served by Pinterest's CDN even when the API only references the small.
 */
function upgradeToHighRes(url: string): string {
  return url.replace(/\/236x\//g, "/736x/");
}

function mapPinResult(item: ApifyResponseItem): PinterestPin {
  const pin = item.pin ?? {};
  const media = item.media?.images ?? {};
  const boardRef = item.board_ref ?? {};

  const imageUrl = upgradeToHighRes(
    media.medium?.url ??
      media.large?.url ??
      media.small?.url ??
      media.thumb?.url ??
      "",
  );
  const thumbUrl = upgradeToHighRes(media.thumb?.url ?? media.small?.url ?? "");

  return {
    id: String(item.id ?? ""),
    url: item.url ?? "",
    title: pin.title ?? item.title ?? "",
    description: pin.description ?? pin.closeup_description ?? "",
    altText: pin.alt_text ?? "",
    imageUrl,
    imageThumbUrl: thumbUrl,
    dominantColor: pin.dominant_color ?? "",
    boardName: boardRef.name ?? "",
    boardUrl: boardRef.url ?? "",
  };
}

/**
 * Uncached implementation. Wrapped by `unstable_cache` below.
 *
 * Throws if APIFY_TOKEN is missing or if Apify returns a non-2xx response —
 * callers (the API route handler) catch and translate to a 500.
 */
async function searchPinterestPinsUncached(
  query: string,
  limit: number,
  type: PinterestSearchType,
): Promise<PinterestPin[]> {
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    throw new Error(
      "APIFY_TOKEN is not set. Add it in Vercel → Settings → Environment Variables.",
    );
  }

  const response = await fetch(`${APIFY_ENDPOINT}?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      queries: [query],
      type,
      limit,
    }),
    // Don't use Next.js's auto-fetch cache here; we handle caching at the
    // function level via `unstable_cache` (which is the right granularity).
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Apify Pinterest scraper failed: HTTP ${response.status} — ${body.slice(0, 200)}`,
    );
  }

  const data = (await response.json()) as ApifyResponseItem[];

  // Apify returns mixed entity types — filter to actual pins with images.
  return data
    .filter(
      (item) =>
        (item.entity_type === "pin" || item.pin) && item.media?.images,
    )
    .map(mapPinResult);
}

/**
 * Search Pinterest for pins matching a query.
 *
 * Cached for 24 hours per (query, limit, type). Identical searches are free
 * within the cache window — no Apify credits consumed.
 *
 * @param query  Free-text search, e.g. "warm minimalism living room"
 * @param limit  Max pins to return (default 30, hard cap 100)
 * @param type   Pinterest entity type (default "all-pins")
 */
export const searchPinterestPins = unstable_cache(
  async (
    query: string,
    limit: number,
    type: PinterestSearchType,
  ): Promise<PinterestPin[]> => {
    return searchPinterestPinsUncached(query, limit, type);
  },
  ["pinterest-search"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: ["pinterest"],
  },
);
