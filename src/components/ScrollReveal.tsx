"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul";
  stagger?: number;
  y?: number;
  /** Optional starting tilt in degrees; settles to 0 as it reveals. */
  rotate?: number;
};

export function ScrollReveal({
  children,
  className,
  as = "div",
  stagger = 0.08,
  y = 24,
  rotate = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement & HTMLUListElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = gsap.utils.toArray<HTMLElement>(Array.from(root.children));
    if (items.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0, rotate: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y, rotate },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            // Replays every time the section crosses into view, scrolling
            // either up or down, instead of only firing once.
            toggleActions: "play reverse play reverse",
          },
        },
      );
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === root) trigger.kill();
      });
    };
  }, [stagger, y, rotate]);

  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
