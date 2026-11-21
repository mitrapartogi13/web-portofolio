"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import SplitText from "../SplitText";
import Reveal from "../Reveal";

/** Accordion; the first item starts open, like the reference. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-base px-[5vw] py-[6vw] lg:px-[10vw]">
      <SplitText
        lines={site.faq.title}
        className="mb-[6vw] text-center text-[9vw] leading-[1.5] md:text-[7vw] lg:text-[5.5vw]"
      />

      <div>
        {site.faq.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={item.q} delay={i * 0.06} className="rise border-b border-fg/12">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left md:py-8"
                >
                  <span className="text-[4.2vw] leading-[1.5] md:text-[2.6vw] lg:text-[1.5vw]">{item.q}</span>
                  <span
                    aria-hidden
                    className="relative grid size-[12.5vw] shrink-0 place-items-center overflow-hidden rounded-full border border-fg/20 md:size-[5.7vw] lg:size-[3.9vw]"
                  >
                    <span className={cn("bg-brand absolute inset-0 rounded-full transition-transform duration-300", isOpen ? "scale-100" : "scale-0")} />
                    <span className={cn("absolute h-0.5 w-4 rounded-full transition-colors duration-300", isOpen ? "bg-paper" : "bg-fg")} />
                    <span
                      className={cn(
                        "absolute h-0.5 w-4 rounded-full transition-[transform,background-color] duration-300",
                        isOpen ? "bg-paper" : "bg-fg",
                        isOpen ? "rotate-0" : "rotate-90",
                      )}
                    />
                  </span>
                </button>
              </h3>
              <div
                id={`faq-${i}`}
                role="region"
                className={cn(
                  "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 text-[4vw] leading-[1.6] text-fg/75 md:pb-8 md:text-[2.6vw] lg:w-[61vw] lg:pr-[3vw] lg:text-[1.25vw]">
                    {item.a}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
