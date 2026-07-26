import React from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  /** Optional right-aligned slot, e.g. a "see all" link. */
  aside?: React.ReactNode;
  /** Draw the hairline under the header (default true). */
  divider?: boolean;
}

/** Eyebrow (mono, gold) + serif italic title — the standard section header. */
export default function SectionHeader({
  eyebrow,
  title,
  aside,
  divider = true,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${
        divider ? 'border-b border-stone-200 pb-6 dark:border-stone-800' : ''
      }`}
    >
      <div className="space-y-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </span>
        <h2 className="font-serif italic text-3xl text-stone-900 md:text-4xl dark:text-stone-50">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}
