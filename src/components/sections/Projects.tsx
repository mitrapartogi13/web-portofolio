"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { scrollToY } from "@/lib/lenis";
import { clamp, prefersReducedMotion, subscribeScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import SplitText from "../SplitText";

type Project = (typeof site.projects.items)[number];
type Filter = (typeof site.projects.filters)[number];

/** The line's head sits this far down the viewport. */
const HEAD = 0.62;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Interactive timeline. A progress line is drawn by scrolling (its head
 * rides at 62% of the viewport); when it reaches a project's node the node
 * fills with a pulse, the year darkens and the card grows out of the line.
 * Scrolling back reverses it. Nodes are buttons that jump to their project;
 * the filter keeps working and the counter follows the line.
 */
export default function Projects() {
  const { title, intro, filters, items } = site.projects;
  const [filter, setFilter] = useState<Filter>("All");
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const visible = filter === "All" ? items : items.filter((p) => p.category === filter);

  // Scroll-linked line and node activation. Re-subscribes after a filter
  // change so the new layout is measured straight away.
  useEffect(() => {
    const reduce = prefersReducedMotion();
    return subscribeScroll(() => {
      const track = trackRef.current;
      if (!track) return;
      const r = track.getBoundingClientRect();
      const reach = clamp(window.innerHeight * HEAD - r.top, 0, r.height);
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${r.height ? reach / r.height : 0})`;
      if (tipRef.current) {
        tipRef.current.style.transform = `translate3d(-50%, ${reach}px, 0) translateY(-50%)`;
        tipRef.current.style.opacity = reach > 0 && reach < r.height ? "1" : "0";
      }

      let on = 0;
      const nodes = track.querySelectorAll<HTMLElement>("[data-node]");
      nodes.forEach((item) => {
        const node = item.querySelector<HTMLElement>(".tl-node");
        if (!node) return;
        const nr = node.getBoundingClientRect();
        const active = reduce || reach >= nr.top + nr.height / 2 - r.top;
        item.classList.toggle("in", active);
        if (active) on++;
      });
      if (counterRef.current) counterRef.current.textContent = `${pad(on)} / ${pad(nodes.length)}`;
    });
  }, [filter]);

  const jumpTo = (el: HTMLElement) => {
    const node = el.querySelector<HTMLElement>(".tl-node");
    if (!node) return;
    const nr = node.getBoundingClientRect();
    scrollToY(window.scrollY + nr.top + nr.height / 2 - window.innerHeight * HEAD + 4);
  };

  return (
    <section id="projects" className="relative bg-base px-[5vw] py-[15vw] lg:px-[4vw] lg:py-[8vw]">
      <div className="flex flex-col gap-[6vw] lg:flex-row lg:items-end lg:justify-between lg:gap-[4vw]">
        <SplitText lines={title} className="text-[9vw] leading-[1.2] md:text-[7vw] lg:text-[5.5vw]" />
        <p className="text-[4vw] leading-[1.5] text-fg/75 md:w-[70vw] md:text-[2.5vw] lg:w-[30vw] lg:text-[1.25vw]">
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
                filter === f ? "border-transparent text-paper" : "border-fg/20 hover:border-fg/60",
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
        <p className="hidden shrink-0 text-[1.25vw] text-fg/60 tabular-nums md:block md:text-[2.2vw] lg:text-[1.25vw]">
          <span ref={counterRef}>00 / {pad(visible.length)}</span>
        </p>
      </div>

      <div ref={trackRef} className="relative mt-[12vw] md:mt-[8vw] lg:mt-[6vw]">
        {/* Rail, progress fill and the moving head */}
        <div aria-hidden className="absolute inset-y-0 left-[3vw] w-px bg-fg/12 md:left-1/2" />
        <div ref={fillRef} aria-hidden className="absolute inset-y-0 left-[3vw] w-px origin-top scale-y-0 bg-fg md:left-1/2" />
        <div
          ref={tipRef}
          aria-hidden
          className="absolute top-0 left-[3vw] z-20 size-3 rounded-full bg-fg opacity-0 shadow-[0_0_0_6px_rgb(15_20_25/0.1)] transition-opacity duration-300 md:left-1/2"
        />

        <ol className="relative flex flex-col gap-[16vw] md:gap-[10vw] lg:gap-[7vw]">
          {visible.map((p, i) => (
            <TimelineItem
              key={`${filter}-${p.name}`}
              project={p}
              index={items.indexOf(p)}
              side={i % 2 === 0 ? "left" : "right"}
              onJump={jumpTo}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function TimelineItem({
  project,
  index,
  side,
  onJump,
}: {
  project: Project;
  index: number;
  side: "left" | "right";
  onJump: (el: HTMLElement) => void;
}) {
  const itemRef = useRef<HTMLLIElement>(null);
  const left = side === "left";

  return (
    <li
      ref={itemRef}
      data-node
      data-side={side}
      className="tl-item proj group/item relative grid grid-cols-[6vw_1fr] items-start gap-x-[4vw] md:grid-cols-[1fr_8vw_1fr] md:gap-x-0"
    >
      {/* Node on the rail (a real button: jumps to this project) */}
      <button
        type="button"
        aria-label={`Go to ${project.name}`}
        onClick={() => itemRef.current && onJump(itemRef.current)}
        className="col-start-1 row-start-1 mt-[3vw] justify-self-center md:col-start-2 md:mt-[1.6vw] lg:mt-[1.2vw]"
      >
        <span className="tl-node relative z-10 grid size-[4.5vw] place-items-center rounded-full border border-fg/25 bg-base transition-[border-color,transform] duration-500 group-hover/item:scale-125 md:size-[2.2vw] lg:size-[1.4vw]">
          <span className="tl-dot block size-[45%] rounded-full bg-fg" />
        </span>
      </button>

      {/* Year + category on the far side of the rail (tablet and up) */}
      <div
        className={cn(
          "tl-side row-start-1 hidden md:block md:mt-[0.6vw] lg:mt-[0.2vw]",
          left ? "md:col-start-3 md:pl-[3vw]" : "md:col-start-1 md:pr-[3vw] md:text-right",
        )}
      >
        <p className="tl-year text-[9vw] leading-none tracking-[-0.02em] tabular-nums lg:text-[5.5vw]">{project.year}</p>
        <p className="mt-[1vw] text-[2.2vw] text-fg/60 lg:mt-[0.6vw] lg:text-[1.1vw]">
          {pad(index + 1)} · {project.category}
        </p>
      </div>

      <div
        className={cn(
          "tl-card col-start-2 row-start-1",
          left ? "md:col-start-1 md:pr-[3vw]" : "md:col-start-3 md:pl-[3vw]",
        )}
      >
        <p className="mb-[3vw] text-[3.6vw] text-fg/60 tabular-nums md:hidden">
          {project.year} · {project.category}
        </p>
        <ProjectCard project={project} index={index} />
      </div>
    </li>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState(false);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !badgeRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    badgeRef.current.style.left = `${e.clientX - r.left}px`;
    badgeRef.current.style.top = `${e.clientY - r.top}px`;
  };

  return (
    <article className="group" style={{ "--d": "0.1s" } as CSSProperties}>
      <a href={project.href} className="block" aria-label={`${project.name}: ${project.summary}`}>
        <div
          className="proj-media relative aspect-[16/10] overflow-hidden rounded-[var(--r)] bg-paper [--r:3vw] lg:[--r:1.667vw]"
          onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
          onPointerLeave={() => setHover(false)}
          onPointerMove={move}
        >
          <div className="proj-zoom absolute inset-0">
            <div className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
              <Image src={project.image} alt="" fill sizes="(min-width: 768px) 42vw, 80vw" className="object-cover" />
            </div>
          </div>
          <span className="absolute top-[3vw] left-[3vw] rounded-full bg-black/45 px-[3vw] py-[1vw] text-[3.2vw] text-white backdrop-blur-md md:text-[1.8vw] lg:top-[1.2vw] lg:left-[1.2vw] lg:px-[1vw] lg:py-[0.35vw] lg:text-[0.95vw]">
            {project.category}
          </span>
          {/* Cursor badge (mouse only) */}
          <span
            ref={badgeRef}
            aria-hidden
            className={cn(
              "bg-brand pointer-events-none absolute top-1/2 left-1/2 hidden size-[7vw] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[1vw] text-paper transition-[scale,left,top] duration-[400ms,250ms,250ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid",
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
              <span className="mr-[2vw] align-top text-[3.2vw] text-fg/50 md:text-[1.8vw] lg:mr-[0.8vw] lg:text-[0.95vw]">
                {pad(index + 1)}
              </span>
              {project.name}
            </h3>
            <span className="relative grid size-[9vw] shrink-0 place-items-center overflow-hidden rounded-full border border-fg/25 transition-colors duration-300 group-hover:border-transparent group-hover:bg-fg group-hover:text-paper md:size-[5vw] lg:size-[2.6vw]">
              <ArrowUpRight
                aria-hidden
                className="size-[45%] transition-transform duration-300 ease-out group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
              />
              <ArrowUpRight
                aria-hidden
                className="absolute size-[45%] -translate-x-[150%] translate-y-[150%] transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
              />
            </span>
          </div>
          <p className="mt-[2vw] text-[3.8vw] leading-[1.5] text-fg/75 md:mt-[1vw] md:text-[2.2vw] lg:mt-[0.6vw] lg:text-[1.1vw]">
            {project.summary}
          </p>
          <p className="mt-[2vw] text-[3.4vw] text-fg/60 md:mt-[1vw] md:text-[2vw] lg:mt-[0.8vw] lg:text-[1vw]">
            {project.tags.join("  •  ")}
          </p>
          <div className="relative mt-[4vw] h-px w-full bg-fg/15 md:mt-[2vw] lg:mt-[1.5vw]">
            <span className="bg-brand absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
          </div>
        </div>
      </a>
    </article>
  );
}
