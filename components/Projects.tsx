"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Loaded client-side only: pdf.js relies on browser APIs that are unavailable during SSR.
const PdfViewer = dynamic(() => import("./PdfViewer"), { ssr: false });

// A document attached to a project. `file` is the exact filename inside public/projects/
// (kept as uploaded — spaces and parentheses are encoded automatically when opened).
type ProjectDoc = { label: string; file: string };

type Project = {
  category: string;
  title: string;
  description: string;
  button: string;
  tags: string[];
  // Attach one or more PDFs here. The card opens them in the in-page slide viewer.
  // Leave empty/undefined and the button falls back to the contact section.
  docs?: ProjectDoc[];
};

const projects: Project[] = [
  {
    category: "BIM & 4D Simulation",
    title: "The Hive: 4D BIM Project",
    description:
      "Advanced virtual design and construction capstone demonstrating 4D BIM capabilities with integrated time and scheduling coordination using Navisworks and MS Project.",
    button: "View Documentation",
    tags: ["BIM", "4D"],
    docs: [{ label: "View Documentation", file: "Final Design File 26S_AFNM (1).pdf" }],
  },
  {
    category: "Multi-Use High-Rise",
    title: "The Urban Rise",
    description:
      "Comprehensive documentation for an 8-level mixed-use building integrating commercial ground floor spaces, residential units, life safety systems, and detailed construction assemblies.",
    button: "View Plans",
    tags: ["Mixed-Use", "8-Level"],
    docs: [
      { label: "Sheet Set R01", file: "2401-RO1-1156DUNDASSTREET-LONDON-PROJECT03-AN.pdf" },
      { label: "Sheet Set R09", file: "2401-RO9-1156DUNDASSTREET-LONDON-PROJECT03-AN.pdf" },
    ],
  },
  {
    category: "Commercial Retail",
    title: "Evergreen Market",
    description:
      "Detailed commercial project featuring foundation, roof, and wall section details with a focus on design integration and construction feasibility.",
    button: "View Details",
    tags: ["Commercial", "Retail"],
    docs: [
      { label: "Design Final", file: "A3016 AFNM 25W DESIGN FINAL.pdf" },
      { label: "Project Final", file: "A3016 AFNM 25W PROJECT-FINAL-15-04-25 (1).pdf" },
    ],
  },
  {
    category: "Systems Integration",
    title: "BIM/MEP Capstone",
    description:
      "Advanced multi-trade coordination project demonstrating Mechanical, Electrical, Plumbing, and Structural systems integration within a commercial building model.",
    button: "View Systems",
    tags: ["MEP", "BIM"],
    docs: [{ label: "View Systems", file: "Capstone Commerical (1).pdf" }],
  },
  {
    category: "Residential Development",
    title: "The Ridgeway Townhouse",
    description:
      "Multi-unit residential development featuring detailed block plans, unit layouts, and construction schedules including doors, windows, and room specifications.",
    button: "View Plans",
    tags: ["Residential", "Multi-Unit"],
    docs: [
      { label: "Design Final", file: "ARCH-5009 - EDEN PROJECT 25S DESIGN FINAL 27-06-25 - AFNM (3).pdf" },
      { label: "Summary", file: "ARCH-5009 - EDEN PROJECT 25S - AFNM - FINAL (1) (1).pdf" },
    ],
  },
  {
    category: "Accessibility Compliance",
    title: "Universal Toilet Room Design",
    description:
      "Specialized accessibility design showcasing compliance with barrier-free requirements through detailed Universal Toilet Room documentation.",
    button: "View Design",
    tags: ["Accessibility", "Code"],
    docs: [{ label: "View Design", file: "UTR FINAL.pdf" }],
  },
  {
    category: "Conceptual Design",
    title: "Community Center Pavilion",
    description:
      "Architectural concept featuring render, floor plans, elevations, and sections for a community pavilion, demonstrating early-stage design and visualization skills.",
    button: "View Concept",
    tags: ["Concept", "Design"],
    docs: [{ label: "View Concept", file: "Assignment 02 - 18-04-25 (2).pdf" }],
  },
  {
    category: "Hand Sketch",
    title: "Rebel Remedy Hand Sketch",
    description:
      "Detailed hand-drawn elevation for a commercial renovation project, showcasing freehand sketching and architectural visualization expertise.",
    button: "View Sketch",
    tags: ["Hand Sketch", "Elevation"],
    docs: [{ label: "View Sketch", file: "doodle updated.pdf" }],
  },
  {
    category: "Commercial Development",
    title: "Commercial Building Project",
    description:
      "Comprehensive commercial building design showcasing structural and architectural coordination with detailed construction documentation.",
    button: "View Project",
    tags: ["Commercial", "Structural"],
    docs: [
      { label: "Structural", file: "STRUCTURAL ASSIGNMENT - FINAL.pdf" },
      { label: "Materials", file: "MATS-3010 - Assignment 1_04-04-25.pdf" },
    ],
  },
  {
    category: "Healthcare & Wellness",
    title: "Wellness Center Design",
    description:
      "Specialized wellness facility design focusing on therapeutic environments, accessibility features, and health-centered architectural solutions.",
    button: "View Design",
    tags: ["Wellness", "Healthcare"],
    docs: [
      { label: "Design", file: "Design-Arch-1030 - CMU Wellness Centre.pdf" },
      { label: "Working Drawings", file: "WD - Arch-1030 - CMU Wellness Centre.pdf" },
    ],
  },
];

