"use client";

import React from "react";

interface LetterStyle {
  char: string;
  className: string;
}

/**
 * Ransom Note monochrome paper cutout typography for "Mitra Partogi".
 * Each letter has a unique cutout shape, rotation, font family, shadow, and background stock.
 */
const RANSOM_FIRST_NAME: LetterStyle[] = [
  // M (Black Cutout, White Text)
  {
    char: "M",
    className:
      "bg-stone-950 dark:bg-stone-950 text-stone-50 font-2peas font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm -rotate-2 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase tracking-wider hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
  // I (White Cutout, Solid Black Text — 100% visible & sharp)
  {
    char: "I",
    className:
      "bg-white dark:bg-white text-stone-950 font-2peas italic font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2 sm:px-2.5 py-0.5 sm:py-1 border-2 border-stone-950 rounded-none rotate-2 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase -translate-y-0.5 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
  // T (Dark Cutout, White Text)
  {
    char: "T",
    className:
      "bg-stone-900 dark:bg-stone-900 text-stone-50 font-2peas font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-br-md -rotate-1 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase translate-y-0.5 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
  // R (Light Gray Cutout, Black Text)
  {
    char: "R",
    className:
      "bg-stone-200 dark:bg-stone-200 text-stone-950 font-2peas font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2.5 sm:px-3 py-0.5 sm:py-1 border border-stone-950 rounded-tl-md rotate-2 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase -translate-y-0.5 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
  // A (White Cutout, Solid Black Text)
  {
    char: "A",
    className:
      "bg-white dark:bg-white text-stone-950 font-2peas font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-stone-950 rounded-sm -rotate-2 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase translate-y-0.5 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
];

const RANSOM_LAST_NAME: LetterStyle[] = [
  // P (Black Cutout, White Text)
  {
    char: "P",
    className:
      "bg-stone-950 dark:bg-stone-950 text-stone-50 font-2peas font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-tr-md rotate-1 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase -translate-y-0.5 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
  // A (White Cutout, Black Text)
  {
    char: "A",
    className:
      "bg-white dark:bg-white text-stone-950 font-2peas font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2 sm:px-2.5 py-0.5 sm:py-1 border border-stone-950 rounded-none -rotate-2 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase translate-y-0.5 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
  // R (Black Cutout, White Text)
  {
    char: "R",
    className:
      "bg-stone-900 dark:bg-stone-900 text-stone-50 font-2peas font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2 sm:px-2.5 py-1 sm:py-1.5 border border-stone-700 rounded-bl-md rotate-2 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase -translate-y-0.5 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
  // T (Light Gray Cutout, Black Text)
  {
    char: "T",
    className:
      "bg-stone-200 dark:bg-stone-200 text-stone-950 font-2peas italic font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2.5 sm:px-3 py-0.5 sm:py-1 border border-stone-950 rounded-sm -rotate-2 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase translate-y-0.5 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
  // O (Black Circle Cutout, White Text)
  {
    char: "O",
    className:
      "bg-stone-950 dark:bg-stone-950 text-stone-50 font-2peas font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-stone-100 rounded-full rotate-1 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase -translate-y-0.5 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
  // G (White Cutout, Black Text)
  {
    char: "G",
    className:
      "bg-white dark:bg-white text-stone-950 font-2peas font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2 sm:px-2.5 py-0.5 sm:py-1 border-2 border-stone-950 rounded-none -rotate-1 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase translate-y-0.5 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
  // I (Black Cutout, White Text)
  {
    char: "I",
    className:
      "bg-stone-950 dark:bg-stone-950 text-stone-50 font-2peas font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2 sm:px-2.5 py-1 sm:py-1.5 border border-stone-700 rounded-tr-lg rotate-2 shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.8)] inline-block uppercase -translate-y-0.5 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default",
  },
];

export default function RansomHeroName() {
  return (
    <h1
      aria-label="Mitra Partogi"
      className="flex flex-wrap items-center gap-x-3 gap-y-3 py-2 my-1 leading-none select-none"
    >
      <span className="inline-flex items-center gap-1 sm:gap-1.5">
        {RANSOM_FIRST_NAME.map((item, idx) => (
          <span key={`first-${idx}`} className={item.className}>
            {item.char}
          </span>
        ))}
      </span>

      <span className="inline-flex items-center gap-1 sm:gap-1.5">
        {RANSOM_LAST_NAME.map((item, idx) => (
          <span key={`last-${idx}`} className={item.className}>
            {item.char}
          </span>
        ))}
      </span>
    </h1>
  );
}
