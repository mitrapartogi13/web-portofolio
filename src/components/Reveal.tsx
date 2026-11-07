import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Marks an element for InViewObserver, which adds `.in` once visible.
 * Pair with the `.rise`, `.line-up` or `.draw` CSS classes.
 */
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
  const style = { "--d": `${delay}s`, ...(rise ? { "--rise": rise } : {}) } as CSSProperties;
  return (
    <Tag data-reveal="" className={className} style={style}>
      {children}
    </Tag>
  );
}
