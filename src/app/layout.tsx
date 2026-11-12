import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { personalInfo } from "@/data/portfolio";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-host",
  display: "swap",
});

const description =
  "Portfolio of Mitra Partogi — Informatics Engineering student at ITS. Competitive programming, systems, robotics and data.";

export const metadata: Metadata = {
  title: `${personalInfo.name} — Informatics Engineer`,
  description,
  openGraph: { title: `${personalInfo.name} — Informatics Engineer`, description, type: "website" },
};

export const viewport: Viewport = { themeColor: "#f4f4f1" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-intro drives the hero load sequence (see Hero.tsx / globals.css).
    <html lang="en" className={hostGrotesk.variable} data-intro="wait" suppressHydrationWarning>
      <body>
        <noscript>
          <style>{`[data-intro] .intro-photo,[data-intro] .intro-header{opacity:1!important;transform:none!important}[data-intro] .intro-line>span,[data-intro] .split-letter{transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-fg px-4 py-3 text-sm text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
