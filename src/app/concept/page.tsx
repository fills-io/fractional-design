import { Suspense } from "react";
import ConceptPageShell from "./ConceptPageShell";

/**
 * /concept — the destination for all three homepage CTAs.
 *
 * Three entry modes (carried via query string):
 *   - ?mode=quick&industry=...&spec=...&vibe=...
 *       User filled out the homepage's quick prompt; we echo their picks back
 *       and (in Phase 4) launch the AI-auto-filled wizard.
 *   - ?mode=studio
 *       User wants the full hands-on wizard (all 9 steps manual).
 *   - ?mode=upload
 *       User uploaded a reference image; we'll re-prompt for the file here
 *       in Phase 4 once Vercel Blob is wired.
 *
 * This file (a Server Component) just renders the navbar + shell. The shell
 * is a Client Component because it reads `useSearchParams()` for the dynamic
 * mode + values.
 *
 * Wrapped in <Suspense> because Next.js 16 requires CSR-bailout boundaries
 * around components that use `useSearchParams`.
 */

import Navbar from "@/components/Navbar";

export default function ConceptPage() {
  return (
    <div className="min-h-screen bg-dark text-hero-cream">
      <Navbar />
      <Suspense
        fallback={
          <div className="mx-auto max-w-4xl px-8 py-24 text-hero-dim">
            Loading your brief…
          </div>
        }
      >
        <ConceptPageShell />
      </Suspense>
    </div>
  );
}
