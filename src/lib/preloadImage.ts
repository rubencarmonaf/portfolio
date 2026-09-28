const cache = new Map<string, Promise<void>>();

/**
 * Downloads and decodes an image once, so showing it later doesn't pop in.
 * Never rejects: a failed preload just means the image loads normally.
 */
export function preloadImage(src: string): Promise<void> {
  let pending = cache.get(src);
  if (!pending) {
    const img = new window.Image();
    img.src = src;
    pending = img.decode().catch(() => undefined);
    cache.set(src, pending);
  }
  return pending;
}

/** Resolves when `src` is ready or after `ms`, whichever comes first. */
export function preloadImageWithin(src: string, ms: number): Promise<void> {
  return Promise.race([preloadImage(src), new Promise<void>((resolve) => setTimeout(resolve, ms))]);
}
