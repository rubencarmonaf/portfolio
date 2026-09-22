"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type GalleryImage = { src: string; alt: string };

const ROTATIONS = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1"];

export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const ref = useRef<HTMLDivElement>(null);

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
            toggleActions: "play none none none",
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
          scrub: 0.6,
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
    <div ref={ref} className="flex flex-col gap-6 py-4">
      {images.map((image, i) => (
        <div
          key={image.src}
          className={`gallery-card overflow-hidden rounded-2xl border border-line shadow-xl shadow-black/20 ${ROTATIONS[i % ROTATIONS.length]}`}
          style={{ marginLeft: i % 2 === 0 ? 0 : "8%", marginRight: i % 2 === 0 ? "8%" : 0 }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={1568}
            height={778}
            className="aspect-[1568/778] w-full object-cover"
            sizes="(min-width: 1024px) 440px, 100vw"
          />
        </div>
      ))}
    </div>
  );
}
