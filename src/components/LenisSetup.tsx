"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/**
 * Drives scroll through Lenis (inertia/smoothing) and feeds every frame into
 * GSAP's ticker so ScrollTrigger stays in sync with Lenis's virtual scroll
 * position instead of the raw native scroll event.
 */
export function LenisSetup() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ autoRaf: false });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
