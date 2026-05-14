export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-acc">
        Fractional · v0.1
      </p>
      <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-txt md:text-7xl">
        Design your space.
        <br />
        <span className="italic text-txt-2">Built like</span>{" "}
        <span className="italic text-acc">architecture.</span>
      </h1>
      <p className="mt-8 max-w-md text-sm leading-relaxed text-txt-2">
        Theme foundation is live. Navbar + hero land in the next commit.
      </p>
      <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-txt-3">
        Light mode active · dark mode toggles next
      </div>
    </main>
  );
}
