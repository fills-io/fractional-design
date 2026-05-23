/**
 * Wizard draft persistence — localStorage-backed.
 *
 * Why localStorage (and not the DB):
 *   - A wizard draft is "scratch work" — most are abandoned before generation.
 *     Persisting every draft to Postgres pollutes the table with garbage and
 *     burns DB writes.
 *   - The user's brief becomes a real DB row only at the moment they click
 *     "Generate" — that's when there's something worth saving server-side.
 *   - localStorage gives instant load (no API call on mount), works offline,
 *     and the UX win (refresh doesn't kill your work) is the same.
 *
 * Trade-offs we accept:
 *   - Drafts don't sync across devices. A user who starts on phone can't
 *     resume on laptop. That's fine — the product expectation is one
 *     sitting per brief.
 *   - Clearing browser data clears drafts. Same as any pre-save state.
 *
 * Storage shape:
 *   key   = "fills:wizard:draft"
 *   value = { savedAt: ISO timestamp, state: WizardState }
 *
 * We use a single key (not per-draft) because the wizard's URL doesn't carry
 * an ID yet. When DB-backed drafts land, this key becomes a fallback.
 */

import type { WizardState } from "./wizard-state";

const STORAGE_KEY = "fills:wizard:draft";

type StoredDraft = {
  savedAt: string;
  state: WizardState;
};

/**
 * Persist the current wizard state. Runs synchronously — localStorage is
 * fast enough that we don't need to debounce, but the caller may choose to.
 *
 * SSR-safe: returns silently when called server-side (no window).
 */
export function saveDraft(state: WizardState): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredDraft = {
      savedAt: new Date().toISOString(),
      state,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage quota exceeded, private browsing, etc. — silently swallow.
    // Worst case: refresh resets the draft, which is the pre-PR behavior.
  }
}

/**
 * Read the saved wizard state, or `null` if none / unreadable.
 *
 * SSR-safe: returns null server-side.
 */
export function loadDraft(): {
  state: WizardState;
  savedAt: Date;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDraft;
    if (!parsed || typeof parsed !== "object" || !parsed.state) return null;
    return {
      state: parsed.state,
      savedAt: new Date(parsed.savedAt),
    };
  } catch {
    // Corrupt JSON — nuke it so we don't keep failing.
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}

/**
 * Wipe the saved draft. Call this when the user has successfully generated
 * a brief (the DB now owns the real artifact) or hits an explicit "Start over".
 */
export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
