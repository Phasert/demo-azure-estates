"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useFavourites } from "@/features/properties/favourites";

export function FavouriteButton({ id, title, variant = "overlay" }: { id: string; title: string; variant?: "overlay" | "inline" }) {
  const { isSaved, toggle } = useFavourites();
  const saved = isSaved(id);
  const base =
    variant === "overlay"
      ? "size-11 justify-center rounded-full bg-ivory/90 text-navy backdrop-blur hover:bg-ivory"
      : "gap-3 border border-navy/20 px-5 py-3 text-xs tracking-[0.16em] uppercase hover:border-navy";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved properties` : `Save ${title}`}
      className={`inline-flex items-center transition-colors ${base}`}
    >
      <motion.span key={String(saved)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
        <Heart aria-hidden="true" size={18} strokeWidth={1.5} className={saved ? "fill-champagne-deep stroke-champagne-deep" : ""} />
      </motion.span>
      {variant === "inline" && <span>{saved ? "Saved" : "Save property"}</span>}
    </button>
  );
}
