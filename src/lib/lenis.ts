"use client";

import type Lenis from "lenis";

/** Shares the single Lenis instance with sections that need it (snap points). */
let instance: Lenis | null = null;
const waiters = new Set<(lenis: Lenis) => void>();

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
  if (lenis) waiters.forEach((w) => w(lenis));
}

export function onLenis(cb: (lenis: Lenis) => void) {
  if (instance) cb(instance);
  waiters.add(cb);
  return () => {
    waiters.delete(cb);
  };
}

/** Smooth-scroll to a document Y, through Lenis when it is running. */
export function scrollToY(y: number) {
  if (instance) instance.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}
