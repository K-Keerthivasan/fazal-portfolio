import Image from "next/image";

const competencies = [
  "Revit modeling & Navisworks coordination",
  "Clash detection & MEP/structural integration",
  "Construction & permit drawing sets",
  "Building envelope & wall-assembly detailing",
  "Ontario Building Code & barrier-free design",
  "Zoning, area & GFA analysis",
  "AutoCAD drafting & technical details",
  "4D scheduling (Navisworks, MS Project)",
];

const stats = [
  ["10+", "Documented Projects"],
  ["3+", "Years in Practice"],
  ["Revit", "BIM Workflow"],
  ["OBC", "Code-Compliant"],
];

export default function About() {
  return (
    <section id="about" className="relative py-20 sm:py-32">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Profile</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Practical design thinking backed by technical control.
            </h2>

            <div className="card-surface mt-8 rounded-xl border border-emerald-500/15 p-4 sm:p-5">
              {/* Replace this image path if Fazal's profile photo file changes. */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-emerald-500/15 bg-[#0d1310]">
                <Image
                  src="/Abul Fazal Profile.jpeg"
                  alt="Fazal professional profile photo"
                  fill
                  sizes="(min-width: 1024px) 400px, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060807]/60 via-transparent to-transparent" />
              </div>
              <div className="mt-5">
                {/* Change name and titles here. */}
                <h3 className="text-2xl font-semibold text-white">Fazal</h3>
                <p className="mt-1.5 text-emerald-400">Architectural Technologist</p>
                <p className="mt-1 text-sm text-[#8b958e]">
                  BIM Coordination &amp; Documentation Specialist
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="border-l-2 border-emerald-400/40 pl-5 sm:pl-6">
              <h3 className="text-xl font-semibold text-white">Professional Summary</h3>
              <p className="mt-5 leading-8 text-[#a8b2ab]">
                Architectural Technologist specializing in BIM production and construction documentation.
                I work in Autodesk Revit, Navisworks, AutoCAD, and MS Project to deliver coordinated
                models and complete drawing sets for commercial, multi-level, and healthcare projects,
                covering everything from site and area plans to elevations, building sections, and wall
                details.
              </p>
              <p className="mt-5 leading-8 text-[#a8b2ab]">
                My strength is cross-discipline coordination across architectural, structural, and MEP
                systems, backed by Ontario Building Code compliance, barrier-free design, and the envelope
                detailing that turns a concept into a buildable, permit-ready project.
              </p>
            </div>

            <div className="mt-10 sm:mt-12">
              <h3 className="text-xl font-semibold text-white">Technical Strengths</h3>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {competencies.map((item) => (
                  <div
                    key={item}
                    className="card-surface group flex items-center gap-3 rounded-lg border border-emerald-500/10 px-4 py-3 text-sm text-[#cdd6d0] transition-colors hover:border-emerald-400/40 hover:text-white"
                  >
                    <span className="font-mono text-emerald-400 transition-transform group-hover:translate-x-0.5">
                      /
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:mt-12 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div
                  key={label}
                  className="card-surface rounded-lg border border-emerald-500/15 p-5 transition-colors hover:border-emerald-400/40"
                >
                  <div className="text-3xl font-semibold tracking-tight text-emerald-400">{value}</div>
                  <div className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#8b958e]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
