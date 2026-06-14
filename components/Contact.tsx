"use client";

import { FormEvent, useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  ArrowIcon,
  BriefcaseIcon,
  DocumentIcon,
  LinkedInIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
} from "./Icons";

declare global {
  interface Window {
    hcaptcha?: {
      reset: () => void;
    };
  }
}

const services = [
  ["BIM Production", "Revit modeling, Navisworks review, and 4D coordination"],
  ["Technical Documentation", "Design development through construction-ready drawings"],
  ["Trade Coordination", "Architectural, structural, and MEP model integration"],
  ["Code Review Support", "Building code and accessibility-focused documentation"],
];

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey || document.querySelector("script[data-hcaptcha]")) return;

    const script = document.createElement("script");
    script.src = "https://js.hcaptcha.com/1/api.js";
    script.async = true;
    script.defer = true;
    script.dataset.hcaptcha = "true";
    document.body.appendChild(script);
  }, [siteKey]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData.entries())),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Message could not be sent.");
      }

      setStatus("success");
      setMessage(result.message || "Message sent successfully.");
      form.reset();
      window.hcaptcha?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  }

  return (
    <section id="contact" className="relative py-20 sm:py-32">
      <div className="green-ambience absolute inset-0 opacity-60" />
      <div className="section-shell relative">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal="left">
            <p className="eyebrow">Contact</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Let&apos;s talk about the next set of drawings.
            </h2>
            <p className="mt-6 text-base leading-7 text-[#a8b2ab] sm:text-lg sm:leading-8">
              Whether the need is BIM support, technical documentation, coordination, or a full-time
              opportunity, I am available to discuss how I can contribute to a clear and buildable outcome.
            </p>

            <div className="mt-9 grid gap-3">
              <ContactCard
                icon={MailIcon}
                title="Email"
                text="Send project details or opportunities"
                value="abul.fazalca@gmail.com"
                href="mailto:abul.fazalca@gmail.com"
              />
              <ContactCard
                icon={PhoneIcon}
                title="Phone"
                text="Available for project discussions"
                value="+1 (226) 236-8670"
                href="tel:+12262368670"
              />
              <ContactCard
                icon={LinkedInIcon}
                title="LinkedIn"
                text="Connect professionally"
                value="linkedin.com/in/abulfazal2001"
                href="https://www.linkedin.com/in/abulfazal2001/"
              />
              <ContactCard
                icon={LocationIcon}
                title="Location"
                text="Working from Ontario"
                value="Ontario, Canada"
              />
              {/* Change email, phone, LinkedIn, and location placeholders above. */}
            </div>

            <div className="card-surface mt-10 rounded-xl border border-emerald-500/15 p-5 sm:p-6">
              <p className="text-base font-semibold text-white">
                Available for full-time roles, contract BIM support, documentation work, and technical
                coordination.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {services.map(([title, text]) => (
                  <div key={title} className="flex gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md border border-emerald-500/20 bg-emerald-500/8 text-emerald-300">
                      <BriefcaseIcon className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-200">{title}</h3>
                      <p className="mt-1 text-sm text-[#8b958e]">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} data-reveal="right" className="card-surface rounded-xl border border-emerald-500/15 p-5 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" autoComplete="name" />
              <Field label="Email" name="email" type="email" autoComplete="email" />
            </div>
            <div className="mt-5">
              <Field label="Subject" name="subject" />
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-medium text-[#cdd6d0]">Message</span>
              <textarea
                name="message"
                required
                minLength={10}
                rows={6}
                className="mt-2 w-full resize-none rounded-lg border border-emerald-500/15 bg-[#060807] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#5b6560] focus:border-emerald-400/70"
                placeholder="Share the project scope, timeline, or opportunity."
              />
            </label>

            <div className="mt-5 min-h-[65px]">
              {siteKey ? (
                <div className="h-captcha" data-sitekey={siteKey} data-theme="dark" />
              ) : (
                <div className="rounded-lg border border-amber-400/25 bg-amber-500/10 p-4 text-sm text-amber-200">
                  Add NEXT_PUBLIC_HCAPTCHA_SITE_KEY to enable hCaptcha.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-sheen soft-glow mt-6 w-full rounded-md bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-[#04140c] transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>

            {message && (
              <p
                className={`mt-4 rounded-lg border p-4 text-sm ${
                  status === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                    : "border-red-400/30 bg-red-500/10 text-red-200"
                }`}
              >
                {message}
              </p>
            )}

            <div className="mt-10 border-t border-emerald-500/10 pt-8">
              <p className="eyebrow">Professional Resources</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-emerald-500/25 px-5 py-3 text-center text-sm font-medium text-emerald-200 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/10"
                  href="#projects"
                >
                  <DocumentIcon className="size-4" />
                  View Work
                </a>
                <a
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-emerald-500/25 px-5 py-3 text-center text-sm font-medium text-emerald-200 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/10"
                  href="https://www.linkedin.com/in/abulfazal2001/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedInIcon className="size-4" />
                  LinkedIn
                  <ArrowIcon className="size-3.5" />
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#cdd6d0]">{label}</span>
      <input
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-lg border border-emerald-500/15 bg-[#060807] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#5b6560] focus:border-emerald-400/70"
        placeholder={label}
      />
    </label>
  );
}

function ContactCard({
  icon: Icon,
  title,
  text,
  value,
  href,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-emerald-500/20 bg-emerald-500/8 text-emerald-300 transition-colors group-hover:border-emerald-400/50 group-hover:bg-emerald-500/12">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-400">{title}</p>
        <p className="mt-2 text-sm text-white">{text}</p>
        <p className="mt-0.5 break-words text-sm text-[#8b958e]">{value}</p>
      </span>
    </div>
  );

  return href ? (
    <a
      className="card-surface group block rounded-lg border border-emerald-500/12 p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-400/45"
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      {content}
    </a>
  ) : (
    <div className="card-surface group rounded-lg border border-emerald-500/12 p-5">{content}</div>
  );
}
