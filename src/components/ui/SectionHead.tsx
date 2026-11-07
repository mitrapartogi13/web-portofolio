import type { ReactNode } from "react";
import { cn, pad } from "@/lib/utils";

interface SectionHeadProps {
  /** Section number, rendered as §01. Consistent across the whole site. */
  index: number;
  kicker: string;
  title: ReactNode;
  /** id for the heading so the section can be `aria-labelledby` it. */
  id?: string;
  /** Right-aligned slot on the label row (counts, links). */
  meta?: ReactNode;
  /** Slot to the right of the title (usually a link). */
  aside?: ReactNode;
  tone?: "paper" | "field";
  as?: "h1" | "h2";
  className?: string;
}

export default function SectionHead({
  index,
  kicker,
  title,
  id,
  meta,
  aside,
  tone = "paper",
  as: Heading = "h2",
  className,
}: SectionHeadProps) {
  const onField = tone === "field";

  return (
    <div
      className={cn(
        "border-t pt-3",
        onField ? "border-on-signal/35" : "border-rule",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-baseline justify-between gap-4 text-label",
          onField ? "text-on-signal-2" : "text-ink-3",
        )}
      >
        <span>
          §{pad(index)} — {kicker}
        </span>
        {meta}
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 md:mt-16">
        <Heading
          id={id}
          className={cn(Heading === "h1" ? "text-h1" : "text-h2", "max-w-[20ch]")}
        >
          {title}
        </Heading>
        {aside}
      </div>
    </div>
  );
}
