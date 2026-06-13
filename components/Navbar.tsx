const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-emerald-500/10 bg-[#060807]/80 backdrop-blur-xl">
      <nav className="section-shell flex h-18 items-center justify-between py-3">
        <a href="#home" className="group flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md border border-emerald-400/30 bg-emerald-500/10 font-mono text-sm font-semibold text-emerald-300 transition-colors group-hover:border-emerald-300/60 group-hover:bg-emerald-500/20">
            F
          </span>
          {/* Change portfolio name/logo here. */}
          <span className="text-base font-semibold tracking-tight text-white">Fazal</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-4 py-2 text-sm font-medium text-[#8b958e] transition-colors hover:bg-emerald-500/5 hover:text-emerald-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden items-center rounded-md border border-emerald-400/25 px-5 py-2 text-sm font-medium text-emerald-200 transition-all hover:border-emerald-300/60 hover:bg-emerald-500/10 hover:shadow-[0_0_24px_rgba(34,197,94,0.18)] sm:inline-flex"
        >
          Get In Touch
        </a>
      </nav>
    </header>
  );
}
