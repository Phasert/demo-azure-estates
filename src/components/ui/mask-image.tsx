"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Mask direction for the reveal. */
  from?: "bottom" | "left" | "right";
  parallax?: boolean;
  preload?: boolean;
};

const masks = {
  bottom: "inset(100% 0 0 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
};

/** Image revealed by an animated clip-path mask, with optional scroll parallax. */
export function MaskImage({ src, alt, sizes, className = "", from = "bottom", parallax = false, preload }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  // The image starts behind a fully-closed mask, so native lazy loading would
  // wait until the mask opens and the reveal would wipe in a blank panel.
  // Start the download as the block approaches the viewport instead.
  const near = useInView(ref, { once: true, margin: "600px 0px" });
  // Observe the unclipped wrapper: Chrome counts an element's own clip-path in
  // IntersectionObserver, so a fully-masked element never reports "in view"
  // and whileInView on it would leave the image hidden forever.
  const shown = useInView(ref, { once: true, amount: 0.25 });
  const open = reduce || shown;

  return (
    <div ref={ref} className={`relative ${className}`}>
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={reduce ? false : { clipPath: masks[from] }}
      animate={open ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="absolute -inset-y-[10%] inset-x-0"
        style={parallax && !reduce ? { y } : undefined}
        initial={reduce ? false : { scale: 1.25 }}
        animate={open ? { scale: 1 } : undefined}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} loading={preload ? undefined : near ? "eager" : "lazy"} className="object-cover" />
      </motion.div>
    </motion.div>
    </div>
  );
}
