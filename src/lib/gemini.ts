/**
 * Gemini wrapper — every AI call in Fills flows through this module so we
 * have a single place to set defaults (model, safety settings, timeouts),
 * swap providers, and add retry / rate-limit logic.
 *
 * Pricing context (2026-05): Gemini's free tier is generous —
 *   - gemini-2.0-flash: 15 RPM, 1500 RPD
 *   - Vision input included free
 * Enough for our dev pace and early user load. We only need a paid tier
 * if/when traffic grows past those limits.
 *
 * Model choice:
 *   - Default = `gemini-2.0-flash` — fast, free, plenty smart for our
 *     compatibility checks, search suggestions, and Design DNA narrative.
 *   - Vision is the same model; just pass it images in the parts array.
 */

import {
  GoogleGenerativeAI,
  type GenerativeModel,
  type Content,
} from "@google/generative-ai";

export type GeminiModelName =
  | "gemini-flash-latest"
  | "gemini-flash-lite-latest"
  | "gemini-pro-latest"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-pro";

// gemini-flash-latest is an alias that points to the current stable Flash
// model. Choosing the alias keeps us on the most up-to-date model without
// requiring a code change every time Google ships a new generation.
//
// Model history for this codebase:
//   - gemini-2.0-flash → 429 on first request (needed billing on the project)
//   - gemini-1.5-flash → 404 (model retired)
//   - gemini-flash-latest → current pick (lists as available with our key)
const DEFAULT_MODEL: GeminiModelName = "gemini-flash-latest";

/**
 * Lazy-init the SDK client. We don't construct at module load so a missing
 * key only fails the individual request, not the entire build.
 */
function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it in Vercel → Settings → Environment Variables.",
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Get a configured Gemini model instance. Centralizes defaults like safety
 * settings, generation config, etc. so individual call sites don't drift.
 */
export function getModel(
  name: GeminiModelName = DEFAULT_MODEL,
): GenerativeModel {
  return getClient().getGenerativeModel({
    model: name,
    generationConfig: {
      // Lower temperature = more deterministic. Tuned for design-advice tasks
      // where we want clarity over creativity. Per-call overrides allowed.
      temperature: 0.7,
      // Cap so a runaway response can't burn cost or block the user.
      maxOutputTokens: 2048,
    },
  });
}

/**
 * Run a single-turn prompt and return the model's text response. Convenience
 * wrapper for the most common case ("give me text out for this text in").
 */
export async function generateText(
  prompt: string,
  options: {
    model?: GeminiModelName;
    /** Optional system instruction sent as a leading message. */
    system?: string;
    /** Override temperature (default 0.7). */
    temperature?: number;
  } = {},
): Promise<string> {
  const model = getClient().getGenerativeModel({
    model: options.model ?? DEFAULT_MODEL,
    systemInstruction: options.system,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: 2048,
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Run a multi-modal prompt (text + images). Used by From-Image mode to read
 * an uploaded reference photo. Image input is base64-encoded.
 */
export async function generateFromImage(opts: {
  prompt: string;
  /** Base64 image data (no data: prefix). */
  imageBase64: string;
  /** MIME type, e.g. "image/jpeg". */
  mimeType: string;
  model?: GeminiModelName;
  system?: string;
}): Promise<string> {
  const model = getClient().getGenerativeModel({
    model: opts.model ?? DEFAULT_MODEL,
    systemInstruction: opts.system,
  });

  const parts: Content[] = [
    {
      role: "user",
      parts: [
        { text: opts.prompt },
        {
          inlineData: {
            data: opts.imageBase64,
            mimeType: opts.mimeType,
          },
        },
      ],
    },
  ];
  const result = await model.generateContent({ contents: parts });
  return result.response.text();
}
