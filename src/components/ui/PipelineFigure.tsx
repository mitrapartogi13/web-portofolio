import { cn, pad } from "@/lib/utils";

interface PipelineFigureProps {
  steps: readonly string[];
  tone?: "paper" | "field";
  className?: string;
}

/**
 * A project's process drawn as a numbered pipeline. Stands in for project
 * imagery until real screenshots exist (DESIGN.md §6.4), and explains the
 * mechanism instead of decorating it. Connectors draw in on scroll (CSS).
 * The final step — the outcome — is the only one in the signal colour.
 */
export default function PipelineFigure({
  steps,
  tone = "paper",
  className,
}: PipelineFigureProps) {
  const onField = tone === "field";
  const last = steps.length - 1;

  return (
    <ol
      className={cn(
        "grid md:auto-cols-fr md:grid-flow-col",
        onField ? "text-on-signal" : "text-ink",
        className,
      )}
    >
      {steps.map((step, i) => (
        <li key={step} className="relative flex gap-4 pb-6 md:flex-col md:gap-3 md:pb-0">
          <div className="flex shrink-0 items-center md:w-full">
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
            {i < last && (
              <span
                aria-hidden
                className={cn(
                  "draw-x hidden h-px flex-1 md:block",
                  onField ? "bg-on-signal/60" : "bg-ink",
                )}
              />
            )}
          </div>
          {i < last && (
            <span
              aria-hidden
              className={cn(
                "absolute top-9 bottom-0 left-[17.5px] w-px md:hidden",
                onField ? "bg-on-signal/60" : "bg-ink",
              )}
            />
          )}
          <span className="pt-2 text-sm leading-snug md:max-w-[16ch] md:pt-0 md:pr-4">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
