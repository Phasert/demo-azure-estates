import { SectionHeading } from "@/components/ui/section-heading";
import { LazyDayNight, LazyFloorPlan, LazyTour } from "./lazy";
import { residenceName } from "@/features/concept/residence";

export function TourSection() {
  return (
    <section aria-labelledby="tour-heading" className="bg-navy text-ivory">
      <div className="container-lux grid gap-8 pt-24 pb-14 sm:pt-32 lg:grid-cols-[1fr_auto] lg:items-end">
        <SectionHeading
          id="tour-heading"
          light
          eyebrow={`Signature experience · ${residenceName}`}
          title="Experience the property before you arrive."
          intro="Step room by room through a conceptual Caribbean residence. Swipe, use the arrow keys or choose a room, and open the details marked in each space."
        />
        <p className="max-w-xs text-xs leading-relaxed text-ivory/55 lg:text-right">
          A concept, not a listing. Each room is illustrated with photography of a different home, so the spaces are not shown as one real building.
        </p>
      </div>
      <LazyTour />
    </section>
  );
}

export function FloorPlanSection() {
  return (
    <section aria-labelledby="plan-heading" className="py-24 sm:py-32">
      <div className="container-lux">
        <SectionHeading
          id="plan-heading"
          eyebrow="Interactive floor plan"
          title="Read the house like an architect."
          intro="Select any space on the plan to see how the conceptual residence flows from arrival to the water's edge."
        />
        <div className="mt-14">
          <LazyFloorPlan />
        </div>
      </div>
    </section>
  );
}

export function DayNightSection() {
  return (
    <section aria-labelledby="dn-heading" className="bg-mist/50 py-24 sm:py-32">
      <div className="container-lux">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            id="dn-heading"
            eyebrow="From daylight to evening"
            title="Watch the atmosphere change."
            intro="Drag the timeline to move from bright midday to golden hour, sunset and a lamp-lit evening."
          />
          <p className="max-w-xs text-xs leading-relaxed text-navy/55 lg:text-right">
            An original illustration of a conceptual villa. It is drawn rather than photographed, so no unrelated photos are blended together.
          </p>
        </div>
        <div className="mt-14">
          <LazyDayNight />
        </div>
      </div>
    </section>
  );
}
