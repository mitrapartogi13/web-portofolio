export interface Project {
  id: string;
  /** URL segment for /projects/[slug]. */
  slug: string;
  title: string;
  /** Short name for indexes and navigation. */
  shortTitle: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string[];
  /**
   * Placeholder stock photo (Unsplash). Kept for reference but not rendered:
   * it does not show the actual project. Replace with a real screenshot or
   * diagram, then render it in the case study.
   */
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  year?: string;
  role?: string;
  /** Case-study sections. Every sentence is derived from longDescription. */
  problem?: string;
  constraints?: string[];
  approach?: string[];
  outcome?: string;
  /** One headline number, if the project has a real one. */
  metric?: { value: string; label: string };
  /** The project's process, drawn by PipelineFigure. Last step = outcome. */
  pipeline: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  /** Short course monogram shown on the timeline node, e.g. "SD". */
  code: string;
  sks: number;
  description: string;
  details: string[];
}

export interface Achievement {
  id: string;
  title: string;
  organizer: string;
  year: string;
  rank: string;
  description: string;
}

export interface Skill {
  name: string;
  category: "languages" | "core" | "tools";
  /** ids of projects / teaching / achievements where this skill was used. */
  evidence?: string[];
}

export interface Stat {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}

export const personalInfo = {
  name: "Mitra Partogi",
  role: "Informatics Programmer & Competitive Programmer",
  // Rotated by the hero's RoleTicker on the home page.
  roles: ["Software Engineer", "Data Science Enthusiast", "Competitive Programmer"],
  bio: "Mahasiswa Teknik Informatika ITS yang berfokus pada efisiensi algoritma, pemrograman kompetitif, dan eksplorasi sains data untuk memecahkan masalah kompleks.",
  longBio:
    "Saya adalah mahasiswa Teknik Informatika di Institut Teknologi Sepuluh Nopember (ITS) yang memiliki ketertarikan mendalam di bidang pemrograman kompetitif dan sains data. Selain aktif mengeksplorasi algoritma, saya mendedikasikan waktu saya sebagai Asisten Dosen untuk membantu rekan mahasiswa memahami dasar pemrograman, struktur data, hingga sistem operasi. Saya juga berpengalaman dalam merancang soal kompetisi nasional serta mengembangkan sistem kontrol robot otonom.",
  avatar: "/profile-picture.webp",
  // Deck shown by the interactive ProfileCardStack on the About page.
  // First item is the real profile photo; the rest are whitelisted Unsplash
  // placeholders (see next.config.ts) — swap these for your own shots.
  gallery: [
    "/profile-picture.webp",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
  ],
  email: "mitrapartogi@gmail.com",
  location: "Surabaya, Indonesia",
  resumeUrl: "#",
  socials: {
    github: "https://github.com/mitrapartogi13",
    linkedin: "https://www.linkedin.com/in/mitra-partogi",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
  },
};

export const academicTimeline = [
  {
    year: "2024 - Sekarang",
    stage: "Sarjana (S1) Teknik Informatika",
    institution: "Institut Teknologi Sepuluh Nopember (ITS)",
    details:
      "Fokus pada Pemrograman Kompetitif dan Sains Data. IPK saat ini: 3.82/4.00.",
  },
  {
    year: "2021 - 2024",
    stage: "Pendidikan Menengah Atas - MIPA",
    institution: "SMAN 15 Surabaya",
    details:
      "Nilai Akhir: 92.76/100.00. Aktif sebagai Duta Hemat Energi Jawa Timur (KESDM RI) dan memimpin organisasi kesiswaan.",
  },
];

export const teachingExperiences: Experience[] = [
  {
    id: "ta-1",
    role: "Asisten Dosen - Struktur Data",
    company: "Departemen Teknik Informatika, ITS",
    period: "Februari 2026 - Sekarang",
    code: "SD",
    sks: 4,
    description:
      "Mengelola praktikum mata kuliah Struktur Data (4 SKS) dan memberikan asistensi pemrograman.",
    details: [
      "Membimbing mahasiswa dalam implementasi struktur data lanjut menggunakan bahasa C dan C++.",
      "Menyelenggarakan sesi asistensi dan evaluasi praktikum untuk memperkuat pemahaman logika mahasiswa.",
    ],
  },
  {
    id: "ta-2",
    role: "Asisten Dosen - Sistem Operasi",
    company: "Departemen Teknik Informatika, ITS",
    period: "Februari 2026 - Sekarang",
    code: "SO",
    sks: 4,
    description:
      "Membantu pelaksanaan praktikum dan pemahaman konsep inti sistem operasi (4 SKS).",
    details: [],
  },
  {
    id: "ta-3",
    role: "Asisten Dosen - Dasar Pemrograman",
    company: "Departemen Teknik Informatika, ITS",
    period: "September 2025 - Sekarang",
    code: "DP",
    sks: 4,
    description:
      "Membimbing mahasiswa tingkat awal dalam memahami fondasi pemrograman mendasar (4 SKS).",
    details: [
      "Mengajarkan konsep algoritma, percabangan, perulangan, dan fungsi menggunakan bahasa C.",
    ],
  },
];

