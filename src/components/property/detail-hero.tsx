"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Property } from "@/features/properties/types";
import { formatPrice } from "@/features/properties/query";
import { typeLabel } from "@/features/properties/data";

const ease = [0.22, 1, 0.36, 1] as const;

/** Full-bleed arrival: the image opens from a doorway mask, then pulls back into a framed plate on scroll. */
export function DetailHero({ property: p }: { property: Property }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const inset = useTransform(scrollYProgress, [0, 0.8], ["inset(0% 0% 0% 0%)", "inset(6% 4% 6% 4%)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section ref={ref} aria-label={`${p.title} introduction`} className="relative -mt-19 h-[100svh] min-h-[36rem] bg-ivory">
      <motion.div className="absolute inset-0 overflow-hidden bg-navy" style={reduce ? undefined : { clipPath: inset }}>
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { clipPath: "inset(30% 38% 30% 38%)", scale: 1.3 }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
          transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
        >
          <motion.div className="absolute inset-0" style={reduce ? undefined : { scale }}>
            <Image src={p.images[0].src} alt={p.images[0].alt} fill preload sizes="100vw" className="object-cover" />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-t from-navy/85 via-navy/10 to-navy/50" />
      </motion.div>

      <motion.div className="relative flex h-full flex-col justify-end pb-14 text-ivory sm:pb-20" style={reduce ? undefined : { y: copyY }}>
        <div className="container-lux">
          <motion.p className="eyebrow text-champagne" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            {typeLabel(p.type)} · Ref {p.id.toUpperCase()} · Illustrative listing
          </motion.p>
          <h1 className="mt-4 overflow-hidden font-serif text-[clamp(3rem,10vw,9rem)] leading-[0.95] font-light">
            <motion.span className="block" initial={reduce ? false : { y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.2, ease, delay: 1.1 }}>
              {p.title}
            </motion.span>
          </h1>
          <motion.div
            className="mt-6 flex flex-wrap items-end justify-between gap-6 border-t border-ivory/25 pt-6"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8, ease }}
          >
            <p className="max-w-md font-serif text-xl leading-snug italic sm:text-2xl">{p.tagline}</p>
            <div className="text-right">
              <p className="eyebrow text-ivory/70">Guide price (illustrative)</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl">{formatPrice(p.priceTTD)}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
