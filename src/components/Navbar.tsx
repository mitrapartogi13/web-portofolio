"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { EASE } from "@/lib/motion";
import { ICON_BUTTON } from "@/lib/ui";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  const headerRef = useRef<HTMLElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLElement | null>(null);

  // Hide on scroll down, reveal on scroll up — never while the menu is open,
  // while the header holds keyboard focus, or when motion is reduced.
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isOpen || reduceMotion) {
      setHidden(false);
      return;
    }
    if (headerRef.current?.contains(document.activeElement)) {
      setHidden(false);
      return;
    }
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 140);
  });

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // While the drawer is open: lock scroll, close on Escape or outside click,
  // and move focus into the menu so keyboard users land where they expect.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const close = () => {
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        drawerRef.current?.contains(target) ||
        menuButtonRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    drawerRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <motion.header
      ref={headerRef}
      animate={{ y: hidden ? "-120%" : "0%" }}
      transition={{ duration: 0.35, ease: EASE }}
      className="pointer-events-none fixed left-0 top-0 z-50 w-full px-6 py-4 md:px-12 md:py-6"
    >
      <a
        href="#main-content"
        className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-10 focus:rounded-full focus:border focus:border-stone-200 focus:bg-stone-50 focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider focus:text-stone-900 dark:focus:border-stone-800 dark:focus:bg-stone-900 dark:focus:text-stone-50"
      >
        Skip to content
      </a>

      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Mitra Partogi — home"
          className="block shrink-0 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <Image
            src="/poly-art-profile.webp"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-full border border-stone-200/50 bg-stone-100/80 px-2.5 py-1.5 shadow-xs backdrop-blur-md md:flex dark:border-stone-800/40 dark:bg-stone-900/50"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                aria-current={isActive ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-300 ${
                  isActive
                    ? "font-medium text-stone-950 dark:text-stone-50"
                    : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 -z-10 rounded-full border border-stone-200/30 bg-white shadow-xs dark:border-stone-700/20 dark:bg-stone-800"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            onClick={() => setIsOpen(!isOpen)}
            className={ICON_BUTTON}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X className="h-4.5 w-4.5" />
            ) : (
              <Menu className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer — stays mounted and is made `inert` when closed, so its
          links can never be tabbed to or intercept taps while invisible. */}
      <nav
        ref={drawerRef}
        id="mobile-menu"
        aria-label="Primary"
        inert={!isOpen}
        className={`absolute left-6 right-6 top-full mt-2 flex flex-col gap-3 rounded-3xl border border-stone-200 bg-stone-50/95 p-6 shadow-lg backdrop-blur-lg transition duration-200 ease-out motion-reduce:transition-none md:hidden dark:border-stone-800 dark:bg-stone-950/95 ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setIsOpen(false)}
              className={`rounded-xl px-4 py-3 font-mono text-sm uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-stone-100 font-bold text-stone-950 dark:bg-stone-900 dark:text-stone-50"
                  : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-900/50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </motion.header>
  );
}
