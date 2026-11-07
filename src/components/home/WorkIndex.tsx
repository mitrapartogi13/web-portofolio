"use client";

import { useState, ViewTransition } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/portfolio";
import PipelineFigure from "@/components/ui/PipelineFigure";
import { cn, pad } from "@/lib/utils";

/**
 * Index + sticky preview (borrowed principle from the reference): the list
 * is the navigation, the panel beside it explains the hovered/focused item.
 * On small screens the panel is hidden and each row carries its own summary.
 */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const current = projects[active];

  return (
    <div className="grid-page mt-12 gap-y-10 md:mt-16">
      <ol className="col-span-4 border-t border-on-signal/35 md:col-span-6 lg:col-span-7">
        {projects.map((project, i) => (
          <li key={project.id} className="border-b border-on-signal/35">
            <Link
              href={`/projects/${project.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 py-6 transition-colors duration-[var(--dur-1)] md:grid-cols-[3.5rem_1fr_auto] md:py-8",
                "hover:bg-signal-field-2 focus-visible:bg-signal-field-2",
                active === i && "lg:bg-signal-field-2",
              )}
            >
              <span className="pt-1 pl-2 text-label text-on-signal-2">{pad(i + 1)}</span>
              <span>
                <ViewTransition name={`project-${project.slug}`} share="morph">
                  <span className="block text-h3 md:text-[1.75rem] md:leading-tight">
                    {project.shortTitle}
                  </span>
                </ViewTransition>
                <span className="mt-1 block text-label text-on-signal-2">
                  {project.category}
                </span>
                <span className="mt-4 block max-w-[52ch] text-sm text-on-signal-2 lg:hidden">
                  {project.description}
                </span>
              </span>
              <ArrowRight
                aria-hidden
                strokeWidth={1.75}
                className="mt-1 mr-2 size-5 transition-transform duration-[var(--dur-2)] ease-out group-hover:translate-x-1"
              />
            </Link>
          </li>
        ))}
      </ol>

      <aside
        aria-hidden
        className="hidden lg:col-span-5 lg:block"
      >
        <div className="sticky top-[calc(var(--header-h)+2rem)] border border-on-signal/35 p-8">
          <p className="text-label text-on-signal-2">
            Gbr. 1.{active + 1} — Alur kerja
          </p>
          <p className="mt-6 text-h3">{current.shortTitle}</p>
          <p className="mt-3 text-sm text-on-signal-2">{current.description}</p>
          {current.role && (
            <p className="mt-6 text-label text-on-signal-2">Peran · {current.role}</p>
          )}
          <PipelineFigure
            key={current.id}
            steps={current.pipeline}
            tone="field"
            orientation="vertical"
            className="mt-8"
          />
        </div>
      </aside>
    </div>
  );
}