function docUrl(file: string) {
  return `/projects/${encodeURIComponent(file)}`;
}

export default function Projects() {
  const [activePdf, setActivePdf] = useState<{ file: string; title: string } | null>(null);

  // Preload the viewer bundle on idle so the first click opens with no download latency.
  useEffect(() => {
    const preload = () => import("./PdfViewer");
    type IdleWindow = Window & { requestIdleCallback?: (cb: () => void) => number };
    const w = window as IdleWindow;
    if (w.requestIdleCallback) {
      w.requestIdleCallback(preload);
    } else {
      const t = setTimeout(preload, 1500);
      return () => clearTimeout(t);
    }
  }, []);

  function open(project: Project, doc: ProjectDoc) {
    const title = project.docs && project.docs.length > 1 ? `${project.title} · ${doc.label}` : project.title;
    setActivePdf({ file: docUrl(doc.file), title });
  }

  return (
    <section id="projects" className="relative border-y border-emerald-500/10 bg-[#0a0e0c] py-24 sm:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Selected Work</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Project Portfolio
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#a8b2ab]">
            A comprehensive showcase of architectural projects spanning from conceptual design to detailed
            construction documentation, demonstrating expertise in BIM, MEP coordination, and code
            compliance.
          </p>
        </div>

        {/* Update project details and attach PDFs in the `projects` array above. */}
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const docs = project.docs ?? [];
            return (
              <article
                key={project.title}
                className="card-surface group flex min-h-[380px] flex-col rounded-xl border border-emerald-500/12 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-400/50 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.25)]"
              >
                <div className="architectural-grid relative mb-6 flex h-28 items-end justify-between rounded-lg border border-emerald-500/12 bg-[#060807] p-4 transition-colors group-hover:border-emerald-400/30">
                  {docs.length > 0 && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-wider text-emerald-300">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      {docs.length > 1 ? `${docs.length} PDFs` : "PDF"}
                    </span>
                  )}
                  <span className="font-mono text-4xl font-semibold text-emerald-500/25 transition-colors group-hover:text-emerald-500/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px w-16 bg-emerald-400/40 transition-all group-hover:w-24" />
                </div>
                <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-emerald-400">
                  {project.category}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{project.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-[#a8b2ab]">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 font-mono text-[0.7rem] text-emerald-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {docs.length === 0 ? (
                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center text-sm font-medium text-emerald-300 transition-colors group-hover:text-emerald-200"
                  >
                    {project.button}
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                ) : docs.length === 1 ? (
                  <button
                    type="button"
                    onClick={() => open(project, docs[0])}
                    className="mt-6 inline-flex items-center self-start text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200"
                  >
                    {docs[0].label}
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </button>
                ) : (
                  <div className="mt-6">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[#8b958e]">
                      Documents
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {docs.map((doc) => (
                        <button
                          key={doc.file}
                          type="button"
                          onClick={() => open(project, doc)}
                          className="rounded-md border border-emerald-500/25 px-3 py-1.5 text-xs font-medium text-emerald-200 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/10"
                        >
                          {doc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="card-surface mt-14 flex flex-col items-center gap-6 rounded-xl border border-emerald-500/15 p-8 text-center sm:p-10">
          <p className="text-xl font-semibold text-white">
            Interested in seeing more details about any of these projects?
          </p>
          <a
            href="#contact"
            className="soft-glow inline-flex items-center gap-2 rounded-md bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-[#04140c] transition-all hover:bg-emerald-400"
          >
            Let&apos;s Discuss Your Project
            <span>→</span>
          </a>
        </div>
      </div>

      {activePdf && (
        <PdfViewer file={activePdf.file} title={activePdf.title} onClose={() => setActivePdf(null)} />
      )}
    </section>
  );
}
