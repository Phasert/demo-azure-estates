import type { Metadata } from "next";
import { PageIntro } from "@/components/page/page-intro";
import { MaskImage } from "@/components/ui/mask-image";
import { Reveal, RevealText } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "About",
  description: "The philosophy behind Azure Estates, a fictional luxury Caribbean real estate agency created as a portfolio demonstration.",
};

const principles = [
  { n: "01", t: "Fewer, finer homes", d: "An imagined portfolio kept deliberately small, so every residence receives an editorial level of care." },
  { n: "02", t: "Architecture first", d: "We present homes through their design, materials and relationship to the landscape — not just their square footage." },
  { n: "03", t: "Local by nature", d: "Our fictional advisors would know each coastline, valley and village as residents, not visitors." },
  { n: "04", t: "Discretion", d: "Private viewings, considered conversations and an unhurried approach to one of life's great decisions." },
];

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageIntro eyebrow="About Azure Estates" title="The art of the considered move." image="/images/white-villa-terrace.webp" intro="An imagined boutique agency, designed to show how Caribbean real estate could be presented with the care of an architecture journal." />

      <section className="container-lux grid gap-16 py-24 sm:py-36 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow text-champagne-deep">Our story (fictional)</p>
          <RevealText text="Born from a love of island architecture." className="mt-5 font-serif text-4xl leading-[1.05] font-light sm:text-6xl" />
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-lg leading-relaxed text-navy/75">
              Azure Estates imagines an agency founded by architects and hospitality professionals who felt the region&apos;s finest homes deserved better than
              a gallery of wide-angle photos and a list of features.
            </p>
            <p className="mt-4 max-w-lg leading-relaxed text-navy/75">
              The result is a slower, more editorial way of telling a property&apos;s story: its light, its materials, its view and the life it makes possible.
            </p>
          </Reveal>
        </div>
        <MaskImage src="/images/living-room-light.webp" alt="Sunlit living room with gallery wall" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/5]" from="right" parallax />
      </section>

      <section aria-labelledby="principles-heading" className="bg-navy py-24 text-ivory sm:py-32">
        <div className="container-lux">
          <RevealText id="principles-heading" text="Our principles" className="font-serif text-4xl font-light sm:text-6xl" />
          <ul className="mt-16 grid gap-px bg-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <li key={p.n} className="bg-navy p-8">
                <Reveal delay={i * 0.1}>
                  <p className="font-serif text-5xl text-champagne">{p.n}</p>
                  <h3 className="mt-8 font-serif text-2xl">{p.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/70">{p.d}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-lux py-24 sm:py-32">
        <Reveal className="mx-auto max-w-3xl border-y border-navy/15 py-12 text-center">
          <p className="eyebrow text-champagne-deep">Important</p>
          <p className="mt-5 font-serif text-3xl leading-snug">This is a fictional demonstration.</p>
          <p className="mt-4 leading-relaxed text-navy/70">
            Azure Estates is not a registered business or licensed real estate brokerage. There are no agents, offices or properties for sale. All names,
            figures and descriptions were written for illustration, and photography is used under the Unsplash License to depict architectural style only.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
