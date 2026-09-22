"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Images and web fonts finish loading after ScrollTrigger positions are first
 * computed, which can leave trigger start/end points stale. Refresh once
 * everything has settled so scroll reveals fire at the right spot.
 */
export function GsapSetup() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh);
    }

    const timeout = window.setTimeout(refresh, 600);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timeout);
    };
  }, []);

  return null;
}
