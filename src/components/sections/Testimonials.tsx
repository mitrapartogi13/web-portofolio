"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import SplitText from "../SplitText";
import Reveal from "../Reveal";

const items = site.testimonials.items;
const n = items.length;

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Placeholder avatar: initials on a dark disc (no real photos yet). */
function Avatar({ name }: { name: string }) {
  return (
    <span className="grid size-full place-items-center rounded-full bg-[#e2e2de] text-[0.32em] text-fg/75">
      {initials(name)}
    </span>
  );
}

/**
 * Card carousel. Five avatars sit on the card's top edge with the active one
 * centred, scaled 1.6× inside a gradient ring; the others overlap at 60%.
 */
export default function Testimonials() {
  const [active, setActive] = useState(0);
  const go = (d: number) => setActive((a) => (a + d + n) % n);
  const item = items[active];

  return (
    <section id="testimonials" className="bg-base px-[5vw] py-[12vw] lg:px-[4vw] lg:py-[7vw]">
      <div className="flex flex-col gap-[16vw] md:gap-[10vw] lg:gap-[6vw]">
        <SplitText
          lines={site.testimonials.title}
          className="mx-auto text-center text-[9vw] leading-[1.2] md:text-[7vw] lg:w-[59.8vw] lg:text-[5.2vw]"
        />

        <Reveal className="rise relative" rise="40px">
          <div className="relative mx-auto h-[95vw] w-[90vw] overflow-hidden rounded-[5vw] border border-fg/10 bg-paper md:h-[52vw] md:rounded-[5vw] lg:h-[30vw] lg:w-[55.2vw] lg:rounded-[2vw]">
            <div
              key={active}
              aria-live="polite"
              className="flex h-full animate-[fade-in_0.6s_ease] flex-col items-center justify-center gap-[6vw] px-[7vw] pt-[22vw] pb-[8vw] text-center md:gap-[4vw] md:px-[8vw] md:pt-[14vw] md:pb-[4vw] lg:gap-[2.5vw] lg:px-[6vw] lg:pt-[8vw] lg:pb-[4vw]"
            >
              <div className="flex flex-col gap-[0.4vw]">
                <p className="text-[6vw] leading-[1.5] text-fg md:text-[4vw] lg:text-[2.6vw]">{item.name}</p>
                <p className="text-[3.5vw] leading-[1.5] md:text-[2.15vw] lg:text-[1.145vw]">{item.role}</p>
              </div>
              <p className="w-[75vw] text-[3.6vw] leading-[1.6] text-fg/70 md:w-[74vw] md:text-[2.15vw] lg:w-[35.3vw] lg:text-[1.145vw]">
                “{item.quote}”
              </p>
            </div>
          </div>

          {/* Avatar rail on the card's top edge */}
          <div className="absolute -top-[6vw] left-1/2 flex -translate-x-1/2 items-center md:-top-[4vw] lg:-top-[2vw]">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const i = (active + offset + n) % n;
              const isActive = offset === 0;
              return (
                <button
                  key={offset}
                  type="button"
                  onClick={() => go(offset)}
                  aria-label={isActive ? `${items[i].name} (current)` : `Show testimonial from ${items[i].name}`}
                  className={cn(
                    "relative size-[11.4vw] shrink-0 overflow-hidden rounded-full text-[11.4vw] transition-transform duration-500 md:size-[8vw] md:text-[8vw] lg:size-[5vw] lg:text-[5vw]",
                    isActive
                      ? "bg-brand z-10 mx-[5vw] scale-[1.6] p-[0.3vw] md:mx-[3vw] lg:mx-[2vw]"
                      : "opacity-60",
                    offset === -1 && "z-[4] -mr-[2.5vw] lg:-mr-[1vw]",
                    offset === -2 && "z-[3] -mr-[2.5vw] lg:-mr-[1vw]",
                    offset === 1 && "z-[4] -ml-[2.5vw] lg:-ml-[1vw]",
                    offset === 2 && "z-[3] -ml-[2.5vw] lg:-ml-[1vw]",
                  )}
                >
                  <Avatar name={items[i].name} />
                </button>
              );
            })}
          </div>

          <div className="mt-[8vw] flex justify-center gap-3 md:mt-[3vw] lg:mt-[3vw]">
            {[
              { d: -1, label: "Previous testimonial", Icon: ArrowLeft },
              { d: 1, label: "Next testimonial", Icon: ArrowRight },
            ].map(({ d, label, Icon }) => (
              <button
                key={d}
                type="button"
                onClick={() => go(d)}
                aria-label={label}
                className="group relative grid size-10 place-items-center overflow-hidden rounded-full border border-fg/20 transition-colors duration-300 hover:text-paper md:size-12"
              >
                <span aria-hidden className="bg-brand absolute inset-0 scale-0 rounded-full transition-transform duration-300 group-hover:scale-100" />
                <Icon aria-hidden className="relative size-4" />
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
