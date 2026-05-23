"use client";

/**
 * Client-side wizard controller.
 *
 * Holds the current step in React state and renders the matching placeholder
 * card. Back / Next buttons move between steps. The URL stays at
 * `/concept/wizard` — we add per-step URLs once each step has real content
 * worth deep-linking to.
 *
 * Query params from the homepage (`?mode=`, `?industry=`, `?spec=`, `?vibe=`)
 * are carried into the wizard for future use (seed the relevant steps,
 * decide whether to auto-fill in Quick mode, etc.).
 */

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  WIZARD_STEPS,
  type WizardStepId,
  stepNumber,
  nextStep,
  prevStep,
} from "@/lib/wizard-steps";
import WizardProgress from "@/components/wizard/WizardProgress";

export default function WizardClient() {
  const [current, setCurrent] = useState<WizardStepId>("space");
  const params = useSearchParams();
  const mode = params.get("mode") ?? "studio";

  const step = WIZARD_STEPS.find((s) => s.id === current)!;
  const idx = stepNumber(current);
  const total = WIZARD_STEPS.length;
  const isFirst = idx === 1;
  const isLast = idx === total;

  function goBack() {
    const prev = prevStep(current);
    if (prev) setCurrent(prev);
  }

  function goNext() {
    const next = nextStep(current);
    if (next) setCurrent(next);
  }

  return (
    <>
      <WizardProgress current={current} />

      <main className="mx-auto max-w-4xl px-8 py-12 sm:py-16">
        {/* Step heading */}
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-acc">
          <span className="inline-block h-px w-6 bg-acc" />
          Step {String(idx).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        <h1 className="font-serif text-[clamp(32px,4.5vw,48px)] font-normal leading-[1.1] tracking-tight text-hero-cream">
          {step.label}
        </h1>

        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-hero-cream-2">
          {step.description}
        </p>

        {/* Step body — placeholder card for now */}
        <div className="mt-10 border border-dark-3 bg-[rgba(34,30,24,0.6)] p-10 text-center backdrop-blur-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-hero-dim">
            {step.id} step · placeholder
          </p>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-hero-cream-2">
            The real {step.label.toLowerCase()} controls (Pinterest grids, AI
            suggestions, color builder, etc.) plug in here in the next Phase 4 PR.
          </p>
        </div>

        {/* Step navigation */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-dark-3 pt-8 sm:flex-row">
          {isFirst ? (
            <Link
              href={`/concept?mode=${encodeURIComponent(mode)}`}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-hero-dim transition hover:text-acc"
            >
              ← Back to intro
            </Link>
          ) : (
            <button
              onClick={goBack}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-hero-cream-2 transition hover:text-acc"
            >
              ← Back
            </button>
          )}

          <button
            onClick={goNext}
            disabled={isLast}
            className="inline-flex items-center gap-2 bg-acc px-7 py-3.5 text-sm font-medium text-white transition hover:gap-3 hover:bg-acc-h disabled:cursor-not-allowed disabled:bg-dark-3 disabled:text-hero-dim disabled:opacity-70"
          >
            {isLast ? "Generate brief →" : "Next →"}
          </button>
        </div>

        {/* Footnote */}
        <p className="mt-10 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-hero-dim">
          Wizard shell · individual steps land over the next PRs
        </p>
      </main>
    </>
  );
}
