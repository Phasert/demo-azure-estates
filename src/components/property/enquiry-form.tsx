"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { properties } from "@/features/properties/data";

type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

/**
 * Demo enquiry form. Validates client-side and shows a confirmation,
 * but intentionally sends nothing: this is a fictional agency.
 */
export function EnquiryForm({ propertyTitle, tone = "light" }: { propertyTitle?: string; tone?: "light" | "dark" }) {
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const dark = tone === "dark";

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const next: Errors = {};
    if (name.length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address.";
    if (message.length < 10) next.message = "Please add a short message (10 characters or more).";
    if (!fd.get("consent")) next.consent = "Please confirm you understand this is a demo.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSent(name.split(" ")[0]);
  }

  const field = `w-full border-0 border-b bg-transparent px-0 py-3 text-base outline-none transition-colors focus:ring-0 ${
    dark ? "border-ivory/30 placeholder:text-ivory/40 focus:border-champagne" : "border-navy/25 placeholder:text-navy/40 focus:border-navy"
  }`;
  const label = `eyebrow ${dark ? "text-ivory/70" : "text-navy/60"}`;
  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className={`mt-2 text-sm ${dark ? "text-red-300" : "text-red-700"}`}>
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof Errors) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined });

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="sent" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="py-10">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-champagne text-navy">
              <Check aria-hidden="true" />
            </span>
            <p className="mt-6 font-serif text-4xl">Thank you, {sent}.</p>
            <p className={`mt-3 max-w-md leading-relaxed ${dark ? "text-ivory/75" : "text-navy/70"}`}>
              Your enquiry has been recorded in this demo only — nothing was sent, and no one will contact you. Azure Estates and its listings
              are fictional.
            </p>
            <button type="button" onClick={() => setSent(null)} className="mt-6 text-xs tracking-[0.18em] uppercase underline underline-offset-4">
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, y: -16 }} className="grid gap-7 sm:grid-cols-2" aria-label="Property enquiry">
            <div>
              <label htmlFor={`${uid}-name`} className={label}>Full name</label>
              <input id={`${uid}-name`} name="name" autoComplete="name" className={field} {...a11y("name")} />
              {err("name")}
            </div>
            <div>
              <label htmlFor={`${uid}-email`} className={label}>Email</label>
              <input id={`${uid}-email`} name="email" type="email" autoComplete="email" className={field} {...a11y("email")} />
              {err("email")}
            </div>
            <div>
              <label htmlFor={`${uid}-phone`} className={label}>Phone (optional)</label>
              <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" className={field} />
            </div>
            <div>
              <label htmlFor={`${uid}-property`} className={label}>Property of interest</label>
              <select id={`${uid}-property`} name="property" defaultValue={propertyTitle ?? ""} className={`${field} ${dark ? "[&>option]:text-navy" : ""}`}>
                <option value="">General enquiry</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.title}>{p.title}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${uid}-message`} className={label}>Message</label>
              <textarea
                id={`${uid}-message`}
                name="message"
                rows={4}
                defaultValue={propertyTitle ? `I'd like to arrange a private viewing of ${propertyTitle}.` : ""}
                className={`${field} resize-none`}
                {...a11y("message")}
              />
              {err("message")}
            </div>
            <div className="sm:col-span-2">
              <label className={`flex items-start gap-3 text-sm ${dark ? "text-ivory/80" : "text-navy/75"}`}>
                <input type="checkbox" name="consent" className="mt-1 size-4 accent-champagne-deep" {...a11y("consent")} />
                I understand Azure Estates is a fictional demo and that this form does not send my details anywhere.
              </label>
              {err("consent")}
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className={`group relative inline-flex items-center gap-4 overflow-hidden px-8 py-4 text-xs tracking-[0.2em] uppercase ${dark ? "bg-champagne text-navy" : "bg-navy text-ivory"}`}
              >
                <span className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-lux group-hover:scale-x-100 ${dark ? "bg-ivory" : "bg-navy-soft"}`} />
                <span className="relative">Request a private viewing</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
