"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Pause, Play } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { SearchPanel } from "./search-panel";

/** Featured arrivals. `focus` is the point the camera approaches; `detail` is the architectural crop shown in the lens. */
const scenes = [
  { slug: "coral-house", name: "Coral House", place: "Black Rock Heights, Tobago", src: "/images/hero-villa.webp", alt: "Illustrative white villa with cantilevered terraces above a reflecting pool", focus: "50% 45%", detail: { x: 30, y: 28, label: "Cantilevered timber soffit" } },
  { slug: "villa-solenne", name: "Villa Solenne", place: "Westmoorings by the Sea, Trinidad", src: "/images/white-villa-terrace.webp", alt: "White modernist villa with a pool terrace under a bright sky", focus: "55% 50%", detail: { x: 60, y: 30, label: "Glazed rooftop lounge" } },
  { slug: "the-glass-pavilion", name: "The Glass Pavilion", place: "Maraval Hills, Trinidad", src: "/images/glass-pavilion-pool.webp", alt: "Glass pavilion home opening onto a turquoise pool", focus: "45% 55%", detail: { x: 40, y: 42, label: "Floating flat roof" } },
  { slug: "sea-grape-cottage", name: "Sea Grape Beach House", place: "Castara Bay, Tobago", src: "/images/plantation-house.webp", alt: "Two-storey plantation-style house with a pool and palms", focus: "50% 50%", detail: { x: 50, y: 32, label: "Wraparound verandah" } },
];

const DURATION = 9000;
const SLATS = 7;
const line1 = "Exceptional Properties.";
const line2 = "Extraordinary Living.";
const ease = [0.22, 1, 0.36, 1] as const;
const shutter = [0.76, 0, 0.24, 1] as const;

