import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page/page-intro";
import { MaskImage } from "@/components/ui/mask-image";
import { Reveal, RevealText } from "@/components/ui/reveal";
import { getPropertiesInNeighbourhood, neighbourhoods } from "@/features/properties/data";
import { formatPrice } from "@/features/properties/query";
import { DestinationExplorer } from "@/components/neighbourhoods/destination-explorer";

export const metadata: Metadata = {
  title: "Neighbourhoods",
  description: "Explore the Trinidad and Tobago neighbourhoods featured in the fictional Azure Estates portfolio demo.",
};

export default function NeighbourhoodsPage() {
  return (
    <main id="main-content">
      <PageIntro eyebrow="Neighbourhoods" title="Know the place before you know the house." image="/images/overwater-pavilion.webp" intro="A guide to the coastlines, hillsides and villages that frame our illustrative collection." />
      <section aria-labelledby="guide-heading" className="container-lux py-20 sm:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-champagne-deep">Destination guide</p>
            <RevealText id="guide-heading" text="Choose your shoreline." className="mt-4 font-serif text-4xl font-light sm:text-6xl" />
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-navy/55">
            Neighbourhood names, descriptions and listings are fictionalised for this demo. Each is inspired by a real area of Trinidad or Tobago.
          </p>
        </div>
        <DestinationExplorer destinations={neighbourhoods.map((n) => ({ ...n, homes: getPropertiesInNeighbourhood(n.slug) }))} />
      </section>
      <div className="container-lux divide-y divide-navy/10 py-12">
        {neighbourhoods.map((n, i) => {
          const homes = getPropertiesInNeighbourhood(n.slug);
          return (
            <section key={n.slug} id={n.slug} aria-labelledby={`${n.slug}-h`} className="grid scroll-mt-28 gap-12 py-20 lg:grid-cols-2 lg:items-center">
              <div className={i % 2 ? "lg:order-2" : ""}>
                <MaskImage src={n.image.src} alt={n.image.alt} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[5/4]" from={i % 2 ? "right" : "left"} parallax />
              </div>
              <div>
                <p className="eyebrow text-champagne-deep">{String(i + 1).padStart(2, "0")} · {n.island}</p>
                <RevealText id={`${n.slug}-h`} text={n.name} className="mt-4 font-serif text-5xl font-light sm:text-6xl" />
                <Reveal delay={0.1}>
                  <p className="mt-6 max-w-lg leading-relaxed text-navy/75">{n.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {n.highlights.map((h) => <li key={h} className="border border-navy/15 px-3 py-1.5 text-xs">{h}</li>)}
                  </ul>
                  {homes.length > 0 && (
                    <div className="mt-8">
                      <p className="eyebrow text-[0.6rem] text-navy/55">Illustrative homes here</p>
                      <ul className="mt-3">
                        {homes.map((h) => (
                          <li key={h.id}>
                            <Link href={`/properties/${h.slug}`} className="group flex items-baseline justify-between gap-4 border-b border-navy/10 py-3">
                              <span className="font-serif text-xl transition-colors group-hover:text-champagne-deep">{h.title}</span>
                              <span className="text-sm text-navy/60">{formatPrice(h.priceTTD)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
