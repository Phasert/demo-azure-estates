import Image from "next/image";
import { HeroCopy } from "./hero-copy";

export function Hero() {
  return (
    <section aria-label="Azure Estates introduction" className="relative isolate bg-ink text-white">
      <Image
        src="/images/coral-house.webp"
        alt=""
        fill
        unoptimized
        preload
        className="-z-20 object-cover object-[62%_50%]"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink/95 via-ink/70 to-ink/25" />
      <div className="mx-auto flex min-h-[min(42rem,82svh)] max-w-6xl items-center px-6 py-20 xl:px-0">
        <HeroCopy />
      </div>
    </section>
  );
}
