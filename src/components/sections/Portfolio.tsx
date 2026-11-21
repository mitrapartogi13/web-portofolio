"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Snap from "lenis/snap";
import { onLenis } from "@/lib/lenis";
import { site } from "@/data/site";
import { clamp, docTop, easeOutCubic, prefersReducedMotion, subscribeScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import SplitText from "../SplitText";

const items = site.work.items;
const STEPS = items.length - 1;

/**
 * 360vh section. A curved white band rises over the hero (clip-path
 * ellipse 150% → 60%, easeOutCubic), then a sticky gradient panel holds the
 * project list while preview cards slide up one by one, darkening the card
 * beneath to brightness(0.3). Scroll snaps to one stop per card.
 */
export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    let top = 0;
    let height = 0;
    let measuredAt = -1;
    let lastActive = 0;

    // P runs linearly from the first snap point (top + 0.36vh) to the end of
    // the sticky range; the rail shows P directly (measured on the reference).
    const range = (vh: number) => ({ from: top + 0.36 * vh, len: height - 1.36 * vh });

    const unsubscribe = subscribeScroll((y) => {
      const section = sectionRef.current;
      if (!section) return;
      const vh = window.innerHeight;
      if (measuredAt !== window.innerWidth) {
        top = docTop(section);
        height = section.offsetHeight;
        measuredAt = window.innerWidth;
      }

      // Curved band
      const pb = clamp((y - (top - vh)) / (1.08 * vh));
      if (bandRef.current) {
        bandRef.current.style.transform = `translateY(${-0.35 * vh * pb}px)`;
        bandRef.current.style.clipPath = `ellipse(${150 - 90 * easeOutCubic(pb)}% 100% at 50% 100%)`;
      }

      const { from, len } = range(vh);
      const p = clamp((y - from) / len);
      if (railRef.current) railRef.current.style.transform = `scaleY(${p})`;

      // Card k slides in while P ∈ [(k-1)/3 + 0.09, (k-1)/3 + 0.237].
      const seg = (k: number) =>
        k < 1 || k > STEPS ? 0 : clamp((p - ((k - 1) / STEPS + 0.09)) / 0.147);
      cardRefs.current.forEach((card, k) => {
        if (!card) return;
        const inT = k === 0 ? 1 : reduce ? (seg(k) > 0.5 ? 1 : 0) : seg(k);
        const nextT = reduce ? (seg(k + 1) > 0.5 ? 1 : 0) : seg(k + 1);
        card.style.transform = `translateY(${(1 - inT) * 100}%)`;
        card.style.filter = `brightness(${1 - 0.7 * nextT})`;
      });

      let a = 0;
      for (let k = 1; k <= STEPS; k++) if (seg(k) >= 0.5) a = k;
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }
    });

    // Snap to one stop per card, like the reference (Lenis snap, proximity).
    let snap: Snap | null = null;
    let removers: (() => void)[] = [];
    const addPoints = () => {
      removers.forEach((r) => r());
      const section = sectionRef.current;
      if (!snap || !section) return;
      const vh = window.innerHeight;
      const t = docTop(section);
      const from = t + 0.36 * vh;
      const len = section.offsetHeight - 1.36 * vh;
      removers = Array.from({ length: STEPS + 1 }, (_, k) => snap!.add(from + (k * len) / STEPS));
    };
    const offLenis = onLenis((lenis) => {
      snap?.destroy();
      snap = new Snap(lenis, { type: "proximity", distanceThreshold: "37%" });
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

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative h-[360vh] pt-[30vw] lg:pt-[8vw]"
    >
      {/* The drop-shadow lives on a wrapper: a filter on the clipped band
          itself would be clipped away with it. */}
      <div aria-hidden className="absolute inset-x-0 top-0 z-[2] h-[50vh] [filter:drop-shadow(0_-18px_40px_rgb(15_20_25/0.08))]">
        <div ref={bandRef} className="absolute inset-0 bg-paper [clip-path:ellipse(150%_100%_at_50%_100%)]" />
      </div>

      <div className="sticky top-0 z-[3] flex h-screen bg-paper flex-col items-center justify-center gap-[15vw] overflow-hidden px-[5vw] md:gap-[6.25vw] lg:gap-[5vw] lg:px-[4vw]">
        <SplitText
          lines={site.work.title}
          className="text-center text-[9vw] leading-[1.5] md:text-[6.5vw] lg:text-[5.5vw]"
        />

        <div className="flex w-full flex-col items-center gap-[8vw] md:gap-[5vw] lg:flex-row lg:gap-[4vw]">
          {/* Index with progress rail */}
          <div className="relative w-full lg:w-[21.33vw] lg:shrink-0">
            <div aria-hidden className="absolute top-[7vw] left-1 h-[63vw] w-px bg-fg/15 md:top-[3.5vw] md:h-[33vw] lg:top-[2.75vw] lg:h-[21vw]" />
            <div
              ref={railRef}
              aria-hidden
              className="absolute top-[7vw] left-1 h-[63vw] w-px origin-top scale-y-0 bg-fg md:top-[3.5vw] md:h-[33vw] lg:top-[2.75vw] lg:h-[21vw]"
            />
            <ol className="flex flex-col">
              {items.map((item, i) => (
                <li
                  key={item.name}
                  aria-current={i === active ? "true" : undefined}
                  className="relative flex h-[21vw] items-center gap-[5vw] md:h-[11vw] md:gap-[1.2vw] lg:h-[7vw] lg:gap-[1.2vw]"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "-mt-[7vw] size-2.5 shrink-0 rounded-full border transition-colors duration-500 md:-mt-[4vw] lg:-mt-[1.5vw]",
                      i <= active ? "border-fg bg-fg" : "border-fg/35 bg-paper",
                    )}
                  />
                  <div>
                    <h3 className="text-[5.5vw] leading-[1.5] md:text-[3.5vw] lg:text-[1.5vw]">{item.name}</h3>
                    <p className="text-[4.2vw] leading-[1.5] md:text-[2.5vw] lg:text-[1vw]">
                      {item.tags.join("  •  ")}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Stacked previews */}
          <div className="relative h-[52vw] w-[90vw] shrink-0 overflow-hidden rounded-[3vw] lg:h-[38vw] lg:w-[66.67vw] lg:rounded-[1.667vw]">
            {items.map((item, i) => (
              <div
                key={item.name}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute inset-0 overflow-hidden rounded-[inherit] bg-cream will-change-transform"
                style={{ transform: i === 0 ? "none" : "translateY(100%)" }}
              >
                <Image
                  src={item.image}
                  alt={`${item.name} — screenshot`}
                  fill
                  sizes="(min-width: 1025px) 67vw, 90vw"
                  className="object-cover"
                />
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
