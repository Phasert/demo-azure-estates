"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { Neighbourhood, Property } from "@/features/properties/types";
import { formatPrice } from "@/features/properties/query";

const ease = [0.22, 1, 0.36, 1] as const;

// Equirectangular projection for the Trinidad & Tobago region.
const W = 800;
const H = 760;
const LON0 = -62.0;
const LON1 = -60.4;
const LAT0 = 11.45;
const LAT1 = 9.95;
const project = (lon: number, lat: number) => [((lon - LON0) / (LON1 - LON0)) * W, ((LAT0 - lat) / (LAT0 - LAT1)) * H] as const;
const path = (pts: [number, number][]) => pts.map(([lon, lat], i) => `${i ? "L" : "M"}${project(lon, lat).map((v) => v.toFixed(1)).join(" ")}`).join(" ") + " Z";

// Simplified, hand-traced outlines (approximate; not survey-accurate).
const trinidad = path([
  [-61.66, 10.69], [-61.55, 10.76], [-61.4, 10.79], [-61.2, 10.8], [-61.0, 10.83], [-60.91, 10.83], [-60.93, 10.72], [-60.98, 10.6],
  [-61.0, 10.42], [-61.01, 10.27], [-61.0, 10.13], [-61.12, 10.09], [-61.3, 10.07], [-61.5, 10.06], [-61.7, 10.06], [-61.92, 10.04],
  [-61.86, 10.11], [-61.7, 10.15], [-61.6, 10.2], [-61.5, 10.28], [-61.47, 10.42], [-61.47, 10.55], [-61.5, 10.63], [-61.58, 10.66],
]);
const tobago = path([
  [-60.85, 11.15], [-60.77, 11.17], [-60.68, 11.21], [-60.58, 11.26], [-60.51, 11.3], [-60.5, 11.34], [-60.56, 11.34], [-60.66, 11.3],
  [-60.75, 11.26], [-60.82, 11.21],
]);

type Dest = Neighbourhood & { homes: Property[] };

