const footerStats = ["10+ Projects", "3+ Years", "BIM Specialist"];

export default function Footer() {
  return (
    <footer className="border-t border-emerald-500/10 bg-[#040605] py-14">
      <div className="section-shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-md border border-emerald-400/30 bg-emerald-500/10 font-mono text-sm font-semibold text-emerald-300">
                F
              </span>
              {/* Change footer name/title here. */}
              <h2 className="text-xl font-semibold text-white">Fazal</h2>
            </div>
            <p className="mt-3 text-sm text-[#8b958e]">Architectural Technologist &amp; BIM Specialist</p>
            <p className="mt-5 max-w-xl text-sm leading-6 text-[#6b756f]">
              Ready to transform architectural visions into reality through advanced BIM technology.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {footerStats.map((stat) => (
              <span
                key={stat}
                className="rounded-full border border-emerald-500/20 px-4 py-1.5 font-mono text-xs text-emerald-300"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-emerald-500/10 pt-6 text-sm text-[#6b756f]">
          © 2026 Fazal Portfolio. Designed with precision, built with passion.
        </div>
      </div>
    </footer>
  );
}
