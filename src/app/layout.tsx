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

export const viewport: Viewport = { themeColor: "#050505" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={hostGrotesk.variable}>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-white px-4 py-3 text-sm text-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
