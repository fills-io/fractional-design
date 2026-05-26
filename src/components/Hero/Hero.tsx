import ConceptBuilder from "./ConceptBuilder";

export default function Hero() {
  return (
    <section className="relative min-h-[780px] overflow-hidden border-b border-dark-3 bg-dark px-8 py-12">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,196,176,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(232,196,176,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Corner ticks — architectural detailing */}
      <span className="absolute left-3.5 top-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-hero-dim">
        FILLS · A-001
      </span>
      <span className="absolute right-3.5 top-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-hero-dim">
        v0.1
      </span>
      <span className="absolute bottom-3.5 left-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-hero-dim">
        HERO · 01
      </span>
      <span className="absolute bottom-3.5 right-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-hero-dim">
        N↑
      </span>

      {/* Center stage */}
      <div className="relative z-10 mx-auto flex max-w-[780px] flex-col items-center pt-12 text-center">
        {/* Eyebrow pill */}
        <span className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-dark-3 bg-[rgba(45,40,35,0.6)] px-3.5 py-1.5 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-acc" />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-hero-cream-2">
            Interior · Architecture · AI
          </span>
        </span>

        {/* Headline */}
        <h1 className="mb-4 font-serif text-[clamp(40px,5.4vw,64px)] font-normal leading-[0.98] tracking-tight text-hero-cream">
          Design your space.
          <br />
          <span className="italic text-hero-cream-2">Built like</span>{" "}
          <span className="italic text-acc">architecture.</span>
        </h1>

        {/* Subhead */}
        <p className="mx-auto mb-10 max-w-[520px] text-sm font-light leading-relaxed text-hero-cream-2">
          Where interior design, architecture, and AI converge. Generate a
          complete editorial mood board — palette, materials, lighting,
          furniture — in five minutes.
        </p>

        {/* Concept builder with tabs */}
        <ConceptBuilder />
      </div>
    </section>
  );
}
