export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
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
    linkedin: "http://www.linkedin.com/in/mitra-partogi",
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
  { name: "C / C++", category: "languages" },
  { name: "Python", category: "languages" },
  { name: "HTML", category: "languages" },
  { name: "Algoritma & Struktur Data", category: "core" },
  { name: "Competitive Programming", category: "core" },
  { name: "Logika Matematika", category: "core" },
  { name: "Sistem Kontrol Robot Otonom", category: "core" },
  { name: "Linux / Ubuntu", category: "tools" },
  { name: "Microsoft Office", category: "tools" },
  { name: "Google Spreadsheets", category: "tools" },
];