export const achievements: Achievement[] = [
  {
    id: "ach-1",
    title: "Juara 1 Competitive Programming - PINGFEST",
    organizer: "Universitas Sebelas Maret (UNS)",
    year: "2025",
    rank: "Juara 1",
    description:
      "Memenangkan kompetisi pemrograman berbasis penyelesaian masalah algoritmik.",
  },
  {
    id: "ach-2",
    title: "Juara 1 International Brain Challenge",
    organizer: "Telkom University",
    year: "2024",
    rank: "Juara 1",
    description:
      "Kompetisi internasional berskala akademik yang menguji ketangkasan logika dan pemecahan masalah.",
  },
  {
    id: "ach-3",
    title: "Juara 1 Duta Hemat Energi Jawa Timur",
    organizer: "IIEE, Kementerian ESDM RI, dan APEC",
    year: "2023",
    rank: "Juara 1",
    description:
      "Diakui atas kontribusi luar biasa dalam inisiatif efisiensi energi dan konservasi di lingkungan sekolah.",
  },
  {
    id: "ach-4",
    title: "Main Speaker at APEC Youngsters Forum",
    organizer: "IIEE, KESDM RI, APEC",
    year: "2023",
    rank: "Pembicara Utama",
    description:
      "Membagikan wawasan mengenai strategi konservasi energi di hadapan para pemimpin muda internasional.",
  },
];

export const projects: Project[] = [
  {
    id: "p-1",
    slug: "schematics-npc-2025",
    shortTitle: "Schematics NPC 2025",
    year: "2025",
    role: "Problem setter, tim inti",
    problem:
      "Kompetisi pemrograman tingkat nasional membutuhkan soal yang benar-benar menguji kemampuan problem-solving peserta, dengan tingkat kesulitan yang seimbang.",
    constraints: [
      "Setiap soal wajib punya solusi resmi (golden solution) sebagai acuan penilaian.",
      "Test case harus valid dan cukup kuat untuk membedakan solusi benar dari yang keliru.",
      "Tingkat kesulitan antarsoal harus seimbang.",
    ],
    approach: [
      "Menyusun deskripsi masalah yang jelas dan tidak ambigu.",
      "Menulis golden solution untuk setiap soal.",
      "Membuat dan memvalidasi test case di Polygon.",
    ],
    outcome:
      "Soal, solusi resmi, dan test case untuk kompetisi Competitive Programming berskala nasional.",
    pipeline: [
      "Deskripsi masalah",
      "Golden solution",
      "Generator test case",
      "Validasi tingkat kesulitan",
    ],
    title: "Schematics NPC 2025 - Problem Setter Core",
    category: "Competitive Programming / Software Engineering",
    description:
      "Menjadi bagian dari tim perancang soal untuk kompetisi pemrograman tingkat nasional.",
    longDescription:
      "Bertanggung jawab penuh dalam perancangan soal Competitive Programming berskala nasional untuk menguji kemampuan problem-solving peserta. Tugas meliputi penyusunan deskripsi masalah, pembuatan solusi resmi (golden solution), serta pembuatan test case yang valid untuk memastikan tingkat kesulitan yang seimbang.",
    tags: ["C++", "Competitive Programming", "Test-Case Generation", "Polygon"],
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
    demoUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: "p-2",
    slug: "roboboat-barunastra",
    shortTitle: "Roboboat Barunastra",
    role: "Programmer magang, tim Barunastra ITS",
    problem:
      "Kapal tanpa awak harus bergerak secara mandiri: mengenali lingkungannya lalu menentukan arah tanpa kendali manusia.",
    constraints: [
      "Data sensor harus diolah secara real-time.",
      "Sistem visual dan kontrol navigasi harus bekerja sebagai satu kesatuan.",
    ],
    approach: [
      "Mengembangkan sistem visual otonom untuk membaca lingkungan kapal.",
      "Memprogram kontrol navigasi berdasarkan data sensor.",
    ],
    outcome:
      "Sistem visual dan kontrol yang mendukung pergerakan kapal secara otonom.",
    pipeline: [
      "Sensor & kamera",
      "Pengolahan visual",
      "Kontrol navigasi",
      "Gerak otonom",
    ],
    title: "Autonomous Roboboat - Control & Vision System",
    category: "Robotics / Embedded Systems",
    description:
      "Pengembangan sistem visual dan kontrol navigasi otomatis pada kapal tanpa awak Barunastra ITS.",
    longDescription:
      "Berperan sebagai programmer magang yang berfokus pada pengembangan sistem visual otonom serta kontrol navigasi pada roboboat. Proyek ini melibatkan pengolahan data sensor real-time dan pemrograman kontrol untuk mendukung pergerakan robot kapal secara mandiri (autonomous).",
    tags: ["C++", "Python", "Computer Vision", "Robot Control"],
    image:
      "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800",
    demoUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: "p-3",
    slug: "dhelibels",
    shortTitle: "DHELIBELS",
    role: "Pengorganisir gerakan",
    problem:
      "Menekan konsumsi listrik operasional sekolah lewat gerakan bersama, bukan sekadar imbauan.",
    approach: [
      "Langkah-langkah penghematan taktis.",
      "Kolaborasi tim.",
      "Edukasi massal tentang konservasi energi.",
    ],
    outcome:
      "Penghematan listrik setara sekitar Rp15 juta dalam kurun waktu 6 bulan.",
    metric: { value: "±Rp15 jt", label: "dihemat dalam 6 bulan" },
    pipeline: [
      "Langkah penghematan",
      "Kolaborasi tim",
      "Edukasi massal",
      "±Rp15 jt / 6 bulan",
    ],
    title: "DHELIBELS Energy Efficiency Initiative",
    category: "Sustainability / Management",
    description:
      "Kampanye efisiensi energi yang berhasil memotong biaya listrik operasional hingga belasan juta rupiah.",
    longDescription:
      "Mengorganisir gerakan konservasi energi terintegrasi di lingkungan sekolah. Melalui langkah-langkah penghematan taktis, kolaborasi tim, dan edukasi massal, proyek ini berhasil memotong konsumsi listrik sekolah setara dengan sekitar 15 juta rupiah dalam kurun waktu 6 bulan.",
    tags: ["Data Analysis", "Energy Conservation", "Project Management"],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    demoUrl: "#",
    githubUrl: "#",
    featured: true,
  },
];

