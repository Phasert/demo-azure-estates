import { Waves } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="bg-sand px-6">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-sand focus:p-4">
        Skip to content
      </a>
      <div className="mx-auto flex min-h-19 max-w-6xl flex-wrap items-center justify-between gap-3 py-4">
        <Link href="/" className="inline-flex items-center gap-2 font-serif text-xl sm:text-2xl">
          <Waves aria-hidden="true" size={22} />
          Azure Estates
        </Link>
        <nav aria-label="Main navigation">
          <a href="#collection" className="text-sm font-semibold underline-offset-4 hover:underline">
            The collection
          </a>
        </nav>
      </div>
    </header>
  );
}
