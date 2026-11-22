import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Letter roll used with the entry fill: on hover / focus-visible of the
 * nearest `group`, each letter rolls up and a copy in `toClass` colour
 * rolls in from below, staggered by 15ms. Letters are grouped by word, so
 * a long title only wraps between words.
 */
export default function RollText({
  text,
  fromClass,
  toClass,
  className,
}: {
  text: string;
  fromClass?: string;
  toClass: string;
  className?: string;
}) {
  const roll = "block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
  let i = 0;
  return (
    <span className={cn("relative", className)} aria-label={text}>
      {text.split(" ").map((word, w, words) => (
        <Fragment key={w}>
          <span aria-hidden className="inline-block whitespace-nowrap">
            {[...word].map((ch) => {
              const delay = `${i++ * 0.015}s`;
              return (
                <span key={i} className="relative inline-block overflow-hidden align-bottom">
                  <span
                    className={cn(roll, fromClass, "group-hover:-translate-y-full group-focus-visible:-translate-y-full")}
                    style={{ transitionDelay: delay }}
                  >
                    {ch}
                  </span>
                  <span
                    className={cn(roll, toClass, "absolute inset-0 translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0")}
                    style={{ transitionDelay: delay }}
                  >
                    {ch}
                  </span>
                </span>
              );
            })}
          </span>
          {w < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
