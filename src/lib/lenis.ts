import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Null when Lenis is off (reduced motion) — native scroll is in use then. */
export function getLenis() {
  return instance;
}
