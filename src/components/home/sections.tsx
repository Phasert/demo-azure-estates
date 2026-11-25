import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { neighbourhoods, propertyTypes, getAllProperties } from "@/features/properties/data";
import { MaskImage } from "@/components/ui/mask-image";
import { Reveal, RevealText } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { EnquiryForm } from "@/components/property/enquiry-form";

export function Categories() {
  const all = getAllProperties();
  return (
    <section aria-labelledby="categories-heading" className="bg-mist/60 py-24 sm:py-32">
      <div className="container-lux">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionHeading id="categories-heading" eyebrow="Ways to live" title="Four distinct expressions of island life." />
          </div>
        </div>
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {propertyTypes.map((t, i) => (
            <li key={t.value}>
              <Reveal delay={i * 0.1}>
                <Link href={`/properties?type=${t.value}`} className="group relative block aspect-[3/4] overflow-hidden bg-navy text-ivory">
                  <Image src={t.image.src} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover opacity-80 transition-all duration-[1.4s] ease-lux group-hover:scale-110 group-hover:opacity-60" />
                  <div className="absolute inset-0 bg-linear-to-t from-navy/90 via-navy/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="eyebrow text-champagne">{String(i + 1).padStart(2, "0")} — {all.filter((p) => p.type === t.value).length} homes</p>
                    <h3 className="mt-3 font-serif text-3xl">{t.label}</h3>
                    <p className="mt-2 max-h-0 overflow-hidden text-sm text-ivory/80 opacity-0 transition-all duration-700 ease-lux group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100">
                      {t.blurb}
                    </p>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AboutTeaser() {
  return (
    <section aria-labelledby="about-heading" className="bg-navy py-24 text-ivory sm:py-36">
      <div className="container-lux grid gap-16 lg:grid-cols-2 lg:items-center">
        <MaskImage src="/images/white-villa-garden.webp" alt="White villa facade above a garden pool" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[5/4]" from="left" parallax />
        <div>
          <p className="eyebrow text-champagne">About Azure Estates</p>
          <RevealText id="about-heading" text="A quieter, more considered way to find a home." className="mt-5 font-serif text-4xl leading-[1.05] font-light sm:text-6xl" />
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-lg leading-relaxed text-ivory/75">
              Azure Estates is an imagined boutique agency. Its fictional advisors would represent a small number of exceptional homes at a time, pairing local
              knowledge with an editor&apos;s eye for architecture and place.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/55">This brand exists only as a design demonstration.</p>
            <Link href="/about" className="group mt-10 inline-flex items-center gap-3 text-xs tracking-[0.2em] text-champagne uppercase">
              Our philosophy <ArrowRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-1.5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function NeighbourhoodsPreview() {
  return (
    <section aria-labelledby="hoods-heading" className="py-24 sm:py-36">
      <div className="container-lux">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionHeading id="hoods-heading" eyebrow="Featured neighbourhoods" title="Places with a character of their own." />
          </div>
          <Link href="/neighbourhoods" className="text-xs tracking-[0.2em] uppercase underline-offset-8 hover:underline">All neighbourhoods →</Link>
        </div>
        <ul className="mt-16 grid gap-x-6 gap-y-14 md:grid-cols-2">
          {neighbourhoods.map((n, i) => (
            <li key={n.slug} className={i % 2 ? "md:mt-24" : ""}>
              <Link href={`/neighbourhoods#${n.slug}`} className="group block">
                <div className="overflow-hidden">
                  <MaskImage src={n.image.src} alt={n.image.alt} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[16/11] transition-transform duration-[1.4s] ease-lux group-hover:scale-105" />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-3xl">{n.name}</h3>
                  <span className="eyebrow text-champagne-deep">{n.island}</span>
                </div>
                <p className="mt-2 text-navy/70">{n.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function EnquiryCta() {
  return (
    <section aria-labelledby="cta-heading" className="relative isolate overflow-hidden bg-navy py-24 text-ivory sm:py-32">
      <Image src="/images/beach-sunrise.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25" />
      <div className="container-lux grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="eyebrow text-champagne">Private enquiries</p>
          <RevealText id="cta-heading" text="Begin your search with a conversation." className="mt-5 font-serif text-4xl leading-[1.05] font-light sm:text-6xl" />
          <p className="mt-6 max-w-sm text-ivory/70">This demonstration form validates your input and confirms on-screen. No data leaves your browser.</p>
        </div>
        <EnquiryForm tone="dark" />
      </div>
    </section>
  );
}
