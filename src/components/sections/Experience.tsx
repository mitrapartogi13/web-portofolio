"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Snap from "lenis/snap";
import { onLenis, scrollToY } from "@/lib/lenis";
import { site } from "@/data/site";
import { clamp, docTop, easeOutCubic, prefersReducedMotion, subscribeScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import SplitText from "../SplitText";

const years = site.experience.years;

/*
 * Scroll timeline, in "steps" (one step = STEP viewport heights):
 *   inside a year, one step per item after the first (the card stack);
 *   between two years, one step for the reel to turn.
 * starts[i] is the step at which year i shows its first item.
 */
const STEP = 0.7;
const starts: number[] = [];
let acc = 0;
years.forEach((y, i) => {
  starts.push(acc);
  acc += y.items.length - 1 + (i < years.length - 1 ? 1 : 0);
});
const TOTAL = acc;

/** Reel position (float, 0 = newest year) and each year's local progress. */
function timeline(t: number) {
  let reel = years.length - 1;
  for (let i = 0; i < years.length; i++) {
    const end = starts[i] + years[i].items.length - 1;
    if (t <= end) {
      reel = i;
      break;
    }
    if (i < years.length - 1 && t < starts[i + 1]) {
      reel = i + (t - end); // turning towards the next year
      break;
    }
  }
  const local = years.map((y, i) => clamp(t - starts[i], 0, y.items.length - 1));
  return { reel, local };
}

/**
 * Experience as a film reel of years (newest first). The centre frame is
 * the current year with the original list + stacked preview behaviour;
 * the neighbouring years sit tilted at the sides and can be clicked.
 * Scrolling plays a year's items, then turns the reel to the next year.
 */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeYear, setActiveYear] = useState(0);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    let top = 0;
    let measuredAt = -1;
    let lastYear = 0;

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

      const t = clamp((y - (top + 0.36 * vh)) / (STEP * vh), 0, TOTAL);
      const { reel, local } = timeline(t);

      // Reel: frames slide sideways, tilt away and recede in depth.
      const offset = vw >= 1025 ? 0.68 : vw >= 768 ? 0.8 : 0.78;
      frameRefs.current.forEach((frame, i) => {
        if (!frame) return;
        const d = i - reel;
        const ad = Math.min(Math.abs(d), 1.5);
        const tilt = clamp(d, -1, 1);
        frame.style.transform =
          `translate3d(${d * offset * vw}px, 0, ${-ad * 220}px) rotateY(${-tilt * 38}deg) scale(${1 - Math.min(ad, 1) * 0.14})`;
        frame.style.opacity = String(clamp(1.8 - Math.abs(d)) * (1 - Math.min(ad, 1) * 0.35));
        frame.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));

        // Inside each year: rail, dots and card stack follow its own progress.
        const n = years[i].items.length;
        const u = local[i];
        const rail = frame.querySelector<HTMLElement>("[data-rail]");
        if (rail) rail.style.transform = `scaleY(${n > 1 ? u / (n - 1) : 1})`;
        const cards = frame.querySelectorAll<HTMLElement>("[data-card]");
        const dots = frame.querySelectorAll<HTMLElement>("[data-dot]");
        const seg = (k: number) => (k < 1 || k >= n ? 0 : clamp((u - (k - 1) - 0.27) / 0.44));
        cards.forEach((card, k) => {
          const inT = k === 0 ? 1 : reduce ? (seg(k) > 0.5 ? 1 : 0) : seg(k);
          const nextT = reduce ? (seg(k + 1) > 0.5 ? 1 : 0) : seg(k + 1);
          card.style.transform = `translateY(${(1 - inT) * 100}%)`;
          card.style.filter = `brightness(${1 - 0.7 * nextT})`;
        });
        dots.forEach((dot, k) => dot.classList.toggle("on", k === 0 || seg(k) >= 0.5));
      });

      const current = Math.round(reel);
      if (current !== lastYear) {
        lastYear = current;
        setActiveYear(current);
      }
    });

    // Snap to every item and every year start (Lenis snap, proximity).
    let snap: Snap | null = null;
    let removers: (() => void)[] = [];
    const addPoints = () => {
      removers.forEach((r) => r());
      const section = sectionRef.current;
      if (!snap || !section) return;
      const vh = window.innerHeight;
      const from = docTop(section) + 0.36 * vh;
      removers = Array.from({ length: TOTAL + 1 }, (_, k) => snap!.add(from + k * STEP * vh));
    };
    const offLenis = onLenis((lenis) => {
      snap?.destroy();
      snap = new Snap(lenis, { type: "proximity", distanceThreshold: "30%" });
      addPoints();
    });
    window.addEventListener("resize", addPoints);

    return () => {
      unsubscribe();
      offLenis();
      window.removeEventListener("resize", addPoints);
      snap?.destroy();
    };
  }, []);

  const goToYear = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const vh = window.innerHeight;
    scrollToY(docTop(section) + 0.36 * vh + starts[i] * STEP * vh);
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative pt-[30vw] lg:pt-[8vw]"
      style={{ height: `${(TOTAL * STEP + 1.36) * 100}vh` }}
    >
      {/* The drop-shadow lives on a wrapper: a filter on the clipped band
          itself would be clipped away with it. */}
      <div aria-hidden className="absolute inset-x-0 top-0 z-[2] h-[50vh] [filter:drop-shadow(0_-18px_40px_rgb(15_20_25/0.08))]">
        <div ref={bandRef} className="absolute inset-0 bg-paper [clip-path:ellipse(150%_100%_at_50%_100%)]" />
      </div>

      <div className="sticky top-0 z-[3] flex h-screen flex-col items-center justify-center gap-[6vw] overflow-hidden bg-paper md:gap-[4vw] lg:gap-[2.5vw]">
        <SplitText
          lines={site.experience.title}
          className="text-center text-[9vw] leading-[1.3] md:text-[6.5vw] lg:text-[5vw]"
        />

        {/* The reel */}
        <div className="relative w-full [perspective:1800px]">
          <div className="relative mx-auto w-[80vw] [transform-style:preserve-3d] md:w-[80vw] lg:w-[74vw]">
            {years.map((year, i) => (
              <div
                key={year.year}
                ref={(el) => {
                  frameRefs.current[i] = el;
                }}
                aria-hidden={i !== activeYear}
                className={cn(
                  "w-full rounded-[4vw] border border-fg/10 bg-base p-[5vw] shadow-[0_30px_80px_rgb(15_20_25/0.12)] will-change-transform md:rounded-[3vw] md:p-[3.5vw] lg:rounded-[1.8vw] lg:p-[2.4vw]",
                  i === 0 ? "relative" : "absolute inset-x-0 top-0",
                )}
                style={i === 0 ? undefined : ({ transform: `translate3d(${i * 68}vw,0,-220px) rotateY(-38deg) scale(0.86)`, opacity: 0.65 } as CSSProperties)}
              >
                <YearFrame year={year} />
                {i !== activeYear && (
                  <button
                    type="button"
                    onClick={() => goToYear(i)}
                    aria-label={`Show ${year.year}`}
                    className="absolute inset-0 z-10 cursor-pointer rounded-[inherit]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
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
    <div>
      <div className="mb-[5vw] flex items-baseline justify-between md:mb-[3vw] lg:mb-[1.8vw]">
        <p className="text-[10vw] leading-none tracking-[-0.02em] tabular-nums md:text-[7vw] lg:text-[3.6vw]">{year.year}</p>
        <p className="text-[3.6vw] text-fg/60 md:text-[2.2vw] lg:text-[1vw]">
          {String(n).padStart(2, "0")} {n === 1 ? "entry" : "entries"}
        </p>
      </div>

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
            className="absolute top-[5vw] left-[3.5px] w-[3px] origin-top rounded-full bg-fg md:top-[3vw] lg:top-[2.2vw]"
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
              <Image src={item.image} alt={`${item.name} — preview`} fill sizes="(min-width: 1025px) 46vw, 80vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
