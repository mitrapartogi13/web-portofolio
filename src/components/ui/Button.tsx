import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "inverse";

const variants: Record<Variant, string> = {
  primary: "bg-signal-field text-on-signal hover:bg-signal-field-2",
  secondary: "border border-rule text-ink hover:border-ink",
  inverse: "bg-on-signal text-signal-field hover:bg-on-signal-2",
};

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  /** External links get an ↗ arrow and open in a new tab. */
  external?: boolean;
  className?: string;
}

/** The only button shape on the site: 44px tall, 2px radius, mono label. */
export function buttonClasses(variant: Variant = "primary", className?: string) {
  return cn(
    "group inline-flex h-11 items-center gap-3 rounded-[2px] px-5 text-label whitespace-nowrap",
    "transition-colors duration-[var(--dur-1)] ease-out",
    variants[variant],
    className,
  );
}

export function ButtonLink({
  variant = "primary",
  external,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <Link
      {...props}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={buttonClasses(variant, className)}
    >
      {children}
      <Icon
        aria-hidden
        strokeWidth={1.75}
        className="size-4 transition-transform duration-[var(--dur-2)] ease-out group-hover:translate-x-1"
      />
    </Link>
  );
}
