"use client";

import { useEffect } from "react";

type PdfViewerProps = {
  file: string;
  title: string;
  onClose: () => void;
};

export default function PdfViewer({ file, title, onClose }: PdfViewerProps) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#040605]/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} document viewer`}
    >
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

      <div className="min-h-0 flex-1 p-3 sm:p-5">
        <div className="h-full overflow-hidden rounded-lg border border-emerald-500/15 bg-[#0d1310]">
          <iframe
            title={title}
            src={`${file}#view=FitH`}
            className="h-full w-full bg-white"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-3 border-t border-emerald-500/15 px-4 py-3 sm:hidden">
        <a
          href={file}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-md border border-emerald-500/25 px-4 py-2 text-center text-xs font-medium text-emerald-200"
        >
          Open PDF
        </a>
        <a
          href={file}
          download
          className="flex-1 rounded-md border border-emerald-500/25 px-4 py-2 text-center text-xs font-medium text-emerald-200"
        >
          Download
        </a>
      </div>
    </div>
  );
}
