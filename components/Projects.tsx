"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Client-only: pdf.js relies on browser APIs that are unavailable during SSR.
const PdfViewer = dynamic(() => import("./PdfViewer"), { ssr: false });

// A document attached to a project. `file` is the exact filename inside public/projects/
// (kept as uploaded; spaces and parentheses are encoded automatically when opened).
type ProjectDoc = { label: string; file: string };

type Project = {
  category: string;
  title: string;
  description: string;
  button: string;
  tags: string[];
  thumbnail: string;
  // Attach one or more PDFs here. The card opens them in the in-page slide viewer.
  // Leave empty/undefined and the button falls back to the contact section.
  docs?: ProjectDoc[];
};

const projects: Project[] = [
  {
    category: "Multi-Level Building Design",
    title: "The Exbrit",
    description:
      "A seven-storey building modelled in Revit and developed into a full design set. It covers the sheet list, area plans for every level, site planning, and detailed interior and exterior renderings.",
    button: "View Documentation",
    tags: ["Revit", "Design Dev"],
    thumbnail: "/images/IMG_1.jpeg",
    docs: [{ label: "View Documentation", file: "Final Design File 26S_AFNM (1).pdf" }],
  },
    {
    category: "Architectural Design",
    title: "The Eden Project",
    description:
      "An architectural design package for 555 McCormick Street. It pairs exterior perspectives with a coordinated set of plans, elevations, and sections, all worked through against Ontario Building Code requirements.",
    button: "View Design",
    tags: ["Design Dev", "Visualization"],
    thumbnail: "/images/IMG_2.jpeg",
    docs: [
      { label: "Design Final", file: "ARCH-5009 - EDEN PROJECT 25S DESIGN FINAL 27-06-25 - AFNM (3).pdf" },
      { label: "Summary Set", file: "ARCH-5009 - EDEN PROJECT 25S - AFNM - FINAL (1) (1).pdf" },
    ],
  },

  {
    category: "Commercial Renovation",
    title: "Rickety Development",
    description:
      "A commercial building worked up to the 2024 Ontario Building Code in two stages, a design package and a construction package. Both include general notes, project scope, and the detailing needed for permit and contractor review.",
    button: "View Drawings",
    tags: ["OBC 2024", "Commercial"],
    thumbnail: "/images/IMG_3.jpeg",
    docs: [
      { label: "Design Final", file: "A3016 AFNM 25W DESIGN FINAL.pdf" },
      { label: "Project Final", file: "A3016 AFNM 25W PROJECT-FINAL-15-04-25 (1).pdf" },
    ],
  },

    {
    category: "BIM Coordination",
    title: "Commercial Capstone",
    description:
      "A commercial capstone built around the foundation and structural grid. It includes footing layouts with top and bottom of footing elevations, floor-drain coordination, and dimensioned plans put together in one coordinated model.",
    button: "View Drawings",
    tags: ["BIM", "Foundations"],
    thumbnail: "/images/IMG_4.jpeg",
    docs: [{ label: "View Drawings", file: "Capstone Commerical (1).pdf" }],
  },

    {
    category: "Concept & Schematic",
    title: "Schematic Design Study",
    description:
      "An early concept study that works through massing, plan layouts, and rough drawings. It shows how an idea gets tested and tightened up into a workable design direction.",
    button: "View Study",
    tags: ["Concept", "Schematic"],
    thumbnail: "/images/IMG_5.jpeg",
    docs: [{ label: "View Study", file: "doodle updated.pdf" }],
  },

  {
    category: "Commercial Building",
    title: "1156 Dundas Street",
    description:
      "A two-storey commercial building in London, Ontario, drawn up as a complete construction set. It includes site and floor plans, isometrics, and elevations, along with wall assemblies for steel-stud, masonry, curtain-wall, and CMU construction.",
    button: "View Plans",
    tags: ["Construction Docs", "Envelope"],
    thumbnail: "/images/IMG_6.jpeg",
    docs: [
      { label: "Drawing Set", file: "2401-RO1-1156DUNDASSTREET-LONDON-PROJECT03-AN.pdf" },
      { label: "Wall Sections & Details", file: "2401-RO9-1156DUNDASSTREET-LONDON-PROJECT03-AN.pdf" },
      { label: "View Drawings", file: "STRUCTURAL ASSIGNMENT - FINAL.pdf" }
    ],
  },

 

  {
    category: "Healthcare & Wellness",
    title: "Oxford Wellness Centre",
    description:
      "A wellness centre at 1080 Oxford Street, London, taken from zoning analysis through to working drawings. It includes lot coverage and GFA calculations, site and roof plans, elevations, a building section, and CMU wall sections and details.",
    button: "View Design",
    tags: ["Zoning", "CMU"],
    thumbnail: "/images/IMG_7.jpeg",
    docs: [
      { label: "Design", file: "Design-Arch-1030 - CMU Wellness Centre.pdf" },
      { label: "Working Drawings", file: "WD - Arch-1030 - CMU Wellness Centre.pdf" },
    ],
  },
  {
    category: "Barrier-Free Design",
    title: "Universal Toilet Room",
    description:
      "A barrier-free washroom detailed to Section 3.8 of the Ontario Building Code. It dimensions the clear transfer space, a 1700 mm turning circle, fixture and grab-bar clearances, and the accessible controls.",
    button: "View Design",
    tags: ["Accessibility", "OBC 3.8"],
    thumbnail: "/images/IMG_8.jpeg",
    docs: [{ label: "View Design", file: "UTR FINAL.pdf" }],
  },

  {
    category: "Technical Detailing",
    title: "Building Science & Detailing",
    description:
      "Two building-science studies focused on the envelope: a foundation-to-wall assembly and an annotated material section. Together they cover waterproofing, drainage, air and vapour barriers, insulation, and framing, referenced to Part 9 of the Ontario Building Code.",
    button: "View Details",
    tags: ["Envelope", "Details"],
    thumbnail: "/images/IMG_9.jpeg",
    docs: [
      { label: "Wall & Foundation Detail", file: "Assignment 02 - 18-04-25 (2).pdf" },
      { label: "Material Assemblies", file: "MATS-3010 - Assignment 1_04-04-25.pdf" },
    ],
  },
];

