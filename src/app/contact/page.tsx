'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, Copy, Check } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import Reveal from '@/components/Reveal';

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the email above is still selectable.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="link-underline inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-stone-400 hover:text-accent transition-colors dark:text-stone-500"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          Tersalin
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Salin Email
        </>
      )}
    </button>
  );
}

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // No backend — this hands the message to the visitor's own mail client.
    const subject = encodeURIComponent(
      formState.subject || `Pesan dari ${formState.name}`,
    );
    const body = encodeURIComponent(
      `${formState.message}\n\n—\n${formState.name}\n${formState.email}`,
    );
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;

    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 4000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 md:py-16 space-y-16">
      {/* Title */}
      <Reveal className="space-y-4 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">Hubungi Saya</span>
        <h1 className="font-serif italic text-5xl md:text-7xl text-stone-900 dark:text-stone-50 leading-tight">
          Mari Berkolaborasi
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm md:text-base leading-relaxed">
          Punya proyek menarik atau ingin berdiskusi seputar peluang kerja sama akademik? Kirimkan pesan Anda langsung di bawah ini.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Side: Editorial Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-8">
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
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="bg-transparent border-b border-stone-200 dark:border-stone-800/80 focus:border-accent dark:focus:border-accent outline-hidden py-2 text-stone-900 dark:text-stone-100 transition-colors"
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
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="bg-transparent border-b border-stone-200 dark:border-stone-800/80 focus:border-accent dark:focus:border-accent outline-hidden py-2 text-stone-900 dark:text-stone-100 transition-colors"
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
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                className="bg-transparent border-b border-stone-200 dark:border-stone-800/80 focus:border-accent dark:focus:border-accent outline-hidden py-2 text-stone-900 dark:text-stone-100 transition-colors"
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
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="bg-transparent border-b border-stone-200 dark:border-stone-800/80 focus:border-accent dark:focus:border-accent outline-hidden py-2 text-stone-900 dark:text-stone-100 transition-colors resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="submit"
                className="px-8 py-4 bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-950 font-mono text-xs uppercase tracking-wider rounded-full hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-colors duration-300 shadow-md flex items-center gap-2"
              >
                Kirim Pesan
                <Send className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {justSubmitted && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400"
                  >
                    Membuka aplikasi email Anda…
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        {/* Right Side: Channels */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-12 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-800 pt-10 lg:pt-0 lg:pl-16">
          <div className="space-y-8">
            <h3 className="font-serif text-2xl font-bold italic">Hubungi Langsung</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800/40 text-stone-600 dark:text-stone-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Email</span>
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 hover:text-accent transition-colors">
                    <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                  </p>
                  <CopyEmailButton email={personalInfo.email} />
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
          <div className="space-y-4 pt-6 lg:pt-0 border-t border-stone-200/60 dark:border-stone-800/60">
            <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Jejaring Sosial</span>
            <div className="flex flex-wrap gap-3">
              {Object.entries(personalInfo.socials).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-50 hover:border-stone-400 dark:hover:border-stone-600 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all"
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
