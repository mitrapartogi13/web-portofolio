import type { Metadata } from "next";
import { personalInfo, publicSocials } from "@/data/portfolio";
import SectionHead from "@/components/ui/SectionHead";
import ContactForm from "@/components/contact/ContactForm";
import CopyEmailButton from "@/components/CopyEmailButton";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Mitra Partogi untuk kolaborasi proyek, kompetisi, atau kerja sama akademik.",
};

export default function ContactPage() {
  const socials = publicSocials();

  return (
    <div className="container-page pt-6 pb-[var(--section-y)] md:pt-10">
      <SectionHead as="h1" index={3} kicker="Kontak" title="Mari berkolaborasi" />
      <p className="mt-6 measure text-body-lg text-ink-2">
        Punya proyek menarik atau ingin berdiskusi seputar peluang kerja sama
        akademik? Kirimkan pesan langsung di bawah ini.
      </p>

      <div className="grid-page mt-12 gap-y-16 md:mt-16">
        <div className="col-span-4 md:col-span-6 lg:col-span-7">
          <ContactForm email={personalInfo.email} />
        </div>

        <dl className="col-span-4 self-start border-t border-ink md:col-span-6 lg:col-span-4 lg:col-start-9">
          <div className="border-b border-rule py-5">
            <dt className="text-label text-ink-3">Email</dt>
            <dd className="mt-2">
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-h3 break-all text-signal underline decoration-1 underline-offset-[0.2em] hover:decoration-2"
              >
                {personalInfo.email}
              </a>
              <div className="mt-4">
                <CopyEmailButton email={personalInfo.email} />
              </div>
            </dd>
          </div>
          <div className="border-b border-rule py-5">
            <dt className="text-label text-ink-3">Lokasi</dt>
            <dd className="mt-2">{personalInfo.location}</dd>
          </div>
          {socials.length > 0 && (
            <div className="border-b border-rule py-5">
              <dt className="text-label text-ink-3">Jejaring</dt>
              <dd className="mt-2">
                <ul className="space-y-1">
                  {socials.map((s) => (
                    <li key={s.key}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-signal underline decoration-1 underline-offset-[0.2em] hover:decoration-2"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
