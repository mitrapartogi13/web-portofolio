"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { prefersReducedMotion } from "@/lib/scroll";
import SplitText from "../SplitText";
import Reveal from "../Reveal";

const items = site.awards.items;

// Timings fitted to positions sampled every ~35ms on the reference.
const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";
const CARD_MOVE = "transform 660ms cubic-bezier(0.33, 1.53, 0.69, 0.99)"; // back-out, ~9% overshoot
const LAYER_IN = `transform 440ms ${EASE_OUT_CUBIC}`;
const FADE_IN = `opacity 320ms ${EASE_OUT_CUBIC}`;
const FADE_OUT = `opacity 430ms ${EASE_OUT_CUBIC}`;

/**
 * Ledger of awards. On desktop a preview card sits at 50vw and glides
 * vertically (back-out ease, slight overshoot) to centre on the hovered row;
 * it does not follow the cursor horizontally. Each newly hovered row's image
 * scales 0 → 1.05 on top of the stack. The card fades out when the pointer
 * leaves the list but keeps its position, so the next hover glides from there.
 */
export default function Awards() {
  const boxRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const api = useRef<{ enter: (i: number) => void; leave: () => void } | null>(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    let z = 1;
    let top = 0; // index of the image layer currently on top

    api.current = {
      enter(i) {
        const row = rowRefs.current[i];
        const box = boxRef.current;
        const card = cardRef.current;
        if (!row || !box || !card) return;

        const y = row.offsetTop + row.offsetHeight / 2 - box.offsetHeight / 2;
        card.style.transition = reduce ? "none" : CARD_MOVE;
        card.style.transform = `translate3d(0, ${y}px, 0)`;

        const layer = layerRefs.current[i];
        if (layer && i !== top) {
          top = i;
          layer.style.zIndex = String(++z);
          if (reduce) {
            layer.style.transform = "scale(1.05)";
          } else {
            layer.style.transition = "none";
            layer.style.transform = "scale(0)";
            void layer.offsetWidth; // commit the start state before animating
            layer.style.transition = LAYER_IN;
            layer.style.transform = "scale(1.05)";
          }
        }

        box.style.transition = reduce ? "none" : FADE_IN;
        box.style.opacity = "1";
      },
      leave() {
        const box = boxRef.current;
        if (!box) return;
        box.style.transition = reduce ? "none" : FADE_OUT;
        box.style.opacity = "0";
      },
    };
  }, []);

  return (
    <section id="awards" className="relative bg-base py-[7vw]">
      <div className="px-[5vw] lg:px-[4vw]">
        <SplitText
          lines={site.awards.title}
          className="mb-[4vw] text-[9vw] leading-[1.2] md:text-[7vw] lg:text-[5.5vw]"
        />

        <div className="relative" onPointerLeave={() => api.current?.leave()}>
          {items.map((item, i) => (
            <div key={item.title} onPointerEnter={(e) => e.pointerType === "mouse" && api.current?.enter(i)}>
              <div
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className="py-5 lg:py-8"
              >
                <Reveal as="h3" delay={i * 0.05} className="line-up overflow-clip text-[5.5vw] leading-[1.5] md:text-[3.4vw] lg:text-[1.8vw]">
                  <span>{item.title}</span>
                </Reveal>
                <Reveal as="p" delay={i * 0.05 + 0.08} className="line-up mt-3 overflow-clip text-[3.6vw] leading-[1.5] tracking-[0.025em] text-fg/60 md:text-[2.3vw] lg:text-[1.25vw]">
                  <span>{item.meta}</span>
                </Reveal>
              </div>
              <Reveal delay={i * 0.08} className="draw h-px w-full bg-fg/15" />
            </div>
          ))}

          {/* Preview card (desktop only): fixed at 50vw, springs between rows */}
          <div
            ref={boxRef}
            aria-hidden
            className="pointer-events-none absolute top-0 left-[46vw] z-10 hidden opacity-0 lg:block"
          >
            <div
              ref={cardRef}
              className="relative h-[22vw] w-[40vw] overflow-hidden rounded-2xl bg-paper shadow-[0_24px_60px_rgb(0_0_0/0.12)] will-change-transform"
            >
              {items.map((item, i) => (
                <div
                  key={item.title}
                  ref={(el) => {
                    layerRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{ zIndex: i === 0 ? 1 : 0, transform: `scale(${i === 0 ? 1.05 : 0})` }}
                >
                  <Image src={item.image} alt="" fill sizes="40vw" className="rounded-2xl object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
