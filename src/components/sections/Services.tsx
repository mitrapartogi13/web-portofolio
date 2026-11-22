"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { clamp, docTop, lerp, prefersReducedMotion, subscribeScroll } from "@/lib/scroll";
import SplitText from "../SplitText";
import Reveal from "../Reveal";
import RollText from "../RollText";
import TechIcon from "../TechIcon";
import { useEntryFill } from "@/lib/useEntryFill";

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
    <section ref={sectionRef} id="services" className="relative h-[275vh] bg-base">
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
            <StackCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * One tech stack card. Not a link: on hover an ink fill blooms from the
 * cursor's entry point (same as the "Get in Touch" button), the title
 * letters roll into a light copy, and the logos and list turn light.
 */
function StackCard({ card }: { card: (typeof site.services.cards)[number] }) {
  const { fillRef, handlers } = useEntryFill();
  return (
    <div
      onPointerEnter={handlers.onPointerEnter}
      onPointerLeave={handlers.onPointerLeave}
      className="group relative flex h-[85vw] w-[75vw] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-fg/12 bg-paper p-[5vw] md:h-[65vw] md:w-[55vw] md:p-[3vw] lg:h-[30vw] lg:w-[27vw] lg:p-[1.6vw]"
    >
      <span
        ref={fillRef}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-0 rounded-full bg-fg"
        style={{ transform: "translate(-50%, -50%) scale(0)" }}
      />

      {/* Logos of the card's tools */}
      <ul aria-hidden className="relative flex flex-wrap gap-[2.5vw] md:gap-[1.4vw] lg:gap-[0.6vw]">
        {card.items.map((item) => (
          <li
            key={item.name}
            className="grid size-[12vw] place-items-center rounded-full border border-fg/15 text-fg transition-colors duration-500 group-hover:border-paper/25 group-hover:text-paper md:size-[8vw] lg:size-[3.4vw]"
          >
            <TechIcon name={item.icon} className="size-[45%]" />
          </li>
        ))}
      </ul>

      <div className="relative">
        <h3 className="mb-[3vw] text-[6.5vw] leading-[1.5] md:mb-[2vw] md:text-[5vw] lg:mb-[1vw] lg:text-[2.5vw]">
          <RollText text={card.title} fromClass="text-fg" toClass="text-paper" />
        </h3>
        <ul className="pl-[1.5vw] text-fg transition-colors duration-500 group-hover:text-paper lg:pl-[0.5vw]">
          {card.items.map((item) => (
            <li
              key={item.name}
              className="mb-[1.8vw] flex items-center gap-[2.5vw] text-[4vw] leading-[1.5] last:mb-0 md:mb-[1vw] md:gap-[1.4vw] md:text-[3vw] lg:mb-[0.4vw] lg:gap-[0.7vw] lg:text-[1.25vw]"
            >
              <TechIcon name={item.icon} className="size-[1.1em] shrink-0" />
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
