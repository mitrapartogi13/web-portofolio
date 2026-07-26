import type { Variants } from 'framer-motion';

/** Single easing family used for every animation on the site. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
} as const;

/** Standard enter animation: fade in while rising slightly. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

/** Parent container that staggers its `fadeUp` children. */
export const stagger = (
  staggerChildren = 0.1,
  delayChildren = 0.05,
): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren, delayChildren },
  },
});
