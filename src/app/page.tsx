import { Hero } from "@/components/home/hero";
import { FeaturedProperty } from "@/components/home/featured-property";
import { SiteHeader } from "@/components/site/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <FeaturedProperty />
      </main>
      <footer className="bg-ink px-6 py-8 text-sand">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-8 gap-y-2">
          <span className="font-serif text-xl">Azure Estates</span>
          <p className="text-sm text-sand/80">Fictional real estate portfolio demo</p>
        </div>
      </footer>
    </>
  );
}
