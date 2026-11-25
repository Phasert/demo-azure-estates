import { RevealText } from "./reveal";

export function SectionHeading({ eyebrow, title, intro, light = false, id }: { eyebrow: string; title: string; intro?: string; light?: boolean; id?: string }) {
  return (
    <div className="max-w-3xl">
      <p className={`eyebrow ${light ? "text-champagne" : "text-champagne-deep"}`}>{eyebrow}</p>
      <RevealText id={id} text={title} className="mt-5 font-serif text-4xl leading-[1.05] font-light text-balance sm:text-5xl lg:text-6xl" />
      {intro && <p className={`mt-6 max-w-xl leading-relaxed ${light ? "text-ivory/75" : "text-navy/70"}`}>{intro}</p>}
    </div>
  );
}
