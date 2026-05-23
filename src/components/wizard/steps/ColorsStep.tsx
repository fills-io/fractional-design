"use client";

/**
 * Step 3 — Colors & Palette.
 *
 * Four-slot color palette builder (Primary / Secondary / Accent / Supporting).
 * Each slot is a hex value + a designer name + the material it shows up on.
 *
 * AI suggestion via Colormind (free, no API key) lands in a follow-up PR
 * — for now this is a pure manual builder.
 */

import ColorPaletteBuilder, {
  PALETTE_SLOTS,
} from "@/components/wizard/ColorPaletteBuilder";
import type { ColorEntry } from "@/db/schema";
import type { WizardState } from "@/lib/wizard-state";

type Props = {
  state: WizardState;
  setState: (patch: Partial<WizardState>) => void;
};

/** Default starting palette — pulled from the warm-cream/terracotta theme. */
function defaultPalette(): ColorEntry[] {
  return PALETTE_SLOTS.map((slot) => ({
    hex: slot.defaultHex,
    name: "",
    material: "",
  }));
}

export default function ColorsStep({ state, setState }: Props) {
  const palette = state.palette ?? defaultPalette();

  return (
    <div className="space-y-6">
      <p className="text-[14px] text-hero-cream-2">
        Build the palette in four roles. The names and materials you write here
        feed straight into the final Design DNA brief, so think of them as
        designer-to-designer notes, not generic labels.
      </p>

      <ColorPaletteBuilder
        palette={palette}
        onChange={(next) => setState({ palette: next })}
      />

      <p className="text-[11px] text-hero-dim">
        Tip: leave a name blank if you&apos;re still scouting. You can come
        back to refine after the AI has suggested complementary tones.
      </p>
    </div>
  );
}
