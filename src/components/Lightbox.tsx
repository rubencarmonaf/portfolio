"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react/ssr";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { preloadImage } from "@/lib/preloadImage";

type LightboxImage = { src: string; alt: string; width: number; height: number };

type LightboxProps = {
  images: LightboxImage[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** Thumbnail for each image; its loaded src is the placeholder while the full image loads. */
  getOrigin: (index: number) => HTMLElement | null;
  labels: {
    dialog: string;
    close: string;
    previous: string;
    next: string;
    zoomHint: string;
    panHint: string;
  };
};

const SWIPE_THRESHOLD = 50;
const TAP_TOLERANCE = 6;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Rendered as a native <dialog> opened with showModal(): that puts it in the
// browser's top layer, so it escapes the transforms GSAP applies to pinned
// project cards (a position:fixed overlay inside them would be positioned
// relative to the card, not the viewport).
export function Lightbox({ images, index, onIndexChange, onClose, getOrigin, labels }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef<number | null>(null);
  const directionRef = useRef(1);
  const closingRef = useRef(false);

  // Zoom works by scaling around a transform-origin and panning by moving that
  // origin: with origin clamped to the frame, the zoomed image always fills it.
  const [zoomed, setZoomed] = useState(false);
  const zoom = useRef({ scale: 1, ox: 0, oy: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null);

  const count = images.length;

  const releasePage = () => {
    getLenis()?.start();
    document.documentElement.style.overflow = "";
  };

  const resetZoom = useCallback((animate: boolean) => {
    const el = zoomRef.current;
    zoom.current.scale = 1;
    setZoomed(false);
    if (!el) return;
    if (animate && !prefersReducedMotion()) {
      gsap.to(el, { scale: 1, duration: 0.35, ease: "power3.out" });
    } else {
      gsap.set(el, { scale: 1 });
    }
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    const frame = frameRef.current;
    const previous = prevIndexRef.current;
    prevIndexRef.current = index;
    if (!dialog || index === null) return;

    resetZoom(false);
    const reduce = prefersReducedMotion();

    // Safety net for slow networks: the already-loaded thumbnail fills the
    // frame until the full-resolution image arrives, so it's never empty.
    const thumb = getOrigin(index)?.querySelector("img");
    if (frame) frame.style.backgroundImage = thumb?.currentSrc ? `url("${thumb.currentSrc}")` : "";

    // Make the arrows feel instant: fetch the neighbours ahead of time.
    if (count > 1) {
      preloadImage(images[(index + 1) % count].src);
      preloadImage(images[(index - 1 + count) % count].src);
    }

    if (previous === null) {
      dialog.showModal();
      getLenis()?.stop();
      document.documentElement.style.overflow = "hidden";
      if (reduce || !frame) return;

      // Appear in place with a short fade and settle. Growing out of the
      // thumbnail looked like the image flew in from off-screen, since the
      // thumbnails sit rotated at the side of the page.
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(
        frame,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
      );
    } else if (previous !== index && !reduce && frame) {
      gsap.fromTo(
        frame,
        { x: directionRef.current * 16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
      );
    }
  }, [index, getOrigin, resetZoom, images, count]);

  // If the gallery unmounts while open, don't leave the page scroll-locked.
  useEffect(() => releasePage, []);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    const frame = frameRef.current;
    if (!dialog || index === null || closingRef.current) return;
    closingRef.current = true;
    resetZoom(false);

    const finish = () => {
      dialog.close();
      gsap.set([frame, backdropRef.current], { clearProps: "all" });
      releasePage();
      closingRef.current = false;
      onClose();
    };

    if (prefersReducedMotion() || !frame) {
      finish();
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0);
    tl.to(frame, { opacity: 0, scale: 0.96, duration: 0.2, ease: "power2.in" }, 0);
  }, [index, onClose, resetZoom]);

  // overflow:hidden on <html> doesn't stop touch scrolling in iOS Safari, so
  // also swallow wheel/touch-move on the dialog itself. Needs a non-passive
  // listener, which React's onWheel/onTouchMove can't provide.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const block = (event: Event) => event.preventDefault();
    dialog.addEventListener("wheel", block, { passive: false });
    dialog.addEventListener("touchmove", block, { passive: false });
    return () => {
      dialog.removeEventListener("wheel", block);
      dialog.removeEventListener("touchmove", block);
    };
  }, []);

  // Esc fires "cancel"; take it over so closing gets the same animation.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      close();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [close]);

  const go = (step: number) => {
    if (index === null || count < 2) return;
    directionRef.current = step;
    onIndexChange((index + step + count) % count);
  };

  const zoomInAt = (clientX: number, clientY: number) => {
    const frame = frameRef.current;
    const el = zoomRef.current;
    if (!frame || !el) return;
    const rect = frame.getBoundingClientRect();
    // Enough magnification that a landscape screenshot on a phone fills most
    // of the screen height, never less than 2x or more than 3.5x.
    const scale = clamp((window.innerHeight * 0.6) / rect.height, 2, 3.5);
    const ox = clamp(clientX - rect.left, 0, rect.width);
    const oy = clamp(clientY - rect.top, 0, rect.height);
    zoom.current = { scale, ox, oy };
    setZoomed(true);
    gsap.set(el, { transformOrigin: `${ox}px ${oy}px` });
    if (prefersReducedMotion()) gsap.set(el, { scale });
    else gsap.to(el, { scale, duration: 0.4, ease: "power3.out" });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      ox: zoom.current.ox,
      oy: zoom.current.oy,
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = event.clientX - d.x;
    const dy = event.clientY - d.y;
    if (Math.abs(dx) > TAP_TOLERANCE || Math.abs(dy) > TAP_TOLERANCE) d.moved = true;

    if (!zoomed || !frameRef.current || !zoomRef.current) return;
    // Moving the origin by -d/(scale-1) keeps the point under the finger
    // under the finger.
    const { scale } = zoom.current;
    const rect = frameRef.current.getBoundingClientRect();
    const ox = clamp(d.ox - dx / (scale - 1), 0, rect.width);
    const oy = clamp(d.oy - dy / (scale - 1), 0, rect.height);
    zoom.current.ox = ox;
    zoom.current.oy = oy;
    gsap.set(zoomRef.current, { transformOrigin: `${ox}px ${oy}px` });
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = event.clientX - d.x;

    if (zoomed) {
      if (!d.moved) resetZoom(true);
      return;
    }
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
    else if (!d.moved) zoomInAt(event.clientX, event.clientY);
  };

  const image = index !== null ? images[index] : null;
  const navButton =
    "absolute flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-paper transition-colors hover:border-signal hover:text-signal-ink";

  return (
    <dialog
      ref={dialogRef}
      aria-label={labels.dialog}
      data-lenis-prevent
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 text-paper backdrop:bg-transparent"
    >
      <div ref={backdropRef} className="absolute inset-0 bg-ink/90 backdrop-blur-sm" onClick={close} />

      {image && (
        <div className="pointer-events-none relative flex h-full w-full items-center justify-center px-4 pb-28 pt-20 sm:px-20 sm:pb-20">
          <div
            ref={frameRef}
            className={`pointer-events-auto overflow-hidden rounded-2xl border border-line bg-[length:100%_100%] bg-no-repeat shadow-2xl shadow-black/40 ${
              zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
            }`}
            style={{ touchAction: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              drag.current = null;
            }}
          >
            <div ref={zoomRef} className="will-change-transform">
              {/* unoptimized: serve the original full-resolution screenshot so
                  zooming in stays sharp instead of upscaling a phone-sized one. */}
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                unoptimized
                loading="eager"
                draggable={false}
                className="block h-auto max-h-[75dvh] w-auto max-w-full select-none"
              />
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={close}
        aria-label={labels.close}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-paper transition-colors hover:border-signal hover:text-signal-ink"
      >
        <X size={18} />
      </button>

      {index !== null && (
        <>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.previous}
                className={`${navButton} bottom-5 left-5 sm:bottom-auto sm:left-6 sm:top-1/2 sm:-translate-y-1/2`}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.next}
                className={`${navButton} bottom-5 right-5 sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2`}
              >
                <ArrowRight size={18} />
              </button>
            </>
          )}
          <div className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-center">
            {count > 1 && (
              <p aria-live="polite" className="font-display text-xs text-paper-dim">
                {index + 1} / {count}
              </p>
            )}
            <p className="max-w-[12rem] text-[11px] leading-tight text-paper-faint sm:max-w-none">
              {zoomed ? labels.panHint : labels.zoomHint}
            </p>
          </div>
        </>
      )}
    </dialog>
  );
}
