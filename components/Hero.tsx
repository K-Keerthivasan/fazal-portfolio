import ParticleField from "./ParticleField";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden border-b border-emerald-500/10 pt-28 sm:pt-18"
    >
      {/* Replace this placeholder with a professional architectural render or project hero image. */}
      <div className="absolute inset-0 bg-[linear-gradient(110deg,#060807_15%,rgba(6,8,7,0.92)_45%,rgba(10,14,12,0.55)),url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center" />
      <div className="architectural-grid absolute inset-0 opacity-40" />
      <div className="green-ambience absolute inset-0" />
      <ParticleField />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#060807] to-transparent" />

      <div className="section-shell relative z-10 py-20 sm:py-28">
        <div className="max-w-3xl fade-up">
          <p className="eyebrow mb-5">Architectural Technologist / BIM Specialist</p>
          <h1 className="text-[2.8rem] font-semibold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Designing with Data,
            <span className="gradient-flow mt-1 block bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              Delivering with Precision.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-[#a8b2ab] sm:text-lg sm:leading-8">
            I build coordinated Revit models and construction-ready drawing sets, turning design intent
            into code-compliant documentation, resolved details, and buildable outcomes.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#projects"
              className="btn-sheen soft-glow group inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-[#04140c] transition-all hover:bg-emerald-400 hover:-translate-y-0.5"
            >
              View Selected Work
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-md border border-emerald-400/25 px-7 py-3.5 text-sm font-semibold text-emerald-200 transition-all hover:border-emerald-300/60 hover:bg-emerald-500/10"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
