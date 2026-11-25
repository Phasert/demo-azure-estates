"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Property } from "@/features/properties/types";
import { typeLabel } from "@/features/properties/data";
import { formatNumber, formatPrice } from "@/features/properties/query";
import { FavouriteButton } from "./favourite-button";

import type { CardVariant } from "./card-layout";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Editorial property card. Three compositions keep a results page from
 * reading as a uniform grid; all share the same link, data and favourite control.
 */
export function PropertyCard({ property: p, index = 0, variant = "portrait", sizes }: { property: Property; index?: number; variant?: CardVariant; sizes?: string }) {
  const second = p.images[1] ?? p.images[0];
  const feature = variant === "feature";
  const landscape = variant === "landscape";
  // The hover photo sits behind a fully-closed clip-path, which the browser's
  // native lazy loading treats as invisible, so it never fetches. Load it
  // eagerly once the card is near the viewport so the wipe has a photo to show.
  const ref = useRef<HTMLElement>(null);
  const near = useInView(ref, { once: true, margin: "400px 0px" });

  const media = (
    <div className={`relative overflow-hidden bg-mist ${feature ? "aspect-[4/5] sm:aspect-[16/10]" : landscape ? "aspect-[16/11]" : "aspect-[4/5]"}`}>
      <Image
        src={p.images[0].src}
        alt={p.images[0].alt}
        fill
        sizes={sizes ?? (feature ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw")}
        className="object-cover transition-transform duration-[1.6s] ease-lux group-hover:scale-[1.08]"
      />
      {/* Second photograph wipes in on hover */}
      <div className="absolute inset-0 [clip-path:inset(0_0_0_100%)] transition-[clip-path] duration-[1.1s] ease-lux group-hover:[clip-path:inset(0_0_0_45%)] group-focus-visible:[clip-path:inset(0_0_0_45%)]">
        <Image src={second.src} alt="" fill loading={near ? "eager" : "lazy"} sizes="(min-width: 1024px) 33vw, 50vw" className="scale-110 object-cover transition-transform duration-[1.6s] ease-lux group-hover:scale-100" />
        <span className="absolute inset-y-0 left-[45%] w-px bg-ivory/70" />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-navy/60 via-transparent to-transparent" />
      <span className="eyebrow absolute top-4 left-4 bg-ivory/90 px-3 py-1.5 text-[0.6rem] text-navy">Illustrative listing</span>
      <span className="absolute bottom-4 left-4 font-serif text-5xl leading-none text-ivory/90 sm:text-6xl">{String(index + 1).padStart(2, "0")}</span>
      <span className="absolute right-4 bottom-4 flex size-11 translate-y-3 items-center justify-center rounded-full bg-champagne text-navy opacity-0 transition-all duration-500 ease-lux group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight aria-hidden="true" size={18} />
      </span>
    </div>
  );

  const details = (
    <div className={feature ? "flex flex-col justify-end sm:pl-2" : "pt-5"}>
      <p className="eyebrow text-champagne-deep">
        {typeLabel(p.type)} · {p.location.split(",")[1]?.trim()}
      </p>
      <h3 className={`mt-2 font-serif leading-[1.02] ${feature ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl"}`}>{p.title}</h3>
      <p className="mt-1.5 text-sm text-navy/65">{p.location.split(",")[0]}</p>
      {feature && <p className="mt-5 max-w-md font-serif text-xl leading-snug text-navy/80 italic">{p.tagline}</p>}
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-navy/10 pt-4">
        <p className="font-serif text-2xl">{formatPrice(p.priceTTD)}</p>
        <p className="text-xs tracking-wide text-navy/65">
          {p.bedrooms} bd · {p.bathrooms} ba · {formatNumber(p.sizeSqFt)} sq ft
        </p>
      </div>
      {/* Amenities slide up on hover */}
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-lux group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
        <ul className="flex flex-wrap gap-1.5 overflow-hidden" aria-label="Highlights">
          {p.amenities.slice(0, feature ? 5 : 3).map((a, i) => (
            <li key={a} className="mt-3 border border-navy/15 px-2.5 py-1 text-[0.7rem]" style={{ transitionDelay: `${i * 40}ms` }}>
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease, delay: (index % 3) * 0.08 }}
      className="group relative"
    >
      <Link href={`/properties/${p.slug}`} className={`block focus-visible:outline-offset-8 ${feature ? "grid gap-6 sm:grid-cols-[1.6fr_1fr] sm:gap-10" : ""}`}>
        {media}
        {details}
      </Link>
      <div className="absolute top-3 right-3">
        <FavouriteButton id={p.id} title={p.title} />
      </div>
    </motion.article>
  );
}
