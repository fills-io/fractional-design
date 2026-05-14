const DOORS = [
  {
    tag: "Recommended",
    label: "Quick · 5 min",
    desc: "Pick three things, we fill in five more. The fastest way to a finished brief.",
    cta: "Try Quick",
    primary: true,
  },
  {
    tag: null,
    label: "Upload · 1 min",
    desc: "Drop a reference image and we extract the brief automatically. Start to finish in about a minute.",
    cta: "Upload images",
    primary: false,
  },
  {
    tag: null,
    label: "Full Studio · 10 min",
    desc: "Step through every dimension yourself. No auto-fill, every choice is yours.",
    cta: "Open Studio",
    primary: false,
  },
];

export default function PickYourDoor() {
  return (
    <section className="border-b border-bdr bg-bg px-8 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center gap-2.5 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-acc">
          <span className="inline-block h-px w-6 bg-acc" />
          Three ways to start
        </span>
        <h3 className="mt-5 font-serif text-[clamp(28px,3.8vw,44px)] font-normal leading-[1.12] tracking-tight text-txt">
          Pick your door.
        </h3>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {DOORS.map((d) => (
          <button
            key={d.label}
            className={`group relative flex flex-col p-8 text-left transition ${
              d.primary
                ? "border-2 border-acc bg-acc-3 hover:bg-[#FCEAE0]"
                : "border border-bdr bg-bg-2 hover:border-acc hover:bg-bg-3"
            }`}
          >
            <span className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-acc" />
            <span className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-acc" />

            {d.tag && (
              <span className="mb-4 inline-flex w-fit items-center bg-acc px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white">
                {d.tag}
              </span>
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-acc">
              {d.label}
            </span>
            <p className="mt-4 flex-1 text-[13px] leading-[1.7] text-txt-2">
              {d.desc}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-medium text-txt transition group-hover:gap-3 group-hover:text-acc">
              {d.cta}
              <span>→</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
