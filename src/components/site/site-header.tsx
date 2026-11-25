"use client";

import { Heart, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { navLinks } from "./nav";
import { useFavourites } from "@/features/properties/favourites";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const { ids } = useFavourites();

  // Close the mobile menu on navigation.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const overHero = (["/", "/about", "/neighbourhoods", "/experience"].includes(pathname) || pathname.startsWith("/properties/")) && !scrolled && !open;

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,color,box-shadow] duration-500 ease-lux ${
        open
          ? "bg-ivory text-navy" // no backdrop-filter while open: it would trap the fixed menu panel
          : overHero
            ? "bg-transparent text-ivory"
            : "bg-ivory/90 text-navy shadow-[0_1px_0_rgb(16_42_67/0.08)] backdrop-blur-md"
      }`}
    >
      <div className="container-lux flex h-19 items-center justify-between gap-6">
        <Link href="/" className="group flex items-baseline gap-2" aria-label="Azure Estates home">
          <span className="font-serif text-2xl tracking-wide sm:text-[1.7rem]">Azure Estates</span>
          <span className="eyebrow hidden text-[0.55rem] opacity-70 sm:inline">Demo</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {navLinks.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className="group relative py-2 text-[0.8rem] tracking-[0.14em] uppercase"
              >
                {l.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-lux ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/properties?saved=1"
            className="relative inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-current/10"
            aria-label={`Saved properties (${ids.length})`}
          >
            <Heart aria-hidden="true" size={19} strokeWidth={1.5} />
            {ids.length > 0 && (
              <span className="absolute top-1.5 right-1 flex size-4.5 items-center justify-center rounded-full bg-champagne text-[0.6rem] font-semibold text-navy">
                {ids.length}
              </span>
            )}
          </Link>
          <Link
            href="/contact"
            className={`hidden border px-5 py-2.5 text-[0.72rem] tracking-[0.18em] uppercase transition-colors duration-300 md:inline-block ${
              overHero ? "border-ivory/60 hover:bg-ivory hover:text-navy" : "border-navy hover:bg-navy hover:text-ivory"
            }`}
          >
            Enquire
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-19 bottom-0 bg-ivory text-navy lg:hidden"
          >
            <ul className="container-lux flex flex-col gap-2 pt-10">
              {navLinks.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
                  <Link href={l.href} className="block border-b border-navy/10 py-4 font-serif text-4xl">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
