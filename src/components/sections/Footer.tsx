import { site } from "@/data/site";
import CtaButton from "../CtaButton";
import Logo from "../Logo";
import Reveal from "../Reveal";

function SocialIcon({ name }: { name: string }) {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;
  switch (name) {
    case "github":
      return (
        <svg {...common}>
          <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13v5.43h-4v-4.82c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.9h-4v-11Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
        </svg>
      );
  }
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative overflow-hidden px-[5vw] pt-[20vw] md:pt-[10vw] lg:px-[4vw] lg:pt-[10vw]">
      {/* Soft grey glow, recreated with gradients (the reference uses an SVG). */}
      <div
        aria-hidden
        className="absolute top-[38vw] left-1/2 h-[234vw] w-[500vw] -translate-x-1/2 md:top-[50vw] md:h-[46.9vw] md:w-full lg:top-[9.4vw] lg:h-[46.9vw]"
        style={{
          background:
            "radial-gradient(38% 46% at 22% 92%, #ffffff 0%, rgb(255 255 255 / 0) 100%), radial-gradient(42% 52% at 64% 104%, #dcdcd7 0%, rgb(220 220 215 / 0) 100%), radial-gradient(30% 40% at 92% 96%, #ffffff 0%, rgb(255 255 255 / 0) 100%), linear-gradient(to bottom, rgb(244 244 241 / 0) 35%, #e2e2dd 100%)",
          filter: "blur(24px)",
        }}
      />

      <div className="relative">
        <Reveal
          className="rise flex flex-col gap-8 rounded-[32px] border border-fg/15 bg-paper/60 px-6 backdrop-blur-sm py-[60px] md:gap-10 md:px-8 lg:gap-20 lg:p-12"
          rise="96px"
        >
          <div className="flex flex-col-reverse items-center gap-16 md:gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-24">
            <Logo size="footer" />
            <div className="flex flex-col items-center gap-[7vw] md:gap-[2vw] lg:items-end lg:gap-[2vw]">
              <p className="text-center text-[7.5vw] leading-[1.15] md:text-[5vw] lg:w-[40vw] lg:text-right lg:text-[3.4vw]">
                {site.footer.title[0]} <br className="hidden lg:block" />
                {site.footer.title[1]}
              </p>
              <CtaButton label={site.cta} href={`mailto:${site.email}`} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-36">
            <div className="flex flex-col items-center gap-[1vw] text-[4.6vw] leading-[1.5] md:text-[2.3vw] lg:items-start lg:text-[1.25vw]">
              <h2 className="mb-[2vw] uppercase lg:mb-[1vw]">Reach Out</h2>
              <p>{site.location}</p>
              <a href={`mailto:${site.email}`} className="hover:text-fg/60">
                {site.email}
              </a>
            </div>
            <ul className="flex gap-4">
              {site.footer.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid size-[42px] place-items-center rounded-full border border-fg/40 transition-colors hover:bg-fg hover:text-paper"
                  >
                    <SocialIcon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="flex flex-col items-center gap-2 pt-8 pb-6 text-[3.6vw] leading-[1.5] md:flex-row md:justify-between md:pt-12 md:pb-8 md:text-[2.3vw] lg:text-[1.25vw]">
          <p>
            Copyright © {site.name.first[0]}
            {site.name.first.slice(1).toLowerCase()} {site.name.last[0]}
            {site.name.last.slice(1).toLowerCase()} {year}
          </p>
          <p>
            Layout: <a href="https://elena-voss-portfolio-template-v3.21st.app/" className="hover:text-fg/60">Hyperiux</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
