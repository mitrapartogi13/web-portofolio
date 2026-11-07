import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know our custom type-scale utilities, otherwise it
 * reads `text-label` as a colour and silently drops it next to `text-ink-3`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "h1", "h2", "h3", "body-lg", "label", "data"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Zero-pads section and list indices: 1 → "01". */
export function pad(n: number) {
  return String(n).padStart(2, "0");
}
