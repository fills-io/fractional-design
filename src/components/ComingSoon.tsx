/**
 * Coming Soon — the holding page shown at fills.io while the product is
 * being redesigned. Intentionally minimal: a wordmark, a single sentence
 * of positioning, and a small "in private build" notice.
 *
 * Visual language matches the rest of the app — dark surface (the hero
 * "dark even in light mode" pattern), terracotta accent, architectural
 * sheet stamps in the corners.
 *
 * No form, no CTA, no calendar widget — those add weight to a page whose
 * job is just to say "this domain belongs to a real company, the product
 * is being built." Email-capture can land in a follow-up if Aisha wants it.
 */

export default function ComingSoon() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-dark px-8 py-12">
      {/* Subtle grid background — matches the hero on the real site */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,196,176,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(232,196,176,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Architectural sheet stamps */}
      <span className="absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[0.18em] text-hero-dim">
        FILLS · A-001
      </span>
      <span className="absolute right-4 top-4 font-mono text-[9px] uppercase tracking-[0.18em] text-hero-dim">
        IN PRIVATE BUILD
      </span>
      <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.18em] text-hero-dim">
        © 2026 FILLS LTD
      </span>
      <span className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-[0.18em] text-hero-dim">
        FILLS.IO
      </span>

      {/* Center stage */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[680px] flex-col items-center justify-center text-center">
        {/* Eyebrow */}
        <span className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-dark-3 bg-[rgba(45,40,35,0.6)] px-3.5 py-1.5 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-acc" />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-hero-cream-2">
            Interior · Architecture · AI
          </span>
        </span>

        {/* Wordmark */}
        <div className="mb-3 flex items-center gap-3">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="11" height="11" rx="1" fill="#C8512A" />
            <rect x="15" y="2" width="11" height="5" rx="1" fill="#f0eae2" />
            <rect x="15" y="9" width="11" height="4" rx="1" fill="#8b7e72" />
            <rect x="2" y="15" width="5" height="11" rx="1" fill="#8b7e72" />
            <rect x="9" y="15" width="4" height="11" rx="1" fill="#C8512A" opacity="0.4" />
            <rect x="15" y="15" width="11" height="11" rx="1" fill="#f0eae2" />
          </svg>
          <span className="font-serif text-[28px] tracking-tight text-hero-cream">
            Fills<b className="font-medium text-acc">.io</b>
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-6 font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.05] tracking-tight text-hero-cream">
          The mood board,{" "}
          <span className="italic text-acc">reimagined</span>
          <br />
          <span className="italic text-hero-cream-2">for architects.</span>
        </h1>

        {/* Subhead */}
        <p className="mx-auto mb-10 max-w-[460px] text-[15px] leading-relaxed text-hero-cream-2">
          A new tool for interior designers and architects — palette,
          materials, lighting, furniture, all in five minutes. Currently in
          private build with a small group of designers.
        </p>

        {/* Status pill */}
        <div className="inline-flex items-center gap-3 border border-acc/30 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-acc">
          <span className="inline-block h-px w-6 bg-acc" />
          Public launch · later this year
        </div>

        {/* Contact line */}
        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-hero-dim">
          For collaborations or early access ·{" "}
          <a
            href="mailto:aisha@fills.io"
            className="text-hero-cream-2 underline-offset-4 transition hover:text-acc hover:underline"
          >
            aisha@fills.io
          </a>
        </p>
      </div>
    </main>
  );
}
