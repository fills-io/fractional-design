"use client";

/**
 * Client-side wizard controller.
 *
 * Holds the current step + the in-progress brief in React state and renders
 * the matching step component (or a placeholder for steps that haven't been
 * ported yet). Back / Next buttons move between steps.
 *
 * Query params from the homepage (`?mode=`, `?industry=`, `?spec=`, `?vibe=`)
 * are consumed once on mount to pre-seed the Space step's industry. Once the
 * AI auto-fill lands (Quick mode), the spec and vibe inputs will seed
 * subsequent steps too.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  WIZARD_STEPS,
  type WizardStepId,
  stepNumber,
  nextStep,
  prevStep,
} from "@/lib/wizard-steps";
import { findIndustryByLabel } from "@/lib/space-taxonomy";
import {
  type WizardState,
  EMPTY_WIZARD_STATE,
} from "@/lib/wizard-state";
import WizardProgress from "@/components/wizard/WizardProgress";
import SpaceStep from "@/components/wizard/steps/SpaceStep";
import VibeStep from "@/components/wizard/steps/VibeStep";
import ColorsStep from "@/components/wizard/steps/ColorsStep";
import FurnitureStep from "@/components/wizard/steps/FurnitureStep";
import LightingStep from "@/components/wizard/steps/LightingStep";
import FlooringStep from "@/components/wizard/steps/FlooringStep";
import CeilingStep from "@/components/wizard/steps/CeilingStep";
import MaterialsStep from "@/components/wizard/steps/MaterialsStep";
import ReviewStep from "@/components/wizard/steps/ReviewStep";

export default function WizardClient() {
  const [current, setCurrent] = useState<WizardStepId>("space");
  const [wizardState, setWizardState] = useState<WizardState>(EMPTY_WIZARD_STATE);

  const params = useSearchParams();
  const mode = params.get("mode") ?? "studio";

  // Seed industry from the homepage Quick form (if it sent one through).
  // Runs once — subsequent renders won't clobber a user-selected industry.
  useEffect(() => {
    const industryParam = params.get("industry");
    if (industryParam) {
      const matched = findIndustryByLabel(industryParam);
      if (matched) {
        setWizardState((prev) =>
          prev.industryId ? prev : { ...prev, industryId: matched.id },
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = WIZARD_STEPS.find((s) => s.id === current)!;
  const idx = stepNumber(current);
  const total = WIZARD_STEPS.length;
  const isFirst = idx === 1;
  const isLast = idx === total;

  /** Merge a partial update into the wizard state. */
  function patchState(patch: Partial<WizardState>) {
    setWizardState((prev) => ({ ...prev, ...patch }));
  }

  /** Can the user advance from the current step? */
  function canAdvance(): boolean {
    switch (current) {
      case "space":
        // Space step: industry + specific space required, the rest optional.
        return !!(wizardState.industryId && wizardState.spaceId);
      case "vibe":
        // Vibe step: at least one pin picked (max 3 enforced by the grid).
        return (wizardState.vibePins?.length ?? 0) > 0;
      case "colors":
        // Colors step: any non-default-only palette is OK to advance.
        // (We don't require all 4 names filled — that's a stylistic choice.)
        return true;
      case "furniture":
        return (wizardState.furniturePins?.length ?? 0) > 0;
      case "lighting":
        return (wizardState.lightingPins?.length ?? 0) > 0;
      case "flooring":
        return (wizardState.flooringPins?.length ?? 0) > 0;
      case "ceiling":
        return (wizardState.ceilingPins?.length ?? 0) > 0;
      case "materials":
        return (wizardState.materialsPins?.length ?? 0) > 0;
      default:
        // Placeholder steps don't gate Next yet — fill this in per step.
        return true;
    }
  }

  function goBack() {
    const prev = prevStep(current);
    if (prev) setCurrent(prev);
  }

  function goNext() {
    if (!canAdvance()) return;
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

        {/* Step body */}
        <div className="mt-10">
          {current === "space" && (
            <SpaceStep state={wizardState} setState={patchState} />
          )}
          {current === "vibe" && (
            <VibeStep state={wizardState} setState={patchState} />
          )}
          {current === "colors" && (
            <ColorsStep state={wizardState} setState={patchState} />
          )}
          {current === "furniture" && (
            <FurnitureStep state={wizardState} setState={patchState} />
          )}
          {current === "lighting" && (
            <LightingStep state={wizardState} setState={patchState} />
          )}
          {current === "flooring" && (
            <FlooringStep state={wizardState} setState={patchState} />
          )}
          {current === "ceiling" && (
            <CeilingStep state={wizardState} setState={patchState} />
          )}
          {current === "materials" && (
            <MaterialsStep state={wizardState} setState={patchState} />
          )}
          {current === "review" && (
            <ReviewStep state={wizardState} goToStep={setCurrent} />
          )}
        </div>

        {/* Step navigation */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-dark-3 pt-8 sm:flex-row">
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
            disabled={isLast || !canAdvance()}
            className="inline-flex items-center gap-2 bg-acc px-7 py-3.5 text-sm font-medium text-white transition hover:gap-3 hover:bg-acc-h disabled:cursor-not-allowed disabled:bg-dark-3 disabled:text-hero-dim disabled:opacity-70"
          >
            {isLast ? "Generate brief →" : "Next →"}
          </button>
        </div>

        <p className="mt-10 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-hero-dim">
          Wizard in progress · steps land over upcoming PRs
        </p>
      </main>
    </>
  );
}

/* ─── Sub-components ───────────────────────────────────────────────────── */

function PlaceholderStep({
  stepId,
  stepLabel,
}: {
  stepId: string;
  stepLabel: string;
}) {
  return (
    <div className="border border-dark-3 bg-[rgba(34,30,24,0.6)] p-10 text-center backdrop-blur-sm">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-hero-dim">
        {stepId} step · placeholder
      </p>
      <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-hero-cream-2">
        The real {stepLabel.toLowerCase()} controls (Pinterest grids, AI
        suggestions, color builder, etc.) plug in here in an upcoming PR.
      </p>
    </div>
  );
}
