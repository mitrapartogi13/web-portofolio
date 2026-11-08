import { cn } from "@/lib/utils";

/**
 * White pill with a dot. On hover the dot scales 120× to flood the pill
 * black while each letter rolls up and is replaced by a white copy.
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
  const letters = [...label];

  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[#111]",
        "h-[12vw] gap-[3.1vw] px-[6.86vw] text-[4.2vw]",
        "md:h-[8vw] md:gap-[2.06vw] md:px-[4.57vw] md:text-[3vw]",
        "lg:h-[3.5vw] lg:gap-[0.9vw] lg:px-[2vw] lg:text-[1.15vw]",
        className,
      )}
    >
      <span className="relative z-10 mt-[0.1em] flex">
        <span className="block size-[1.71vw] rounded-full bg-night transition-transform duration-[400ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:scale-[120] md:size-[1.14vw] lg:size-[0.5vw]" />
      </span>
      <span className="relative z-20 flex leading-[1.3]" aria-label={label}>
        {letters.map((ch, i) => (
          <span key={i} aria-hidden className="relative inline-block overflow-hidden">
            <span
              className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full"
              style={{ transitionDelay: `${i * 0.015}s` }}
            >
              {ch === " " ? " " : ch}
            </span>
            <span
              className="absolute inset-0 block translate-y-full text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
              style={{ transitionDelay: `${i * 0.015}s` }}
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        ))}
      </span>
    </a>
  );
}
