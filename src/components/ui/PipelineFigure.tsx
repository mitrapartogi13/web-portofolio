import { cn, pad } from "@/lib/utils";

interface PipelineFigureProps {
  steps: readonly string[];
  tone?: "paper" | "field";
  /** "auto": vertical on mobile, horizontal from md. "vertical": always. */
  orientation?: "auto" | "vertical";
  className?: string;
}

/**
 * A project's process drawn as a numbered pipeline. Stands in for project
 * imagery until real screenshots exist (DESIGN.md §6.4), and explains the
 * mechanism instead of decorating it. Connectors draw in on scroll (CSS).
 * The final step — the outcome — is the only filled one.
 */
export default function PipelineFigure({
  steps,
  tone = "paper",
  orientation = "auto",
  className,
}: PipelineFigureProps) {
  const onField = tone === "field";
  const horizontal = orientation === "auto";
  const last = steps.length - 1;
  const line = onField ? "bg-on-signal/60" : "bg-ink";

  return (
    <ol
      className={cn(
        "grid",
        horizontal && "md:auto-cols-fr md:grid-flow-col",
        onField ? "text-on-signal" : "text-ink",
        className,
      )}
    >
      {steps.map((step, i) => (
        <li
          key={step}
          className={cn(
            "relative flex gap-4 pb-6",
            horizontal && "md:flex-col md:gap-3 md:pb-0",
            i === last && "pb-0",
          )}
        >
          <div className={cn("flex shrink-0 items-center", horizontal && "md:w-full")}>
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center border text-label",
                i === last
                  ? onField
                    ? "border-on-signal bg-on-signal text-signal-field"
                    : "border-signal-field bg-signal-field text-on-signal"
                  : onField
                    ? "border-on-signal/60"
                    : "border-ink",
              )}
            >
              {pad(i + 1)}
            </span>
            {horizontal && i < last && (
              <span aria-hidden className={cn("draw-x hidden h-px flex-1 md:block", line)} />
            )}
          </div>
          {i < last && (
            <span
              aria-hidden
              className={cn(
                "absolute top-9 bottom-0 left-[17.5px] w-px",
                horizontal && "md:hidden",
                line,
              )}
            />
          )}
          <span
            className={cn(
              "pt-2 text-sm leading-snug",
              horizontal && "md:max-w-[16ch] md:pt-0 md:pr-4",
            )}
          >
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
