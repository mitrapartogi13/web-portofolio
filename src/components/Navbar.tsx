"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { cn, pad } from "@/lib/utils";
import { navItems } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close the sheet whenever the route changes.
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // While open: lock scroll, Esc closes, focus moves into the sheet.
  useEffect(() => {
    if (!open) return;
    const button = buttonRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="header-scroll sticky top-0 z-40 border-b border-transparent bg-paper">
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Mitra Partogi — beranda"
          className="group flex items-center gap-3"
        >
          <span
            aria-hidden
            className="grid size-8 place-items-center bg-ink font-mono text-[0.75rem] font-medium text-paper transition-colors duration-[var(--dur-1)] group-hover:bg-signal-field group-hover:text-on-signal"
          >
            MP
          </span>
          <span className="hidden text-sm font-medium sm:inline">Mitra Partogi</span>
        </Link>

        <nav aria-label="Utama" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-11 items-center gap-2 px-3 text-sm transition-colors duration-[var(--dur-1)]",
                      active ? "text-ink" : "text-ink-2 hover:text-ink",
                    )}
                  >
                    <span aria-hidden className="text-label text-ink-3">
                      {pad(i)}
                    </span>
                    <span
                      className={cn(
                        "underline-offset-[0.35em]",
                        active && "underline decoration-signal decoration-2",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="grid size-11 place-items-center text-ink md:hidden"
          >
            {open ? (
              <X aria-hidden className="size-5" strokeWidth={1.75} />
            ) : (
              <Menu aria-hidden className="size-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Full-screen sheet on mobile. Kept mounted but inert when closed so
          it can never be tabbed into or intercept taps. */}
      <div
        ref={sheetRef}
        id="mobile-menu"
        inert={!open}
        className={cn(
          "fixed inset-x-0 top-[var(--header-h)] bottom-0 bg-paper transition-opacity duration-[var(--dur-2)] ease-in-out md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav aria-label="Utama (seluler)" className="container-page border-t border-rule pt-6">
          <ul>
            {navItems.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-rule">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline gap-4 py-5"
                  >
                    <span aria-hidden className="text-label text-ink-3">
                      {pad(i)}
                    </span>
                    <span className={cn("text-h2", active && "text-signal")}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
