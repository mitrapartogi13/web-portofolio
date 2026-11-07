"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Stateless toggle: the icon is chosen by CSS (`dark:` variant), so the
 * server render always matches the client and there is no hydration flash.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    const apply = () => {
      root.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("theme", next);
      } catch {
        // Storage blocked (private mode): the choice lasts for this page only.
      }
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduce) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Ganti tema terang atau gelap"
      className={cn(
        "grid size-11 place-items-center rounded-full text-ink-2 transition-colors duration-[var(--dur-1)] hover:bg-paper-2 hover:text-ink",
        className,
      )}
    >
      <Moon aria-hidden className="size-[18px] dark:hidden" strokeWidth={1.75} />
      <Sun aria-hidden className="hidden size-[18px] dark:block" strokeWidth={1.75} />
    </button>
  );
}
