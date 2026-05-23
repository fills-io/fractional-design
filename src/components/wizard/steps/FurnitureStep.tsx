"use client";

/**
 * Step 4 — Furniture.
 *
 * Single Pinterest grid for now. Sub-sections (sofa / chairs / tables broken
 * out into separate grids) come when the AI helper that generates those
 * sub-sections lands. Until then, this is a single 6-pin grid for "furniture
 * for {space}".
 */

import PinterestStepWrapper from "./PinterestStepWrapper";
import { getIndustry } from "@/lib/space-taxonomy";
import type { WizardState } from "@/lib/wizard-state";

type Props = {
  state: WizardState;
  setState: (patch: Partial<WizardState>) => void;
};

const MAX_PINS = 6;

export default function FurnitureStep({ state, setState }: Props) {
  const industry = state.industryId ? getIndustry(state.industryId) : null;
  const spaceLabel =
    industry?.spaces.find((s) => s.id === state.spaceId)?.label.toLowerCase() ??
    "interior";

  return (
    <PinterestStepWrapper
      spaceLabel={spaceLabel}
      category="furniture"
      rememberedQuery={state.furnitureQuery}
      selectedPins={state.furniturePins ?? []}
      maxSelections={MAX_PINS}
      onChange={({ pins, query }) =>
        setState({ furniturePins: pins, furnitureQuery: query })
      }
      helperText={`Up to ${MAX_PINS} pins. Mix scale — a hero piece, a few supporting items.`}
    />
  );
}
