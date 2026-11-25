"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

/*
 * Original illustrated architectural scene (not a photograph). Matched
 * photographs of one building at different times were not available, so the
 * atmosphere is rendered procedurally from four colour keyframes.
 */

const phases = [
  { label: "Daylight", time: "1:00 pm" },
  { label: "Golden hour", time: "5:15 pm" },
  { label: "Sunset", time: "6:20 pm" },
  { label: "Evening", time: "8:00 pm" },
] as const;

type Key = keyof typeof palette;
const palette = {
  skyTop: ["#5fa8d3", "#86a9c8", "#3d4f7a", "#0b1a2e"],
  skyMid: ["#a9d4ea", "#f1c89a", "#e0866a", "#1b2c4a"],
  horizon: ["#e6f3f8", "#f7dca8", "#f6b56c", "#34405e"],
  seaTop: ["#3b98bd", "#7f97a3", "#6b6a88", "#13253f"],
  seaBottom: ["#1c6f93", "#3f6880", "#2a3655", "#081627"],
  sun: ["#fffbe9", "#ffd690", "#ff9a5c", "#ff9a5c"],
  wall: ["#f6f4ee", "#f4dfc4", "#dcae95", "#22324c"],
  wallShade: ["#d6dadd", "#d9b997", "#a87d76", "#16233a"],
  slab: ["#8b6f53", "#8a6447", "#6e4a3e", "#2b2420"],
  glass: ["#a9c9da", "#e4cfaa", "#e9a57c", "#d99a55"],
  pool: ["#56c6dc", "#79b9c4", "#6d93a8", "#2aa9bd"],
  deck: ["#e7e2d6", "#e9d3b5", "#c9a08a", "#2a3346"],
  land: ["#4f7b67", "#6b7660", "#4f3f52", "#0c1726"],
  palm: ["#24453a", "#2f3a2b", "#2a2232", "#050c17"],
} satisfies Record<string, string[]>;

const num = {
  sunY: [90, 300, 412, 520],
  sunR: [34, 38, 44, 44],
  glow: [0, 0.12, 0.45, 1],
  stars: [0, 0, 0.1, 1],
  moon: [0, 0, 0, 1],
  haze: [0, 0.35, 0.55, 0],
};

const hexToRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function lerpColor(stops: string[], t: number) {
  const i = Math.min(Math.floor(t), stops.length - 2);
  const f = t - i;
  const a = hexToRgb(stops[i]);
  const b = hexToRgb(stops[i + 1]);
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(",")})`;
}
function lerpNum(stops: number[], t: number) {
  const i = Math.min(Math.floor(t), stops.length - 2);
  return stops[i] + (stops[i + 1] - stops[i]) * (t - i);
}

// Deterministic star field.
const stars = Array.from({ length: 70 }, (_, i) => ({ x: (i * 197.3) % 1200, y: (i * 89.7) % 380, r: ((i * 7) % 3) * 0.5 + 0.6 }));

export function DayNight() {
  const [t, setT] = useState(0); // 0..3
  const tRef = useRef(0);
  useEffect(() => {
    tRef.current = t;
  }, [t]);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = !!useReducedMotion();
  const uid = useId();

  // Autoplay advances time smoothly; pauses offscreen.
  useEffect(() => {
    if (!playing || !inView) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const next = Math.min(3, tRef.current + dt * 0.35);
      tRef.current = next;
      setT(next);
      if (next >= 3) setPlaying(false);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, inView]);

  const c = (k: Key) => lerpColor(palette[k], t);
  const n = (k: keyof typeof num) => lerpNum(num[k], t);
  const phase = Math.min(3, Math.round(t));
  const sunY = n("sunY");
  const glow = n("glow");

  const jump = (p: number) => {
    setPlaying(false);
    if (reduce) return setT(p);
    const from = t;
    let start: number | null = null;
    const anim = (now: number) => {
      start ??= now;
      const k = Math.min(1, (now - start) / 900);
      const e = 1 - Math.pow(1 - k, 3);
      setT(from + (p - from) * e);
      if (k < 1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  };

  return (
    <div ref={ref}>
      <figure className="relative overflow-hidden bg-navy">
        <svg viewBox="0 0 1200 640" className="block h-auto w-full" role="img" aria-label={`Illustration of a modernist villa at ${phases[phase].label.toLowerCase()}`}>
          <defs>
            <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={c("skyTop")} />
              <stop offset="0.6" stopColor={c("skyMid")} />
              <stop offset="1" stopColor={c("horizon")} />
            </linearGradient>
            <linearGradient id={`${uid}-sea`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={c("seaTop")} />
              <stop offset="1" stopColor={c("seaBottom")} />
            </linearGradient>
            <radialGradient id={`${uid}-sun`}>
              <stop offset="0" stopColor={c("sun")} stopOpacity="0.9" />
              <stop offset="1" stopColor={c("sun")} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${uid}-lamp`}>
              <stop offset="0" stopColor="#ffd796" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ffd796" stopOpacity="0" />
            </radialGradient>
            <clipPath id={`${uid}-skyclip`}>
              <rect width="1200" height="420" />
            </clipPath>
          </defs>

          {/* Sky, stars, moon, sun */}
          <rect width="1200" height="420" fill={`url(#${uid}-sky)`} />
          <g opacity={n("stars")}>
            {stars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.4 + (i % 5) * 0.12} />
            ))}
          </g>
          <g opacity={n("moon")}>
            <circle cx="260" cy="110" r="22" fill="#f4ecd8" />
            <circle cx="270" cy="104" r="20" fill={c("skyTop")} />
          </g>
          <g clipPath={`url(#${uid}-skyclip)`}>
            <circle cx="900" cy={sunY} r={n("sunR") * 4} fill={`url(#${uid}-sun)`} opacity="0.7" />
            <circle cx="900" cy={sunY} r={n("sunR")} fill={c("sun")} />
          </g>
          <rect y="300" width="1200" height="120" fill={c("horizon")} opacity={n("haze") * 0.4} />

          {/* Sea + headland + sun path */}
          <rect y="420" width="1200" height="220" fill={`url(#${uid}-sea)`} />
          <path d="M940 420 Q1000 380 1060 396 T1200 384 V420 Z" fill={c("land")} opacity="0.85" />
          <g opacity={sunY < 430 ? 0.6 * (1 - n("stars")) : 0}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={900 - 60 + i * 6} y={430 + i * 14} width={120 - i * 12} height="3" rx="1.5" fill={c("sun")} opacity={0.8 - i * 0.12} />
            ))}
          </g>

          {/* Villa */}
          <g>
            {/* lower volume */}
            <rect x="180" y="330" width="600" height="170" fill={c("wall")} />
            <rect x="180" y="330" width="40" height="170" fill={c("wallShade")} />
            <rect x="240" y="360" width="500" height="120" fill={c("glass")} />
            {/* upper cantilevered volume */}
            <rect x="320" y="222" width="640" height="12" fill={c("slab")} />
            <rect x="340" y="234" width="580" height="96" fill={c("wall")} />
            <rect x="880" y="234" width="40" height="96" fill={c("wallShade")} />
            <rect x="370" y="250" width="490" height="66" fill={c("glass")} />
            <rect x="160" y="320" width="640" height="10" fill={c("slab")} />
            {/* mullions */}
            <g stroke={c("slab")} strokeWidth="3">
              {[340, 440, 540, 640].map((x) => <line key={x} x1={x} y1="360" x2={x} y2="480" />)}
              {[470, 570, 670, 770].map((x) => <line key={x} x1={x} y1="250" x2={x} y2="316" />)}
            </g>
            {/* interior lamps + window glow */}
            <g opacity={glow}>
              <rect x="240" y="360" width="500" height="120" fill="#ffc874" opacity="0.2" />
              <rect x="370" y="250" width="490" height="66" fill="#ffc874" opacity="0.3" />
              {[290, 490, 690].map((x) => <circle key={x} cx={x} cy="392" r="40" fill={`url(#${uid}-lamp)`} />)}
              {[420, 620, 820].map((x) => <circle key={x} cx={x} cy="278" r="30" fill={`url(#${uid}-lamp)`} />)}
              {/* soffit downlights */}
              {[380, 480, 580, 680, 780, 880].map((x) => <circle key={x} cx={x} cy="238" r="2.5" fill="#fff3d6" />)}
            </g>
            {/* glass reflection sweep (daytime) */}
            <path d="M260 480 L330 360 H360 L290 480 Z M560 480 L630 360 H645 L575 480 Z" fill="#fff" opacity={0.25 * (1 - glow)} />
          </g>

          {/* Deck + infinity pool */}
          <rect x="80" y="500" width="1040" height="14" fill={c("deck")} />
          <rect x="120" y="514" width="960" height="46" fill={c("pool")} />
          <rect x="120" y="514" width="960" height="46" fill="#7ff3ff" opacity={glow * 0.2} />
          <path d="M140 530 Q200 524 260 530 T380 530 T500 530 T620 530 T740 530 T860 530 T980 530" stroke="#fff" strokeOpacity={0.35 - glow * 0.15} fill="none" strokeWidth="1.5" />
          <rect y="560" width="1200" height="80" fill={c("deck")} />
          <rect y="560" width="1200" height="80" fill="#000" opacity={0.08 + glow * 0.25} />

          {/* Palms (foreground layer) */}
          <g fill={c("palm")}>
            <path d="M80 560 C86 470 92 400 108 330 L114 332 C100 400 96 470 92 560 Z" />
            <path d="M110 330 C60 300 20 310 0 340 C40 318 80 318 110 334 Z M112 330 C150 290 200 290 230 310 C190 300 150 310 114 336 Z M110 330 C100 280 70 250 40 246 C76 266 96 290 106 334 Z M112 332 C140 300 150 260 146 230 C134 266 124 300 108 334 Z M110 332 C80 340 50 370 40 400 C70 370 90 350 112 338 Z" />
            <path d="M1120 560 C1112 480 1104 420 1088 360 L1082 362 C1096 420 1104 480 1108 560 Z" />
            <path d="M1086 360 C1130 330 1170 336 1200 360 C1160 344 1120 346 1088 366 Z M1084 360 C1050 326 1010 330 980 350 C1020 338 1056 344 1082 366 Z M1086 360 C1092 316 1118 290 1146 288 C1114 306 1098 330 1090 366 Z M1084 362 C1110 376 1130 404 1136 430 C1112 402 1096 384 1082 368 Z" />
          </g>
          {/* Garden uplights at evening */}
          <g opacity={glow}>
            <ellipse cx="96" cy="556" rx="30" ry="8" fill="#ffd796" opacity="0.5" />
            <ellipse cx="1112" cy="556" rx="30" ry="8" fill="#ffd796" opacity="0.5" />
          </g>
        </svg>

        <div className="pointer-events-none absolute top-4 left-4 flex flex-col gap-1 text-ivory sm:top-6 sm:left-6">
          <p className="font-serif text-3xl drop-shadow sm:text-5xl" aria-live="polite">{phases[phase].label}</p>
          <p className="text-xs tracking-[0.2em] uppercase opacity-80 drop-shadow">{phases[phase].time}</p>
        </div>
        <p className="absolute right-3 bottom-3 bg-navy/70 px-2.5 py-1 text-[0.6rem] tracking-wide text-ivory/85 sm:right-5 sm:bottom-5">Original illustration · conceptual villa</p>
      </figure>

      {/* Timeline controls */}
      <div className="mt-6 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <button
          type="button"
          onClick={() => {
            if (t >= 3) setT(0);
            setPlaying((p) => !p);
          }}
          aria-pressed={playing}
          className="inline-flex min-h-11 items-center gap-3 border border-navy px-5 text-xs tracking-[0.18em] uppercase transition-colors hover:bg-navy hover:text-ivory"
        >
          {playing ? <Pause aria-hidden="true" size={14} /> : <Play aria-hidden="true" size={14} />}
          {playing ? "Pause" : "Play timeline"}
        </button>
        <div>
          <label htmlFor={`${uid}-range`} className="sr-only">Time of day</label>
          <input
            id={`${uid}-range`}
            type="range"
            min={0}
            max={300}
            step={1}
            value={Math.round(t * 100)}
            aria-valuetext={`${phases[phase].label}, ${phases[phase].time}`}
            onChange={(e) => {
              setPlaying(false);
              setT(Number(e.target.value) / 100);
            }}
            className="h-11 w-full cursor-pointer accent-[#8a6f45]"
          />
          <div className="grid grid-cols-4" role="group" aria-label="Jump to time of day">
            {phases.map((p, i) => (
              <button
                key={p.label}
                type="button"
                onClick={() => jump(i)}
                aria-pressed={phase === i}
                className={`min-h-11 text-left text-[0.65rem] tracking-[0.14em] uppercase transition-colors sm:text-xs ${i === 3 ? "text-right" : i > 0 ? "text-center" : ""} ${phase === i ? "text-navy" : "text-navy/45 hover:text-navy"}`}
              >
                {p.label}
                {phase === i && <motion.span layoutId="dn-mark" className="mx-auto mt-1 block h-px w-full bg-champagne-deep" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
