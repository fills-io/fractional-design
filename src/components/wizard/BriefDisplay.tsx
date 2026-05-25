"use client";

/**
 * The generated Design DNA brief — the user's final artifact.
 *
 * Rendered after a successful /api/ai/generate-brief call. Layout is
 * editorial — large concept line, color swatches with names + materials,
 * mood lines, strategic pillars, cinematic description.
 *
 * Intentionally read-only here. Editing comes in the mood-board editor
 * (later phase). For now: read, screenshot, regenerate if not right.
 */

import type { GenerateBriefResponse } from "@/lib/ai/prompts/generate-brief";

type Props = {
  brief: GenerateBriefResponse;
  onRegenerate: () => void;
  onStartOver: () => void;
};

const ROLE_LABEL: Record<
  GenerateBriefResponse["colorSystem"][number]["role"],
  string
> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  supporting: "Supporting",
};

export default function BriefDisplay({
  brief,
  onRegenerate,
  onStartOver,
}: Props) {
  return (
    <article className="space-y-12">
      {/* Concept line — the headline of the whole brief */}
      <header className="border-b border-dark-3 pb-10">
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-acc">
          <span className="inline-block h-px w-6 bg-acc" />
          Design DNA · brief generated
        </div>
        <h1 className="font-serif text-[clamp(28px,4vw,44px)] font-normal leading-[1.15] tracking-tight text-hero-cream">
          {brief.conceptLine}
        </h1>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {brief.keywords.map((kw) => (
            <span
              key={kw}
              className="border border-dark-3 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-hero-cream-2"
            >
              {kw}
            </span>
          ))}
        </div>
      </header>

      {/* Color system */}
      <section>
        <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-acc">
          Color system
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brief.colorSystem.map((c) => (
            <div key={c.role} className="space-y-3">
              <div
                className="aspect-square border border-dark-3"
                style={{ backgroundColor: c.hex }}
              />
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-hero-dim">
                  {ROLE_LABEL[c.role]} · {c.hex}
                </div>
                <div className="mt-1 font-serif text-[16px] text-hero-cream">
                  {c.name}
                </div>
                <div className="mt-0.5 text-[11px] text-hero-cream-2">
                  {c.material}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cinematic description — the visual brief */}
      <section className="border border-dark-3 bg-[rgba(34,30,24,0.5)] p-8">
        <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-acc">
          The space, as it would be photographed
        </h2>
        <p className="font-serif text-[16px] leading-[1.7] text-hero-cream">
          {brief.cinematicDescription}
        </p>
      </section>

      {/* Section mood lines */}
      <section>
        <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-acc">
          Section atmospheres
        </h2>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {(
            [
              ["vibe", "Vibe"],
              ["colors", "Colors"],
              ["furniture", "Furniture"],
              ["lighting", "Lighting"],
              ["surfaces", "Surfaces"],
              ["materials", "Materials"],
              ["pillars", "Pillars"],
              ["cover", "Cover"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-hero-dim">
                {label}
              </dt>
              <dd className="mt-1 text-[14px] leading-relaxed text-hero-cream-2">
                {brief.sectionMoodLines[key]}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Strategic pillars */}
      <section>
        <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-acc">
          Strategic pillars
        </h2>
        <div className="grid grid-cols-1 gap-px bg-bdr sm:grid-cols-3">
          {(
            [
              ["psychological", "Psychological"],
              ["functional", "Functional"],
              ["marketing", "Marketing"],
            ] as const
          ).map(([key, label]) => (
            <div
              key={key}
              className="bg-dark p-6"
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-acc">
                {label}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-hero-cream-2">
                {brief.strategicPillars[key]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <footer className="flex flex-col items-center justify-between gap-4 border-t border-dark-3 pt-8 sm:flex-row">
        <button
          type="button"
          onClick={onStartOver}
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-hero-dim transition hover:text-acc"
        >
          ← Start a new brief
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          className="inline-flex items-center gap-2 border border-acc px-6 py-3 text-[12px] font-medium uppercase tracking-[0.1em] text-acc transition hover:bg-acc hover:text-white"
        >
          ↻ Regenerate brief
        </button>
      </footer>
    </article>
  );
}
