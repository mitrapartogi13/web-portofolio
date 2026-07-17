'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/data/portfolio';
import useSound from '@/hooks/useSound';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { playClick } = useSound();
  const [hovered, setHovered] = useState(false);

  // Motion values for tilt coordinate mapping
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs to avoid jittery movements
  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });

  // Map mouse offsets to degrees of tilt rotation
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse offset from card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize coordinates to ranges [-0.5, 0.5]
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <Link 
      href={`/projects#${project.id}`}
      onClick={playClick}
      className="block group"
      data-cursor="view"
      data-cursor-text="LIHAT"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
        className="relative overflow-hidden rounded-3xl border border-card-border bg-card p-4 transition-all duration-350 hover:shadow-lg dark:hover:shadow-black/20"
      >
        {/* Project Image Panel */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-stone-200 dark:bg-stone-900/50">
          <motion.div 
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="w-full h-full relative"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={project.featured}
            />
          </motion.div>
          
          {/* Subtle noise layout blend overlay */}
          <div className="absolute inset-0 bg-stone-900/10 pointer-events-none mix-blend-overlay" />
          
          {/* Tag Pill Overlay */}
          <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
            {project.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider bg-stone-900/80 dark:bg-stone-950/80 text-white rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card Details */}
        <div className="mt-5 px-1 flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500">
              {project.category}
            </span>
            <h3 className="font-serif italic text-2xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-accent transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-[90%] line-clamp-2 leading-relaxed mt-1">
              {project.description}
            </p>
          </div>
          
          <div className="p-2.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 text-stone-700 dark:text-stone-300 group-hover:bg-accent group-hover:text-white dark:group-hover:text-stone-950 transition-colors duration-300 mt-1 shadow-xs">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

