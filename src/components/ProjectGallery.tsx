"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MagnifyingGlassPlus } from "@phosphor-icons/react/ssr";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { Lightbox } from "@/components/Lightbox";

type GalleryImage = { src: string; alt: string; width: number; height: number };

const ROTATIONS = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1"];

export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const t = useTranslations("projects.lightbox");
  const ref = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getOrigin = useCallback((index: number) => thumbRefs.current[index] ?? null, []);
  const handleClose = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const cards = gsap.utils.toArray<HTMLElement>(".gallery-card", root);
    if (cards.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      // Same direction and amplitude for every card so the stack drifts
      // together on scroll instead of pulling apart at different rates.
      gsap.to(cards, {
        y: -18,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === root) trigger.kill();
      });
    };
  }, []);

  return (
    <>
      <div ref={ref} className="flex flex-col gap-6 py-4">
        {images.map((image, i) => (
          <button
            key={image.src}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`${t("open")}: ${image.alt}`}
            className={`gallery-card group relative block cursor-zoom-in overflow-hidden rounded-2xl border border-line shadow-xl shadow-black/20 transition-[border-color] hover:border-signal/50 focus-visible:border-signal focus-visible:outline-none ${ROTATIONS[i % ROTATIONS.length]}`}
            style={{ marginLeft: i % 2 === 0 ? 0 : "8%", marginRight: i % 2 === 0 ? "8%" : 0 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(min-width: 1024px) 440px, 100vw"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/90 text-paper transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
            >
              <MagnifyingGlassPlus size={16} />
            </span>
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={handleClose}
        getOrigin={getOrigin}
        labels={{
          dialog: t("dialog"),
          close: t("close"),
          previous: t("previous"),
          next: t("next"),
          zoomHint: t("zoomHint"),
          panHint: t("panHint"),
        }}
      />
    </>
  );
}