// Real numbers only — sourced from the data above.
export const stats: Stat[] = [
  { value: 3.82, decimals: 2, label: "IPK / 4.00" },
  { value: 100, suffix: "+", label: "Mahasiswa Dibimbing" },
  { value: 3, suffix: "×", label: "Juara 1" },
  { value: 3, label: "Mata Kuliah Diampu" },
];

export const skills: Skill[] = [
  { name: "C / C++", category: "languages", evidence: ["p-1", "p-2", "ta-1", "ta-3"] },
  { name: "Python", category: "languages", evidence: ["p-2"] },
  { name: "HTML", category: "languages" },
  { name: "Algoritma & Struktur Data", category: "core", evidence: ["ta-1", "p-1"] },
  { name: "Competitive Programming", category: "core", evidence: ["p-1", "ach-1"] },
  { name: "Logika Matematika", category: "core", evidence: ["ach-2"] },
  { name: "Sistem Kontrol Robot Otonom", category: "core", evidence: ["p-2"] },
  { name: "Linux / Ubuntu", category: "tools" },
  { name: "Microsoft Office", category: "tools" },
  { name: "Google Spreadsheets", category: "tools" },
];

// ------------------------------------------------------------------
// Derived helpers
// ------------------------------------------------------------------

export const skillGroups = [
  { key: "languages", label: "Bahasa" },
  { key: "core", label: "Kompetensi inti" },
  { key: "tools", label: "Tools & platform" },
] as const;

/**
 * Social links that point at a real profile. Bare domains such as
 * "https://instagram.com" are placeholders and are not shown.
 */
export function publicSocials() {
  return Object.entries(personalInfo.socials)
    .filter(([, url]) => {
      try {
        return new URL(url).pathname.replace(/\/$/, "") !== "";
      } catch {
        return false;
      }
    })
    .map(([key, url]) => ({
      key,
      label: key === "github" ? "GitHub" : key === "linkedin" ? "LinkedIn" : key,
      url,
    }));
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** True when a link field holds a real URL rather than the "#" placeholder. */
export function hasLink(url?: string): url is string {
  return Boolean(url && url !== "#");
}

/** Resolve an evidence id to a label and an internal link. */
export function resolveEvidence(id: string) {
  const project = projects.find((p) => p.id === id);
  if (project) return { label: project.shortTitle, href: `/projects/${project.slug}` };
  const course = teachingExperiences.find((t) => t.id === id);
  if (course) return { label: `Asisten ${course.code}`, href: `/about#mengajar` };
  const ach = achievements.find((a) => a.id === id);
  if (ach) return { label: ach.title.split(" - ").pop() ?? ach.title, href: `/about#prestasi` };
  return null;
}

/** Totals for the teaching section, derived from the data. */
export const teachingSummary = {
  courses: teachingExperiences.length,
  sks: teachingExperiences.reduce((sum, t) => sum + t.sks, 0),
};
