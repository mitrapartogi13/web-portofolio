"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { clamp, docTop, lerp, prefersReducedMotion, subscribeScroll } from "@/lib/scroll";
import SplitText from "../SplitText";
import Reveal from "../Reveal";

/**
 * 275vh section. Intro on top, then a sticky row of cards that travels from
 * just off the right edge (104.6vw) to its end position, starting 0.2vh
 * before the section top and lasting 1.97vh (fitted to the reference).
 */
export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let top = 0;
    let measuredAt = -1;
    return subscribeScroll((y) => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (measuredAt !== vw) {
        top = docTop(section);
        measuredAt = vw;
      }
      const p = clamp((y - (top - 0.2 * vh)) / (1.97 * vh));
      const end = -(track.scrollWidth - vw);
      track.style.transform = `translateX(${lerp(1.046 * vw, end, p)}px)`;
    });
  }, []);

  return (
    <section ref={sectionRef} id="services" className="relative h-[275vh] bg-night">
      <div className="relative px-[5vw] pt-[15vw] md:w-[85vw] md:px-[5vw] md:pt-[15vw] lg:w-[60vw] lg:px-[4vw] lg:pt-[6vw]">
        <SplitText
          lines={site.services.title}
          className="text-[9vw] leading-[1.2] md:text-[7vw] lg:text-[5.5vw]"
        />
        <Reveal
          as="p"
          className="rise mt-[5vw] text-[4.5vw] leading-[1.5] md:mt-[5vw] md:w-[75vw] md:text-[2.5vw] lg:mt-[1.5vw] lg:w-[39vw] lg:text-[1.25vw]"
        >
          {site.services.text}
        </Reveal>
      </div>

      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-[5vw] px-[5vw] will-change-transform md:gap-[3vw] md:px-[5vw] lg:gap-[1.6vw] lg:px-[4vw]"
          style={{ transform: "translateX(104.6vw)" }}
        >
          {site.services.cards.map((card) => (
            <a
              key={card.title}
              href="#contact"
              className="group relative flex h-[85vw] w-[75vw] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-card p-[5vw] md:h-[65vw] md:w-[55vw] md:p-[3vw] lg:h-[30vw] lg:w-[27vw] lg:p-[1.6vw]"
            >
              <div aria-hidden className="bg-brand absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex justify-end">
                <span className="relative grid size-[9vw] place-items-center overflow-hidden rounded-full border border-white/30 transition-colors duration-300 group-hover:bg-white md:size-[7vw] lg:size-[3vw]">
                  <ArrowUpRight
                    aria-hidden
                    className="size-[45%] transition-transform duration-300 ease-out group-hover:translate-x-[150%] group-hover:-translate-y-[150%] group-hover:text-black"
                  />
                  <ArrowUpRight
                    aria-hidden
                    className="absolute size-[45%] -translate-x-[150%] translate-y-[150%] text-black transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
                  />
                </span>
              </div>
              <div className="relative">
                <h3 className="mb-[3vw] text-[6.5vw] leading-[1.5] md:mb-[2vw] md:text-[5vw] lg:mb-[1vw] lg:text-[2.5vw]">
                  {card.title}
                </h3>
                <ul className="pl-[1.5vw] lg:pl-[0.5vw]">
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="mb-[1.8vw] flex items-center gap-[2.5vw] text-[4vw] leading-[1.5] last:mb-0 md:mb-[1vw] md:gap-[1.4vw] md:text-[3vw] lg:mb-[0.4vw] lg:gap-[0.7vw] lg:text-[1.25vw]"
                    >
                      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-white" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
