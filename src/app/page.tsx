import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { AboutTeaser, Categories, EnquiryCta, NeighbourhoodsPreview } from "@/components/home/sections";
import { DayNightSection, FloorPlanSection, TourSection } from "@/components/experience/sections";
import { PropertyCard } from "@/components/property/property-card";
import { layoutFor } from "@/components/property/card-layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedProperties } from "@/features/properties/data";

export default function Home() {
  const featured = getFeaturedProperties();
  return (
    <main id="main-content">
      <Hero />

      <section aria-labelledby="featured-heading" className="py-24 sm:py-36">
        <div className="container-lux">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              id="featured-heading"
              eyebrow="Featured residences"
              title="A curated collection of imagined homes."
              intro="Each listing is a fictional composition, written and illustrated to show how an exceptional property might be presented."
            />
            <Link href="/properties" className="text-xs tracking-[0.2em] uppercase underline-offset-8 hover:underline">View all properties →</Link>
          </div>
          <ul className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-6 lg:gap-y-20">
            {featured.map((p, i) => {
              const { variant, className } = layoutFor(i);
              return (
                <li key={p.id} className={className}>
                  <PropertyCard property={p} index={i} variant={variant} />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <TourSection />
      <FloorPlanSection />
      <DayNightSection />
      <Categories />
      <NeighbourhoodsPreview />
      <AboutTeaser />
      <EnquiryCta />
    </main>
  );
}
