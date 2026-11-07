"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { clamp, docTop, easeInOutCubic, prefersReducedMotion, subscribeScroll } from "@/lib/scroll";
import SplitText from "../SplitText";

const work = site.work.items;
// Same arrangement as the reference: column 1 = items 1,3; column 2 = items 2,4.
const columns = [
  { images: [work[0].image, work[2].image], dur: "10s", delay: "-6.1s" },
  { images: [work[1].image, work[3].image], dur: "18s", delay: "-6.1s" },
];

/**
 * 300vh section. The gradient card is sticky and shrinks from scale 1 to 0.5
 * over the first 2 viewport heights (easeInOutCubic, measured on the
 * reference), uncovering a wall of project shots drifting upwards.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let top = 0;
    let measuredAt = -1;
    return subscribeScroll((y) => {
      const section = sectionRef.current;
      const card = cardRef.current;
      if (!section || !card) return;
      if (measuredAt !== window.innerWidth) {
        top = docTop(section);
        measuredAt = window.innerWidth;
      }
      const p = clamp((y - top) / (2 * window.innerHeight));
      card.style.transform = `scale(${1 - 0.5 * easeInOutCubic(p)})`;
    });
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative h-[300vh]">
      {/* Work wall, revealed as the card shrinks */}
      <div aria-hidden className="absolute inset-0 bg-night">
        <div className="sticky top-0 flex h-screen gap-[2.5vw] overflow-hidden px-[5vw] lg:px-[4vw]">
          {columns.map((col, c) => (
            <div
              key={c}
              className="wall-col flex flex-1 flex-col gap-[2.5vw]"
              style={{ "--wall-gap": "2.5vw", "--wall-dur": col.dur, "--wall-delay": col.delay } as CSSProperties}
            >
              {[...col.images, ...col.images].map((src, i) => (
                <div key={i} className="relative aspect-[644/389] w-full shrink-0 overflow-hidden">
                  <Image src={src} alt="" fill sizes="50vw" className="object-cover" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hero card */}
      <div
        ref={cardRef}
        className="bg-hero sticky top-0 z-[2] flex h-screen origin-center flex-col overflow-hidden px-[5vw] pt-[30vw] will-change-transform lg:flex-row lg:items-center lg:px-[4vw] lg:pt-0"
      >
        {/* Blend sits on the positioned wrapper: its transform creates the
            stacking context, so the blend must live here to see the gradient. */}
        <div
          aria-hidden
          className="absolute top-[38vh] left-1/2 h-[193vw] w-[160vw] -translate-x-1/2 opacity-95 mix-blend-luminosity md:top-[-16vh] md:left-[10vw] md:h-[180vh] md:w-[100vw] md:translate-x-0 lg:left-1/2 lg:w-[180vw] lg:-translate-x-1/2"
        >
          <Image
            src={site.hero.image}
            alt=""
            fill
            priority
            quality={55}
            sizes="(min-width: 1025px) 75vw, (min-width: 768px) 60vw, 100vw"
            className="object-contain brightness-[0.7] contrast-[1.2] [mask-image:radial-gradient(ellipse_55%_48%_at_55%_48%,black_45%,transparent_100%)] md:[mask-image:radial-gradient(ellipse_50%_56%_at_53%_40%,black_45%,transparent_100%)] lg:[mask-image:radial-gradient(ellipse_26%_56%_at_53%_40%,black_45%,transparent_100%)]"
          />
        </div>

        <div className="relative z-10 flex w-full flex-col lg:flex-row lg:justify-between">
          <SplitText
            as="h1"
            onMount
            delay={0.2}
            lines={[site.hero.title.join(" ")]}
            className="text-[15vw] leading-[1.1] md:w-[56vw] md:text-[12vw] lg:w-[41.4vw] lg:text-[7.5vw]"
          />
          <div className="mt-[6vw] flex flex-col-reverse gap-[7vw] text-[4.5vw] leading-[1.15] md:mt-[4vw] md:gap-[10.4vw] md:py-[2vw] md:text-[3.5vw] lg:mt-0 lg:flex-col lg:justify-between lg:gap-0 lg:text-right lg:text-[1.25vw]">
            <p>
              {site.hero.sideTop[0]}
              <br />
              {site.hero.sideTop[1]}
            </p>
            <p>
              {site.hero.sideBottom[0]}
              <br />
              {site.hero.sideBottom[1]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
