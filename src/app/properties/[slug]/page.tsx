import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, TriangleAlert } from "lucide-react";
import { getAllProperties, getNeighbourhood, getPropertyBySlug, typeLabel } from "@/features/properties/data";
import { formatNumber, formatPrice } from "@/features/properties/query";
import { Gallery } from "@/components/property/gallery";
import { EnquiryForm } from "@/components/property/enquiry-form";
import { FavouriteButton } from "@/components/property/favourite-button";
import { PropertyCard } from "@/components/property/property-card";
import { DetailHero } from "@/components/property/detail-hero";
import { MaskImage } from "@/components/ui/mask-image";
import { Reveal, RevealText } from "@/components/ui/reveal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProperties().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) return {};
  const description = `Illustrative listing: ${p.tagline} ${p.bedrooms}-bedroom ${typeLabel(p.type).toLowerCase()} in ${p.location}. Fictional demo — not for sale.`;
  return {
    title: `${p.title} (Illustrative)`,
    description,
    openGraph: { title: `${p.title} — Azure Estates demo`, description, images: [{ url: p.images[0].src, alt: p.images[0].alt }] },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) notFound();
  const hood = getNeighbourhood(p.neighbourhood);
  const all = getAllProperties();
  const related = all.filter((x) => x.id !== p.id && (x.type === p.type || x.neighbourhood === p.neighbourhood)).slice(0, 3);
  const i = all.findIndex((x) => x.id === p.id);
  const next = all[(i + 1) % all.length];

  const specs: [string, string][] = [
    ["Type", typeLabel(p.type)],
    ["Bedrooms", String(p.bedrooms)],
    ["Bathrooms", String(p.bathrooms)],
    ["Interior", `${formatNumber(p.sizeSqFt)} sq ft`],
    ...(p.lotSqFt ? ([["Lot", `${formatNumber(p.lotSqFt)} sq ft`]] as [string, string][]) : []),
    ["Completed", String(p.yearCompleted)],
    ["Guide price", formatPrice(p.priceTTD)],
  ];
  const chapters = p.images.slice(1, 3);

  return (
    <main id="main-content" className="pb-24">
      <DetailHero property={p} />

      <div className="container-lux">
        <nav aria-label="Breadcrumb" className="pt-10 text-xs tracking-wide text-navy/60">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-navy">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/properties" className="hover:text-navy">Properties</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-navy">{p.title}</li>
          </ol>
        </nav>
        <div className="mt-6 flex items-start gap-3 border border-champagne bg-champagne/20 px-4 py-3 text-sm">
          <TriangleAlert aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-champagne-deep" />
          <p>
            <strong>Illustrative listing.</strong> {p.title} is a fictional property created for a portfolio demo. It is not available for sale or rent, and its photographs show
            different, unrelated homes.
          </p>
        </div>
      </div>

      {/* Overview + specification sheet */}
      <section aria-labelledby="overview-heading" className="container-lux grid gap-16 py-20 sm:py-28 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="eyebrow text-champagne-deep">Overview · {p.location}</p>
          <RevealText id="overview-heading" text={p.tagline} className="mt-5 max-w-2xl font-serif text-4xl leading-[1.08] font-light sm:text-5xl" />
          <Reveal delay={0.1}>
            {p.description.map((para) => (
              <p key={para.slice(0, 24)} className="mt-6 max-w-xl leading-relaxed text-navy/75 first-of-type:mt-10">{para}</p>
            ))}
            <div className="mt-10">
              <FavouriteButton id={p.id} title={p.title} variant="inline" />
            </div>
          </Reveal>
        </div>
        <Reveal className="lg:pt-10">
          <h2 className="eyebrow text-navy/55">Specification</h2>
          <dl className="mt-4">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-navy/10 py-4">
                <dt className="text-sm text-navy/60">{k}</dt>
                <dd className="font-serif text-2xl">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-navy/50">All figures are fictional demonstration data.</p>
        </Reveal>
      </section>

      {/* Visual chapters from this listing's own illustrative images */}
      {chapters.length > 0 && (
        <section aria-label="Visual highlights" className="container-lux grid gap-6 sm:grid-cols-12">
          {chapters.map((img, n) => (
            <figure key={img.src} className={n === 0 ? "sm:col-span-7" : "sm:col-span-5 sm:mt-40"}>
              <MaskImage src={img.src} alt={img.alt} sizes="(min-width: 640px) 55vw, 100vw" className={n === 0 ? "aspect-[4/5]" : "aspect-[3/4]"} from={n === 0 ? "left" : "right"} parallax />
              <figcaption className="mt-3 flex items-center gap-3 text-xs tracking-[0.16em] text-navy/60 uppercase">
                <span className="font-serif text-base tracking-normal text-champagne-deep">0{n + 1}</span> {img.caption}
              </figcaption>
            </figure>
          ))}
        </section>
      )}

      {/* Gallery */}
      <section aria-labelledby="gallery-heading" className="container-lux mt-28 sm:mt-36">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="gallery-heading" className="font-serif text-4xl font-light sm:text-5xl">The gallery</h2>
          <p className="max-w-sm text-xs text-navy/55">Illustrative photography of different homes, used to suggest the character of this fictional listing.</p>
        </div>
        <Gallery images={p.images} title={p.title} />
      </section>

      {/* Amenities */}
      <section aria-labelledby="amenities-heading" className="mt-28 bg-navy py-24 text-ivory sm:mt-36">
        <div className="container-lux">
          <p className="eyebrow text-champagne">Amenities</p>
          <RevealText id="amenities-heading" text="Everything considered." className="mt-4 font-serif text-4xl font-light sm:text-6xl" />
          <ol className="mt-14 grid gap-px bg-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
            {p.amenities.map((a, n) => (
              <li key={a} className="bg-navy p-6">
                <Reveal delay={(n % 4) * 0.06}>
                  <span className="font-serif text-3xl text-champagne">{String(n + 1).padStart(2, "0")}</span>
                  <p className="mt-6 text-lg">{a}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Lifestyle / neighbourhood */}
      {hood && (
        <section aria-labelledby="lifestyle-heading" className="container-lux grid gap-12 py-24 sm:py-32 lg:grid-cols-2 lg:items-center">
          <MaskImage src={hood.image.src} alt={hood.image.alt} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[5/4]" from="left" parallax />
          <div>
            <p className="eyebrow text-champagne-deep">The lifestyle · {hood.island}</p>
            <RevealText id="lifestyle-heading" text={`Life in ${hood.name}`} className="mt-4 font-serif text-4xl font-light sm:text-6xl" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg leading-relaxed text-navy/75">{hood.description}</p>
              <ul className="mt-6 space-y-2">
                {hood.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-sm"><span className="h-px w-6 bg-champagne-deep" />{h}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-navy/50">Neighbourhood names and descriptions are fictionalised.</p>
              <Link href={`/neighbourhoods#${hood.slug}`} className="mt-6 inline-block text-xs tracking-[0.18em] uppercase underline underline-offset-4">Explore {hood.name}</Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Interactive feature */}
      <section className="container-lux">
        <Link href="/experience" className="group relative flex flex-col justify-between gap-6 overflow-hidden border border-navy/15 p-8 transition-colors hover:border-navy sm:flex-row sm:items-center sm:p-12">
          <span className="absolute inset-0 origin-left scale-x-0 bg-navy transition-transform duration-700 ease-lux group-hover:scale-x-100" />
          <span className="relative transition-colors duration-500 group-hover:text-ivory">
            <span className="eyebrow text-champagne-deep group-hover:text-champagne">Interactive</span>
            <span className="mt-2 block font-serif text-3xl sm:text-4xl">Walk through a conceptual residence</span>
            <span className="mt-2 block max-w-lg text-sm opacity-70">Room-by-room tour, interactive floor plan and day-to-night scene. A separate concept home, not {p.title}.</span>
          </span>
          <ArrowRight aria-hidden="true" className="relative shrink-0 transition-all duration-500 group-hover:translate-x-2 group-hover:text-champagne" />
        </Link>
      </section>

      {/* Enquiry */}
      <section aria-labelledby="enquire-heading" className="container-lux grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow text-champagne-deep">Private viewing</p>
          <h2 id="enquire-heading" className="mt-4 font-serif text-4xl font-light sm:text-5xl">Enquire about {p.title}</h2>
          <p className="mt-4 max-w-sm text-sm text-navy/60">Demo form — it validates and confirms on-screen, but nothing is sent.</p>
        </div>
        <EnquiryForm propertyTitle={p.title} />
      </section>

      {/* Related + next */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="container-lux">
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-navy/10 pt-16">
            <h2 id="related-heading" className="font-serif text-4xl font-light sm:text-5xl">You may also consider</h2>
            <Link href="/properties" className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase"><ArrowLeft aria-hidden="true" size={14} /> All properties</Link>
          </div>
          <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, n) => (
              <li key={r.id} className={n === 1 ? "lg:mt-16" : ""}>
                <PropertyCard property={r} index={n} variant={n === 1 ? "landscape" : "portrait"} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="container-lux mt-24">
        <Link href={`/properties/${next.slug}`} className="group block border-t border-navy/15 pt-10">
          <span className="eyebrow text-navy/55">Next residence</span>
          <span className="mt-3 flex items-center justify-between gap-6 font-serif text-5xl font-light transition-colors group-hover:text-champagne-deep sm:text-7xl">
            {next.title}
            <ArrowRight aria-hidden="true" size={40} strokeWidth={1} className="shrink-0 transition-transform duration-500 group-hover:translate-x-3" />
          </span>
        </Link>
      </section>
    </main>
  );
}