export function Hero() {
  const [target, setTarget] = useState(0);
  const [shown, setShown] = useState(0);
  const [cycle, setCycle] = useState(0); // bumps on every transition
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = !!useReducedMotion();

  // Pointer depth: background, lens and frame move at different rates.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 50, damping: 20 });
  const sy = useSpring(py, { stiffness: 50, damping: 20 });
  const bgX = useTransform(sx, (v) => v * -14);
  const bgY = useTransform(sy, (v) => v * -10);
  const fgX = useTransform(sx, (v) => v * 28);
  const fgY = useTransform(sy, (v) => v * 20);

  const { scrollY } = useScroll();
  const lift = useTransform(scrollY, [0, 700], [0, 140]);

  const goTo = useCallback(
    (n: number) => {
      if (n === target) return;
      setTarget(n);
      setCycle((c) => c + 1);
      if (reduce) setShown(n);
    },
    [target, reduce],
  );

  // Image swaps mid-shutter, while the slats cover the frame.
  useEffect(() => {
    if (reduce || target === shown) return;
    const t = setTimeout(() => setShown(target), 700);
    return () => clearTimeout(t);
  }, [target, shown, reduce]);

  const running = !paused && !hold && inView && !reduce;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => goTo((target + 1) % scenes.length), DURATION);
    return () => clearTimeout(t);
  }, [running, target, goTo]);

  const scene = scenes[shown];
  const labelScene = scenes[target];

  return (
    <section
      ref={ref}
      aria-label="Featured property arrivals"
      className="relative isolate -mt-19 flex min-h-svh flex-col overflow-hidden bg-navy text-ivory"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      {/* Layer 1 — the property, approached by a slow camera push */}
      <motion.div className="absolute -inset-6 -z-30" style={reduce ? undefined : { x: bgX, y: bgY }}>
        <motion.div className="absolute inset-0" style={reduce ? undefined : { y: lift }}>
          <AnimatePresence initial={false}>
            <motion.div key={shown} className="absolute inset-0" initial={{ opacity: reduce ? 0 : 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduce ? 0.4 : 0.01, delay: reduce ? 0 : 0.2 } }}>
              <motion.div
                className="absolute inset-0"
                style={{ transformOrigin: scene.focus }}
                initial={reduce ? false : { scale: 1.02 }}
                animate={reduce ? undefined : { scale: running || shown === target ? 1.16 : 1.1 }}
                transition={{ duration: DURATION / 1000 + 2, ease: "linear" }}
              >
                <Image src={scene.src} alt={scene.alt} fill preload={shown === 0} loading={shown === 0 ? undefined : "eager"} sizes="100vw" quality={80} className="object-cover" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 -z-20 bg-linear-to-b from-navy/70 via-navy/10 to-navy/85" />
      <div className="absolute inset-0 -z-20 bg-linear-to-r from-navy/60 via-transparent to-transparent" />

      {/* Layer 2 — architectural reveal: vertical shutters close and reopen like louvres */}
      {!reduce && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 flex">
          {Array.from({ length: SLATS }, (_, i) => (
            <div key={i} className="relative h-full flex-1 overflow-hidden">
              <motion.div
                key={`${cycle}-${i}`}
                className="absolute inset-0 bg-navy"
                initial={{ y: cycle === 0 ? "0%" : "101%" }}
                animate={{ y: cycle === 0 ? "-101%" : ["101%", "0%", "0%", "-101%"] }}
                transition={
                  cycle === 0
                    ? { duration: 1.3, ease: shutter, delay: 0.15 + i * 0.06 }
                    : { duration: 1.7, times: [0, 0.38, 0.55, 1], ease: shutter, delay: i * 0.045 }
                }
              />
              {i > 0 && <span className="absolute inset-y-0 left-0 w-px bg-ivory/[0.06]" />}
            </div>
          ))}
        </div>
      )}

      {/* Layer 3 — detail lens: a magnified crop of the same photograph, floating at a different depth */}
      {!reduce && (
        <motion.div aria-hidden="true" className="pointer-events-none absolute top-[22%] right-[7%] hidden w-[18vw] max-w-72 lg:block" style={{ x: fgX, y: fgY }}>
          <AnimatePresence mode="wait">
            <motion.div key={shown} initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(100% 0 0 0)" }} transition={{ duration: 0.9, ease: shutter, delay: 0.5 }}>
              <div className="relative aspect-[3/4] overflow-hidden border border-champagne/50">
                <motion.div className="absolute inset-0" initial={{ scale: 2.6 }} animate={{ scale: 2.3 }} transition={{ duration: 10, ease: "linear" }} style={{ transformOrigin: `${scene.detail.x}% ${scene.detail.y}%` }}>
                  <Image src={scene.src} alt="" fill loading="eager" sizes="300px" className="object-cover" />
                </motion.div>
              </div>
              <p className="mt-3 flex items-center gap-3 text-[0.65rem] tracking-[0.18em] text-ivory/85 uppercase">
                <span className="h-px w-6 bg-champagne" /> {scene.detail.label}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Layer 4 — hairline architectural frame */}
      {!reduce && (
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 size-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <motion.path
            d="M4 18 V96 M96 18 V96 M4 96 H96"
            stroke="#D7C3A3"
            strokeOpacity="0.35"
            strokeWidth="0.1"
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.4, ease, delay: 0.4 }}
          />
        </svg>
      )}

      <div className="container-lux relative flex flex-1 flex-col justify-end pt-36 pb-8 sm:pb-12">
        {/* Property name + location (changes with each arrival) */}
        <div className="min-h-14" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={target} initial="hidden" animate="show" exit="exit" className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="overflow-hidden">
                <motion.span
                  className="block font-serif text-2xl italic sm:text-3xl"
                  variants={{ hidden: { y: "110%" }, show: { y: 0 }, exit: { y: "-110%" } }}
                  transition={{ duration: 0.8, ease, delay: cycle === 0 ? 1.2 : 0.75 }}
                >
                  <Link href={`/properties/${labelScene.slug}`} className="pointer-events-auto hover:text-champagne">
                    {labelScene.name}
                  </Link>
                </motion.span>
              </span>
              <motion.span
                className="eyebrow text-champagne"
                variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 }, exit: { opacity: 0 } }}
                transition={{ duration: 0.6, delay: cycle === 0 ? 1.45 : 0.95 }}
              >
                {labelScene.place} · Illustrative
              </motion.span>
            </motion.div>
          </AnimatePresence>
        </div>

        <h1 className="mt-4 font-serif text-[clamp(2.7rem,8.2vw,8.25rem)] leading-[0.92] font-light tracking-tight" aria-label={`${line1} ${line2}`}>
          {[line1, line2].map((line, li) => (
            <span key={line} aria-hidden="true" className={`block ${li === 1 ? "text-champagne italic sm:pl-[9vw]" : ""}`}>
              {line.split(" ").map((word, wi, words) => {
                const offset = words.slice(0, wi).join(" ").length + (wi ? 1 : 0);
                return (
                  <Fragment key={wi}>
                    <span className="inline-block whitespace-nowrap">
                      {word.split("").map((ch, ci) => (
                        <span key={ci} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                          <motion.span
                            className="inline-block"
                            initial={reduce ? false : { y: "115%", rotate: 7 }}
                            animate={{ y: 0, rotate: 0 }}
                            transition={{ duration: 1.1, ease, delay: 1.5 + li * 0.3 + (offset + ci) * 0.022 }}
                          >
                            {ch}
                          </motion.span>
                        </span>
                      ))}
                    </span>
                    {wi < words.length - 1 && " "}
                  </Fragment>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.div className="mt-10" initial={reduce ? false : { opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" }} animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }} transition={{ duration: 1.1, ease, delay: 2.4 }}>
          <SearchPanel />
        </motion.div>

        {/* Arrival controls */}
        <motion.div
          className="mt-6 flex items-center gap-4"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          onPointerEnter={() => setHold(true)}
          onPointerLeave={() => setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={() => setHold(false)}
        >
          {!reduce && (
            <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play arrivals" : "Pause arrivals"} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-ivory/30 hover:bg-ivory hover:text-navy">
              {paused ? <Play aria-hidden="true" size={14} /> : <Pause aria-hidden="true" size={14} />}
            </button>
          )}
          <div role="group" aria-label="Choose featured property" className="grid flex-1 grid-cols-4 gap-2 sm:gap-4">
            {scenes.map((s, n) => (
              <button key={s.slug} type="button" onClick={() => goTo(n)} aria-pressed={n === target} aria-label={`Arrive at ${s.name}`} className="group py-3 text-left">
                <span className="relative block h-px w-full bg-ivory/25">
                  {n === target && (
                    <motion.span
                      key={`${cycle}-${paused}-${hold}-${inView}`}
                      className="absolute inset-0 origin-left bg-champagne"
                      initial={{ scaleX: running ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: running ? DURATION / 1000 : 0, ease: "linear" }}
                    />
                  )}
                </span>
                <span className={`mt-3 hidden text-[0.65rem] tracking-[0.16em] uppercase transition-colors sm:block ${n === target ? "text-ivory" : "text-ivory/45 group-hover:text-ivory/80"}`}>
                  <span className="mr-2 font-serif text-sm tracking-normal text-champagne">0{n + 1}</span>
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
