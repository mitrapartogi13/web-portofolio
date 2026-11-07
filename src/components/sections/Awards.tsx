"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import SplitText from "../SplitText";
import Reveal from "../Reveal";

const items = site.awards.items;

/**
 * Ledger of awards. On desktop a preview card follows the cursor; the
 * hovered row's image scales in on top of the previous one.
 */
export default function Awards() {
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [shown, setShown] = useState<number[]>([]);

  const move = (e: React.PointerEvent) => {
    const list = listRef.current;
    const preview = previewRef.current;
    if (!list || !preview || e.pointerType !== "mouse") return;
    const r = list.getBoundingClientRect();
    preview.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px) translate(-50%, -50%)`;
  };

  const enter = (i: number) => {
    setHovered(i);
    setShown((s) => [...s.filter((x) => x !== i), i]);
  };

  return (
    <section id="awards" className="relative bg-night py-[7vw]">
      <div className="px-[5vw] lg:px-[4vw]">
        <SplitText
          lines={site.awards.title}
          className="mb-[4vw] text-[9vw] leading-[1.2] md:text-[7vw] lg:text-[5.5vw]"
        />

        <div
          ref={listRef}
          className="relative"
          onPointerMove={move}
          onPointerLeave={() => setHovered(null)}
        >
          {items.map((item, i) => (
            <div key={item.title} onPointerEnter={() => enter(i)}>
              <div className="py-5 lg:py-8">
                <Reveal as="h3" delay={i * 0.05} className="line-up overflow-clip text-[5.5vw] leading-[1.5] md:text-[3.4vw] lg:text-[1.8vw]">
                  <span>{item.title}</span>
                </Reveal>
                <Reveal as="p" delay={i * 0.05 + 0.08} className="line-up mt-3 overflow-clip text-[3.6vw] leading-[1.5] tracking-[0.025em] text-white/30 md:text-[2.3vw] lg:text-[1.25vw]">
                  <span>{item.meta}</span>
                </Reveal>
              </div>
              <Reveal delay={i * 0.08} className="draw h-px w-full bg-white/20" />
            </div>
          ))}

          {/* Cursor-following preview (desktop only) */}
          <div
            ref={previewRef}
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-0 left-0 z-10 hidden transition-opacity duration-300 lg:block",
              hovered === null ? "opacity-0" : "opacity-100",
            )}
          >
            <div className="relative h-[22vw] w-[40vw] overflow-hidden rounded-2xl bg-night shadow-2xl">
              {items.map((item, i) => {
                const z = shown.indexOf(i);
                return (
                  <div
                    key={item.title}
                    className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ zIndex: z + 1, transform: `scale(${z === -1 ? 0 : hovered === i ? 1.05 : 1})` }}
                  >
                    <Image src={item.image} alt="" fill sizes="40vw" className="rounded-2xl object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
