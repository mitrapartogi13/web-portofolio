"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "@/lib/useInView";
import { cn } from "@/lib/utils";

/** Adds `.in` once visible; pair with the `.rise` / `.draw` CSS classes. */
export default function Reveal({
  as: Tag = "div",
  className,
  delay = 0,
  rise,
  children,
}: {
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Override rise distance, e.g. "10%". */
  rise?: string;
  children?: ReactNode;
}) {
  const [ref, inView] = useInView<HTMLElement>();
  const style = { "--d": `${delay}s`, ...(rise ? { "--rise": rise } : {}) } as CSSProperties;
  return (
    <Tag ref={ref} className={cn(className, inView && "in")} style={style}>
      {children}
    </Tag>
  );
}
