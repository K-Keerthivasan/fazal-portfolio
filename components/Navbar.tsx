"use client";

import { useState } from "react";
import { ContactIcon, LinkedInIcon, MailIcon, ProfileIcon, ProjectsIcon } from "./Icons";

const navItems = [
  { label: "About", href: "#about", icon: ProfileIcon },
  { label: "Projects", href: "#projects", icon: ProjectsIcon },
  { label: "Contact", href: "#contact", icon: ContactIcon },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-emerald-500/10 bg-[#060807]/85 backdrop-blur-xl">
      <nav className="section-shell flex min-h-18 items-center justify-between gap-4 py-3">
        <a href="#home" onClick={closeMenu} className="group flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md border border-emerald-400/30 bg-emerald-500/10 font-mono text-sm font-semibold text-emerald-300 transition-colors group-hover:border-emerald-300/60 group-hover:bg-emerald-500/20">
            F
          </span>
          {/* Change portfolio name/logo here. */}
          <span className="text-base font-semibold tracking-tight text-white">Fazal</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#8b958e] transition-colors hover:bg-emerald-500/5 hover:text-emerald-300"
            >
              <Icon className="size-4" />
              {item.label}
            </a>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="https://www.linkedin.com/in/abulfazal2001/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Fazal's LinkedIn profile"
            className="grid size-10 place-items-center rounded-md border border-emerald-400/20 text-emerald-200 transition-all hover:border-emerald-300/60 hover:bg-emerald-500/10 hover:shadow-[0_0_24px_rgba(34,197,94,0.16)]"
          >
            <LinkedInIcon className="size-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md border border-emerald-400/25 px-5 py-2 text-sm font-medium text-emerald-200 transition-all hover:border-emerald-300/60 hover:bg-emerald-500/10 hover:shadow-[0_0_24px_rgba(34,197,94,0.18)]"
          >
            <MailIcon className="size-4" />
            Get In Touch
          </a>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-emerald-400/25 text-emerald-200 transition hover:border-emerald-300/60 hover:bg-emerald-500/10 md:hidden"
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-200 ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity duration-200 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-200 ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-emerald-500/10 bg-[#060807]/95 transition-[max-height,opacity] duration-300 md:hidden ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="section-shell py-3">
          <div className="grid gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-md border border-emerald-500/10 bg-emerald-500/5 px-4 py-3 text-sm font-medium text-[#cdd6d0] transition hover:border-emerald-400/40 hover:text-emerald-200"
              >
                <Icon className="size-4 text-emerald-300" />
                {item.label}
              </a>
              );
            })}
            <a
              href="https://www.linkedin.com/in/abulfazal2001/"
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-md border border-emerald-500/10 bg-emerald-500/5 px-4 py-3 text-sm font-medium text-[#cdd6d0] transition hover:border-emerald-400/40 hover:text-emerald-200"
            >
              <LinkedInIcon className="size-4 text-emerald-300" />
              LinkedIn
            </a>
            <a
              href="#contact"
              onClick={closeMenu}
              className="soft-glow mt-1 flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-[#04140c] transition hover:bg-emerald-400"
            >
              <MailIcon className="size-4" />
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
