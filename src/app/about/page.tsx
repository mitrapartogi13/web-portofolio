'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Award, Calendar, Trophy } from 'lucide-react';
import {
  personalInfo,
  academicTimeline,
  teachingExperiences,
  achievements,
  skills,
} from '@/data/portfolio';
import ProfileCardStack from '@/components/ProfileCardStack';
import Reveal from '@/components/Reveal';
import SectionHeader from '@/components/SectionHeader';
import { EASE, fadeUp, stagger } from '@/lib/motion';

const skillGroups = [
  { key: 'languages', label: 'Bahasa Pemrograman' },
  { key: 'core', label: 'Kompetensi Inti' },
  { key: 'tools', label: 'Tools & Platform' },
] as const;

/**
 * Vertical timeline whose gold spine "draws" itself as the section scrolls
 * into view. Cards alternate left/right on desktop; each node carries the
 * course monogram (SD, SO, DP).
 */
function TeachingTimeline() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 0.8', 'end 0.55'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  return (
    <div ref={railRef} className="relative">
      {/* Static rail + animated gold spine */}
      <div className="absolute left-6 top-0 bottom-0 w-px -translate-x-1/2 bg-stone-200 dark:bg-stone-800 md:left-1/2" />
      <motion.div
        style={{ scaleY: progress }}
        className="absolute left-6 top-0 bottom-0 w-px -translate-x-1/2 origin-top bg-accent md:left-1/2"
      />

      <div className="flex flex-col gap-10 md:gap-14">
        {teachingExperiences.map((exp, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div
              key={exp.id}
              className="relative md:grid md:grid-cols-2 md:gap-x-20"
            >
              {/* Course monogram node */}
              <div className="absolute left-6 top-5 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-accent/40 bg-background font-mono text-[11px] font-bold text-accent shadow-sm md:left-1/2">
                {exp.code}
              </div>

              <Reveal
                as="article"
                className={`ml-14 rounded-2xl border border-card-border bg-card p-6 transition-colors duration-300 hover:border-accent/40 md:ml-0 ${
                  isLeft ? 'md:col-start-1' : 'md:col-start-2'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-accent">
                    {exp.period}
                  </span>
                  <span className="rounded-full border border-stone-200 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-stone-500 dark:border-stone-800 dark:text-stone-400">
                    {exp.sks} SKS
                  </span>
                </div>

                <h3 className="mt-2 font-serif text-xl font-bold leading-tight md:text-2xl">
                  {exp.role}
                </h3>
                <p className="mt-1 font-mono text-xs text-stone-400">
                  {exp.company}
                </p>

                <p className="mt-4 border-t border-border-muted pt-4 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                  {exp.description}
                </p>

                {exp.details.length > 0 && (
                  <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs text-stone-500 dark:text-stone-400">
                    {exp.details.map((detail, dIdx) => (
                      <li key={dIdx} className="leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 md:py-16 space-y-24 md:space-y-32">
      {/* Intro Grid */}
      <motion.section
        variants={stagger()}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
      >
        <div className="lg:col-span-7 space-y-6">
          <motion.span
            variants={fadeUp}
            className="font-mono text-xs uppercase tracking-widest text-accent font-semibold"
          >
            Biografi Singkat
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="font-serif italic text-5xl md:text-7xl text-stone-900 dark:text-stone-50 leading-tight"
          >
            Kisah & Kredensial
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-stone-700 dark:text-stone-300 leading-relaxed text-sm md:text-base whitespace-pre-line first-letter:mr-1 first-letter:float-left first-letter:font-serif first-letter:text-7xl first-letter:italic first-letter:leading-[0.8] first-letter:text-accent"
          >
            {personalInfo.longBio}
          </motion.p>
        </div>

        <motion.div variants={fadeUp} className="lg:col-span-5">
          <ProfileCardStack images={personalInfo.gallery} alt={personalInfo.name} />
        </motion.div>
      </motion.section>

      {/* Academic Timeline Section */}
      <section className="space-y-10">
        <SectionHeader eyebrow="Perjalanan Akademik" title="Riwayat Pendidikan" />

        <div className="max-w-3xl space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-200 dark:before:bg-stone-800">
          {academicTimeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, ease: EASE, delay: index * 0.1 }}
              className="relative pl-10 group"
            >
              {/* Node pin */}
              <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border border-stone-300 dark:border-stone-700 bg-background group-hover:bg-accent group-hover:border-accent transition-colors duration-300" />

              <div className="space-y-1">
                <span className="font-mono text-[9px] text-stone-400 dark:text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.year}
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                  {item.stage}
                </h3>
                <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
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
      <section className="space-y-12">
        <SectionHeader eyebrow="Pengalaman Mengajar" title="Asisten Dosen" />

        <TeachingTimeline />
      </section>

      {/* Achievements — editorial numbered list */}
      <section className="space-y-10">
        <SectionHeader eyebrow="Prestasi & Kejuaraan" title="Penghargaan Lomba" />

        <div>
          {achievements.map((ach, index) => {
            const RankIcon = ach.rank.toLowerCase().includes('juara')
              ? Trophy
              : Award;
            return (
              <Reveal
                key={ach.id}
                delay={index * 0.06}
                className="group grid grid-cols-[3rem_1fr] gap-x-5 gap-y-3 border-b border-stone-200 py-8 transition-colors duration-300 first:border-t hover:bg-stone-100/50 md:grid-cols-[4.5rem_1fr_auto] md:gap-x-8 dark:border-stone-800 dark:hover:bg-stone-900/20"
              >
                <span className="font-serif italic text-3xl leading-none text-stone-300 transition-colors duration-300 group-hover:text-accent md:text-5xl dark:text-stone-700">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="space-y-1.5">
                  <h4 className="font-serif text-xl font-bold leading-snug transition-colors duration-300 group-hover:text-accent md:text-2xl">
                    {ach.title}
                  </h4>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    {ach.organizer}
                  </p>
                  <p className="max-w-xl text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                    {ach.description}
                  </p>
                </div>

                <div className="col-start-2 flex items-center gap-3 md:col-start-3 md:flex-col md:items-end md:gap-2">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                    <RankIcon className="h-3 w-3" />
                    {ach.rank}
                  </span>
                  <span className="font-mono text-xs text-stone-400 dark:text-stone-500">
                    {ach.year}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-10 border-t border-stone-200 dark:border-stone-800 pt-16">
        <SectionHeader
          eyebrow="Keahlian"
          title="Teknologi & Kompetensi"
          divider={false}
        />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.key} className="space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500">
                {group.label}
              </span>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((skill) => skill.category === group.key)
                  .map((skill) => (
                    <span
                      key={skill.name}
                      className="rounded-full border border-stone-200 px-3.5 py-1.5 font-mono text-[11px] text-stone-700 transition-colors duration-300 hover:border-accent hover:text-accent dark:border-stone-800 dark:text-stone-300"
                    >
                      {skill.name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
