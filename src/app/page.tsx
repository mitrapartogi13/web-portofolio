  "use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Trophy } from "lucide-react";
import { projects, skills, stats } from "@/data/portfolio";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import StatCounter from "@/components/StatCounter";
import SpliteAsciiHero from "@/components/SpliteAsciiHero";

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const marqueeSkills = [...skills, ...skills];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-14 md:pt-16 pb-10 flex flex-col gap-12 md:gap-16">
      {/* Splite 3D ASCII Hero Section */}
      <SpliteAsciiHero />

      {/* Stat Strip */}
      <Reveal className="grid grid-cols-2 gap-8 border-y border-stone-200 py-10 sm:grid-cols-4 dark:border-stone-800">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1.5">
            <div className="font-serif text-4xl italic text-stone-900 md:text-5xl dark:text-stone-50">
              <StatCounter
                value={stat.value}
                decimals={stat.decimals}
                suffix={stat.suffix}
              />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400">
              {stat.label}
            </p>
          </div>
        ))}
      </Reveal>

      {/* Skills Marquee — decorative rhythm break, duplicated list scrolled by CSS */}
      <div
        aria-hidden
        className="-my-12 overflow-hidden border-y border-stone-200 py-5 dark:border-stone-800"
      >
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {marqueeSkills.map((skill, i) => (
            <span
              key={`${skill.name}-${i}`}
              className="flex items-center gap-10 font-mono text-sm uppercase tracking-widest text-stone-400 dark:text-stone-500"
            >
              {skill.name}
              <span className="text-accent">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Featured Projects Section — one large lead card, two supporting */}
      <section className="space-y-10">
        <SectionHeader
          eyebrow="Karya Pilihan"
          title="Proyek Unggulan"
          aside={
            <Link
              href="/projects"
              className="group font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 hover:text-accent dark:hover:text-accent transition-colors flex items-center gap-2"
            >
              Lihat Semua Proyek
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {featuredProjects[0] && (
            <div className="md:col-span-2">
              <ProjectCard project={featuredProjects[0]} />
            </div>
          )}
          {featuredProjects.slice(1, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Profile & Credentials Teaser Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-stone-100/50 dark:bg-stone-900/10 border border-stone-200/50 dark:border-stone-800/40 p-8 md:p-12 rounded-3xl">
        <Reveal as="div" className="lg:col-span-7 space-y-6">
          <SectionHeader
            eyebrow="Akademik & Pengajaran"
            title="Asisten Dosen & Lomba Berprestasi"
            divider={false}
          />
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm md:text-base">
            Selain mengembangkan kode produksi, saya aktif berkontribusi dalam
            pengajaran akademik sebagai <strong>Asisten Dosen</strong> Struktur
            Data & Algoritma. Saya juga berdedikasi menguji kompetensi rekayasa
            saya melalui kejuaraan pemrograman tingkat nasional.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/about"
              className="px-6 py-3 bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-950 font-mono text-[11px] uppercase tracking-wider rounded-full hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              Pelajari Kredensial Saya
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>

        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Reveal
            delay={0.1}
            className="p-5 bg-white dark:bg-stone-900/30 border border-stone-200/60 dark:border-stone-800/40 rounded-2xl space-y-3"
          >
            <BookOpen className="w-5.5 h-5.5 text-accent" />
            <h4 className="font-serif text-lg font-bold">
              Mengajar Asisten Dosen
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Membimbing 100+ mahasiswa dalam mata kuliah Struktur Data & PBO.
            </p>
          </Reveal>
          <Reveal
            delay={0.2}
            className="p-5 bg-white dark:bg-stone-900/30 border border-stone-200/60 dark:border-stone-800/40 rounded-2xl space-y-3"
          >
            <Trophy className="w-5.5 h-5.5 text-accent" />
            <h4 className="font-serif text-lg font-bold">Juara Kompetisi</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Juara 1 PINGFEST 2025 dan International Brain Challenge 2024.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
