import Link from "next/link";
import { personalInfo, publicSocials } from "@/data/portfolio";
import { navItems } from "@/lib/nav";

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = publicSocials();

  return (
    <footer className="border-t border-rule">
      <div className="container-page grid-page gap-y-10 py-12 md:py-16">
        <div className="col-span-4 md:col-span-3 lg:col-span-5">
          <p className="text-h3">{personalInfo.name}</p>
          <p className="mt-2 max-w-[36ch] text-sm text-ink-2">
            Teknik Informatika ITS. {personalInfo.location}.
          </p>
        </div>

        <nav aria-label="Footer" className="col-span-2 md:col-span-1 lg:col-span-2">
          <p className="text-label text-ink-3">Halaman</p>
          <ul className="mt-3 space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-2 hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-2 lg:col-span-2">
          <p className="text-label text-ink-3">Kanal</p>
          <ul className="mt-3 space-y-1">
            <li>
              <a href={`mailto:${personalInfo.email}`} className="text-sm text-ink-2 hover:text-ink">
                Email
              </a>
            </li>
            {socials.map((s) => (
              <li key={s.key}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-2 hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 md:col-span-6 lg:col-span-3">
          <p className="text-label text-ink-3">Kolofon</p>
          <p className="mt-3 text-sm text-ink-2">
            Diset dengan Mona Sans &amp; Martian Mono. Dibangun dengan Next.js,
            dirender statis.
          </p>
        </div>

        <p className="col-span-4 border-t border-rule pt-4 text-label text-ink-3 md:col-span-6 lg:col-span-12">
          © {year} {personalInfo.name}
        </p>
      </div>
    </footer>
  );
}
