import { personalInfo } from "@/data/portfolio";
import { pad } from "@/lib/utils";
import CopyEmailButton from "./CopyEmailButton";

/**
 * Closing signal field (one of only two full-bleed blue bands on the site).
 * The email address itself is the call to action.
 */
export default function ContactBand({ index }: { index: number }) {
  return (
    <section aria-labelledby="contact-band-title" className="field">
      <div className="container-page section-y">
        <div className="flex items-baseline justify-between gap-4 border-t border-on-signal/35 pt-3 text-label text-on-signal-2">
          <span>§{pad(index)} — Kontak</span>
          <span>{personalInfo.location}</span>
        </div>

        <h2
          id="contact-band-title"
          className="mt-10 max-w-[16ch] text-h1 md:mt-16"
        >
          Punya soal yang menarik untuk dipecahkan?
        </h2>

        <div className="mt-12 flex flex-col gap-6 md:mt-20 lg:flex-row lg:items-end lg:justify-between">
          <a
            href={`mailto:${personalInfo.email}`}
            className="text-h2 break-all underline decoration-1 underline-offset-[0.15em] transition-[text-decoration-thickness] duration-[var(--dur-1)] hover:decoration-2 sm:break-normal"
          >
            {personalInfo.email}
          </a>
          <CopyEmailButton email={personalInfo.email} tone="field" />
        </div>
      </div>
    </section>
  );
}
