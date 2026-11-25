"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Info, Plus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { residenceName, tourRooms, type ConceptRoom } from "@/features/concept/residence";

const ease = [0.22, 1, 0.36, 1] as const;
const camera = [0.65, 0, 0.35, 1] as const;

/**
 * Image-based conceptual walkthrough. Each room "opens" through a doorway-
 * shaped mask while the camera pushes forward; the outgoing room dissolves
 * forward past the viewer. Not a 360° tour, and photos come from different homes.
 */
export function PropertyTour() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [hotspot, setHotspot] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(stageRef, { amount: 0.3 });
  const reduce = !!useReducedMotion();
  const room = tourRooms[index];

  const go = useCallback(
    (next: number) => {
      const n = (next + tourRooms.length) % tourRooms.length;
      if (n === index) return;
      setDir(next > index ? 1 : -1);
      setIndex(n);
      setHotspot(null);
    },
    [index],
  );

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tourRooms.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = (map[e.key] + tourRooms.length) % tourRooms.length;
    go(n);
    tabsRef.current[n]?.focus();
  };

  useEffect(() => {
    if (hotspot === null) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setHotspot(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotspot]);

  return (
    <div className="relative bg-navy text-ivory">
      <div
        ref={stageRef}
        className="relative h-[78svh] min-h-[34rem] overflow-hidden sm:h-[88svh]"
        role="region"
        aria-roledescription="room viewer"
        aria-label={`${residenceName} conceptual tour — ${room.name}`}
      >
        {/* Scene */}
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={room.id}
            custom={dir}
            className="absolute inset-0"
            variants={{
              enter: () => (reduce ? { opacity: 0 } : { clipPath: "inset(28% 36% 22% 36%)", scale: 1.35, opacity: 1 }),
              center: { clipPath: "inset(0% 0% 0% 0%)", scale: 1, opacity: 1 },
              exit: () => (reduce ? { opacity: 0 } : { scale: 1.18, opacity: 0, filter: "blur(6px)" }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0.3 : 1.5, ease: camera }}
            style={{ zIndex: 1 }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) go(index + 1);
              else if (info.offset.x > 70) go(index - 1);
            }}
          >
            <motion.div
              className="absolute inset-0"
              // Slow continuous camera push while the room is on screen.
              animate={reduce || !inView ? { scale: 1 } : { scale: 1.08, x: dir * -12 }}
              transition={{ duration: 14, ease: "linear" }}
            >
              <Image src={room.image.src} alt={room.image.alt} fill loading="eager" sizes="100vw" className="object-cover" draggable={false} />
            </motion.div>
            <div className="absolute inset-0 bg-linear-to-t from-navy/90 via-navy/15 to-navy/40" />
          </motion.div>
        </AnimatePresence>

        {/* Doorway frame lines — drawn on each transition */}
        {!reduce && (
          <svg key={`frame-${room.id}`} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.rect
              x="36"
              y="28"
              width="28"
              height="50"
              fill="none"
              stroke="#D7C3A3"
              strokeWidth="0.15"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: 0 }}
              transition={{ pathLength: { duration: 0.7, ease }, opacity: { delay: 0.8, duration: 0.6 } }}
            />
          </svg>
        )}

        {/* Hotspots */}
        <div className="absolute inset-0 z-[3]">
          <AnimatePresence>
            {room.hotspots.map((h, i) => (
              <motion.div
                key={`${room.id}-${i}`}
                className="absolute"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: reduce ? 0 : 1.3 + i * 0.15, duration: 0.5, ease }}
              >
                <button
                  type="button"
                  onClick={() => setHotspot(hotspot === i ? null : i)}
                  aria-expanded={hotspot === i}
                  aria-label={`Detail: ${h.label}`}
                  className="group relative -translate-x-1/2 -translate-y-1/2 p-2"
                >
                  {!reduce && <span className="absolute inset-2 animate-ping rounded-full bg-champagne/40 [animation-duration:2.4s]" />}
                  <span className="relative flex size-8 items-center justify-center rounded-full border border-champagne bg-navy/50 text-champagne backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Plus aria-hidden="true" size={14} className={`transition-transform duration-300 ${hotspot === i ? "rotate-45" : ""}`} />
                  </span>
                </button>
                <AnimatePresence>
                  {hotspot === i && (
                    <motion.div
                      role="note"
                      initial={{ opacity: 0, y: 8, clipPath: "inset(0 0 100% 0)" }}
                      animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.45, ease }}
                      className={`absolute top-6 w-56 bg-ivory p-4 text-navy shadow-xl ${h.x > 60 ? "right-0" : "left-0"}`}
                    >
                      <p className="font-serif text-lg leading-tight">{h.label}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-navy/70">{h.detail}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Copy */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] pb-28 sm:pb-36">
          <div className="container-lux">
            <AnimatePresence mode="wait">
              <motion.div key={room.id} className="max-w-xl" exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }} aria-live="polite">
                <motion.p
                  className="eyebrow flex items-center gap-3 text-champagne"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduce ? 0 : 0.7 }}
                >
                  <span className="font-serif text-base tracking-normal normal-case">{String(index + 1).padStart(2, "0")}</span>
                  <span className="h-px w-10 bg-champagne/60" />
                  {room.kicker}
                </motion.p>
                <h3 className="mt-3 overflow-hidden font-serif text-5xl leading-none font-light sm:text-7xl">
                  <motion.span
                    className="block"
                    initial={reduce ? { opacity: 0 } : { y: "105%" }}
                    animate={reduce ? { opacity: 1 } : { y: 0 }}
                    transition={{ duration: 1, ease, delay: reduce ? 0 : 0.8 }}
                  >
                    {room.name}
                  </motion.span>
                </h3>
                <motion.p
                  className="mt-4 hidden max-w-md text-sm leading-relaxed text-ivory/80 sm:block sm:text-base"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 1.05, duration: 0.7, ease }}
                >
                  {room.description}
                </motion.p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {room.details.map((d, i) => (
                    <motion.li
                      key={d}
                      className="border border-ivory/25 bg-navy/30 px-3 py-1.5 text-xs backdrop-blur-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduce ? 0 : 1.2 + i * 0.08, duration: 0.5, ease }}
                    >
                      {d}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mini plan locator */}
        <MiniPlan active={room} />

        <p className="absolute top-4 left-4 z-[5] flex max-w-[calc(100%-2rem)] items-center gap-2 bg-navy/70 px-3 py-2 text-[0.68rem] leading-snug backdrop-blur sm:top-6 sm:left-6">
          <Info aria-hidden="true" size={13} className="shrink-0 text-champagne" />
          Conceptual tour · each room illustrated with photography of a different home · not a 360° tour
        </p>
      </div>

      {/* Room navigation */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-ivory/15 bg-navy/70 backdrop-blur-md">
        <div className="container-lux flex items-stretch gap-2">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous room" className="flex w-11 shrink-0 items-center justify-center hover:text-champagne">
            <ArrowLeft aria-hidden="true" size={18} />
          </button>
          <div role="tablist" aria-label="Rooms" className="flex min-w-0 flex-1 snap-x gap-1 overflow-x-auto [scrollbar-width:none]">
            {tourRooms.map((r, i) => (
              <button
                key={r.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                aria-selected={i === index}
                tabIndex={i === index ? 0 : -1}
                onClick={() => go(i)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`relative shrink-0 snap-start px-3 py-5 text-left text-[0.7rem] tracking-[0.14em] uppercase transition-colors sm:px-4 ${
                  i === index ? "text-ivory" : "text-ivory/45 hover:text-ivory/80"
                }`}
              >
                <span className="mr-2 font-serif text-sm tracking-normal text-champagne/80">{String(i + 1).padStart(2, "0")}</span>
                {r.name}
                {i === index && <motion.span layoutId="tour-tab" className="absolute inset-x-3 top-0 h-0.5 bg-champagne" transition={{ duration: 0.6, ease }} />}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next room" className="flex w-11 shrink-0 items-center justify-center hover:text-champagne">
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>
      {hotspot !== null && (
        <button type="button" className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 focus:z-20 focus:bg-ivory focus:p-2 focus:text-navy" onClick={() => setHotspot(null)}>
          <X aria-hidden="true" size={14} /> Close detail
        </button>
      )}
    </div>
  );
}

function MiniPlan({ active }: { active: ConceptRoom }) {
  return (
    <div aria-hidden="true" className="absolute top-16 right-4 z-[5] hidden w-40 bg-navy/60 p-3 backdrop-blur sm:top-6 sm:right-6 md:block">
      <p className="eyebrow mb-2 text-[0.55rem] text-champagne">You are here</p>
      <svg viewBox="100 20 800 620" className="w-full">
        {tourRooms.map((r) => (
          <motion.rect
            key={r.id}
            x={r.plan.x}
            y={r.plan.y}
            width={r.plan.w}
            height={r.plan.h}
            stroke="#FAF9F6"
            strokeOpacity={0.5}
            strokeWidth={4}
            animate={{ fill: r.id === active.id ? "#D7C3A3" : "rgba(250,249,246,0.04)" }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </svg>
    </div>
  );
}
