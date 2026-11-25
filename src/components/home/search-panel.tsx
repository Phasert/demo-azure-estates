"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, type FormEvent } from "react";
import { propertyTypes } from "@/features/properties/data";
import { priceOptions } from "@/features/properties/query";

export function SearchPanel() {
  const router = useRouter();
  const uid = useId();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const key of ["q", "type", "max", "beds"]) {
      const v = String(fd.get(key) ?? "").trim();
      if (v && v !== "all" && v !== "0") params.set(key, v);
    }
    router.push(`/properties${params.size ? `?${params}` : ""}`);
  }

  const cell = "flex flex-col gap-1 px-5 py-3 lg:border-l lg:border-navy/10 lg:first:border-l-0";
  const label = "eyebrow text-[0.6rem] text-navy/55";
  const control = "w-full appearance-none bg-transparent text-[0.95rem] text-navy outline-none";

  return (
    <form
      role="search"
      aria-label="Search properties"
      onSubmit={onSubmit}
      className="grid w-full grid-cols-2 bg-ivory/95 text-navy shadow-[0_30px_80px_-30px_rgb(16_42_67/0.6)] backdrop-blur lg:grid-cols-[1.6fr_1fr_1fr_0.8fr_auto]"
    >
      <div className={`${cell} col-span-2 border-b border-navy/10 lg:col-span-1 lg:border-b-0`}>
        <label htmlFor={`${uid}-q`} className={label}>Search</label>
        <input id={`${uid}-q`} name="q" placeholder="Location, villa, pool…" className={`${control} placeholder:text-navy/40`} />
      </div>
      <div className={cell}>
        <label htmlFor={`${uid}-type`} className={label}>Property type</label>
        <select id={`${uid}-type`} name="type" className={control} defaultValue="all">
          <option value="all">All types</option>
          {propertyTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div className={`${cell} border-l border-navy/10`}>
        <label htmlFor={`${uid}-max`} className={label}>Price</label>
        <select id={`${uid}-max`} name="max" className={control} defaultValue="">
          {priceOptions.map((p) => <option key={p.label} value={p.value ?? ""}>{p.label}</option>)}
        </select>
      </div>
      <div className={`${cell} border-t border-navy/10 lg:border-t-0`}>
        <label htmlFor={`${uid}-beds`} className={label}>Bedrooms</label>
        <select id={`${uid}-beds`} name="beds" className={control} defaultValue="0">
          <option value="0">Any</option>
          {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}+</option>)}
        </select>
      </div>
      <button type="submit" className="flex items-center justify-center gap-3 border-t border-navy/10 bg-navy px-8 py-4 text-xs tracking-[0.2em] text-ivory uppercase transition-colors hover:bg-navy-soft lg:border-t-0">
        <Search aria-hidden="true" size={16} /> Search
      </button>
    </form>
  );
}
