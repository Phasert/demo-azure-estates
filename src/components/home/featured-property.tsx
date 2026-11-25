import { MapPin } from "lucide-react";
import { featuredProperty } from "@/features/properties/data";

export function FeaturedProperty() {
  const { name, location, description, bedrooms, highlights } = featuredProperty;

  return (
    <section id="collection" aria-labelledby="collection-heading" className="px-6 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <h2 id="collection-heading" className="font-serif text-4xl sm:text-5xl">The collection</h2>
        <article className="border-t border-ink/25 pt-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-lagoon">
            <MapPin aria-hidden="true" size={17} /> {location}
          </p>
          <h3 className="mt-3 font-serif text-3xl sm:text-4xl">{name}</h3>
          <p className="mt-4 max-w-prose leading-relaxed">{description}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-lagoon">
            <li>{bedrooms} bedrooms</li>
            {highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
        </article>
      </div>
    </section>
  );
}
