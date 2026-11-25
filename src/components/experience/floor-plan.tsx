"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { conceptRooms, residenceName } from "@/features/concept/residence";

const ease = [0.22, 1, 0.36, 1] as const;
const WALL = "#102A43";

const center = (id: string) => {
  const r = conceptRooms.find((x) => x.id === id)!.plan;
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
};

/** Interactive schematic plan of the conceptual residence (SVG). Not to scale. */
export function FloorPlan() {
  const [selected, setSelected] = useState("living");
  const [hover, setHover] = useState<string | null>(null);
  const reduce = !!useReducedMotion();
  const idx = conceptRooms.findIndex((r) => r.id === selected);
  const room = conceptRooms[idx];
  const dot = center(selected);

  const step = (d: number) => setSelected(conceptRooms[(idx + d + conceptRooms.length) % conceptRooms.length].id);

  const onKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected(id);
    }
  };

  const draw = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 2, ease, delay },
        };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start">
      <figure className="relative min-w-0">
        <div className="relative border border-navy/10 bg-[#f4f2ec] p-3 sm:p-6">
          <svg viewBox="80 0 840 680" className="h-auto w-full" role="group" aria-label={`${residenceName} floor plan. Select a room to view details.`}>
            <defs>
              <pattern id="waves" width="40" height="12" patternUnits="userSpaceOnUse">
                <path d="M0 6 Q10 0 20 6 T40 6" fill="none" stroke="#102A43" strokeOpacity="0.12" strokeWidth="1.2" />
              </pattern>
              <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#102A43" strokeOpacity="0.12" strokeWidth="2" />
              </pattern>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="#102A43" strokeOpacity="0.04" />
              </pattern>
            </defs>
            <rect x="80" y="0" width="840" height="680" fill="url(#grid)" />
            {/* Sea */}
            <rect x="80" y="0" width="840" height="36" fill="url(#waves)" />
            <text x="100" y="24" fontSize="11" letterSpacing="4" fill="#102A43" opacity="0.45">CARIBBEAN SEA</text>

            {/* Rooms */}
            {conceptRooms.map((r) => {
              const isSel = r.id === selected;
              const isHover = r.id === hover;
              const outdoor = r.id === "terrace" || r.id === "pool";
              return (
                <g
                  key={r.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSel}
                  aria-label={`${r.name}${r.inTour ? "" : " (plan only)"}`}
                  onClick={() => setSelected(r.id)}
                  onKeyDown={(e) => onKey(e, r.id)}
                  onPointerEnter={() => setHover(r.id)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(r.id)}
                  onBlur={() => setHover(null)}
                  className="cursor-pointer outline-none [&:focus-visible>rect:last-of-type]:stroke-[#8a6f45]"
                >
                  <motion.rect
                    x={r.plan.x}
                    y={r.plan.y}
                    width={r.plan.w}
                    height={r.plan.h}
                    animate={{
                      fill: isSel ? "rgba(215,195,163,0.75)" : isHover ? "rgba(215,195,163,0.3)" : r.id === "pool" ? "rgba(120,170,190,0.25)" : "rgba(255,255,255,0)",
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  {outdoor && <rect x={r.plan.x} y={r.plan.y} width={r.plan.w} height={r.plan.h} fill={r.id === "terrace" ? "url(#hatch)" : "url(#waves)"} pointerEvents="none" />}
                  <rect x={r.plan.x} y={r.plan.y} width={r.plan.w} height={r.plan.h} fill="none" stroke={WALL} strokeOpacity={outdoor ? 0.35 : 0} strokeDasharray={outdoor ? "6 6" : undefined} strokeWidth={2} />
                  <text
                    x={r.plan.x + r.plan.w / 2}
                    y={r.plan.y + r.plan.h / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={r.plan.h < 100 ? 13 : 15}
                    letterSpacing="2"
                    fill={WALL}
                    style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", pointerEvents: "none" }}
                  >
                    {r.name}
                  </text>
                </g>
              );
            })}

            {/* Walls (drawn on reveal) */}
            <g fill="none" stroke={WALL} strokeLinecap="square" pointerEvents="none">
              <motion.path d="M120 200 H880 V620 H120 Z" strokeWidth="8" {...draw()} />
              <motion.path d="M400 200 V400 M120 400 H400 M400 460 V620 M400 460 H720 M720 200 V620 M720 440 H880 M560 460 V620" strokeWidth="4" {...draw(0.4)} />
              {/* openings: glazing on the seaward wall */}
              <path d="M430 200 H690 M750 200 H850 M150 200 H370" stroke="#FAF9F6" strokeWidth="6" />
              <path d="M430 200 H690 M750 200 H850 M150 200 H370" stroke={WALL} strokeWidth="1.5" />
              {/* door swings */}
              <path d="M460 620 V580 A40 40 0 0 1 500 620" strokeWidth="1.5" strokeOpacity="0.6" />
              <path d="M400 300 H400" />
              <path d="M720 380 H680 A40 40 0 0 0 720 420" strokeWidth="1.5" strokeOpacity="0.6" />
              <path d="M760 440 V480 A40 40 0 0 0 800 440" strokeWidth="1.5" strokeOpacity="0.6" />
              <path d="M400 330 H360 A40 40 0 0 1 400 290" strokeWidth="1.5" strokeOpacity="0.6" />
            </g>
            {/* Services (not selectable) */}
            <rect x="560" y="460" width="160" height="160" fill="url(#hatch)" pointerEvents="none" />
            <text x="640" y="545" textAnchor="middle" fontSize="12" letterSpacing="2" fill={WALL} opacity="0.5" pointerEvents="none">SERVICES</text>

            {/* Walker dot travels between rooms */}
            <motion.g animate={{ x: dot.x, y: dot.y + 26 }} initial={false} transition={{ duration: reduce ? 0 : 0.9, ease }} pointerEvents="none">
              {!reduce && (
                <motion.circle r="14" fill="#8a6f45" initial={{ opacity: 0.35, scale: 0.6 }} animate={{ opacity: 0, scale: 1.8 }} transition={{ repeat: Infinity, duration: 1.8 }} />
              )}
              <circle r="6" fill="#8a6f45" />
            </motion.g>

            {/* Compass + note */}
            <g transform="translate(870 660)" fill={WALL} opacity="0.6" pointerEvents="none">
              <path d="M0 -18 L5 0 L0 -4 L-5 0 Z" />
              <text y="12" textAnchor="middle" fontSize="10">N</text>
            </g>
            <text x="120" y="660" fontSize="11" letterSpacing="2" fill={WALL} opacity="0.55">SCHEMATIC · NOT TO SCALE · ILLUSTRATIVE ONLY</text>
          </svg>
        </div>
        <figcaption className="mt-3 text-xs text-navy/60">
          {residenceName} is a conceptual layout created for this demo. It does not represent the plan or dimensions of any real or listed property.
        </figcaption>

        {/* Touch-friendly room list */}
        <div role="group" aria-label="Rooms" className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {conceptRooms.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelected(r.id)}
              aria-pressed={r.id === selected}
              className={`shrink-0 border px-4 py-2.5 text-xs tracking-wide transition-colors ${r.id === selected ? "border-navy bg-navy text-ivory" : "border-navy/20"}`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </figure>

      {/* Room panel */}
      <div className="min-w-0 lg:sticky lg:top-28" aria-live="polite">
        <div className="relative aspect-[4/3] overflow-hidden bg-navy">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={room.id}
              className="absolute inset-0"
              initial={reduce ? { opacity: 0 } : { clipPath: "inset(50% 50% 50% 50%)", scale: 1.2 }}
              animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.4 } }}
              transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            >
              <Image src={room.image.src} alt={room.image.alt} fill loading="eager" sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
          <span className="eyebrow absolute top-3 left-3 bg-ivory/90 px-2.5 py-1 text-[0.55rem] text-navy">Illustrative photo · different home</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={room.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease }} className="pt-6">
            <p className="eyebrow text-champagne-deep">
              {room.kicker} · {room.areaNote}
            </p>
            <h3 className="mt-2 font-serif text-4xl font-light sm:text-5xl">{room.name}</h3>
            <p className="mt-4 max-w-md leading-relaxed text-navy/75">{room.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {room.details.map((d) => (
                <li key={d} className="border border-navy/15 px-3 py-1.5 text-xs">{d}</li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex items-center justify-between border-t border-navy/10 pt-5">
          <button type="button" onClick={() => step(-1)} className="inline-flex min-h-11 items-center gap-2 text-xs tracking-[0.16em] uppercase hover:text-champagne-deep">
            <ArrowLeft aria-hidden="true" size={15} /> Previous space
          </button>
          <span className="text-xs text-navy/50">
            {idx + 1} / {conceptRooms.length}
          </span>
          <button type="button" onClick={() => step(1)} className="inline-flex min-h-11 items-center gap-2 text-xs tracking-[0.16em] uppercase hover:text-champagne-deep">
            Next space <ArrowRight aria-hidden="true" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
