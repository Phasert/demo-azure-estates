import Link from "next/link";
import { navLinks } from "./nav";
import { neighbourhoods } from "@/features/properties/data";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-ivory/80">
      <div className="container-lux grid gap-12 py-20 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-4xl text-ivory">Azure Estates</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            A fictional Caribbean real estate agency created as a design and development portfolio piece.
          </p>
          <p className="mt-6 max-w-sm border-l border-champagne/60 pl-4 text-xs leading-relaxed text-ivory/65">
            Every property, price, agent and contact detail on this site is illustrative. Nothing here is an offer for sale,
            and enquiries are not sent anywhere. Photography via Unsplash (Unsplash License).
          </p>
        </div>
        <FooterCol title="Explore" links={navLinks} />
        <FooterCol title="Neighbourhoods" links={neighbourhoods.map((n) => ({ href: `/neighbourhoods#${n.slug}`, label: n.name }))} />
        <div>
          <p className="eyebrow text-champagne">Visit (fictional)</p>
          <address className="mt-5 text-sm leading-7 not-italic">
            12 Example Quay
            <br />
            Westmoorings, Trinidad
            <br />
            hello@azure-estates.example
          </address>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-lux flex flex-wrap justify-between gap-3 py-6 text-xs text-ivory/55">
          <p>© {new Date().getFullYear()} Azure Estates — portfolio demonstration only.</p>
          <p>Not a licensed brokerage · No real listings</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow text-champagne">{title}</p>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="transition-colors hover:text-champagne">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
