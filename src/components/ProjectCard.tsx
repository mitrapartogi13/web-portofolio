'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, ExternalLink, CodeXml } from 'lucide-react';
import { Project } from '@/data/portfolio';
import { EASE } from '@/lib/motion';

interface ProjectCardProps {
  project: Project;
  /**
   * 'link' (default) navigates to the project's anchor on /projects — used
   * for the featured teaser on Home. 'expandable' toggles an inline detail
   * panel instead of navigating — used on the Projects page itself.
   */
  variant?: 'link' | 'expandable';
}

export default function ProjectCard({ project, variant = 'link' }: ProjectCardProps) {
  // Computed at mount (not in an effect) so a deep link like /projects#p-2
  // renders already-expanded instead of flashing collapsed-then-open.
  const [expanded, setExpanded] = useState(
    () =>
      variant === 'expandable' &&
      typeof window !== 'undefined' &&
      window.location.hash === `#${project.id}`,
  );

  const hasDemo = project.demoUrl && project.demoUrl !== '#';
  const hasGithub = project.githubUrl && project.githubUrl !== '#';

  const media = (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-stone-200 dark:bg-stone-900/50">
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        priority={project.featured}
      />

      {/* Subtle noise layout blend overlay */}
      <div className="absolute inset-0 bg-stone-900/10 pointer-events-none mix-blend-overlay" />

      {/* Tag Pill Overlay */}
      <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
        {project.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider bg-stone-900/80 dark:bg-stone-950/80 text-white rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const header = (
    <div className="mt-5 px-1 flex justify-between items-start gap-4">
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500">
          {project.category}
        </span>
        <h3 className="font-serif italic text-2xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-accent transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-400 max-w-[90%] line-clamp-2 leading-relaxed mt-1">
          {project.description}
        </p>
      </div>

      <div className="p-2.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 text-stone-700 dark:text-stone-300 group-hover:bg-accent group-hover:text-white dark:group-hover:text-stone-950 transition-colors duration-300 mt-1 shadow-xs shrink-0">
        {variant === 'expandable' ? (
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        ) : (
          <ArrowUpRight className="w-3.5 h-3.5" />
        )}
      </div>
    </div>
  );

  if (variant === 'link') {
    return (
      <Link href={`/projects#${project.id}`} className="block group">
        <div className="rounded-3xl border border-card-border bg-card p-4 transition-all duration-300 hover:shadow-lg hover:border-accent/30 dark:hover:shadow-black/20">
          {media}
          {header}
        </div>
      </Link>
    );
  }

  return (
    <div
      id={project.id}
      className="scroll-mt-28 rounded-3xl border border-card-border bg-card p-4 transition-colors duration-300 hover:border-accent/30"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="group block w-full text-left"
      >
        {media}
        {header}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-4 border-t border-border-muted px-1 pt-5">
              <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {project.longDescription}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-stone-200 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-stone-600 dark:border-stone-800 dark:text-stone-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {(hasDemo || hasGithub) && (
                <div className="flex flex-wrap gap-5 pt-1">
                  {hasDemo && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent"
                    >
                      Live Demo
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {hasGithub && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-stone-700 dark:text-stone-300"
                    >
                      GitHub
                      <CodeXml className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
