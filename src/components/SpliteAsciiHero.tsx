"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, GraduationCap, Award } from "lucide-react";
import { personalInfo, academicTimeline, achievements, stats } from "@/data/portfolio";
import AsciiAvatarCanvas from "./AsciiAvatarCanvas";
import { EASE, fadeUp, stagger } from "@/lib/motion";

import RansomHeroName from "./RansomHeroName";

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
      <div className="lg:col-span-6 space-y-4 sm:space-y-5 flex flex-col justify-center">
        {/* Top Announcement — plain editorial label without fake arrow */}
        <motion.div variants={fadeUp}>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 pb-0.5 border-b border-stone-300 dark:border-stone-700 hover:border-stone-500 dark:hover:border-stone-400 transition-colors duration-300"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-stone-600 dark:text-stone-400">
              <RoleTicker />
            </span>
          </Link>
        </motion.div>

        {/* Main Headline & Refined Subtitle */}
        <motion.div variants={fadeUp} className="space-y-2">
          <RansomHeroName />

          <p className="text-sm sm:text-base font-medium tracking-wide text-stone-600 dark:text-stone-400">
            Competitive Programmer &amp; Data Science Enthusiast
          </p>
        </motion.div>

        {/* Bio Copy */}
        <motion.p
          variants={fadeUp}
          className="text-sm sm:text-base font-light text-stone-600 dark:text-stone-300 leading-relaxed text-balance max-w-xl"
        >
          {personalInfo.bio}
        </motion.p>

        {/* Interactive CTA Buttons — primary focus */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-3 pt-2"
        >
          <Link
            href="/projects"
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-950 text-xs font-semibold uppercase tracking-wider shadow-lg shadow-stone-900/10 dark:shadow-stone-100/10 hover:bg-stone-800 dark:hover:bg-stone-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Lihat Proyek
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-stone-300 dark:border-stone-800 bg-transparent text-stone-700 dark:text-stone-300 text-xs font-medium uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800/60 hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300"
          >
            Hubungi Saya
          </Link>
        </motion.div>

        {/* Highlights — borderless inline text strip with ample top spacing */}
        <motion.div
          variants={fadeUp}
          className="pt-5 flex flex-wrap items-center gap-y-2 gap-x-3.5 text-xs text-stone-500 dark:text-stone-400 font-normal"
        >
          <div className="inline-flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400 shrink-0" />
            <span>{highlights.academic}</span>
          </div>

          <span className="text-stone-300 dark:text-stone-700 select-none">•</span>

          <div className="inline-flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400 shrink-0" />
            <span>{highlights.teaching}</span>
          </div>

          <span className="text-stone-300 dark:text-stone-700 select-none">•</span>

          <div className="inline-flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400 shrink-0" />
            <span>{highlights.achievement}</span>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Interactive 3D ASCII Avatar Canvas (Dual-sided 3D Card) */}
      <motion.div
        variants={fadeUp}
        className="lg:col-span-6 w-full flex items-center justify-center h-[340px] sm:h-[400px] lg:h-[450px]"
      >
        <AsciiAvatarCanvas
          frontImageSrc="/hero-profile.webp"
          backImageSrc="/profile-bluejack.png"
          className="w-full h-full"
        />
      </motion.div>
    </motion.section>
  );
}
