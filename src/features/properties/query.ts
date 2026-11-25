import type { Property, PropertyType } from "./types";

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "size-desc";

export type PropertyQuery = {
  search: string;
  type: PropertyType | "all";
  maxPrice: number | null;
  minBeds: number;
  sort: SortKey;
  savedOnly: boolean;
};

export const defaultQuery: PropertyQuery = { search: "", type: "all", maxPrice: null, minBeds: 0, sort: "featured", savedOnly: false };

export const priceOptions = [
  { label: "Any price", value: null },
  { label: "Up to TT$10M", value: 10_000_000 },
  { label: "Up to TT$15M", value: 15_000_000 },
  { label: "Up to TT$25M", value: 25_000_000 },
  { label: "Up to TT$50M", value: 50_000_000 },
] as const;

export const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Newest listed", value: "newest" },
  { label: "Largest", value: "size-desc" },
];

/** Pure filter + sort, independent of React so it can move server-side later. */
export function queryProperties(list: Property[], q: PropertyQuery, saved: readonly string[] = []): Property[] {
  const term = q.search.trim().toLowerCase();
  const out = list.filter((p) => {
    if (q.type !== "all" && p.type !== q.type) return false;
    if (q.maxPrice !== null && p.priceTTD > q.maxPrice) return false;
    if (p.bedrooms < q.minBeds) return false;
    if (q.savedOnly && !saved.includes(p.id)) return false;
    if (term) {
      const hay = [p.title, p.location, p.tagline, p.type, ...p.amenities].join(" ").toLowerCase();
      if (!term.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const cmp: Record<SortKey, (a: Property, b: Property) => number> = {
    featured: (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.priceTTD - a.priceTTD,
    "price-asc": (a, b) => a.priceTTD - b.priceTTD,
    "price-desc": (a, b) => b.priceTTD - a.priceTTD,
    newest: (a, b) => b.listedOn.localeCompare(a.listedOn),
    "size-desc": (a, b) => b.sizeSqFt - a.sizeSqFt,
  };
  return [...out].sort(cmp[q.sort]);
}

export const formatNumber = (n: number) => n.toLocaleString("en-US");
export const formatPrice = (n: number) => `TT$${formatNumber(n)}`;
