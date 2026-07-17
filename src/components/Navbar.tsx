"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import useSound from "../hooks/useSound";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/lab", label: "The Lab" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { playClick } = useSound();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-12 md:py-6 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Logo */}
        <Link
          href="/"
          onClick={playClick}
          className="font-serif italic text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
          data-cursor="pointer">
          MP
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 dark:bg-stone-900/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-stone-200/50 dark:border-stone-800/40 shadow-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={playClick}
                className={`relative px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors duration-300 rounded-full ${
                  isActive
                    ? "text-stone-950 dark:text-stone-50 font-medium"
                    : "text-stone-500 hover:text-stone-850 dark:text-stone-400 dark:hover:text-stone-200"
                }`}
                data-cursor="pointer">
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-white dark:bg-stone-800 rounded-full shadow-xs -z-10 border border-stone-200/30 dark:border-stone-700/20"
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
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => {
              playClick();
              setIsOpen(!isOpen);
            }}
            className="p-2.5 rounded-full bg-stone-100/90 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300"
            aria-label="Toggle menu">
            {isOpen ? (
              <X className="w-4.5 h-4.5" />
            ) : (
              <Menu className="w-4.5 h-4.5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-6 right-6 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-lg border border-stone-200 dark:border-stone-850 p-6 rounded-3xl shadow-lg flex flex-col gap-3 pointer-events-auto md:hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => {
                    playClick();
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 text-sm font-mono uppercase tracking-wider rounded-xl transition-all ${
                    isActive
                      ? "bg-stone-100 dark:bg-stone-900 text-stone-950 dark:text-stone-50 font-bold"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900/50"
                  }`}>
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