export function DestinationExplorer({ destinations }: { destinations: Dest[] }) {
  const [active, setActive] = useState(0);
  const reduce = !!useReducedMotion();
  const d = destinations[active];

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
      {/* Stage */}
      <div className="relative aspect-[4/5] overflow-hidden bg-navy text-ivory sm:aspect-[16/11]" aria-live="polite">
        <AnimatePresence initial={false}>
          <motion.div
            key={d.slug}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 0 100%)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0 0%)" }}
            exit={{ opacity: 0.6, transition: { duration: 1.2 } }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div className="absolute inset-0" initial={reduce ? false : { scale: 1.25, x: 40 }} animate={{ scale: 1.05, x: 0 }} transition={{ duration: 6, ease: "easeOut" }}>
              <Image src={d.image.src} alt={d.image.alt} fill loading="eager" sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-linear-to-t from-navy/90 via-navy/20 to-transparent" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div key={d.slug} initial="a" animate="b" exit="c">
              <motion.p className="eyebrow text-champagne" variants={{ a: { opacity: 0 }, b: { opacity: 1 }, c: { opacity: 0 } }} transition={{ delay: 0.5 }}>
                {String(active + 1).padStart(2, "0")} · {d.island}
              </motion.p>
              <h3 className="mt-3 overflow-hidden font-serif text-4xl leading-none font-light sm:text-6xl">
                <motion.span className="block" variants={{ a: { y: "100%" }, b: { y: 0 }, c: { y: "-100%" } }} transition={{ duration: 0.8, ease, delay: 0.4 }}>
                  {d.name}
                </motion.span>
              </h3>
              <motion.p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/80 sm:text-base" variants={{ a: { opacity: 0, y: 10 }, b: { opacity: 1, y: 0 }, c: { opacity: 0 } }} transition={{ delay: 0.6 }}>
                {d.summary}
              </motion.p>
              <motion.div variants={{ a: { opacity: 0 }, b: { opacity: 1 }, c: { opacity: 0 } }} transition={{ delay: 0.75 }} className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {d.homes.map((h) => (
                  <Link key={h.id} href={`/properties/${h.slug}`} className="underline-offset-4 hover:text-champagne hover:underline">
                    {h.title} <span className="text-ivory/60">· {formatPrice(h.priceTTD)}</span>
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Map + destination cards */}
      <div className="flex flex-col gap-6">
        <figure className="relative border border-navy/10 bg-[#f1efe9] p-4">
          <svg viewBox={`120 0 ${W - 120} ${H - 40}`} className="h-auto w-full" role="img" aria-label="Stylised map of Trinidad and Tobago marking the areas that inspired each neighbourhood">
            <defs>
              <pattern id="sea-lines" width="14" height="14" patternUnits="userSpaceOnUse">
                <path d="M0 7 H14" stroke="#102A43" strokeOpacity="0.05" />
              </pattern>
            </defs>
            <rect x="0" y="0" width={W} height={H} fill="url(#sea-lines)" />
            <motion.path d={trinidad} fill="#E8E8E5" stroke="#102A43" strokeWidth="1.5" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, ease }} />
            <motion.path d={tobago} fill="#E8E8E5" stroke="#102A43" strokeWidth="1.5" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease, delay: 0.6 }} />
            <text {...xy(-61.3, 10.45)} fontSize="18" letterSpacing="6" fill="#102A43" opacity="0.4">TRINIDAD</text>
            <text {...xy(-60.82, 11.1)} fontSize="15" letterSpacing="5" fill="#102A43" opacity="0.4">TOBAGO</text>
            <text {...xy(-61.85, 10.4)} fontSize="11" letterSpacing="3" fill="#102A43" opacity="0.35">GULF OF PARIA</text>
            <text {...xy(-61.5, 11.25)} fontSize="11" letterSpacing="3" fill="#102A43" opacity="0.35">CARIBBEAN SEA</text>
            {destinations.map((n, i) => {
              const [x, y] = project(n.inspiredBy.lon, n.inspiredBy.lat);
              const on = i === active;
              const labelLeft = n.inspiredBy.lon < -61.54;
              return (
                <g key={n.slug} aria-hidden="true">
                  {on && !reduce && (
                    <motion.circle cx={x} cy={y} r="10" fill="none" stroke="#8a6f45" strokeWidth="1.5" initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2.6, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.8 }} style={{ transformOrigin: `${x}px ${y}px` }} />
                  )}
                  <motion.circle cx={x} cy={y} animate={{ r: on ? 8 : 5, fill: on ? "#8a6f45" : "#102A43" }} transition={{ duration: 0.4 }} />
                  <text x={labelLeft ? x - 14 : x + 14} y={y + 4} textAnchor={labelLeft ? "end" : "start"} fontSize="13" fill="#102A43" fontWeight={on ? 600 : 400} opacity={on ? 1 : 0.65}>
                    {n.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <figcaption className="mt-2 text-[0.7rem] leading-relaxed text-navy/55">
            Stylised map, not to scale. Markers show the real areas that inspired each fictionalised neighbourhood; outlines are simplified.
          </figcaption>
        </figure>

        <div role="group" aria-label="Choose a destination" className="grid grid-cols-2 gap-2">
          {destinations.map((n, i) => (
            <button
              key={n.slug}
              aria-pressed={i === active}
              type="button"
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden border p-4 text-left transition-colors duration-500 ${i === active ? "border-navy bg-navy text-ivory" : "border-navy/15 hover:border-navy"}`}
            >
              <span className={`eyebrow text-[0.58rem] ${i === active ? "text-champagne" : "text-champagne-deep"}`}>{n.island}</span>
              <span className="mt-1 block font-serif text-xl leading-tight">{n.name}</span>
              <span className={`mt-1 block text-xs ${i === active ? "text-ivory/60" : "text-navy/55"}`}>Inspired by {n.inspiredBy.area}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function xy(lon: number, lat: number) {
  const [x, y] = project(lon, lat);
  return { x, y };
}
