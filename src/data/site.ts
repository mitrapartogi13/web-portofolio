/**
 * All copy for the single page, section by section; content comes from
 * portfolio.ts where a real equivalent exists. Anything marked DUMMY / PLACEHOLDER must be replaced
 * before the site is published.
 */
import { personalInfo, projects } from "./portfolio";

export const site = {
  name: { first: "MITRA", last: "PARTOGI" },
  email: personalInfo.email,
  location: personalInfo.location,
  cta: "Get in Touch",

  hero: {
    // Small line above the name; the name itself comes from `name` above.
    greeting: "Hi there! I'm",
    // Side roles next to the title: one block per role, one string per line.
    side: [
      ["Front End", "Developer"],
      ["Competitive", "Programmer"],
      ["DS AI", "Enthusiast"],
    ],
    // Cut-out portrait (transparent background); lights are added in CSS.
    // High-res lossless master (3764×6688): next/image encodes it once, so
    // it stays sharp on retina screens. hero-mask.png must match its alpha.
    image: "/formal-enhanced.png",
  },

  // Hero background wall: shots from public/work/, spread over two columns.
  work: {
    images: [
      "/work/projects-km-its.webp",
      "/work/award-apec.webp",
      "/work/projects-spmb-jatim.webp",
      "/work/award-brainchallenges5.webp",
      "/work/projects-senopati-ai.webp",
      "/work/award-oracle.webp",
      "/work/2026-schematics-expert.webp",
      "/work/award-apec2.webp",
      "/work/award-senopati-showcase.webp",
    ],
  },

  experience: {
    title: ["Experience"],
    // From the CV (work + organisations), grouped by start year, newest first.
    // accent: each year's own colour (glow, rail, dots, year numerals).
    years: [
      {
        year: "2026",
        accent: "#5b5bd6",
        items: [
          { name: "Frontend Developer", tags: ["BEM ITS", "Next.js", "TypeScript"], image: "/images/experience/2026-exp-km-its.webp" },
          { name: "Laboratory Administrator", tags: ["Algorithms & Programming Lab, ITS"], image: "/images/experience/2026-exp-lab-admin.webp" },
          { name: "Junior Frontend Developer", tags: ["Dinas Pendidikan Jatim", "Next.js", "React"], image: "/images/experience/2026-exp-spmb-jatim.webp" },
          { name: "Expert Staff, Schematics NPC", tags: ["Schematics ITS 2026", "Problem Setting"], image: "/images/experience/2026-schematics-expert.webp" },
          { name: "TA, Data Structures", tags: ["ITS", "C / C++"], image: "/images/experience/2026-ta-data-structures.webp" },
          { name: "TA, Operating Systems", tags: ["ITS", "Linux", "FUSE"], image: "/images/experience/2026-ta-operating-systems.webp" },
          { name: "TA, Programming Fundamentals", tags: ["ITS", "C"], image: "/images/experience/2026-ta-programming-fundamentals.webp" },
        ],
      },
      {
        year: "2025",
        accent: "#e0602b",
        items: [
          { name: "TA, Programming Fundamentals", tags: ["ITS", "C"], image: "/images/experience/2025-ta-programming-fundamentals.webp" },
          { name: "Staff Mentor", tags: ["INCLENATION 2025", "FTEIC ITS"], image: "/images/experience/2025-inclenation.webp" },
          { name: "NPC Staff", tags: ["Schematics ITS 2025", "Problem Setting"], image: "/images/experience/2025-schematics-npc.webp" },
        ],
      },
      {
        year: "2024",
        accent: "#0e8f8a",
        items: [
          { name: "Programming Intern", tags: ["Barunastra ITS", "ROS 2", "OpenCV"], image: "/images/experience/2024-barunastra.webp" },
          { name: "NLC Staff Intern", tags: ["Schematics ITS 2024"], image: "/images/experience/2024-schematics-nlc.webp" },
        ],
      },
      {
        year: "2022",
        accent: "#c0367a",
        items: [
          { name: "Energy Saving Ambassador", tags: ["DHELIBELS", "SMAN 15 Surabaya"], image: "/images/experience/2022-dhelibels.webp" },
        ],
      },
    ],
  },

  why: {
    title: ["Why Work With Me?"],
    subtitle: "Algorithms first, everything else on top",
    cards: [
      {
        icon: "trophy",
        title: "Proven Problem Solving",
        text: "First place at PINGFEST 2025 competitive programming and the International Brain Challenge 2024.",
      },
      {
        icon: "graduation",
        title: "Taught, Not Just Learned",
        text: "Teaching assistant for Data Structures, Operating Systems and Programming Fundamentals at ITS.",
      },
      {
        icon: "cpu",
        title: "From Code to Hardware",
        text: "Built vision and navigation control for Barunastra ITS's autonomous roboboat in C++ and Python.",
      },
    ],
  },

  services: {
    // Tech stack, from the skills and roles on LinkedIn (linkedin.com/in/mitra-partogi).
    // icon: a key of TechIcon (brand logos from simple-icons, others from lucide).
    title: ["Tech Stack", "I've Worked With"],
    text: "The tools behind my day-to-day work: Next.js and TypeScript for the web platforms I build, and C and C++ for algorithms, problem setting and teaching.",
    cards: [
      {
        title: "Front End",
        items: [
          { name: "Next.js", icon: "nextjs" },
          { name: "TypeScript", icon: "typescript" },
          { name: "React", icon: "react" },
          { name: "Web Platforms", icon: "web" },
        ],
      },
      {
        title: "Languages",
        items: [
          { name: "C", icon: "c" },
          { name: "C++", icon: "cpp" },
          { name: "Python", icon: "python" },
          { name: "TypeScript", icon: "typescript" },
        ],
      },
      {
        title: "Algorithms & CP",
        items: [
          { name: "Data Structures", icon: "ds" },
          { name: "Graph Algorithms", icon: "graph" },
          { name: "Problem Setting", icon: "problem" },
          { name: "Competitive Programming", icon: "cp" },
        ],
      },
      {
        title: "Systems & Linux",
        items: [
          { name: "Linux / Ubuntu", icon: "ubuntu" },
          { name: "Processes & Threads", icon: "process" },
          { name: "IPC", icon: "ipc" },
          { name: "FUSE", icon: "fs" },
        ],
      },
    ],
  },

  projects: {
    title: ["Selected", "Projects"],
    intro: "Platforms I have built and maintained: web systems for the ITS student community and for East Java's school admissions, and an AI project on BPJS claims.",
    filters: ["All", "Web", "AI"],
    // From the CV. PLACEHOLDER: SENOPATI summary, all images, and href ("#").
    items: [
      {
        name: "KM ITS Platforms",
        summary: "Front end of three web platforms for the ITS student community: KM ITS Knowledge, News and Timeline. Content browsing and search, plus admin flows to publish news, manage knowledge sources and review event agendas.",
        category: "Web",
        tags: ["Next.js", "TypeScript"],
        year: "2026",
        image: "/images/projects/projects-km-its.webp",
        href: "#",
      },
      {
        name: "SPMB Jawa Timur",
        summary: "Three platforms of East Java's school admission system (PPDB/SPMB): internal admin for offices and report cards, and the school portal, in a Next.js monorepo. Kept public and reliable through registration periods that serve hundreds of thousands of students.",
        category: "Web",
        tags: ["Next.js", "React", "TypeScript", "Monorepo"],
        year: "2026",
        image: "/images/projects/projects-spmb-jatim.webp",
        href: "#",
      },
      {
        name: "SENOPATI AI Klaim BPJS",
        // PLACEHOLDER summary: replace with the real description.
        summary: "An AI project for BPJS claims. Full write-up coming soon.",
        category: "AI",
        tags: ["AI"],
        year: "2026",
        image: "/images/projects/projects-senopati-ai.webp",
        href: "#",
      },
    ],
  },

  awards: {
    title: ["Awards and Contest", "Recognition"],
    // From the CV, newest first.
    items: [
      { title: "1st Place, Competitive Programming", meta: "2026 - PINGFEST UNS", image: "/images/awards/awards-certif-pingfest.webp" },
      { title: "1st Place, Competitive Programming", meta: "2025 - PINGFEST UNS", image: "/images/awards/awards-certif-pingfest.webp" },
      { title: "1st Place, International Brain Challenge", meta: "2024 - TELKOM UNIVERSITY", image: "/images/awards/award-brainchallenges5.webp" },
      { title: "1st Place, Duta Hemat Energi Jawa Timur", meta: "2023 - IIEE, KESDM RI, APEC", image: "/images/awards/award-apec2.webp" },
      { title: "Main Speaker, APEC Youngsters Forum", meta: "2023 - IIEE, KESDM RI, APEC", image: "/images/awards/award-apec.webp" },
    ],
  },

  trusted: {
    title: ["Trusted by Teams", "and Institutions, Built", "Through Real Work."],
    // Real affiliations from portfolio.ts, rendered as text wordmarks.
    logos: ["ITS", "Barunastra", "Schematics", "UNS", "Telkom University", "KESDM"],
  },

  testimonials: {
    title: ["Don't Take It from Me,", "Take It from Them"],
    // PLACEHOLDER: replace with real quotes (lecturers, teammates, students).
    items: [
      { name: "Nama Dosen", role: "Placeholder · Dosen Pengampu, ITS", quote: "Placeholder testimonial. Ask a lecturer you assisted to describe how you ran lab sessions and supported students." },
      { name: "Rekan Tim", role: "Placeholder · Barunastra ITS", quote: "Placeholder testimonial. A teammate from the roboboat team describing your work on vision and control." },
      { name: "Panitia NPC", role: "Placeholder · Schematics ITS", quote: "Placeholder testimonial. A fellow problem setter on how you designed problems and test data." },
      { name: "Mahasiswa", role: "Placeholder · Praktikan Struktur Data", quote: "Placeholder testimonial. A student you mentored on how your explanations helped them." },
      { name: "Pembina", role: "Placeholder · DHELIBELS", quote: "Placeholder testimonial. A supervisor from the energy initiative on your leadership." },
    ],
  },

  faq: {
    title: ["Frequently Asked Questions"],
    items: [
      {
        q: "Who is Mitra Partogi and what does he work on?",
        a: "I study Informatics Engineering at ITS, focused on competitive programming and data science. I work as a teaching assistant for programming fundamentals, data structures and operating systems, set problems for national contests, and have built control software for an autonomous robot boat.",
      },
      {
        q: "What is your strongest technical area?",
        a: "Algorithms and data structures. I compete in competitive programming, set problems for national contests, and teach Data Structures as a TA.",
      },
      {
        q: "Which languages and tools do you use day to day?",
        a: "C and C++ for algorithms and systems work, Python for computer vision and data analysis, and Linux as my everyday environment.",
      },
      {
        q: "Are you open to internships or research collaboration?",
        a: "Yes. I am especially interested in software engineering, machine learning and systems work. Email is the fastest way to reach me.",
      },
      {
        q: "Where are you based?",
        a: `${personalInfo.location}. I study Informatics Engineering at Institut Teknologi Sepuluh Nopember (ITS).`,
      },
    ],
  },

  footer: {
    title: ["Ready to Solve Your", "Next Hard Problem?"],
    socials: [
      { label: "GitHub", href: personalInfo.socials.github, icon: "github" },
      { label: "LinkedIn", href: personalInfo.socials.linkedin, icon: "linkedin" },
      { label: "Instagram", href: personalInfo.socials.instagram, icon: "instagram" }, // PLACEHOLDER URL
      { label: "X", href: personalInfo.socials.twitter, icon: "x" }, // PLACEHOLDER URL
    ],
  },
} as const;
