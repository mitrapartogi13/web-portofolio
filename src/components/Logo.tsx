import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Two-tone wordmark: first name white, last name dimmed (as ELENA/VOSS). */
export default function Logo({ size = "header" }: { size?: "header" | "footer" }) {
  return (
    <span
      className={cn(
        "block whitespace-nowrap leading-none tracking-[-0.01em]",
        size === "header"
          ? "text-[5.9vw] md:text-[4.4vw] lg:text-[2.1vw]"
          : "text-[8vw] md:text-[6vw] lg:text-[3.85vw]",
      )}
    >
      {site.name.first}
      <span className="text-white/50">{site.name.last}</span>
    </span>
  );
}
