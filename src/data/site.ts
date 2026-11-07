/**
 * All copy for the single-page slice. Structure mirrors the reference
 * template section by section; content comes from portfolio.ts where a real
 * equivalent exists. Anything marked DUMMY / PLACEHOLDER must be replaced
 * before the site is published.
 */
import { achievements, personalInfo, projects } from "./portfolio";

export const site = {
  name: { first: "MITRA", last: "PARTOGI" },
  email: personalInfo.email,
  location: personalInfo.location,
  cta: "Get in Touch",

  hero: {
    title: ["Turning Logic", "into Systems"],
    sideTop: ["Competitive", "Programmer"],
    sideBottom: ["Informatics", "Engineer, ITS"],
    // Real photo; a high-res cut-out portrait would match the reference best.
    image: "/hero-portrait.webp",
  },

  work: {
    title: ["Problems I've Solved"],
    items: [
      {
        name: projects[0].shortTitle,
        tags: ["Competitive Programming", "Problem Setting"],
        image: "/work/schematics.webp",
      },
      {
        name: projects[1].shortTitle,
        tags: ["Computer Vision", "Robot Control"],
        image: "/work/roboboat.webp",
      },
      {
        name: projects[2].shortTitle,
        tags: ["Data Analysis", "Energy Efficiency"],
        image: "/work/dhelibels.webp",
      },
      {
        // DUMMY: illustrative side project (A* visualiser for DS labs).
        name: "Search Field",
        tags: ["Algorithms", "Visualisation"],
        image: "/work/astar.webp",
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
    title: ["Engineering That", "Holds Up Under Load"],
    text: personalInfo.bio,
    cards: [
      { title: "Algorithms & CP", items: ["C / C++", "Graph Theory", "Dynamic Programming", "Problem Setting"] },
      { title: "Systems", items: ["Operating Systems", "Linux / Ubuntu", "C Programming", "Concurrency"] },
      { title: "Robotics & Vision", items: ["Python", "Computer Vision", "Robot Control", "Real-time Sensors"] },
      { title: "Data Science", items: ["Python", "Data Analysis", "Spreadsheets", "Visualisation"] },
      { title: "Teaching", items: ["Data Structures", "Operating Systems", "Programming Basics", "Lab Assessment"] },
    ],
  },

  awards: {
    title: ["Awards and Academic", "Recognition"],
    items: achievements.map((a, i) => ({
      title: a.title.split(" - ")[0],
      meta: `${a.year} - ${(a.title.split(" - ")[1] ?? a.organizer).toUpperCase()}`,
      image: ["/work/schematics.webp", "/work/astar.webp", "/work/dhelibels.webp", "/work/roboboat.webp"][i % 4],
    })),
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
        a: personalInfo.longBio,
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
