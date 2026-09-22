"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Pins each ".project-card" child in place while later cards scroll over
 * it, so cards stack visually instead of just scrolling past one another.
 * With a single project there is nothing to stack against yet, so this is
 * a no-op until a second project is added — no per-project wiring needed.
 */
export function StickyProjectStack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    const cards = gsap.utils.toArray<HTMLElement>(".project-card", root);
    if (cards.length < 2) return;

    const ctx = gsap.context(() => {
      const last = cards[cards.length - 1];

      cards.forEach((card, i) => {
        if (card === last) return;

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: last,
          end: "top top",
          pin: true,
          pinSpacing: false,
        });

        gsap.to(card, {
          scale: 0.94,
          opacity: 0,
          filter: "blur(6px)",
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger && root.contains(trigger.trigger as Node)) trigger.kill();
      });
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
