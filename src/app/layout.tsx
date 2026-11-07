import type { Metadata, Viewport } from "next";
import { Martian_Mono, Mona_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { personalInfo } from "@/data/portfolio";

const monaSans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona",
  axes: ["wdth"],
  display: "swap",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
  axes: ["wdth"],
  display: "swap",
});

const description =
  "Portofolio Mitra Partogi — mahasiswa Teknik Informatika ITS. Pemrograman kompetitif, algoritma, sistem, dan sains data.";

export const metadata: Metadata = {
  title: {
    default: `${personalInfo.name} — Informatika ITS`,
    template: `%s — ${personalInfo.name}`,
  },
  description,
  openGraph: {
    title: `${personalInfo.name} — Informatika ITS`,
    description,
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0e10" },
  ],
};

/**
 * Runs before first paint: stored choice wins, otherwise follow the OS and
 * keep following it live until the visitor picks a theme themselves.
 */
const themeScript = `(function(){try{var r=document.documentElement,m=window.matchMedia('(prefers-color-scheme: dark)'),s=localStorage.getItem('theme');r.classList.toggle('dark',s?s==='dark':m.matches);m.addEventListener('change',function(e){if(!localStorage.getItem('theme'))r.classList.toggle('dark',e.matches)})}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${monaSans.variable} ${martianMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main-content"
          className="sr-only z-50 bg-ink px-4 py-3 text-label text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Lewati ke konten
        </a>
        <Navbar />
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
