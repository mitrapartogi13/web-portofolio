"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { clamp, docTop, lerp, prefersReducedMotion, subscribeScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import SplitText from "../SplitText";

type Project = (typeof site.projects.items)[number];
type Filter = (typeof site.projects.filters)[number];

/**
 * Staggered two-column project grid (an echo of the hero's work wall).
 * - Reveal: each image opens from the bottom with clip-path while it
 *   zooms 1.2 → 1; text rises after it.
 * - Scroll: the right column drifts against the left (±6vw) for depth.
 * - Hover (mouse): image scales 1.05, a gradient "View" badge follows the
 *   cursor, the underline fills with the brand gradient, arrow swaps.
 * - Filters re-run the reveal for the cards that remain.
 */
export default function Projects() {
  const { title, intro, filters, items } = site.projects;
  const [filter, setFilter] = useState<Filter>("All");
  const sectionRef = useRef<HTMLElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const visible = filter === "All" ? items : items.filter((p) => p.category === filter);
  const columns: Project[][] = [[], []];
  visible.forEach((p, i) => columns[i % 2].push(p));

  // Reveal cards as they enter the viewport; re-run after a filter change.
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>("[data-proj]:not(.in)") ?? [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filter]);

  // Right column parallax (desktop/tablet only).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let top = 0;
    let measuredAt = -1;
    return subscribeScroll((y) => {
      const section = sectionRef.current;
      const col = rightColRef.current;
      if (!section || !col) return;
      const vw = window.innerWidth;
      if (vw < 768) {
        col.style.transform = "";
        return;
      }
      if (measuredAt !== vw) {
        top = docTop(section);
        measuredAt = vw;
      }
      const vh = window.innerHeight;
      const p = clamp((y + vh - top) / (section.offsetHeight + vh));
      col.style.transform = `translate3d(0, ${lerp(0.06, -0.06, p) * vw}px, 0)`;
    });
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative bg-night px-[5vw] py-[15vw] lg:px-[4vw] lg:py-[8vw]">
      <div className="flex flex-col gap-[6vw] lg:flex-row lg:items-end lg:justify-between lg:gap-[4vw]">
        <SplitText lines={title} className="text-[9vw] leading-[1.2] md:text-[7vw] lg:text-[5.5vw]" />
        <p className="text-[4vw] leading-[1.5] text-white/80 md:w-[70vw] md:text-[2.5vw] lg:w-[30vw] lg:text-[1.25vw]">
          {intro}
        </p>
      </div>

      <div className="mt-[8vw] flex items-center justify-between gap-6 md:mt-[5vw] lg:mt-[4vw]">
        <div
          role="group"
          aria-label="Filter projects"
          className="-mx-[5vw] flex gap-[2.5vw] overflow-x-auto px-[5vw] [scrollbar-width:none] md:gap-[1.5vw] lg:mx-0 lg:gap-[0.8vw] lg:overflow-visible lg:px-0"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "relative h-[10vw] shrink-0 overflow-hidden rounded-full border px-[5vw] text-[3.8vw] transition-colors duration-300 md:h-[6vw] md:px-[3vw] md:text-[2.3vw] lg:h-[3.2vw] lg:px-[1.6vw] lg:text-[1.1vw]",
                filter === f ? "border-transparent" : "border-white/20 hover:border-white/60",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "bg-brand absolute inset-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  filter === f ? "scale-100" : "scale-0",
                )}
              />
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
        <p aria-live="polite" className="hidden shrink-0 text-[1.25vw] text-white/50 lg:block">
          ({String(visible.length).padStart(2, "0")})
        </p>
      </div>

      <div className="mt-[10vw] grid grid-cols-1 gap-[14vw] md:mt-[6vw] md:grid-cols-2 md:gap-x-[4vw] md:gap-y-0 lg:mt-[5vw]">
        {columns.map((col, c) => (
          <div
            key={c}
            ref={c === 1 ? rightColRef : undefined}
            className={cn("flex flex-col gap-[14vw] md:gap-[8vw] lg:gap-[6vw]", c === 1 && "md:pt-[12vw] lg:pt-[10vw]")}
          >
            {col.map((p) => (
              <ProjectCard key={`${filter}-${p.name}`} project={p} index={items.indexOf(p)} delay={c * 0.12} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, delay }: { project: Project; index: number; delay: number }) {
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState(false);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !badgeRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    badgeRef.current.style.left = `${e.clientX - r.left}px`;
    badgeRef.current.style.top = `${e.clientY - r.top}px`;
  };

  return (
    <article data-proj className="proj group" style={{ "--d": `${delay}s` } as CSSProperties}>
      <a href={project.href} className="block" aria-label={`${project.name}: ${project.summary}`}>
        <div
          className="proj-media relative aspect-[16/10] overflow-hidden rounded-[var(--r)] bg-card [--r:3vw] lg:[--r:1.667vw]"
          onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
          onPointerLeave={() => setHover(false)}
          onPointerMove={move}
        >
          <div className="proj-zoom absolute inset-0">
            <div className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
              <Image src={project.image} alt="" fill sizes="(min-width: 768px) 46vw, 90vw" className="object-cover" />
            </div>
          </div>
          <span className="absolute top-[3vw] left-[3vw] rounded-full bg-black/45 px-[3vw] py-[1vw] text-[3.2vw] backdrop-blur-md md:text-[1.8vw] lg:top-[1.2vw] lg:left-[1.2vw] lg:px-[1vw] lg:py-[0.35vw] lg:text-[0.95vw]">
            {project.category}
          </span>
          {/* Cursor badge (mouse only) */}
          <span
            ref={badgeRef}
            aria-hidden
            className={cn(
              "bg-brand pointer-events-none absolute top-1/2 left-1/2 hidden size-[7vw] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[1vw] transition-[scale,left,top] duration-[400ms,250ms,250ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid",
              hover ? "scale-100" : "scale-0",
            )}
          >
            <span className="flex items-center gap-[0.3vw]">
              View <ArrowUpRight className="size-[1.1vw]" />
            </span>
          </span>
        </div>

        <div className="proj-meta">
          <div className="mt-[4vw] flex items-baseline justify-between gap-4 md:mt-[2vw] lg:mt-[1.5vw]">
            <h3 className="text-[6vw] leading-[1.3] md:text-[3.6vw] lg:text-[2vw]">
              <span className="mr-[2vw] align-top text-[3.2vw] text-white/40 md:text-[1.8vw] lg:mr-[0.8vw] lg:text-[0.95vw]">
                {String(index + 1).padStart(2, "0")}
              </span>
              {project.name}
            </h3>
            <div className="flex items-center gap-[3vw] lg:gap-[1vw]">
              <span className="text-[3.6vw] text-white/50 md:text-[2.2vw] lg:text-[1.25vw]">{project.year}</span>
              <span className="relative grid size-[9vw] place-items-center overflow-hidden rounded-full border border-white/30 transition-colors duration-300 group-hover:bg-white md:size-[5vw] lg:size-[2.6vw]">
                <ArrowUpRight
                  aria-hidden
                  className="size-[45%] transition-transform duration-300 ease-out group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
                />
                <ArrowUpRight
                  aria-hidden
                  className="absolute size-[45%] -translate-x-[150%] translate-y-[150%] text-black transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
                />
              </span>
            </div>
          </div>
          <p className="mt-[2vw] text-[3.8vw] leading-[1.5] text-white/70 md:mt-[1vw] md:text-[2.2vw] lg:mt-[0.6vw] lg:w-[90%] lg:text-[1.1vw]">
            {project.summary}
          </p>
          <p className="mt-[2vw] text-[3.4vw] text-white/50 md:mt-[1vw] md:text-[2vw] lg:mt-[0.8vw] lg:text-[1vw]">
            {project.tags.join("  •  ")}
          </p>
          <div className="relative mt-[4vw] h-px w-full bg-white/20 md:mt-[2vw] lg:mt-[1.5vw]">
            <span className="bg-brand absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
          </div>
        </div>
      </a>
    </article>
  );
}
