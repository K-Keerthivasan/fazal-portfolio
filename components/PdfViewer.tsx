"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PdfViewerProps = {
  file: string;
  title: string;
  onClose: () => void;
};

// Minimal structural types for the bits of pdf.js we use.
type RenderTask = { promise: Promise<void>; cancel: () => void };
type PdfViewport = { width: number; height: number };
type PdfPage = {
  getViewport: (opts: { scale: number }) => PdfViewport;
  render: (opts: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfViewport;
  }) => RenderTask;
};
type PdfDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
  destroy: () => Promise<void>;
};
type PdfjsLib = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (opts: Record<string, unknown>) => { promise: Promise<PdfDocument> };
};

// pdf.js is loaded at runtime from /public so webpack never bundles it
// (bundling pdfjs-dist's .mjs under webpack crashes with
// "Object.defineProperty called on non-object"). Loaded once, then cached.
let pdfjsPromise: Promise<PdfjsLib> | null = null;
function loadPdfjs(): Promise<PdfjsLib> {
  if (!pdfjsPromise) {
    // @ts-expect-error - resolved at runtime from /public, not at build time
    const mod = import(/* webpackIgnore: true */ "/pdf.min.mjs") as Promise<unknown>;
    pdfjsPromise = mod.then((lib) => {
      const pdfjs = lib as PdfjsLib;
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

const DOC_OPTIONS = {
  cMapUrl: "/cmaps/",
  cMapPacked: true,
  standardFontDataUrl: "/standard_fonts/",
  disableAutoFetch: true,
  disableStream: true,
};

export default function PdfViewer({ file, title, onClose }: PdfViewerProps) {
  const [pdf, setPdf] = useState<PdfDocument | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  const goTo = useCallback(
    (target: number) => {
      setPageNumber((current) => (target < 1 || target > numPages ? current : target));
    },
    [numPages],
  );
  const goPrev = useCallback(() => goTo(pageNumber - 1), [goTo, pageNumber]);
  const goNext = useCallback(() => goTo(pageNumber + 1), [goTo, pageNumber]);

  // Load the document.
  useEffect(() => {
    let cancelled = false;
    let loaded: PdfDocument | null = null;
    setPdf(null);
    setNumPages(0);
    setPageNumber(1);
    setError(false);

    loadPdfjs()
      .then((pdfjs) => pdfjs.getDocument({ url: file, ...DOC_OPTIONS }).promise)
      .then((doc) => {
        if (cancelled) {
          doc.destroy();
          return;
        }
        loaded = doc;
        setPdf(doc);
        setNumPages(doc.numPages);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      loaded?.destroy().catch(() => {});
    };
  }, [file]);

  // Render the current page whenever it (or the doc) changes.
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    let cancelled = false;
    const canvas = canvasRef.current;

    (async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const stage = stageRef.current;
        const available = stage ? Math.min(stage.clientWidth - 32, 1100) : 900;
        const base = page.getViewport({ scale: 1 });
        const dpr = window.devicePixelRatio || 1;
        const scale = (available / base.width) * dpr;
        const viewport = page.getViewport({ scale });

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        renderTaskRef.current?.cancel();
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / dpr}px`;
        canvas.style.height = `${viewport.height / dpr}px`;

        const task = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = task;
        await task.promise;
      } catch {
        /* render cancelled or page failed - ignore */
      }
    })();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
    };
  }, [pdf, pageNumber]);

  // Lock body scroll + keyboard navigation.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" || event.key === "PageDown") goNext();
      if (event.key === "ArrowLeft" || event.key === "PageUp") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [goNext, goPrev, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#040605]/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} document viewer`}
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-emerald-500/15 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-emerald-400">
            Project Document
          </p>
          <h3 className="truncate text-sm font-semibold text-white sm:text-base">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={file}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-md border border-emerald-500/25 px-4 py-2 text-xs font-medium text-emerald-200 transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/10 sm:inline-flex"
          >
            Open PDF
          </a>
          <a
            href={file}
            download
            className="hidden rounded-md border border-emerald-500/25 px-4 py-2 text-xs font-medium text-emerald-200 transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/10 sm:inline-flex"
          >
            Download
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close viewer"
            className="grid size-9 place-items-center rounded-md border border-emerald-500/25 text-emerald-200 transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/10"
          >
            x
          </button>
        </div>
      </div>

      {/* Slide stage */}
      <div
        ref={stageRef}
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {error ? (
          <div className="text-center text-sm text-[#a8b2ab]">
            <p>This document could not be displayed.</p>
            <a href={file} className="mt-3 inline-block text-emerald-300 underline" target="_blank" rel="noreferrer">
              Open the PDF in a new tab
            </a>
          </div>
        ) : !pdf ? (
          <div className="flex flex-col items-center gap-3 text-sm text-[#a8b2ab]">
            <span className="size-8 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-400" />
            Loading document...
          </div>
        ) : (
          <div key={pageNumber} className="fade-up shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]">
            <canvas ref={canvasRef} className="block bg-white" />
          </div>
        )}

        {numPages > 1 && !error && (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={pageNumber <= 1}
              aria-label="Previous page"
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-emerald-500/25 bg-[#0a0e0c]/80 text-lg text-emerald-200 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-30 sm:left-6"
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={pageNumber >= numPages}
              aria-label="Next page"
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-emerald-500/25 bg-[#0a0e0c]/80 text-lg text-emerald-200 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-30 sm:right-6"
            >
              {">"}
            </button>
          </>
        )}
      </div>

      {/* Counter + thumbnail filmstrip */}
      {pdf && numPages > 0 && !error && (
        <div className="shrink-0 border-t border-emerald-500/15 bg-[#06080799]">
          <div className="flex items-center justify-center gap-4 py-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={pageNumber <= 1}
              className="rounded-md px-3 py-1 text-xs font-medium text-emerald-200 transition-colors hover:bg-emerald-500/10 disabled:opacity-30"
            >
              Prev
            </button>
            <span className="font-mono text-sm text-[#cdd6d0]">
              <span className="text-emerald-400">{pageNumber}</span>
              <span className="mx-1 text-[#5b6560]">/</span>
              {numPages}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={pageNumber >= numPages}
              className="rounded-md px-3 py-1 text-xs font-medium text-emerald-200 transition-colors hover:bg-emerald-500/10 disabled:opacity-30"
            >
              Next
            </button>
          </div>

          {numPages > 1 && (
            <Filmstrip pdf={pdf} numPages={numPages} current={pageNumber} onSelect={goTo} />
          )}
        </div>
      )}
    </div>
  );
}

/* Horizontal slide-sorter strip. Thumbnails render lazily as they scroll into view. */
function Filmstrip({
  pdf,
  numPages,
  current,
  onSelect,
}: {
  pdf: PdfDocument;
  numPages: number;
  current: number;
  onSelect: (page: number) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [current]);

  return (
    <div ref={stripRef} className="hidden items-center gap-2 overflow-x-auto px-4 py-3 sm:flex">
      {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
        <Thumb
          key={page}
          pdf={pdf}
          page={page}
          active={page === current}
          root={stripRef}
          buttonRef={page === current ? activeRef : undefined}
          onClick={() => onSelect(page)}
        />
      ))}
    </div>
  );
}

function Thumb({
  pdf,
  page,
  active,
  root,
  buttonRef,
  onClick,
}: {
  pdf: PdfDocument;
  page: number;
  active: boolean;
  root: React.RefObject<HTMLDivElement | null>;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
  onClick: () => void;
}) {
  const localRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { root: root.current ?? undefined, rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [root]);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    let cancelled = false;
    let task: RenderTask | null = null;
    const canvas = canvasRef.current;

    (async () => {
      try {
        const p = await pdf.getPage(page);
        if (cancelled) return;
        const base = p.getViewport({ scale: 1 });
        const scale = 92 / base.width;
        const viewport = p.getViewport({ scale });
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        task = p.render({ canvasContext: ctx, viewport });
        await task.promise;
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [visible, pdf, page]);

  return (
    <button
      type="button"
      ref={(node) => {
        localRef.current = node;
        if (buttonRef) buttonRef.current = node;
      }}
      onClick={onClick}
      aria-label={`Go to page ${page}`}
      className={`group relative grid shrink-0 place-items-center overflow-hidden rounded-md border bg-[#0d1310] transition-all ${
        active
          ? "border-emerald-400/80 ring-1 ring-emerald-400/40"
          : "border-emerald-500/15 hover:border-emerald-400/50"
      }`}
      style={{ width: 92, minHeight: 70 }}
    >
      {visible ? (
        <canvas ref={canvasRef} className="block w-full" />
      ) : (
        <div className="flex h-[70px] w-full items-center justify-center font-mono text-xs text-[#5b6560]">
          {page}
        </div>
      )}
      <span className="absolute bottom-0 right-0 bg-[#040605]/80 px-1.5 py-0.5 font-mono text-[0.6rem] text-emerald-300">
        {page}
      </span>
    </button>
  );
}
