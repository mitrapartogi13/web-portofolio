import type { CSSProperties, ElementType } from "react";

interface SplitTextProps {
  /** One string per visual line; lines break explicitly like the reference. */
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  /**
   * "view" (default): reveal when scrolled into view.
   * "mount": reveal right after hydration.
   * "manual": the parent adds `split-in` itself (hero intro sequence).
   */
  trigger?: "view" | "mount" | "manual";
  delay?: number;
  stagger?: number;
}

/**
 * Letter-by-letter rise, each letter clipped by its own mask (the reference
 * pads the mask by 0.04em so side bearings are not cut). Server-rendered;
 * InViewObserver adds `split-in`. Screen readers get the plain sentence.
 */
export default function SplitText({
  lines,
  as: Tag = "h2",
  className,
  trigger = "view",
  delay = 0,
  stagger = 0.022,
}: SplitTextProps) {
  let i = 0;

  return (
    <Tag data-split={trigger === "view" ? "" : trigger} aria-label={lines.join(" ")} className={className}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.split(" ").map((word, wi, words) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {[...word].map((ch) => {
                const d = delay + i++ * stagger;
                return (
                  <span
                    key={`${ch}-${i}`}
                    className="relative -mx-[0.04em] inline-block overflow-clip px-[0.04em] align-bottom"
                  >
                    <span className="split-letter" style={{ "--d": `${d}s` } as CSSProperties}>
                      {ch}
                    </span>
                  </span>
                );
              })}
              {wi < words.length - 1 && " "}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
