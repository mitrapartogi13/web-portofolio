"use client";

import { cn } from "@/lib/utils";
import { useEntryFill } from "@/lib/useEntryFill";
import RollText from "./RollText";

/**
 * Ink pill. On hover a white fill blooms from the exact point where the
 * cursor entered until it floods the pill, and on leave it shrinks back
 * into the point where the cursor left. Each letter rolls up into an ink
 * copy at the same time. Keyboard focus fills from the centre.
 * The fill logic lives in useEntryFill (shared with the tech stack cards).
 */
export default function CtaButton({
  label,
  href = "#contact",
  className,
}: {
  label: string;
  href?: string;
  className?: string;
}) {
  const { fillRef, handlers } = useEntryFill();

  return (
    <a
      href={href}
      {...handlers}
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-fg bg-fg text-paper",
        "h-[12vw] px-[6.86vw] text-[4.2vw]",
        "md:h-[8vw] md:px-[4.57vw] md:text-[3vw]",
        "lg:h-[3.5vw] lg:px-[2vw] lg:text-[1.15vw]",
        className,
      )}
    >
      <span
        ref={fillRef}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 z-10 size-0 rounded-full bg-paper"
        style={{ transform: "translate(-50%, -50%) scale(0)" }}
      />
      <RollText text={label} toClass="text-fg" className="z-20 whitespace-nowrap leading-[1.3]" />
    </a>
  );
}
