"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Load the pdf.js worker locally (bundled) so no external CDN is needed.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type PdfViewerProps = {
  file: string;
  title: string;
  onClose: () => void;
};

export default function PdfViewer({ file, title, onClose }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [width, setWidth] = useState(900);
  const [error, setError] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Keep the file/options references stable so the document is not re-fetched.
  // disableAutoFetch + disableStream make pdf.js fetch only the byte ranges needed
  // for the current page (via HTTP 206), so even very large PDFs open near-instantly
  // instead of downloading the whole file up front.
  const options = useMemo(
    () => ({
      cMapUrl: "/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "/standard_fonts/",
      disableAutoFetch: true,
      disableStream: true,
    }),
    [],
  );

  const goTo = useCallback(
    (target: number) => {
      setPageNumber((current) => (target < 1 || target > numPages ? current : target));
    },
    [numPages],
  );

  const goPrev = useCallback(() => goTo(pageNumber - 1), [goTo, pageNumber]);
  const goNext = useCallback(() => goTo(pageNumber + 1), [goTo, pageNumber]);

  // Lock body scroll while the viewer is open.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Keyboard navigation: arrows + escape.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" || event.key === "PageDown") goNext();
      if (event.key === "ArrowLeft" || event.key === "PageUp") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose]);

  // Size the rendered page to the available stage width.
  useEffect(() => {
    function measure() {
      const stage = stageRef.current;
      if (!stage) return;
      setWidth(Math.min(stage.clientWidth - 32, 1100));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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
            download
            className="hidden rounded-md border border-emerald-500/25 px-4 py-2 text-xs font-medium text-emerald-200 transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/10 sm:inline-flex"
          >
            Download PDF
          </a>
          <button
            onClick={onClose}
            aria-label="Close viewer"
            className="grid size-9 place-items-center rounded-md border border-emerald-500/25 text-emerald-200 transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/10"
          >
            ✕
          </button>
        </div>
      </div>

      <Document
        file={file}
        options={options}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={() => setError(true)}
        className="flex min-h-0 flex-1 flex-col"
        loading={
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-[#a8b2ab]">
            <span className="size-8 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-400" />
            Loading document…
          </div>
        }
        error={
          <div className="flex flex-1 flex-col items-center justify-center text-center text-sm text-[#a8b2ab]">
            <p>This document could not be displayed.</p>
            <a href={file} className="mt-3 inline-block text-emerald-300 underline" download>
              Download the PDF instead
            </a>
          </div>
        }
      >
        {/* Slide stage */}
        <div
          ref={stageRef}
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div key={pageNumber} className="fade-up shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]">
            <Page
              pageNumber={pageNumber}
              width={width}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <div
                  style={{ width, height: width * 1.3 }}
                  className="flex items-center justify-center bg-[#0d1310] text-sm text-[#8b958e]"
                >
                  Rendering page…
                </div>
              }
            />
          </div>

          {/* Side nav arrows */}
          {numPages > 1 && !error && (
            <>
              <button
                onClick={goPrev}
                disabled={pageNumber <= 1}
                aria-label="Previous page"
                className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-emerald-500/25 bg-[#0a0e0c]/80 text-lg text-emerald-200 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-30 sm:left-6"
              >
                ‹
              </button>
              <button
                onClick={goNext}
                disabled={pageNumber >= numPages}
                aria-label="Next page"
                className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-emerald-500/25 bg-[#0a0e0c]/80 text-lg text-emerald-200 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-30 sm:right-6"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Counter + thumbnail filmstrip */}
        {numPages > 0 && !error && (
          <div className="shrink-0 border-t border-emerald-500/15 bg-[#06080799]">
            <div className="flex items-center justify-center gap-4 py-2">
              <button
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
                onClick={goNext}
                disabled={pageNumber >= numPages}
                className="rounded-md px-3 py-1 text-xs font-medium text-emerald-200 transition-colors hover:bg-emerald-500/10 disabled:opacity-30"
              >
                Next
              </button>
            </div>

            {numPages > 1 && (
              <Filmstrip numPages={numPages} current={pageNumber} onSelect={goTo} />
            )}
          </div>
        )}
      </Document>
    </div>
  );
}

/* Horizontal slide-sorter strip. Thumbnails render lazily as they scroll into view. */
function Filmstrip({
  numPages,
  current,
  onSelect,
}: {
  numPages: number;
  current: number;
  onSelect: (page: number) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Keep the active thumbnail scrolled into view as the page changes.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [current]);

  return (
    <div
      ref={stripRef}
      className="hidden items-center gap-2 overflow-x-auto px-4 py-3 sm:flex"
      data-strip
    >
      {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
        <Thumb
          key={page}
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
  page,
  active,
  root,
  buttonRef,
  onClick,
}: {
  page: number;
  active: boolean;
  root: React.RefObject<HTMLDivElement | null>;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
  onClick: () => void;
}) {
  const localRef = useRef<HTMLButtonElement>(null);
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

  return (
    <button
      ref={(node) => {
        localRef.current = node;
        if (buttonRef) buttonRef.current = node;
      }}
      onClick={onClick}
      aria-label={`Go to page ${page}`}
      className={`group relative shrink-0 overflow-hidden rounded-md border bg-[#0d1310] transition-all ${
        active
          ? "border-emerald-400/80 ring-1 ring-emerald-400/40"
          : "border-emerald-500/15 hover:border-emerald-400/50"
      }`}
      style={{ width: 92, height: 120 }}
    >
      {visible ? (
        <Page
          pageNumber={page}
          width={92}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={<div style={{ width: 92, height: 120 }} className="bg-[#0d1310]" />}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-mono text-xs text-[#5b6560]">
          {page}
        </div>
      )}
      <span className="absolute bottom-0 right-0 bg-[#040605]/80 px-1.5 py-0.5 font-mono text-[0.6rem] text-emerald-300">
        {page}
      </span>
    </button>
  );
}
