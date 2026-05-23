/**
 * Colormind palette generator — calls the free https://colormind.io API.
 *
 * Colormind returns 5 colors. We keep all 5 but the palette builder only
 * uses 4 slots, so the caller takes the first 4 (or picks any subset).
 *
 * Note on the URL: Colormind only serves HTTP at api.colormind.io (no
 * HTTPS at the time of writing). Calling HTTP from a browser would be
 * blocked as mixed content, so all Colormind calls flow through our
 * Next.js API route at /api/colors/generate — server-to-server HTTP is fine.
 */

const COLORMIND_ENDPOINT = "http://colormind.io/api/";

/** A single "color slot" Colormind accepts in the input array. */
export type ColormindInputColor = "N" | [number, number, number];

/** Call Colormind directly. Server-only — don't call from a client component. */
export async function fetchColormindPalette(
  /** 5-element array. "N" = "fill in for me". RGB tuple = "lock this slot". */
  input: ColormindInputColor[] = ["N", "N", "N", "N", "N"],
  model: "default" | "ui" = "default",
): Promise<string[]> {
  if (input.length !== 5) {
    throw new Error("Colormind expects exactly 5 input slots");
  }

  const response = await fetch(COLORMIND_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, input }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Colormind returned HTTP ${response.status}: ${body.slice(0, 200)}`,
    );
  }

  const data = (await response.json()) as { result?: number[][] };
  if (!Array.isArray(data.result) || data.result.length !== 5) {
    throw new Error("Colormind returned an unexpected shape");
  }

  return data.result.map(rgbToHex);
}

/** Convert an [R, G, B] tuple in 0–255 range to a "#rrggbb" string. */
function rgbToHex(rgb: number[]): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const hex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${hex(rgb[0])}${hex(rgb[1])}${hex(rgb[2])}`;
}

/** Convert a "#rrggbb" string to an [R, G, B] tuple. Used to lock slots. */
export function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}
