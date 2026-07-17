"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Trophy } from "lucide-react";
import { personalInfo, projects } from "@/data/portfolio";
import ProjectCard from "@/components/ProjectCard";
import useSound from "@/hooks/useSound";

export default function Home() {
  const { playClick } = useSound();
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  // Stagger animation container configs
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 1, 0.5, 1] as const,
      },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 md:py-16 flex flex-col gap-24 md:gap-32">
      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[50vh] items-center">
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-250 dark:border-stone-850 bg-stone-100/50 dark:bg-stone-900/30">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 dark:text-stone-400">
              {personalInfo.subRole}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-serif italic text-6xl md:text-8xl lg:text-[95px] leading-[0.9] tracking-tight text-stone-900 dark:text-stone-50">
            {personalInfo.name}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl font-light text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
            {personalInfo.bio}
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 pt-2">
            <Link
              href="/projects"
              onClick={playClick}
              className="px-6 py-3 bg-stone-900 dark:bg-stone-50 text-stone-55 dark:text-stone-950 font-mono text-[11px] uppercase tracking-wider rounded-full hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-colors duration-300 shadow-xs flex items-center gap-2"
              data-cursor="pointer">
              Lihat Proyek
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              onClick={playClick}
              className="px-6 py-3 border border-stone-250 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white font-mono text-[11px] uppercase tracking-wider rounded-full transition-colors duration-300 flex items-center gap-2"
              data-cursor="pointer">
              Hubungi Saya
            </Link>
          </motion.div>
        </div>

        {/* Hero Sidebar Info */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 flex flex-col justify-end gap-6 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-850 pt-8 lg:pt-0 lg:pl-12 font-mono text-[11px] text-stone-500 dark:text-stone-400">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-stone-400 dark:text-stone-550">
              Lokasi
            </span>
            <p className="text-stone-800 dark:text-stone-200">
              {personalInfo.location}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-stone-400 dark:text-stone-550">
              Kontak
            </span>
            <p className="text-stone-850 dark:text-stone-200 hover:text-accent transition-colors">
              <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-stone-400 dark:text-stone-550">
              Fokus Studi
            </span>
            <p className="text-stone-800 dark:text-stone-200">
              Data Science, AI, and Competitive Programming
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Featured Projects Section */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 dark:border-stone-850 pb-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
              Karya Pilihan
            </span>
            <h2 className="font-serif italic text-4xl md:text-5xl text-stone-900 dark:text-stone-50">
              Proyek Unggulan
            </h2>
          </div>
          <Link
            href="/projects"
            onClick={playClick}
            className="group font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 hover:text-accent dark:hover:text-accent transition-colors flex items-center gap-2">
            Lihat Semua Proyek
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Profile & Credentials Teaser Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-stone-100/50 dark:bg-stone-900/10 border border-stone-200/50 dark:border-stone-800/40 p-8 md:p-12 rounded-3xl">
        <div className="lg:col-span-7 space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
            Akademik & Pengajaran
          </span>
          <h2 className="font-serif italic text-4xl md:text-5xl text-stone-900 dark:text-stone-50 leading-tight">
            Asisten Dosen & Lomba Berprestasi
          </h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm md:text-base">
            Selain mengembangkan kode produksi, saya aktif berkontribusi dalam
            pengajaran akademik sebagai <strong>Asisten Dosen</strong> Struktur
            Data & Algoritma. Saya juga berdedikasi menguji kompetensi rekayasa
            saya melalui kejuaraan pemrograman tingkat nasional.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/about"
              onClick={playClick}
              className="px-6 py-3 bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-950 font-mono text-[11px] uppercase tracking-wider rounded-full hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-colors duration-300 flex items-center gap-2"
              data-cursor="pointer">
              Pelajari Kredensial Saya
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-white dark:bg-stone-900/30 border border-stone-200/60 dark:border-stone-800/40 rounded-2xl space-y-3">
            <BookOpen className="w-5.5 h-5.5 text-accent" />
            <h4 className="font-serif text-lg font-bold">
              Mengajar Asisten Dosen
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Membimbing 100+ mahasiswa dalam mata kuliah Struktur Data & PBO.
            </p>
          </div>
          <div className="p-5 bg-white dark:bg-stone-900/30 border border-stone-200/60 dark:border-stone-800/40 rounded-2xl space-y-3">
            <Trophy className="w-5.5 h-5.5 text-accent" />
            <h4 className="font-serif text-lg font-bold">Juara Kompetisi</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Meraih peringkat kejuaraan di HackFest 2025 dan Gemastik.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
