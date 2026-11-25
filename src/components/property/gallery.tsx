"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PropertyImage } from "@/features/properties/types";

const ease = [0.22, 1, 0.36, 1] as const;

export function Gallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [lightbox, setLightbox] = useState(false);

  const go = useCallback(
    (delta: number) => {
      setDir(delta);
      setActive((i) => (i + delta + images.length) % images.length);
    },
    [images.length],
  );

  const current = images[active];

  return (
    <section aria-label={`${title} photo gallery`} aria-roledescription="carousel">
      <div className="relative aspect-[16/10] overflow-hidden bg-navy sm:aspect-[16/9]">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            className="absolute inset-0"
            variants={{
              enter: (d: number) => ({ clipPath: d > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", scale: 1.08 }),
              center: { clipPath: "inset(0 0% 0 0%)", scale: 1 },
              exit: { opacity: 0.4 },
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.1, ease }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
          >
            <Image src={current.src} alt={current.alt} fill sizes="(min-width: 1024px) 66vw, 100vw" preload={active === 0} loading={active === 0 ? undefined : "eager"} className="object-cover" draggable={false} />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-navy/70 to-transparent p-4 text-ivory sm:p-6">
          <p className="text-sm" aria-live="polite">
            <span className="font-serif text-2xl">{String(active + 1).padStart(2, "0")}</span>
            <span className="text-ivory/60"> / {String(images.length).padStart(2, "0")}</span>
            {current.caption && <span className="ml-3 text-ivory/85">{current.caption}</span>}
          </p>
          <div className="pointer-events-auto flex gap-2">
            <GalleryButton label="Previous photo" onClick={() => go(-1)}>
              <ChevronLeft aria-hidden="true" size={20} />
            </GalleryButton>
            <GalleryButton label="Next photo" onClick={() => go(1)}>
              <ChevronRight aria-hidden="true" size={20} />
            </GalleryButton>
            <GalleryButton label="Open full-screen gallery" onClick={() => setLightbox(true)}>
              <Expand aria-hidden="true" size={18} />
            </GalleryButton>
          </div>
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5" aria-label="Choose photo">
        {images.map((img, i) => (
          <li key={img.src + i}>
            <button
              type="button"
              onClick={() => {
                setDir(i > active ? 1 : -1);
                setActive(i);
              }}
              aria-label={`Show photo ${i + 1}: ${img.caption ?? img.alt}`}
              aria-current={i === active}
              className={`relative block aspect-[4/3] w-full overflow-hidden transition-opacity duration-500 ${i === active ? "opacity-100 ring-1 ring-navy ring-offset-2 ring-offset-ivory" : "opacity-55 hover:opacity-100"}`}
            >
              <Image src={img.src} alt="" fill sizes="160px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

      {lightbox && <Lightbox images={images} index={active} onIndex={(i) => setActive(i)} onClose={() => setLightbox(false)} title={title} />}
    </section>
  );
}

function GalleryButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full border border-ivory/40 text-ivory backdrop-blur-sm transition-colors hover:bg-ivory hover:text-navy"
    >
      {children}
    </button>
  );
}

function Lightbox({ images, index, onIndex, onClose, title }: { images: PropertyImage[]; index: number; onIndex: (i: number) => void; onClose: () => void; title: string }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const img = images[index];

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [index, images.length, onClose, onIndex]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} full-screen gallery`}
      className="fixed inset-0 z-[80] flex flex-col bg-navy/97 text-ivory"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between p-4 sm:p-6">
        <p className="text-sm">
          {index + 1} / {images.length} · {img.caption ?? img.alt}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close gallery" className="inline-flex size-11 items-center justify-center rounded-full border border-ivory/30 hover:bg-ivory hover:text-navy">
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="relative flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={index} className="absolute inset-4 sm:inset-x-20" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}>
            <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>
        <button type="button" aria-label="Previous photo" onClick={() => onIndex((index - 1 + images.length) % images.length)} className="absolute top-1/2 left-2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-navy/60 hover:bg-ivory hover:text-navy sm:left-6">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button type="button" aria-label="Next photo" onClick={() => onIndex((index + 1) % images.length)} className="absolute top-1/2 right-2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-navy/60 hover:bg-ivory hover:text-navy sm:right-6">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <p className="p-4 text-center text-xs text-ivory/50">Illustrative photography — not images of a real listing.</p>
    </motion.div>,
    document.body,
  );
}
