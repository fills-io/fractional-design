/**
 * Wizard progress strip — shows where the user is in the 9-step flow.
 *
 * Visually: a row of small labeled segments. Completed steps are filled
 * with the accent color, the current step is highlighted, future steps
 * are muted. On narrow screens it collapses to "Step N of 9".
 */

import { WIZARD_STEPS, type WizardStepId, stepNumber } from "@/lib/wizard-steps";

export default function WizardProgress({ current }: { current: WizardStepId }) {
  const currentIdx = stepNumber(current); // 1-indexed

  return (
    <div className="border-b border-dark-3 bg-[rgba(34,30,24,0.4)] px-8 py-5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        {/* Mobile-only compact label */}
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-hero-dim sm:hidden">
          Step {currentIdx} of {WIZARD_STEPS.length}
        </span>

        {/* Desktop segmented bar */}
        <ol className="hidden flex-1 items-center gap-2 sm:flex">
          {WIZARD_STEPS.map((step, i) => {
            const idx = i + 1;
            const state =
              idx < currentIdx
                ? "done"
                : idx === currentIdx
                  ? "current"
                  : "upcoming";
            return (
              <li
                key={step.id}
                className="flex flex-1 flex-col items-start gap-1.5"
              >
                <div
                  className={`h-[3px] w-full transition ${
                    state === "done"
                      ? "bg-acc"
                      : state === "current"
                        ? "bg-acc"
                        : "bg-dark-3"
                  }`}
                />
                <div className="flex w-full items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em]">
                  <span
                    className={
                      state === "current"
                        ? "text-acc"
                        : state === "done"
                          ? "text-hero-cream-2"
                          : "text-hero-dim"
                    }
                  >
                    {step.label}
                  </span>
                  <span
                    className={
                      state === "current"
                        ? "text-acc"
                        : "text-hero-dim opacity-60"
                    }
                  >
                    {String(idx).padStart(2, "0")}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
