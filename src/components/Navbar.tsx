import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "How it works", href: "#how" },
  { label: "For You", href: "#audience" },
  { label: "Samples", href: "#samples" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex h-[60px] items-center justify-between border-b border-bdr px-8 backdrop-blur-md"
      style={{ background: "var(--nav-bg)" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-4 w-4 place-items-center">
          {/* Brand mark — small architectural rectangle */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="0.5" y="0.5" width="6" height="6" stroke="currentColor" strokeWidth="1" className="text-acc" />
            <rect x="7.5" y="0.5" width="6" height="6" stroke="currentColor" strokeWidth="1" className="text-txt-2" />
            <rect x="0.5" y="7.5" width="6" height="6" stroke="currentColor" strokeWidth="1" className="text-txt-2" />
            <rect x="7.5" y="7.5" width="6" height="6" stroke="currentColor" strokeWidth="1" className="text-acc" />
          </svg>
        </span>
        <span className="text-sm font-medium tracking-tight text-txt">
          Fractional<b className="font-medium text-acc">.</b>design
        </span>
      </Link>

      {/* Nav links — hidden on small screens */}
      <div className="hidden md:flex">
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="flex h-[60px] items-center border-l border-bdr px-5 text-[11.5px] text-txt-2 transition hover:bg-bg-2 hover:text-txt"
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* Right cluster: theme toggle + auth */}
      <div className="flex border-l border-bdr">
        <ThemeToggle />
        <button className="h-[60px] border-l border-bdr px-5 text-xs text-txt-2 transition hover:bg-bg-2 hover:text-txt">
          Sign in
        </button>
        <button className="h-[60px] border-l border-bdr bg-acc px-6 text-xs font-medium text-white transition hover:bg-acc-d">
          Get started →
        </button>
      </div>
    </nav>
  );
}
