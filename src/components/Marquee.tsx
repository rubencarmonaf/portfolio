"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export function Marquee({ items }: { items: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth / 2;
      gsap.fromTo(
        track,
        { x: 0 },
        {
          x: -distance,
          duration: items.length * 2.4,
          ease: "none",
          repeat: -1,
        },
      );
    });

    return () => ctx.revert();
  }, [items]);

  return (
    <div className="relative overflow-hidden border-y border-line-soft py-4">
      <div ref={trackRef} className="flex w-max gap-10 whitespace-nowrap will-change-transform">
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-xs uppercase tracking-[0.2em] text-paper-faint"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
