"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { clamp, docTop, prefersReducedMotion, subscribeScroll } from "@/lib/scroll";
import SplitText from "../SplitText";

// Two waves of the six wordmarks, like the reference's 12 logos.
const logos = [...site.trusted.logos, ...site.trusted.logos];
// x/y jitter in reference px (at 1440 wide), taken from its transforms.
const jitter = [
  [-110, 85], [74, 179], [89, -1], [-144, 26], [-107, 77], [-116, 103],
  [157, 101], [154, -28], [-96, -144], [-127, -121], [-35, 73], [-96, 71],
];
// Start of each logo's flight on section progress; wave 2 trails wave 1.
const starts = logos.map((_, i) => (i < 6 ? 0.07 + i * 0.056 : 0.508 + (i - 6) * 0.037));
const FLIGHT = 0.35;

/** Opacity peaks near z = -400 and falls off faster behind than in front. */
function opacityAt(z: number) {
  return clamp(z > -400 ? 1 - (z + 400) * 0.00042 : 1 - (-400 - z) * 0.00065);
}

/**
 * 240vh section: sticky headline with a second sticky layer on top where
 * wordmarks fly from z = -2200 towards the viewer (perspective 5040px),
 * blurring by 10 × (1 − opacity), as measured on the reference.
 */
export default function Trusted() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    let top = 0;
    let height = 0;
    let measuredAt = -1;
    return subscribeScroll((y) => {
      const section = sectionRef.current;
      if (!section) return;
      const vw = window.innerWidth;
      if (measuredAt !== vw) {
        top = docTop(section);
        height = section.offsetHeight;
        measuredAt = vw;
      }
      const p = clamp((y - top) / (height - window.innerHeight));
      const k = vw / 1440;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = reduce ? 0.55 : clamp((p - starts[i]) / FLIGHT);
        const z = -2200 + 3900 * t;
        const op = reduce ? 0.35 : opacityAt(z);
        el.style.transform = `translate3d(${jitter[i][0] * k}px, ${jitter[i][1] * k}px, ${reduce ? 0 : z}px)`;
        el.style.opacity = String(op);
        el.style.filter = `blur(${reduce ? 0 : 10 * (1 - op)}px)`;
      });
    });
  }, []);

  return (
    <section ref={sectionRef} id="trusted" className="relative z-[2] h-[240vh] bg-night">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <SplitText
          lines={site.trusted.title}
          className="w-[80vw] text-center text-[8vw] leading-[1.2] md:text-[7vw] lg:w-[60vw] lg:text-[5.5vw]"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none sticky top-0 z-20 -mt-[100vh] flex h-screen items-center justify-center overflow-hidden"
      >
        <div className="grid w-[90vw] grid-cols-3 gap-[6vw] [perspective:5040px] md:w-[82vw] md:grid-cols-5 md:gap-[3vw]">
          {logos.map((name, i) => (
            <div
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="flex h-[20vw] items-center justify-center text-center text-[5vw] leading-tight tracking-[-0.01em] whitespace-pre-line opacity-0 will-change-transform md:h-[15vw] md:text-[3vw] lg:h-[8vw] lg:text-[1.9vw]"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
