"use client";

import { useRef } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Direction-aware fill (the "Get in Touch" hover). A circle blooms from the
 * exact point where the cursor entered until it floods the element, and on
 * leave shrinks back into the point where the cursor left. Keyboard focus
 * fills from the centre.
 *
 * The circle's radius reaches the farthest corner from its centre, so at
 * full size it always covers the element. On leave it is re-centred (and
 * re-sized) on the exit point while full, which is invisible, and only the
 * shrink into that point shows.
 *
 * Render the fill as an absolutely positioned, rounded span inside a
 * `relative overflow-hidden` element:
 *   <span ref={fillRef} className="pointer-events-none absolute top-1/2 left-1/2 size-0 rounded-full …"
 *         style={{ transform: "translate(-50%, -50%) scale(0)" }} />
 */
export function useEntryFill() {
  const fillRef = useRef<HTMLSpanElement>(null);

  const place = (el: HTMLElement, x: number, y: number) => {
    const fill = fillRef.current;
    if (!fill) return;
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

  const local = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  const handlers = {
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
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
    },
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType !== "mouse") return;
      const [x, y] = local(e);
      place(e.currentTarget, x, y); // full-size circle: the jump is invisible
      grow(false);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      place(e.currentTarget, r.width / 2, r.height / 2);
      grow(true);
    },
    onBlur: () => grow(false),
  };

  return { fillRef, handlers };
}
