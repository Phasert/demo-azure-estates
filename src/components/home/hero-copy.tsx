"use client";

import { motion, useReducedMotion } from "motion/react";

export function HeroCopy() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={false}
      animate={reduceMotion === false ? { y: [8, 0] } : { y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative max-w-2xl"
    >
      <p className="mb-5 text-sm font-semibold tracking-[0.19em] uppercase">Luxury Caribbean real estate</p>
      <h1 className="font-serif text-5xl leading-[1.03] text-balance sm:text-7xl lg:text-8xl">
        A home on island time.
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
        Discover a collection of imagined coastal residences shaped by the Caribbean landscape.
      </p>
      <a href="#collection" className="mt-8 inline-flex bg-sand px-6 py-3 text-sm font-semibold text-ink hover:bg-white focus-visible:outline-white">
        Explore the collection
      </a>
    </motion.div>
  );
}
