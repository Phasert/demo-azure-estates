import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <div role="note" className="relative z-50 bg-navy text-ivory">
      <p className="container-lux flex items-center justify-center gap-2 py-2 text-center text-[0.7rem] tracking-wide sm:text-xs">
        <Info aria-hidden="true" size={14} className="shrink-0 text-champagne" />
        <span>
          <strong className="font-semibold text-champagne">Fictional demonstration.</strong> Azure Estates is not a real agency; all
          listings, prices and people are illustrative and not for sale.
        </span>
      </p>
    </div>
  );
}
