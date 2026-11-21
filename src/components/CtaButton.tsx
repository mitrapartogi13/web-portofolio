"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Ink pill. On hover a white fill blooms from the exact point where the
 * cursor entered until it floods the pill, and on leave it shrinks back
 * into the point where the cursor left. Each letter rolls up into an ink
 * copy at the same time. Keyboard focus fills from the centre.
 *
 * The fill is a circle whose radius reaches the farthest corner from its
 * centre, so at full size it always covers the pill. On leave it is
 * re-centred (and re-sized) on the exit point while full, which is
 * invisible, and only the shrink into that point shows.
 */
export default function CtaButton({
  label,
  href = "#contact",
  className,
}: {
  label: string;
  href?: string;
  className?: string;
}) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const letters = [...label];

  const place = (el: HTMLElement, x: number, y: number) => {
    const fill = fillRef.current;
    if (!fill) return;
    // Radius = distance to the farthest corner: the circle just covers the
    // pill at full size, so the bloom is visible for the whole transition.
    const r = el.getBoundingClientRect();
    const d = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) + 2;
    fill.style.width = `${d}px`;
    fill.style.height = `${d}px`;
    fill.style.left = `${x}px`;
    fill.style.top = `${y}px`;
  };

  const grow = (on: boolean) => {
    const fill = fillRef.current;
    if (!fill) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    fill.style.transition = reduce ? "none" : `transform ${on ? 600 : 500}ms ${EASE}`;
    fill.style.transform = `translate(-50%, -50%) scale(${on ? 1 : 0})`;
  };

  const local = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  return (
    <a
      href={href}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        const [x, y] = local(e);
        const fill = fillRef.current;
        if (fill) {
          // Start from a dot at the entry point, without animating the move.
          fill.style.transition = "none";
          fill.style.transform = "translate(-50%, -50%) scale(0)";
        }
        place(e.currentTarget, x, y);
        void fill?.offsetWidth;
        grow(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        const [x, y] = local(e);
        place(e.currentTarget, x, y); // full-size circle: the jump is invisible
        grow(false);
      }}
      onFocus={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        place(e.currentTarget, r.width / 2, r.height / 2);
        grow(true);
      }}
      onBlur={() => grow(false)}
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-fg bg-fg text-paper",
        "h-[12vw] px-[6.86vw] text-[4.2vw]",
        "md:h-[8vw] md:px-[4.57vw] md:text-[3vw]",
        "lg:h-[3.5vw] lg:px-[2vw] lg:text-[1.15vw]",
        className,
      )}
    >
      <span
        ref={fillRef}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 z-10 size-0 rounded-full bg-paper"
        style={{ transform: "translate(-50%, -50%) scale(0)" }}
      />
      <span className="relative z-20 flex leading-[1.3]" aria-label={label}>
        {letters.map((ch, i) => (
          <span key={i} aria-hidden className="relative inline-block overflow-hidden">
            <span
              className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full"
              style={{ transitionDelay: `${i * 0.015}s` }}
            >
              {ch === " " ? " " : ch}
            </span>
            <span
              className="absolute inset-0 block translate-y-full text-fg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
              style={{ transitionDelay: `${i * 0.015}s` }}
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        ))}
      </span>
    </a>
  );
}
