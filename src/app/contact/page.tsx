'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import Magnetic from '@/components/Magnetic';
import useSound from '@/hooks/useSound';

export default function Contact() {
  const { playClick } = useSound();
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    
    // Simple mock submit transition
    if (formState.name && formState.email && formState.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({ name: '', email: '', subject: '', message: '' });
      }, 4000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 md:py-16 space-y-16">
      
      {/* Title */}
      <div className="space-y-4 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">Hubungi Saya</span>
        <h1 className="font-serif italic text-5xl md:text-7xl text-stone-900 dark:text-stone-50 leading-tight">
          Mari Berkolaborasi
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm md:text-base leading-relaxed">
          Punya proyek menarik atau ingin berdiskusi seputar peluang kerja sama akademik? Kirimkan pesan Anda langsung di bawah ini.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Side: Editorial Form */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Name Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500">
                      Nama Lengkap
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formState.name}
                      onFocus={playClick}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="bg-transparent border-b border-stone-250 dark:border-stone-800/80 focus:border-accent dark:focus:border-accent outline-hidden py-2 text-stone-900 dark:text-stone-100 transition-colors"
                      data-cursor="text"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500">
                      Alamat Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formState.email}
                      onFocus={playClick}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="bg-transparent border-b border-stone-250 dark:border-stone-800/80 focus:border-accent dark:focus:border-accent outline-hidden py-2 text-stone-900 dark:text-stone-100 transition-colors"
                      data-cursor="text"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="font-mono text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Subjek / Topik
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={formState.subject}
                    onFocus={playClick}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="bg-transparent border-b border-stone-250 dark:border-stone-800/80 focus:border-accent dark:focus:border-accent outline-hidden py-2 text-stone-900 dark:text-stone-100 transition-colors"
                    data-cursor="text"
                  />
                </div>

                {/* Message Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Pesan Anda
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formState.message}
                    onFocus={playClick}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="bg-transparent border-b border-stone-250 dark:border-stone-800/80 focus:border-accent dark:focus:border-accent outline-hidden py-2 text-stone-900 dark:text-stone-100 transition-colors resize-none"
                    data-cursor="text"
                  />
                </div>

                {/* Magnetic Submit Button */}
                <div className="pt-4 overflow-visible">
                  <Magnetic>
                    <button
                      type="submit"
                      className="px-8 py-4 bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-950 font-mono text-xs uppercase tracking-wider rounded-full hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-colors duration-300 shadow-md flex items-center gap-2"
                      data-cursor="click"
                      data-cursor-text="KIRIM"
                    >
                      Kirim Pesan
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </Magnetic>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center p-12 rounded-3xl border border-stone-200 dark:border-stone-850 bg-stone-100/50 dark:bg-card text-center gap-4 min-h-[350px]"
              >
                <CheckCircle2 className="w-12 h-12 text-accent" />
                <h3 className="font-serif italic text-3xl font-bold">Pesan Terkirim!</h3>
                <p className="text-xs text-stone-500 dark:text-stone-450 max-w-sm leading-relaxed">
                  Terima kasih sudah menghubungi. Pesan Anda telah disimulasikan terkirim. Saya akan membalas secepatnya.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Channels */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-12 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-850 pt-10 lg:pt-0 lg:pl-16">
          <div className="space-y-8">
            <h3 className="font-serif text-2xl font-bold italic">Hubungi Langsung</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800/40 text-stone-600 dark:text-stone-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Email</span>
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 hover:text-accent transition-colors">
                    <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800/40 text-stone-600 dark:text-stone-400">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Lokasi</span>
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">{personalInfo.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Grid */}
          <div className="space-y-4 pt-6 lg:pt-0 border-t border-stone-200/60 dark:border-stone-850/60">
            <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Jejaring Sosial</span>
            <div className="flex flex-wrap gap-3">
              {Object.entries(personalInfo.socials).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClick}
                  className="px-4 py-2 border border-stone-250 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-50 hover:border-stone-400 dark:hover:border-stone-600 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all"
                  data-cursor="pointer"
                >
                  {key}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
