"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Code2, GraduationCap, Award } from "lucide-react";
import { personalInfo } from "@/data/portfolio";
import Splite3DCanvas from "./Splite3DCanvas";
import { EASE, fadeUp, stagger } from "@/lib/motion";

/** Animated role switcher inside the top announcement pill badge */
function RoleTicker() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % personalInfo.roles.length),
      3000
    );
    return () => clearInterval(interval);
  }, [reduceMotion]);

  if (reduceMotion) {
    return <span>{personalInfo.roles[0]}</span>;
  }

  return (
    <span className="inline-block h-[1.3em] overflow-hidden align-middle">
      <AnimatePresence mode="wait">
        <motion.span
          key={personalInfo.roles[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="block"
        >
          {personalInfo.roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function SpliteHero() {
  return (
    <motion.section
      variants={stagger()}
      initial="hidden"
      animate="show"
      className="relative w-full py-10 md:py-16 flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stone-300/20 dark:bg-stone-800/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-6 md:gap-8 z-10">
        
        {/* Top Announcement Pill Badge */}
        <motion.div variants={fadeUp}>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-stone-300 dark:border-stone-800 bg-stone-100/80 dark:bg-stone-900/60 backdrop-blur-md shadow-xs hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-400 dark:bg-stone-200 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-900 dark:bg-stone-100" />
            </span>

            <span className="font-mono text-xs uppercase tracking-widest text-stone-700 dark:text-stone-300 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-stone-900 dark:text-stone-100" />
              <RoleTicker />
            </span>

            <span className="text-stone-400 dark:text-stone-600 group-hover:translate-x-0.5 transition-transform duration-200">
              →
            </span>
          </Link>
        </motion.div>

        {/* Bold Centered Headline */}
        <motion.div variants={fadeUp} className="space-y-3">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif tracking-tight text-stone-900 dark:text-stone-50 leading-[0.95] block">
            {personalInfo.name}
          </h1>

          <p className="font-mono text-sm md:text-base uppercase tracking-widest text-stone-500 dark:text-stone-400 font-medium">
            {personalInfo.role}
          </p>
        </motion.div>

        {/* Sub-headline / Copy */}
        <motion.p
          variants={fadeUp}
          className="text-base sm:text-lg md:text-xl font-light text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed text-balance"
        >
          {personalInfo.bio}
        </motion.p>

        {/* Interactive CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/projects"
            className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-950 font-mono text-xs uppercase tracking-wider font-semibold shadow-lg hover:shadow-stone-900/20 dark:hover:shadow-stone-100/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Lihat Proyek
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40 text-stone-800 dark:text-stone-200 font-mono text-xs uppercase tracking-wider font-medium hover:bg-stone-200/80 dark:hover:bg-stone-800/60 hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300 backdrop-blur-xs"
          >
            Hubungi Saya
          </Link>
        </motion.div>

        {/* Highlights Chips */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-mono text-stone-500 dark:text-stone-400"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800">
            <GraduationCap className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            <span>ITB Informatika (3.92)</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800">
            <Code2 className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            <span>Asisten Dosen (DSA & OOP)</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800">
            <Award className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            <span>Juara 1 HackFest 2025</span>
          </div>
        </motion.div>

      </div>

      {/* 3D Interactive Canvas Container */}
      <motion.div
        variants={fadeUp}
        className="w-full max-w-5xl mt-10 md:mt-14 px-4"
      >
        <Splite3DCanvas className="shadow-2xl border border-stone-800/80" />
      </motion.div>

    </motion.section>
  );
}
