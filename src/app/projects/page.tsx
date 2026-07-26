'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/portfolio';
import ProjectCard from '@/components/ProjectCard';
import Reveal from '@/components/Reveal';

// Derive filter tabs from the data itself so they always match real projects.
const categories = [
  'Semua',
  ...Array.from(new Set(projects.map((p) => p.category.split(' / ')[0]))),
];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredProjects =
    selectedCategory === 'Semua'
      ? projects
      : projects.filter((p) => p.category.startsWith(selectedCategory));

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 md:py-16 space-y-12">
      {/* Header Title */}
      <Reveal className="space-y-4 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
          Portofolio
        </span>
        <h1 className="font-serif italic text-5xl md:text-7xl text-stone-900 dark:text-stone-50 leading-tight">
          Katalog Proyek
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm md:text-base leading-relaxed">
          Koleksi eksperimen kreatif, aplikasi fungsional, dan arsitektur
          perangkat lunak yang telah saya rancang dan kembangkan. Klik sebuah
          kartu untuk membaca detail lengkapnya.
        </p>
      </Reveal>

      {/* Category Toggles */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 dark:border-stone-800 pb-6 overflow-x-auto scrollbar-none">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
              }}
              className={`relative px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full transition-colors duration-300 ${
                isActive
                  ? 'text-stone-950 dark:text-stone-50 font-bold'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute inset-0 bg-stone-100 dark:bg-stone-900 rounded-full border border-stone-200/50 dark:border-stone-800/40 -z-10 shadow-xs"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              {category}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[40vh] items-start"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <ProjectCard project={project} variant="expandable" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
          <p className="font-serif italic text-2xl text-stone-400">
            Tidak ada proyek ditemukan
          </p>
          <p className="text-xs font-mono text-stone-500">
            Coba pilih kategori filter yang lain.
          </p>
        </div>
      )}
    </div>
  );
}
