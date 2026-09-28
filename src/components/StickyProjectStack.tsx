"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Pins each ".project-card" child in place while later cards scroll over
 * it, so cards stack visually instead of just scrolling past one another.
 * With a single project there is nothing to stack against yet, so this is
 * a no-op until a second project is added — no per-project wiring needed.
 *
 * Desktop only: on narrow screens a card is taller than the viewport, so the
 * next card starts covering (and blurring) the screenshots the moment they
 * scroll into view. There the cards just scroll normally.
 */
export function StickyProjectStack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const cards = gsap.utils.toArray<HTMLElement>(".project-card", root);
    if (cards.length < 2) return;

    const mm = gsap.matchMedia(root);

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const last = cards[cards.length - 1];

      cards.forEach((card, i) => {
        if (card === last) return;

        // Pin once the card's bottom reaches the viewport bottom rather than its
        // top reaching the top, so a card taller than a short window is fully
        // scrolled through before the next one covers it. For cards that fit,
        // both points are the same.
        ScrollTrigger.create({
          trigger: card,
          start: "bottom bottom",
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
    });

    return () => mm.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
