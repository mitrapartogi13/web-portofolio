'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar } from 'lucide-react';
import { personalInfo, academicTimeline, teachingExperiences, achievements } from '@/data/portfolio';
import SkillsDock from '@/components/SkillsDock';
import ProfileCardStack from '@/components/ProfileCardStack';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.25, 1, 0.5, 1] as const
      } 
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 md:py-16 space-y-24 md:space-y-32">
      
      {/* Intro Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
      >
        <div className="lg:col-span-7 space-y-6">
          <motion.span variants={itemVariants} className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
            Biografi Singkat
          </motion.span>
          <motion.h1 
            variants={itemVariants}
            className="font-serif italic text-5xl md:text-7xl text-stone-900 dark:text-stone-50 leading-tight"
          >
            Kisah & Kredensial
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-stone-700 dark:text-stone-300 leading-relaxed text-sm md:text-base whitespace-pre-line"
          >
            {personalInfo.longBio}
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="lg:col-span-5">
          <ProfileCardStack images={personalInfo.gallery} alt={personalInfo.name} />
        </motion.div>
      </motion.section>

      {/* Academic Timeline Section */}
      <section className="space-y-10">
        <div className="border-b border-stone-200 dark:border-stone-850 pb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">Perjalanan Akademik</span>
          <h2 className="font-serif italic text-3xl md:text-4xl text-stone-900 dark:text-stone-50 mt-2">
            Riwayat Pendidikan
          </h2>
        </div>

        <div className="max-w-3xl space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-200 dark:before:bg-stone-800">
          {academicTimeline.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-10 group"
            >
              {/* Node pin */}
              <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border border-stone-300 dark:border-stone-750 bg-background group-hover:bg-accent group-hover:border-accent transition-colors duration-300" />
              
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-stone-400 dark:text-stone-550 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.year}
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                  {item.stage}
                </h3>
                <p className="text-xs font-mono text-stone-500 dark:text-stone-450">
                  {item.institution}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400 max-w-xl mt-1.5 leading-relaxed">
                  {item.details}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Teaching Assistant Section */}
      <section className="space-y-10">
        <div className="border-b border-stone-200 dark:border-stone-850 pb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">Pengalaman Mengajar</span>
          <h2 className="font-serif italic text-3xl md:text-4xl text-stone-900 dark:text-stone-50 mt-2">
            Asisten Dosen
          </h2>
        </div>

        {/* Mobile View: Vertical Timeline */}
        <div className="block md:hidden max-w-3xl space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-200 dark:before:bg-stone-850">
          {teachingExperiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-10 group"
            >
              {/* Node pin */}
              <div className="absolute left-2.5 top-2.5 w-3 h-3 rounded-full border border-stone-350 dark:border-stone-750 bg-background group-hover:bg-accent group-hover:border-accent transition-colors duration-300" />
              
              <div className="p-6 rounded-2xl border border-card-border bg-card space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-bold">
                      {exp.period}
                    </span>
                    <h3 className="font-serif text-xl font-bold leading-tight">
                      {exp.role}
                    </h3>
                    <p className="font-mono text-xs text-stone-400">
                      {exp.company}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed border-t border-stone-200/50 dark:border-stone-800/40 pt-3">
                  {exp.description}
                </p>

                <ul className="space-y-1.5 text-xs text-stone-500 dark:text-stone-400 list-disc list-inside">
                  {exp.details.map((detail, dIdx) => (
                    <li key={dIdx} className="leading-relaxed">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop View: Curved Snaking Timeline */}
        <div className="hidden md:grid grid-cols-2 gap-x-20 gap-y-28 relative">
          {teachingExperiences.map((exp, index) => {
            const rowIndex = Math.floor(index / 2);
            const isRowEven = rowIndex % 2 === 0; // Row 0 (even), Row 1 (odd), Row 2 (even)...
            
            // Grid column mapping for even vs odd rows
            // For even rows: col index 0 is left (Col 1), col index 1 is right (Col 2)
            // For odd rows: col index 0 is right (Col 2), col index 1 is left (Col 1)
            const isLeft = isRowEven ? (index % 2 === 0) : (index % 2 === 1);
            const gridColumn = isLeft ? 1 : 2;
            const gridRow = rowIndex + 1;

            // Connection Lines Calculations
            const hasNext = index < teachingExperiences.length - 1;
            const isLastOfRow = index % 2 === 1;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                style={{
                  gridRow: gridRow,
                  gridColumn: gridColumn,
                }}
                className="relative p-6 md:p-8 rounded-3xl border border-card-border bg-card flex flex-col justify-between"
              >
                {/* Visual Timeline Connectors and Nodes */}
                {/* 1. Horizontal Connectors */}
                {hasNext && !isLastOfRow && (
                  <>
                    {/* Horizontal connecting line from left card to right card in even row */}
                    {isRowEven && (
                      <div className="absolute left-[calc(100%-12px)] top-1/2 -translate-y-1/2 w-[104px] h-[2px] border-t-2 border-dashed border-accent/40 z-0 pointer-events-none" />
                    )}
                    {/* Horizontal connecting line from right card to left card in odd row */}
                    {!isRowEven && (
                      <div className="absolute right-[calc(100%-12px)] top-1/2 -translate-y-1/2 w-[104px] h-[2px] border-t-2 border-dashed border-accent/40 z-0 pointer-events-none" />
                    )}
                  </>
                )}

                {/* 2. Curved Loop (U-turn) Connectors to Next Row */}
                {hasNext && isLastOfRow && (
                  <>
                    {/* Curved connector on the right side (even row -> odd row U-turn) */}
                    {isRowEven && (
                      <div className="absolute left-[calc(100%-20px)] top-1/2 w-[60px] h-[calc(100%+112px)] border-t-2 border-b-2 border-r-2 border-dashed border-accent/40 rounded-r-[24px] z-0 pointer-events-none" />
                    )}
                    {/* Curved connector on the left side (odd row -> even row U-turn) */}
                    {!isRowEven && (
                      <div className="absolute right-[calc(100%-20px)] top-1/2 w-[60px] h-[calc(100%+112px)] border-t-2 border-b-2 border-l-2 border-dashed border-accent/40 rounded-l-[24px] z-0 pointer-events-none" />
                    )}
                  </>
                )}

                {/* 3. Timeline Nodes (Pins) on connection points */}
                {/* Starting point indicator for the very first item */}
                {index === 0 && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-accent bg-background z-10 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  </div>
                )}
                
                {/* Horizontal exit indicators */}
                {hasNext && !isLastOfRow && (
                  <div className={`absolute ${isRowEven ? '-right-2' : '-left-2'} top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-accent bg-background z-10`} />
                )}

                {/* Loop entry/exit indicators */}
                {hasNext && isLastOfRow && (
                  <div className={`absolute ${isRowEven ? '-right-2' : '-left-2'} top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-accent bg-background z-10`} />
                )}
                {!isRowEven && hasNext && !isLastOfRow && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-accent bg-background z-10" />
                )}
                
                {/* End indicator for the very last item */}
                {index === teachingExperiences.length - 1 && (
                  <div className={`absolute ${rowIndex % 2 === 0 || index % 2 === 0 ? '-right-2' : '-left-2'} top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-accent bg-background z-10 flex items-center justify-center`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-bold">
                        {exp.period}
                      </span>
                      <h3 className="font-serif text-2xl font-bold leading-tight">
                        {exp.role}
                      </h3>
                      <p className="font-mono text-xs text-stone-400">
                        {exp.company}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed border-t border-stone-200/50 dark:border-stone-800/40 pt-4">
                    {exp.description}
                  </p>
                </div>

                <ul className="space-y-1.5 text-xs text-stone-500 dark:text-stone-400 list-disc list-inside mt-4">
                  {exp.details.map((detail, dIdx) => (
                    <li key={dIdx} className="leading-relaxed">
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Achievements / Credentials List */}
      <section className="space-y-10">
        <div className="border-b border-stone-200 dark:border-stone-850 pb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">Prestasi & Kejuaraan</span>
          <h2 className="font-serif italic text-3xl md:text-4xl text-stone-900 dark:text-stone-50 mt-2">
            Penghargaan Lomba
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach, index) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl border border-card-border bg-stone-100/30 dark:bg-card space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center px-2 py-0.5 rounded-lg bg-accent/10 text-accent text-[10px] font-mono font-bold">
                  {ach.rank}
                </span>
                <span className="font-mono text-[9px] text-stone-400">{ach.year}</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold leading-snug">
                  {ach.title}
                </h4>
                <p className="text-[10px] font-mono text-stone-400">{ach.organizer}</p>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {ach.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Dock Section */}
      <section className="py-8 border-t border-stone-200 dark:border-stone-850">
        <SkillsDock />
      </section>

    </div>
  );
}