function docUrl(file: string) {
  return `/projects/${encodeURIComponent(file)}`;
}

export default function Projects() {
  const [activePdf, setActivePdf] = useState<{ file: string; title: string } | null>(null);

  function open(project: Project, doc: ProjectDoc) {
    const title =
      project.docs && project.docs.length > 1 ? `${project.title} - ${doc.label}` : project.title;
    setActivePdf({ file: docUrl(doc.file), title });
  }

  return (
    <section id="projects" className="relative border-y border-emerald-500/10 bg-[#0a0e0c] py-20 sm:py-32">
      <div className="section-shell">
        <div className="max-w-3xl" data-reveal>
          <p className="eyebrow">Selected Work</p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Documentation, BIM, and coordination work.
          </h2>
          <p className="mt-6 text-base leading-7 text-[#a8b2ab] sm:text-lg sm:leading-8">
            A mix of Revit models, full construction drawing sets, envelope details, and code-compliant
            design work, spanning commercial, multi-level, healthcare, structural, and accessibility
            projects. Open any project to page through the drawings.
          </p>
        </div>

        {/* Update project details and attach PDFs in the `projects` array above. */}
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const docs = project.docs ?? [];
            return (
              <article
                key={project.title}
                data-reveal
                style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}
                className="card-surface group flex min-h-[350px] flex-col rounded-xl border border-emerald-500/12 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-400/50 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.25)] sm:min-h-[380px] sm:p-6"
              >
                <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-lg border border-emerald-500/12 bg-[#060807] transition-colors group-hover:border-emerald-400/30">
                  <Image
                    src={project.thumbnail}
                    alt={`${project.title} project thumbnail`}
                    fill
                    sizes="(min-width: 1280px) 370px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="architectural-grid absolute inset-0 opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060807]/90 via-[#060807]/20 to-transparent" />
                  {docs.length > 0 && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-wider text-emerald-300">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      {docs.length > 1 ? `${docs.length} PDFs` : "PDF"}
                    </span>
                  )}
                  <span className="absolute bottom-4 left-4 font-mono text-4xl font-semibold text-emerald-300/70 transition-colors group-hover:text-emerald-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute bottom-5 right-4 h-px w-16 bg-emerald-400/50 transition-all group-hover:w-24" />
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
                    <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
                  </a>
                ) : docs.length === 1 ? (
                  <button
                    type="button"
                    onClick={() => open(project, docs[0])}
                    className="mt-6 inline-flex items-center self-start text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200"
                  >
                    {docs[0].label}
                    <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
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

        <div
          data-reveal="zoom"
          className="card-surface mt-14 flex flex-col items-center gap-6 rounded-xl border border-emerald-500/15 p-6 text-center sm:p-10"
        >
          <p className="text-lg font-semibold text-white sm:text-xl">
            Need a closer look at a drawing set or BIM workflow?
          </p>
          <a
            href="#contact"
            className="btn-sheen soft-glow inline-flex items-center gap-2 rounded-md bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-[#04140c] transition-all hover:bg-emerald-400 hover:-translate-y-0.5"
          >
            Start a Project Conversation
            <span>&rarr;</span>
          </a>
        </div>
      </div>

      {activePdf && (
        <PdfViewer file={activePdf.file} title={activePdf.title} onClose={() => setActivePdf(null)} />
      )}
    </section>
  );
}
