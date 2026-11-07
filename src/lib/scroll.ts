"use client";

/**
 * One rAF loop for every scroll-linked effect on the page. Lenis moves the
 * native scroll position, so reading window.scrollY each frame is enough.
 * Listeners only run when the position (or the viewport) actually changed.
 */
type Listener = (y: number) => void;

const listeners = new Set<Listener>();
let lastY = Number.NaN;
let raf = 0;

function tick() {
  const y = window.scrollY;
  if (y !== lastY) {
    lastY = y;
    listeners.forEach((l) => l(y));
  }
  raf = requestAnimationFrame(tick);
}

function onResize() {
  lastY = Number.NaN; // force every listener to re-measure next frame
}

export function subscribeScroll(listener: Listener) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);
  }
  listener(window.scrollY);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    }
  };
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Document-relative top of an element (layout read). */
export function docTop(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
