"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, GraduationCap, Award } from "lucide-react";
import { personalInfo, academicTimeline, achievements, stats } from "@/data/portfolio";
import AsciiAvatarCanvas from "./AsciiAvatarCanvas";
import { EASE, fadeUp, stagger } from "@/lib/motion";

/** Derive hero highlight chips from the actual data sources — never hardcode facts here. */
function useHeroHighlights() {
  const academic = academicTimeline[0];
  const abbrevMatch = academic.institution.match(/\(([^)]+)\)/);
  const institutionAbbrev = abbrevMatch ? abbrevMatch[1] : academic.institution;
  const gpaStat = stats.find((s) => s.label.includes("IPK"));
  const courseCountStat = stats.find((s) => s.label === "Mata Kuliah Diampu");
  const topAchievement = achievements[0];
  const achievementShort = topAchievement.title.includes(" - ")
    ? topAchievement.title.split(" - ").pop()!
    : topAchievement.title;

  return {
    academic: `${institutionAbbrev} Informatika${gpaStat ? ` (IPK ${gpaStat.value.toFixed(2)})` : ""}`,
    teaching: `Asisten Dosen${courseCountStat ? ` • ${courseCountStat.value} Mata Kuliah` : ""}`,
    achievement: `${topAchievement.rank} ${achievementShort} ${topAchievement.year}`,
  };
}

/** Role ticker inside announcement badge */
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

export default function SpliteAsciiHero() {
  const highlights = useHeroHighlights();

  return (
    <motion.section
      variants={stagger()}
      initial="hidden"
      animate="show"
      className="relative w-full pt-1 pb-2 md:py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center"
    >
      {/* Left Column: Text & CTAs */}
      <div className="lg:col-span-6 space-y-3.5 sm:space-y-4 flex flex-col justify-center">
        {/* Top Announcement — plain editorial label */}
        <motion.div variants={fadeUp}>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 pb-1 border-b border-stone-300 dark:border-stone-700 hover:border-stone-500 dark:hover:border-stone-500 transition-colors duration-300"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-stone-700 dark:text-stone-300 font-medium">
              <RoleTicker />
            </span>

            <span className="text-stone-400 dark:text-stone-600 group-hover:translate-x-0.5 transition-transform duration-200">
              →
            </span>
          </Link>
        </motion.div>

        {/* Main Headline */}
        <motion.div variants={fadeUp} className="space-y-1.5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight text-stone-900 dark:text-stone-50 leading-[0.98] block">
            {personalInfo.name}
          </h1>

          <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 font-medium">
            {personalInfo.role}
          </p>
        </motion.div>

        {/* Bio Copy */}
        <motion.p
          variants={fadeUp}
          className="text-sm sm:text-base font-light text-stone-600 dark:text-stone-300 leading-relaxed text-balance max-w-xl"
        >
          {personalInfo.bio}
        </motion.p>

        {/* Interactive CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-3 pt-0.5"
        >
          <Link
            href="/projects"
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-950 font-mono text-xs uppercase tracking-wider font-semibold shadow-md hover:shadow-stone-900/20 dark:hover:shadow-stone-100/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Lihat Proyek
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40 text-stone-800 dark:text-stone-200 font-mono text-xs uppercase tracking-wider font-medium hover:bg-stone-200/80 dark:hover:bg-stone-800/60 hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300 backdrop-blur-xs"
          >
            Hubungi Saya
          </Link>
        </motion.div>

        {/* Highlights — single bordered strip */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-stretch divide-x divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden text-[11px] font-mono text-stone-500 dark:text-stone-400 w-fit"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300 shrink-0" />
            <span>{highlights.academic}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5">
            <Code2 className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300 shrink-0" />
            <span>{highlights.teaching}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5">
            <Award className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300 shrink-0" />
            <span>{highlights.achievement}</span>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Interactive 3D ASCII Avatar Canvas */}
      <motion.div
        variants={fadeUp}
        className="lg:col-span-6 w-full flex items-center justify-center h-[340px] sm:h-[400px] lg:h-[450px]"
      >
        <AsciiAvatarCanvas imageSrc="/hero-profile.webp" className="w-full h-full" />
      </motion.div>
    </motion.section>
  );
}
