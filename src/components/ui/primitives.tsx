import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Inline link: signal colour, 1px underline that thickens on hover. */
export function TextLink({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        "text-signal underline decoration-1 underline-offset-[0.2em] transition-[text-decoration-thickness] duration-[var(--dur-1)] hover:decoration-2",
        className,
      )}
    />
  );
}

/** Technology / topic tag. Mono, sentence case, never a pill. */
export function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[2px] border border-rule px-2 py-1 font-mono text-xs leading-none text-ink-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Numbered figure with a mono caption: "Gbr. 1 — …". */
export function Figure({
  number,
  caption,
  children,
  className,
}: {
  number: number;
  caption: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={className}>
      {children}
      <figcaption className="mt-3 text-label text-ink-3">
        <span className="text-ink">Gbr. {number}</span> — {caption}
      </figcaption>
    </figure>
  );
}

/** Small status dot + label, e.g. "Aktif". */
export function Status({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-label text-ok">
      <span aria-hidden className="size-1.5 rounded-full bg-ok" />
      {children}
    </span>
  );
}
