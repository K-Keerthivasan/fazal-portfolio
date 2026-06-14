"use client";

import { useEffect } from "react";

/**
 * Reveals any element marked with `data-reveal` when it scrolls into view by
 * adding `.is-revealed`. Mounted once at the app root; it also watches for
 * elements added later (e.g. when the PDF viewer opens).
 */
export default function ScrollReveal() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = (el: Element) => el.classList.add("is-revealed");

    if (prefersReducedMotion) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    const seen = new WeakSet<Element>();
    const observeAll = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Already in view on load (e.g. hero) -> reveal immediately.
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          reveal(el);
        } else {
          observer.observe(el);
        }
      });
    };

    observeAll();

    // Catch elements mounted after the first paint.
    const mutation = new MutationObserver(() => observeAll());
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
