"use client";

import { useEffect, useState, type ElementType } from "react";
import { useInView } from "@/lib/useInView";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  /** One string per visual line; lines break explicitly like the reference. */
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  /** Reveal on mount (hero) instead of on scroll into view. */
  onMount?: boolean;
  delay?: number;
  stagger?: number;
}

/**
 * Letter-by-letter rise, each letter clipped by its own mask (the reference
 * pads the mask by 0.04em so descenders and side bearings are not cut).
 * Screen readers get the plain sentence via aria-label.
 */
export default function SplitText({
  lines,
  as: Tag = "h2",
  className,
  onMount = false,
  delay = 0,
  stagger = 0.022,
}: SplitTextProps) {
  const [ref, inView] = useInView<HTMLElement>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!onMount) return;
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [onMount]);

  const shown = onMount ? mounted : inView;
  let i = 0;

  return (
    <Tag ref={ref} aria-label={lines.join(" ")} className={cn(shown && "split-in", className)}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.split(" ").map((word, wi, words) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {[...word].map((ch) => {
                const d = delay + i++ * stagger;
                return (
                  <span
                    key={`${ch}-${i}`}
                    className="relative inline-block overflow-clip px-[0.04em] -mx-[0.04em] align-bottom"
                  >
                    <span className="split-letter" style={{ ["--d" as string]: `${d}s` }}>
                      {ch}
                    </span>
                  </span>
                );
              })}
              {wi < words.length - 1 && " "}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
