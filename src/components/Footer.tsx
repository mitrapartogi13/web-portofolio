import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-stone-200 md:mt-32 dark:border-stone-800">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
          Punya proyek atau ide?
        </span>

        <Link
          href="/contact"
          className="group mt-4 inline-flex items-center gap-3 font-serif italic text-4xl text-stone-900 transition-colors duration-300 hover:text-accent md:text-6xl dark:text-stone-50"
        >
          Mari Berkolaborasi
          <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:h-9 md:w-9" />
        </Link>

        <div className="mt-6">
          <a
            href={`mailto:${personalInfo.email}`}
            className="link-underline font-mono text-sm text-stone-600 dark:text-stone-400"
          >
            {personalInfo.email}
          </a>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-stone-200 pt-8 md:flex-row md:items-center md:justify-between dark:border-stone-800">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500">
            © {year} {personalInfo.name} — {personalInfo.location}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {Object.entries(personalInfo.socials).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              >
                {key}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
