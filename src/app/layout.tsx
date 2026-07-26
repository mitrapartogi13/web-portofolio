import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TransitionProvider from "@/components/TransitionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Mitra Partogi | Informatics & Competitive Programming",
  description:
    "Portofolio Mitra Partogi, mahasiswa Teknik Informatika ITS yang berfokus pada pemrograman kompetitif, sains data, dan pengajaran akademik.",
  openGraph: {
    title: "Mitra Partogi | Informatics & Competitive Programming",
    description:
      "Portofolio Mitra Partogi, mahasiswa Teknik Informatika ITS yang berfokus pada pemrograman kompetitif, sains data, dan pengajaran akademik.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative selection:bg-accent selection:text-white dark:selection:text-stone-900">
        {/* Grain overlay */}
        <div className="noise-bg" />

        {/* Global Navigation header */}
        <Navbar />

        {/* Dynamic page routes container */}
        <main id="main-content" className="flex-1 flex flex-col pt-24 md:pt-28">
          <TransitionProvider>{children}</TransitionProvider>
        </main>

        <Footer />
      </body>
    </html>
  );
}
