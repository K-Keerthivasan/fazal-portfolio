import Image from "next/image";

const competencies = [
  "BIM: Revit, Navisworks",
  "4D Simulation & Scheduling",
  "Construction Documents",
  "MEP Coordination",
  "Building Code & Accessibility Design",
  "Conceptual Design",
  "AutoCAD Drafting",
  "Design Development",
];

const stats = [
  ["10+", "Projects Completed"],
  ["3+", "Years Experience"],
  ["BIM", "Specialist"],
  ["100%", "Code-Compliant Designs"],
];

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">About Me</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Technical precision for buildable design.
            </h2>

            <div className="card-surface mt-9 rounded-xl border border-emerald-500/15 p-5">
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
                <p className="mt-1 text-sm text-[#8b958e]">BIM Specialist &amp; Design Professional</p>
              </div>
            </div>
          </div>

          <div>
            <div className="border-l-2 border-emerald-400/40 pl-6">
              <h3 className="text-xl font-semibold text-white">Professional Profile</h3>
              <p className="mt-5 leading-8 text-[#a8b2ab]">
                I am a meticulous Architectural Technologist specializing in Building Information Modeling
                (BIM) and advanced construction documentation. My expertise lies in leveraging
                industry-standard tools like Autodesk Revit, Navisworks, AutoCAD, and MS Project to deliver
                efficient, accurate, and innovative solutions for commercial, multi-use, and residential
                projects.
              </p>
              <p className="mt-5 leading-8 text-[#a8b2ab]">
                I excel at cross-trade coordination including MEP, Structural, and Architectural systems,
                while ensuring compliance with building codes and accessibility standards. My passion for
                precision and innovation drives me to create buildable, sustainable designs that bridge the
                gap between architectural vision and construction reality.
              </p>
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-semibold text-white">Core Competencies</h3>
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

            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
