"use client";

import { useState, ViewTransition } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { Tag } from "@/components/ui/primitives";
import { cn, pad } from "@/lib/utils";

const ALL = "Semua";

/** Filter is the only client logic on /projects; switching is instant. */
export default function ProjectCatalog({ projects }: { projects: Project[] }) {
  const categories = [ALL, ...new Set(projects.map((p) => p.category.split(" / ")[0]))];
  const [selected, setSelected] = useState(ALL);
  const visible =
    selected === ALL ? projects : projects.filter((p) => p.category.startsWith(selected));

  return (
    <div className="mt-12 md:mt-16">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter kategori">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={selected === c}
            onClick={() => setSelected(c)}
            className={cn(
              "h-11 rounded-[2px] border px-4 text-label transition-colors duration-[var(--dur-1)]",
              selected === c
                ? "border-ink bg-ink text-paper"
                : "border-rule text-ink-2 hover:border-ink hover:text-ink",
            )}
          >
            {c}
          </button>
        ))}
        <p aria-live="polite" className="ml-auto text-label text-ink-3">
          {visible.length} proyek
        </p>
      </div>

      <ol className="mt-8 border-t border-ink">
        {visible.map((project) => {
          const n = projects.indexOf(project) + 1;
          return (
            <li key={project.id} className="border-b border-rule">
              <Link
                href={`/projects/${project.slug}`}
                className="group grid grid-cols-[2.5rem_1fr_auto] gap-x-4 gap-y-4 py-8 transition-colors duration-[var(--dur-1)] hover:bg-paper-2 md:grid-cols-[3.5rem_1fr_auto] lg:grid-cols-[3.5rem_5fr_4fr_auto] lg:py-10"
              >
                <span className="pt-2 pl-2 text-label text-ink-3">{pad(n)}</span>
                <span>
                  <ViewTransition name={`project-${project.slug}`} share="morph">
                    <span className="block text-h2">{project.shortTitle}</span>
                  </ViewTransition>
                  <span className="mt-3 block max-w-[52ch] text-ink-2">
                    {project.description}
                  </span>
                </span>
                <span className="col-start-2 flex flex-col gap-3 lg:col-start-3 lg:pt-2">
                  <span className="text-label text-ink-3">{project.category}</span>
                  <span className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden
                  strokeWidth={1.75}
                  className="col-start-3 row-start-1 mt-2 mr-2 size-5 transition-transform duration-[var(--dur-2)] ease-out group-hover:translate-x-1 lg:col-start-4"
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
