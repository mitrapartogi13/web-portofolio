"use client";

import { useEffect, useId, useRef } from "react";
import { prefersReducedMotion } from "@/lib/scroll";

/*
 * Outline cursor after the "Steel Blue Gradient" pack shapes (redrawn):
 * a thick black outline, a thin white line just inside it (so it stays
 * visible on dark images) and a see-through middle.
 * Paths share one 28×32 box; HOT is each shape's hotspot in that box.
 */
const PATHS = {
  arrow: "M3 2.5V24.5L8.6 19.3L12.6 28L16.6 26.2L12.7 17.8H20Z",
  point:
    "M9.5 17V4.5a1.9 1.9 0 0 1 3.8 0V12.5a1.9 1.9 0 0 1 3.8 0V13.3a1.9 1.9 0 0 1 3.8 0V14a1.9 1.9 0 0 1 3.8 0V22c0 4-2.5 7-6.5 7H15c-2.5 0-3.8-1-5.2-3L4.6 19.6a1.9 1.9 0 0 1 2.8-2.6L9.5 19Z",
  open: "M9.5 17V7.5a1.9 1.9 0 0 1 3.8 0V12V5a1.9 1.9 0 0 1 3.8 0V12V6a1.9 1.9 0 0 1 3.8 0V12.5V8.5a1.9 1.9 0 0 1 3.8 0V22c0 4-2.5 7-6.5 7H15c-2.5 0-3.8-1-5.2-3L4.6 19.6a1.9 1.9 0 0 1 2.8-2.6L9.5 19Z",
  fist: "M9.5 17V13a1.9 1.9 0 0 1 3.8 0V14V12a1.9 1.9 0 0 1 3.8 0V14V12.5a1.9 1.9 0 0 1 3.8 0V14.5V13.5a1.9 1.9 0 0 1 3.8 0V22c0 4-2.5 7-6.5 7H15c-2.5 0-3.8-1-5.2-3L5.6 20.6a1.9 1.9 0 0 1 2.8-2.6L9.5 19.5Z",
} as const;
type Shape = keyof typeof PATHS;
const SHAPES = Object.keys(PATHS) as Shape[];
const HOT: Record<Shape, [number, number]> = { arrow: [3, 2.5], point: [11.4, 2.6], open: [17, 16], fist: [17, 17] };
const PALM_LINES = "M16 19.5v4M19.8 19.5v4M23.6 19.5v4";

/** Clickable things get the pointing hand; draggable areas get the open hand. */
const POINT_SEL = 'a[href], button, [role="button"], summary, label, select, [data-cursor="pointer"]';
const GRAB_SEL = '[data-cursor="grab"]';
/** Text fields keep the native I-beam. */
const TEXT_SEL = 'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

/**
 * Custom cursor (mouse / trackpad only; touch keeps native behaviour).
 * - Follows the real pointer position with no smoothing, so it never lags.
 * - Arrow → pointing hand over links and buttons (soft morph).
 * - Open hand over [data-cursor="grab"], a fist while pressing there.
 * - Press: shrinks and springs back. Moving fast tilts it a little.
 * The native cursor is hidden only after the first mouse move, so it
 * stays visible if this script never runs.
 */
export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // useId can contain characters that break url(#…) references.
  const uid = `cc${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduce = prefersReducedMotion();
    const html = document.documentElement;
    const layers = new Map<Shape, HTMLElement>();
    root.querySelectorAll<HTMLElement>("[data-shape]").forEach((el) => layers.set(el.dataset.shape as Shape, el));

    let shape: Shape | null = null;
    let pressed = false;
    let overGrab = false;
    let rot = 0;
    let lastX = 0;
    let lastT = 0;
    let raf = 0;

    const setShape = (next: Shape) => {
      if (next === shape) return;
      shape = next;
      layers.forEach((el, name) => el.classList.toggle("on", name === next));
    };
    const applyTransform = () => {
      const scale = pressed && !overGrab ? 0.78 : 1;
      inner.style.transform = `rotate(${rot.toFixed(2)}deg) scale(${scale})`;
    };
    // Tilt decays back to upright once the mouse slows down.
    const settle = () => {
      rot *= 0.86;
      applyTransform();
      raf = Math.abs(rot) > 0.2 ? requestAnimationFrame(settle) : 0;
      if (!raf) {
        rot = 0;
        applyTransform();
      }
    };

    const pick = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      const hit = el?.closest(`${POINT_SEL}, ${GRAB_SEL}, ${TEXT_SEL}`);
      overGrab = !!hit?.matches(GRAB_SEL);
      if (hit?.matches(TEXT_SEL)) {
        root.dataset.hidden = "";
        return;
      }
      delete root.dataset.hidden;
      setShape(overGrab ? (pressed ? "fist" : "open") : hit ? "point" : "arrow");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        // Touch or pen on a hybrid device: step aside for the native cursor.
        html.classList.remove("has-cursor");
        root.dataset.off = "";
        return;
      }
      html.classList.add("has-cursor");
      delete root.dataset.off;
      root.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      pick(e.target);

      if (!reduce) {
        const dt = Math.max(8, e.timeStamp - lastT);
        const vx = (e.clientX - lastX) / dt; // px per ms
        rot = rot * 0.7 + Math.max(-24, Math.min(24, vx * 12)) * 0.3;
        lastX = e.clientX;
        lastT = e.timeStamp;
        applyTransform();
        if (!raf) raf = requestAnimationFrame(settle);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      pressed = true;
      pick(e.target);
      applyTransform();
    };
    const onUp = (e: PointerEvent) => {
      if (!pressed) return;
      pressed = false;
      pick(e.target);
      applyTransform();
    };
    // Hide when the pointer leaves the window; show again on return.
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) root.dataset.away = "";
    };
    const onOver = () => {
      delete root.dataset.away;
    };

    setShape("arrow");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="custom-cursor">
      <div ref={innerRef} className="custom-cursor-inner">
        {SHAPES.map((name) => {
          const d = PATHS[name];
          const clip = `${uid}-${name}`;
          return (
            <div
              key={name}
              data-shape={name}
              className="custom-cursor-shape"
              style={{ left: -HOT[name][0], top: -HOT[name][1] }}
            >
              <svg width="28" height="32" viewBox="0 0 28 32" overflow="visible">
                <defs>
                  <clipPath id={clip}>
                    <path d={d} />
                  </clipPath>
                </defs>
                {/* Thin white line inside the outline; the middle stays clear. */}
                <path d={d} fill="none" stroke="#fff" strokeWidth="4.6" clipPath={`url(#${clip})`} />
                <path d={d} fill="none" stroke="#0b0b0b" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
                {name === "point" && (
                  <path d={PALM_LINES} fill="none" stroke="#0b0b0b" strokeWidth="1.6" strokeLinecap="round" />
                )}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
