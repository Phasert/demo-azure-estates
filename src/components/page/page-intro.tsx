import Image from "next/image";
import { RevealText } from "@/components/ui/reveal";

/** Editorial page header used on interior pages. */
export function PageIntro({ eyebrow, title, intro, image, imageAlt = "" }: { eyebrow: string; title: string; intro?: string; image?: string; imageAlt?: string }) {
  if (image) {
    return (
      <header className="relative isolate -mt-19 flex min-h-[70svh] items-end overflow-hidden bg-navy pt-40 pb-16 text-ivory">
        <Image src={image} alt={imageAlt} fill preload sizes="100vw" className="-z-10 animate-[kenburns_14s_ease-out_forwards] object-cover opacity-70" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-navy via-navy/30 to-navy/50" />
        <div className="container-lux">
          <p className="eyebrow text-champagne">{eyebrow}</p>
          <RevealText as="h1" immediate delay={0.3} text={title} className="mt-5 max-w-4xl font-serif text-5xl leading-[1] font-light text-balance sm:text-7xl" />
          {intro && <p className="mt-6 max-w-xl text-ivory/80">{intro}</p>}
        </div>
      </header>
    );
  }
  return (
    <header className="container-lux pt-20 pb-12 sm:pt-28">
      <p className="eyebrow text-champagne-deep">{eyebrow}</p>
      <RevealText as="h1" immediate delay={0.3} text={title} className="mt-5 max-w-4xl font-serif text-5xl leading-[1] font-light text-balance sm:text-7xl" />
      {intro && <p className="mt-6 max-w-xl text-navy/70">{intro}</p>}
    </header>
  );
}
