/**
 * The shape of the in-progress brief while the user is moving through the
 * wizard. This is the client-side mirror of what eventually gets persisted
 * to the `concepts` table — but kept here as a separate type so the wizard
 * doesn't have to think about DB serialization yet.
 *
 * Every field is optional because the wizard fills them in step by step.
 */

import type { IndustryId } from "./space-taxonomy";

export type WizardState = {
  // ── Step 1: Space ────────────────────────────────────────────────────────
  industryId?: IndustryId;
  spaceId?: string;
  /** Free-text "describe the space" notes. */
  spaceDescription?: string;
  /** Rough size bucket. */
  spaceSize?: "small" | "medium" | "large" | "xl";

  // ── Steps 2–8 (placeholders) ────────────────────────────────────────────
  // We'll add fields as each step ships. Keeping the type open ensures
  // refactors don't cascade through every step component.

  // ── Step 9: Review ───────────────────────────────────────────────────────
  // (read-only summary, no fields of its own)
};

/** Convenient empty state for a fresh wizard. */
export const EMPTY_WIZARD_STATE: WizardState = {};
