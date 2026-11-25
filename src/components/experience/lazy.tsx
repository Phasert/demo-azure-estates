"use client";

import dynamic from "next/dynamic";
import { ExperienceBoundary } from "./error-boundary";

function Skeleton({ className, label, dark }: { className: string; label: string; dark?: boolean }) {
  return (
    <div role="status" className={`flex items-center justify-center ${dark ? "bg-navy text-ivory/60" : "bg-mist/60 text-navy/50"} ${className}`}>
      <span className="eyebrow animate-pulse">Loading {label}…</span>
    </div>
  );
}

// Heavy interactive scenes are split into their own chunks and loaded on demand.
const Tour = dynamic(() => import("./property-tour").then((m) => m.PropertyTour), {
  ssr: false,
  loading: () => <Skeleton dark className="h-[78svh] min-h-[34rem] sm:h-[88svh]" label="conceptual tour" />,
});
const Plan = dynamic(() => import("./floor-plan").then((m) => m.FloorPlan), {
  ssr: false,
  loading: () => <Skeleton className="aspect-[4/3]" label="floor plan" />,
});
const Atmosphere = dynamic(() => import("./day-night").then((m) => m.DayNight), {
  ssr: false,
  loading: () => <Skeleton className="aspect-[15/8]" label="day-to-night scene" />,
});

export const LazyTour = () => (
  <ExperienceBoundary name="conceptual tour">
    <Tour />
  </ExperienceBoundary>
);
export const LazyFloorPlan = () => (
  <ExperienceBoundary name="floor plan">
    <Plan />
  </ExperienceBoundary>
);
export const LazyDayNight = () => (
  <ExperienceBoundary name="day-to-night scene">
    <Atmosphere />
  </ExperienceBoundary>
);
