"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Snap from "lenis/snap";
import { onLenis } from "@/lib/lenis";
import { site } from "@/data/site";
import { clamp, docTop, easeInOutCubic, easeOutCubic, prefersReducedMotion, subscribeScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import SplitText from "../SplitText";

const years = site.experience.years;
const N = years.length;
/** Item steps of the longest year; scroll plays the year on screen only. */
const STEPS = Math.max(...years.map((y) => y.items.length)) - 1;
const STEP = 0.7; // viewport heights per item

/** Shortest signed distance on the loop, in [-N/2, N/2). */
const wrap = (d: number) => ((((d + N / 2) % N) + N) % N) - N / 2;
const mod = (i: number) => ((i % N) + N) % N;

/**
 * Experience as a looping film reel of years (newest first).
 * - Vertical scroll plays the items of the year on screen (list rail +
 *   stacked previews), then the page moves on to the next section.
 * - Years change by swipe / drag, horizontal trackpad scroll, arrow keys
 *   or a click on a tilted side frame. The reel follows a spring.
 * - Each year has its own accent (glow, rail, dots, outlined watermark);
 *   the centre frame tilts towards the cursor with a soft sheen.
 */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const goRef = useRef<(delta: number) => void>(() => {});
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reel$ = reelRef.current;
    if (!reel$) return;
    const reduce = prefersReducedMotion();
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let top = 0;
    let measuredAt = -1;
    let u = 0; // item progress inside the year, 0..STEPS
    let reel = 0; // reel position (unbounded; frame i is centred at reel ≡ i)
    let target = 0;
    let vel = 0;
    let lastActive = 0;
    // Cursor tilt (deg) and sheen, eased towards their targets.
    const tilt = { x: 0, y: 0, g: 0, tx: 0, ty: 0, tg: 0, gx: 50, gy: 50 };

    const spacing = () => {
      const vw = window.innerWidth;
      return (vw >= 1025 ? 0.68 : vw >= 768 ? 0.8 : 0.82) * vw;
    };

    const paint = () => {
      const space = spacing();
      frameRefs.current.forEach((frame, i) => {
        if (!frame) return;
        const d = wrap(i - reel);
        const ad = Math.min(Math.abs(d), 1.5);
        const focus = 1 - Math.min(Math.abs(d), 1); // 1 when centred
        frame.style.transform =
          `translate3d(${d * space}px, 0, ${-ad * 220}px) rotateY(${-clamp(d, -1, 1) * 38}deg) ` +
          `rotateX(${tilt.x * focus}deg) rotateY(${tilt.y * focus}deg) scale(${1 - Math.min(ad, 1) * 0.14})`;
        frame.style.opacity = String(clamp(1.8 - Math.abs(d)) * (1 - Math.min(ad, 1) * 0.35));
        frame.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
        frame.style.setProperty("--focus", focus.toFixed(3));
        frame.style.setProperty("--glare", (tilt.g * focus).toFixed(3));
        frame.style.setProperty("--gx", `${tilt.gx}%`);
        frame.style.setProperty("--gy", `${tilt.gy}%`);

        // Inside the year: only the centred frame follows the scroll. Side
        // frames rest on their first item and catch up while turning in.
        const n = years[i].items.length;
        const local = clamp(u * focus, 0, n - 1);
        const rail = frame.querySelector<HTMLElement>("[data-rail]");
        if (rail) rail.style.transform = `scaleY(${n > 1 ? local / (n - 1) : 1})`;
        const seg = (k: number) => (k < 1 || k >= n ? 0 : clamp((local - (k - 1) - 0.2) / 0.6));
        const ease = (v: number) => (reduce ? (v > 0.5 ? 1 : 0) : easeInOutCubic(v));
        frame.querySelectorAll<HTMLElement>("[data-card]").forEach((card, k) => {
          const inT = k === 0 ? 1 : ease(seg(k));
          const nextT = ease(seg(k + 1));
          card.style.transform = `translateY(${(1 - inT) * 100}%)`;
          card.style.filter = `brightness(${1 - 0.7 * nextT})`;
        });
        frame.querySelectorAll<HTMLElement>("[data-dot]").forEach((dot, k) => dot.classList.toggle("on", k === 0 || seg(k) >= 0.5));
      });

      const a = mod(Math.round(reel));
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }
    };

    // ---- animation loop: spring for the reel, easing for the tilt --------
    let raf = 0;
    let last = 0;
    let dragging = false;
    const loop = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      if (!dragging) {
        if (reduce) {
          reel = target;
          vel = 0;
        } else {
          // Slightly under-damped spring: soft start, tiny settle.
          const w = 11;
          const z = 0.86;
          vel += (w * w * (target - reel) - 2 * z * w * vel) * dt;
          reel += vel * dt;
        }
      }
      const k = 1 - Math.exp(-dt / 0.12);
      tilt.x += (tilt.tx - tilt.x) * k;
      tilt.y += (tilt.ty - tilt.y) * k;
      tilt.g += (tilt.tg - tilt.g) * k;
      paint();
      const settled =
        !dragging &&
        Math.abs(target - reel) < 0.0005 &&
        Math.abs(vel) < 0.001 &&
        Math.abs(tilt.tx - tilt.x) + Math.abs(tilt.ty - tilt.y) + Math.abs(tilt.tg - tilt.g) < 0.01;
      if (settled) {
        reel = target;
        vel = 0;
        paint();
        raf = 0;
        last = 0;
      } else {
        raf = requestAnimationFrame(loop);
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const go = (delta: number) => {
      target = Math.round(target) + delta;
      kick();
    };
    goRef.current = (delta) => go(delta);

    // ---- vertical scroll ---------------------------------------------------
    const unsubscribe = subscribeScroll((y) => {
      const section = sectionRef.current;
      if (!section) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (measuredAt !== vw) {
        top = docTop(section);
        measuredAt = vw;
      }
      // Curved band rising over the hero (unchanged).
      const pb = clamp((y - (top - vh)) / (1.08 * vh));
      if (bandRef.current) {
        bandRef.current.style.transform = `translateY(${-0.35 * vh * pb}px)`;
        bandRef.current.style.clipPath = `ellipse(${150 - 90 * easeOutCubic(pb)}% 100% at 50% 100%)`;
      }
      u = clamp((y - (top + 0.36 * vh)) / (STEP * vh), 0, STEPS);
      paint();
    });

    // ---- swipe / drag ------------------------------------------------------
    let drag: { id: number; x0: number; y0: number; base: number; lastX: number; lastT: number; v: number } | null = null;
    let moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      moved = false;
      drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, base: reel, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
    };
    const onMove = (e: PointerEvent) => {
      if (drag && e.pointerId === drag.id) {
        const dx = e.clientX - drag.x0;
        const dy = e.clientY - drag.y0;
        if (!dragging) {
          if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
            dragging = true;
            moved = true;
            reel$.setPointerCapture(e.pointerId);
            reel$.dataset.dragging = "";
            tilt.tx = tilt.ty = tilt.tg = 0;
          } else if (Math.abs(dy) > 10) {
            drag = null; // a vertical scroll, not a swipe
            return;
          } else return;
        }
        const space = spacing();
        reel = drag.base - dx / space;
        const dtm = Math.max(1, e.timeStamp - drag.lastT) / 1000;
        drag.v = 0.7 * drag.v + 0.3 * (-(e.clientX - drag.lastX) / space / dtm);
        drag.lastX = e.clientX;
        drag.lastT = e.timeStamp;
        kick();
        return;
      }
      // Hover tilt on the centre frame (mouse only).
      if (!finePointer || reduce || e.pointerType !== "mouse" || dragging) return;
      const frame = frameRefs.current[mod(Math.round(reel))];
      if (!frame) return;
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const inside = px >= 0 && px <= 1 && py >= 0 && py <= 1;
      tilt.tx = inside ? (0.5 - py) * 7 : 0;
      tilt.ty = inside ? (px - 0.5) * 9 : 0;
      tilt.tg = inside ? 1 : 0;
      tilt.gx = Math.round(px * 100);
      tilt.gy = Math.round(py * 100);
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (dragging) {
        dragging = false;
        delete reel$.dataset.dragging;
        const base = Math.round(drag.base);
        // Flick or past a fifth of a frame → next / previous year.
        const travel = reel - drag.base + drag.v * 0.18;
        target = Math.abs(travel) > 0.2 ? base + Math.sign(travel) : base;
        vel = clamp(drag.v, -6, 6);
        kick();
      }
      drag = null;
    };
    const onLeave = () => {
      tilt.tx = tilt.ty = tilt.tg = 0;
      kick();
    };
    // Swallow the click that ends a drag, so a side frame isn't selected.
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    // Horizontal trackpad swipe: one year per gesture.
    let wheelAcc = 0;
    let wheelLockUntil = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now < wheelLockUntil) {
        wheelLockUntil = now + 200; // wait for the gesture's inertia to end
        return;
      }
      wheelAcc += e.deltaX;
      if (Math.abs(wheelAcc) > 30) {
        go(Math.sign(wheelAcc));
        wheelAcc = 0;
        wheelLockUntil = now + 200;
      }
    };

    reel$.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    reel$.addEventListener("pointerleave", onLeave);
    reel$.addEventListener("click", onClickCapture, true);
    reel$.addEventListener("wheel", onWheel, { passive: false });

    // ---- snap to each item (Lenis snap, proximity) -------------------------
    let snap: Snap | null = null;
    let removers: (() => void)[] = [];
    const addPoints = () => {
      removers.forEach((r) => r());
      const section = sectionRef.current;
      if (!snap || !section) return;
      const vh = window.innerHeight;
      const from = docTop(section) + 0.36 * vh;
      removers = Array.from({ length: STEPS + 1 }, (_, k) => snap!.add(from + k * STEP * vh));
    };
    const offLenis = onLenis((lenis) => {
      snap?.destroy();
      snap = new Snap(lenis, { type: "proximity", distanceThreshold: "37%" });
      addPoints();
    });
    window.addEventListener("resize", addPoints);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      reel$.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      reel$.removeEventListener("pointerleave", onLeave);
      reel$.removeEventListener("click", onClickCapture, true);
      reel$.removeEventListener("wheel", onWheel);
      offLenis();
      window.removeEventListener("resize", addPoints);
      snap?.destroy();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative pt-[30vw] lg:pt-[8vw]"
      style={{ height: `${(STEPS * STEP + 1.36) * 100}vh` }}
    >
      {/* The drop-shadow lives on a wrapper: a filter on the clipped band
          itself would be clipped away with it. */}
      <div aria-hidden className="absolute inset-x-0 top-0 z-[2] h-[50vh] [filter:drop-shadow(0_-18px_40px_rgb(15_20_25/0.08))]">
        <div ref={bandRef} className="absolute inset-0 bg-paper [clip-path:ellipse(150%_100%_at_50%_100%)]" />
      </div>

      <div className="sticky top-0 z-[3] flex h-screen flex-col items-center justify-center gap-[6vw] overflow-hidden bg-paper md:gap-[4vw] lg:gap-[2.2vw]">
        <SplitText
          lines={site.experience.title}
          className="text-center text-[9vw] leading-[1.3] md:text-[6.5vw] lg:text-[5vw]"
        />

        {/* The reel: swipe / drag sideways, arrow keys, or click a side frame */}
        <div
          ref={reelRef}
          role="group"
          data-cursor="grab"
          aria-roledescription="carousel"
          aria-label={`Experience by year, showing ${years[active].year}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") goRef.current(1);
            else if (e.key === "ArrowLeft") goRef.current(-1);
            else return;
            e.preventDefault();
          }}
          className="xp-reel relative w-full touch-pan-y select-none [perspective:1800px] focus-visible:outline-none"
        >
          <div className="relative mx-auto w-[82vw] [transform-style:preserve-3d] md:w-[80vw] lg:w-[74vw]">
            {years.map((year, i) => (
              <div
                key={year.year}
                ref={(el) => {
                  frameRefs.current[i] = el;
                }}
                aria-hidden={i !== active}
                className={cn("xp-frame w-full will-change-transform", i === 0 ? "relative" : "absolute inset-x-0 top-0")}
                style={
                  {
                    "--accent": year.accent,
                    ...(i === 0
                      ? {}
                      : {
                          transform: `translate3d(${wrap(i) * 68}vw,0,-220px) rotateY(${wrap(i) > 0 ? -38 : 38}deg) scale(0.86)`,
                          opacity: Math.abs(wrap(i)) > 1 ? 0 : 0.65,
                        }),
                  } as CSSProperties
                }
              >
                <div className="xp-card relative overflow-hidden rounded-[4vw] border p-[5vw] md:rounded-[3vw] md:p-[3.5vw] lg:rounded-[1.8vw] lg:p-[2.4vw]">
                  {/* Outlined watermark year */}
                  <span aria-hidden className="xp-watermark pointer-events-none absolute -top-[2.5vw] -right-[3vw] text-[23vw] leading-none tracking-[-0.04em] md:-top-[3vw] md:text-[22vw] lg:-top-[2.4vw] lg:-right-[1vw] lg:text-[12vw]">
                    {year.year}
                  </span>
                  <YearFrame year={year} />
                  {/* Sheen that follows the cursor on the centre frame */}
                  <span aria-hidden className="xp-glare pointer-events-none absolute inset-0 z-[4] rounded-[inherit]" />
                </div>
                {i !== active && (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => goRef.current(Math.round(wrap(i - active)))}
                    aria-label={`Show ${year.year}`}
                    className="absolute inset-0 z-10 cursor-pointer rounded-[4vw] md:rounded-[3vw] lg:rounded-[1.8vw]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <p aria-hidden className="flex items-center gap-[2vw] text-[3.4vw] text-fg/55 md:text-[2vw] lg:gap-[0.6vw] lg:text-[0.9vw]">
          <span className="xp-hint">←</span> Swipe to change year <span className="xp-hint xp-hint-r">→</span>
        </p>
      </div>

      {/* Soft white → base hand-off into the next section */}
      <div aria-hidden className="absolute top-[calc(100%_-_24vh)] left-0 h-[60vh] w-full overflow-hidden">
        <div className="absolute top-[-1vh] left-[-7.5vw] z-[2] h-[40vh] w-[115vw] bg-paper blur-[40px]" />
      </div>
    </section>
  );
}

function YearFrame({ year }: { year: (typeof years)[number] }) {
  const n: number = year.items.length;
  return (
    <div className="relative z-[1]">
      <p className="xp-year mb-[5vw] text-[10vw] leading-none tracking-[-0.02em] tabular-nums md:mb-[3vw] md:text-[7vw] lg:mb-[1.8vw] lg:text-[3.6vw]">
        {year.year}
      </p>

      <div className="flex flex-col gap-[5vw] md:gap-[3vw] lg:flex-row lg:gap-[3vw]">
        {/* Index with progress rail */}
        <div className="relative [--xp-row:19vw] md:[--xp-row:9vw] lg:w-[21vw] lg:shrink-0 lg:[--xp-row:6.6vw]">
          <div
            aria-hidden
            className="absolute top-[5vw] left-[3.5px] w-[3px] rounded-full bg-fg/15 md:top-[3vw] lg:top-[2.2vw]"
            style={{ height: `calc(${n - 1} * var(--xp-row))` }}
          />
          <div
            data-rail
            aria-hidden
            className="xp-rail absolute top-[5vw] left-[3.5px] w-[3px] origin-top rounded-full md:top-[3vw] lg:top-[2.2vw]"
            style={{ height: `calc(${n - 1} * var(--xp-row))`, transform: "scaleY(0)" }}
          />
          <ol className="flex flex-col">
            {year.items.map((item, k) => (
              <li key={item.name} className="relative flex h-[var(--xp-row)] items-center gap-[4vw] md:gap-[1.6vw] lg:gap-[1.2vw]">
                <span
                  data-dot
                  aria-hidden
                  className={cn(
                    "xp-dot -mt-[5.5vw] size-2.5 shrink-0 rounded-full border md:-mt-[3.4vw] lg:-mt-[1.4vw]",
                    k === 0 && "on",
                  )}
                />
                <div>
                  <h3 className="text-[4.6vw] leading-[1.4] md:text-[3.2vw] lg:text-[1.4vw]">{item.name}</h3>
                  <p className="text-[3.6vw] leading-[1.5] text-fg/70 md:text-[2.3vw] lg:text-[0.95vw]">
                    {item.tags.join("  •  ")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Stacked previews */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[3vw] md:rounded-[2vw] lg:aspect-[16/9] lg:rounded-[1.2vw]">
          {year.items.map((item, k) => (
            <div
              key={item.name}
              data-card
              className="absolute inset-0 overflow-hidden rounded-[inherit] bg-cream will-change-transform"
              style={{ transform: k === 0 ? "none" : "translateY(100%)" }}
            >
              <Image
                src={item.image}
                alt={`${item.name} — preview`}
                fill
                draggable={false}
                sizes="(min-width: 1025px) 46vw, 80vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
