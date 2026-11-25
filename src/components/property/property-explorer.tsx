"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getAllProperties, propertyTypes } from "@/features/properties/data";
import { useFavourites } from "@/features/properties/favourites";
import { defaultQuery, priceOptions, queryProperties, sortOptions, type PropertyQuery, type SortKey } from "@/features/properties/query";
import type { PropertyType } from "@/features/properties/types";
import { PropertyCard } from "./property-card";
import { layoutFor } from "./card-layout";

function parse(sp: URLSearchParams): PropertyQuery {
  const type = sp.get("type");
  const max = Number(sp.get("max"));
  const sort = sp.get("sort") as SortKey | null;
  return {
    search: sp.get("q") ?? "",
    type: propertyTypes.some((t) => t.value === type) ? (type as PropertyType) : "all",
    maxPrice: Number.isFinite(max) && max > 0 ? max : null,
    minBeds: Math.max(0, Number(sp.get("beds")) || 0),
    sort: sortOptions.some((s) => s.value === sort) ? sort! : "featured",
    savedOnly: sp.get("saved") === "1",
  };
}

function serialise(q: PropertyQuery) {
  const p = new URLSearchParams();
  if (q.search) p.set("q", q.search);
  if (q.type !== "all") p.set("type", q.type);
  if (q.maxPrice) p.set("max", String(q.maxPrice));
  if (q.minBeds) p.set("beds", String(q.minBeds));
  if (q.sort !== "featured") p.set("sort", q.sort);
  if (q.savedOnly) p.set("saved", "1");
  return p.toString();
}

export function PropertyExplorer() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { ids } = useFavourites();
  const spKey = sp.toString();
  // Local state drives the UI instantly; the URL mirrors it so results are shareable.
  const [q, setQ] = useState(() => parse(new URLSearchParams(spKey)));
  const [syncedKey, setSyncedKey] = useState(spKey);
  const [searchDraft, setSearchDraft] = useState(q.search);
  const [showFilters, setShowFilters] = useState(false);

  // External navigation (e.g. header "saved" link) — adopt the new URL state.
  if (spKey !== syncedKey) {
    const next = parse(new URLSearchParams(spKey));
    setSyncedKey(spKey);
    if (serialise(next) !== serialise(q)) {
      setQ(next);
      setSearchDraft(next.search);
    }
  }

  const update = (patch: Partial<PropertyQuery>) => {
    const next = { ...q, ...patch };
    setQ(next);
    const s = serialise(next);
    setSyncedKey(s);
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };

  const results = useMemo(() => queryProperties(getAllProperties(), q, ids), [q, ids]);
  const activeCount = [q.type !== "all", q.maxPrice !== null, q.minBeds > 0, q.savedOnly, !!q.search].filter(Boolean).length;

  const select = "w-full appearance-none border-b border-navy/25 bg-transparent py-2.5 text-sm outline-none focus:border-navy";
  const lbl = "eyebrow text-[0.6rem] text-navy/55";

  return (
    <div className="container-lux pb-32">
      {/* Type tabs */}
      <div role="group" aria-label="Filter by property type" className="flex gap-2 overflow-x-auto border-b border-navy/10 pb-px">
        {[{ value: "all", label: "All homes" } as const, ...propertyTypes].map((t) => {
          const on = q.type === t.value;
          return (
            <button
              key={t.value}
              type="button"
              aria-pressed={on}
              onClick={() => update({ type: t.value as PropertyQuery["type"] })}
              className={`relative shrink-0 px-4 py-4 text-xs tracking-[0.16em] uppercase transition-colors ${on ? "text-navy" : "text-navy/50 hover:text-navy"}`}
            >
              {t.label}
              {on && <motion.span layoutId="type-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-navy" />}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_auto] lg:items-end">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            update({ search: searchDraft.trim() });
          }}
          className="flex items-center gap-3 border-b border-navy/25 focus-within:border-navy"
        >
          <Search aria-hidden="true" size={18} className="text-navy/50" />
          <label htmlFor="property-search" className="sr-only">Search properties</label>
          <input
            id="property-search"
            type="search"
            value={searchDraft}
            onChange={(e) => {
              setSearchDraft(e.target.value);
              update({ search: e.target.value.trim() });
            }}
            placeholder="Search by name, location or amenity"
            className="w-full bg-transparent py-3 font-serif text-2xl outline-none placeholder:text-navy/35"
          />
        </form>
        <div className="flex items-end gap-4">
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
            aria-controls="filters-panel"
            className="inline-flex items-center gap-2 border border-navy/20 px-4 py-3 text-xs tracking-[0.16em] uppercase hover:border-navy lg:hidden"
          >
            <SlidersHorizontal aria-hidden="true" size={15} /> Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          <div className="min-w-44 flex-1">
            <label htmlFor="sort" className={lbl}>Sort by</label>
            <select id="sort" className={select} value={q.sort} onChange={(e) => update({ sort: e.target.value as SortKey })}>
              {sortOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div id="filters-panel" className={`${showFilters ? "grid" : "hidden"} mt-6 gap-6 sm:grid-cols-3 lg:grid lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end`}>
        <div>
          <label htmlFor="max-price" className={lbl}>Price</label>
          <select id="max-price" className={select} value={q.maxPrice ?? ""} onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : null })}>
            {priceOptions.map((p) => <option key={p.label} value={p.value ?? ""}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="beds" className={lbl}>Bedrooms</label>
          <select id="beds" className={select} value={q.minBeds} onChange={(e) => update({ minBeds: Number(e.target.value) })}>
            <option value={0}>Any</option>
            {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}+ bedrooms</option>)}
          </select>
        </div>
        <label className="flex items-center gap-3 py-2.5 text-sm">
          <input type="checkbox" checked={q.savedOnly} onChange={(e) => update({ savedOnly: e.target.checked })} className="size-4 accent-navy" />
          Saved only ({ids.length})
        </label>
        <button
          type="button"
          disabled={activeCount === 0 && q.sort === "featured"}
          onClick={() => {
            setSearchDraft("");
            update(defaultQuery);
          }}
          className="inline-flex items-center gap-2 py-2.5 text-xs tracking-[0.16em] uppercase underline-offset-4 hover:underline disabled:opacity-40"
        >
          <X aria-hidden="true" size={14} /> Clear all
        </button>
      </div>

      <p className="mt-10 text-sm text-navy/60" aria-live="polite" role="status">
        Showing <span className="font-semibold text-navy">{results.length}</span> of {getAllProperties().length} illustrative properties
      </p>

      <LayoutGroup>
        <motion.ul layout className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-6 lg:gap-y-20">
          <AnimatePresence mode="popLayout">
            {results.map((p, i) => {
              const { variant, className } = layoutFor(i);
              return (
                <motion.li
                  key={p.id}
                  layout
                  className={className}
                  initial={{ opacity: 0, clipPath: "inset(12% 0 0 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.35 } }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <PropertyCard property={p} index={i} variant={variant} />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      <AnimatePresence>
        {results.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border border-navy/10 py-20 text-center">
            <p className="font-serif text-3xl">{q.savedOnly && ids.length === 0 ? "No saved properties yet." : "No homes match these filters."}</p>
            <p className="mt-3 text-sm text-navy/60">
              {q.savedOnly && ids.length === 0 ? "Tap the heart on any listing to save it to this device." : "Try widening your price range or clearing a filter."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
