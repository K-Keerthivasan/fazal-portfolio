"use client";

import { FormEvent, useEffect, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };
  }
}

const services = [
  ["BIM Modeling", "Revit, Navisworks, 4D Simulation"],
  ["Design Development", "Concept through Construction"],
  ["MEP Coordination", "Multi-trade Integration"],
  ["Code Compliance", "Building Code & Accessibility Standards"],
];

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey || document.querySelector("script[data-turnstile]")) return;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = "true";
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
      window.turnstile?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="green-ambience absolute inset-0 opacity-60" />
      <div className="section-shell relative">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Let&apos;s Create Something Extraordinary
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#a8b2ab]">
              Ready to bring your architectural vision to life? I&apos;m passionate about collaborating
              on projects that push the boundaries of design and construction technology.
            </p>

            <div className="mt-10 grid gap-3">
              <ContactCard title="Email" text="Let's discuss your project" value="fazal@example.com" href="mailto:fazal@example.com" />
              <ContactCard title="Phone" text="Available for consultations" value="+1 (000) 000-0000" href="tel:+10000000000" />
              <ContactCard title="Location" text="Based in Ontario" value="Ontario, Canada" />
              {/* Change email, phone, and location placeholders above. */}
            </div>

            <div className="card-surface mt-10 rounded-xl border border-emerald-500/15 p-6">
              <p className="text-base font-semibold text-white">
                Available for full-time opportunities, contract work, and consultations.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {services.map(([title, text]) => (
                  <div key={title} className="border-l-2 border-emerald-400/40 pl-4">
                    <h3 className="text-sm font-semibold text-emerald-200">{title}</h3>
                    <p className="mt-1 text-sm text-[#8b958e]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card-surface rounded-xl border border-emerald-500/15 p-6 sm:p-8">
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
                placeholder="Tell me about your project."
              />
            </label>

            <div className="mt-5 min-h-[65px]">
              {siteKey ? (
                <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" />
              ) : (
                <div className="rounded-lg border border-amber-400/25 bg-amber-500/10 p-4 text-sm text-amber-200">
                  Add NEXT_PUBLIC_CAPTCHA_SITE_KEY to enable CAPTCHA.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="soft-glow mt-6 w-full rounded-md bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-[#04140c] transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Sending…" : "Send Message"}
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
                <a className="flex-1 rounded-md border border-emerald-500/25 px-5 py-3 text-center text-sm font-medium text-emerald-200 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/10" href="#projects">
                  View Portfolio
                </a>
                <a className="flex-1 rounded-md border border-emerald-500/25 px-5 py-3 text-center text-sm font-medium text-emerald-200 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/10" href="#contact">
                  Get In Touch
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
  title,
  text,
  value,
  href,
}: {
  title: string;
  text: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-400">{title}</p>
      <p className="mt-2 text-sm text-white">{text}</p>
      <p className="mt-0.5 text-sm text-[#8b958e]">{value}</p>
    </>
  );

  return href ? (
    <a
      className="card-surface block rounded-lg border border-emerald-500/12 p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-400/45"
      href={href}
    >
      {content}
    </a>
  ) : (
    <div className="card-surface rounded-lg border border-emerald-500/12 p-5">{content}</div>
  );
}
