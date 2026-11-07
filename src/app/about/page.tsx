import type { Metadata } from "next";
import Image from "next/image";
import {
  academicTimeline,
  achievements,
  personalInfo,
  teachingExperiences,
  teachingSummary,
} from "@/data/portfolio";
import SectionHead from "@/components/ui/SectionHead";
import { Figure } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";
import AsciiPortrait from "@/components/about/AsciiPortrait";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Latar belakang, pendidikan, pengalaman mengajar, dan prestasi Mitra Partogi — mahasiswa Teknik Informatika ITS.",
};

/** Real photos only; Unsplash placeholders in the gallery are skipped. */
const photos = personalInfo.gallery.filter((src) => src.startsWith("/"));

export default function AboutPage() {
  return (
    <div className="container-page pt-6 md:pt-10">
      <SectionHead as="h1" index={2} kicker="Tentang" title="Mitra Partogi, dari dekat" />

      <div className="grid-page mt-12 gap-y-12 md:mt-16">
        <div className="col-span-4 md:col-span-6 lg:col-span-6">
          <p className="measure text-body-lg">{personalInfo.longBio}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/projects">Lihat karya</ButtonLink>
            {personalInfo.resumeUrl !== "#" && (
              <ButtonLink href={personalInfo.resumeUrl} variant="secondary" external>
                Unduh CV
              </ButtonLink>
            )}
          </div>

          <section aria-labelledby="edu-title" id="pendidikan" className="mt-20">
            <h2 id="edu-title" className="border-b border-ink pb-3 text-label">
              Pendidikan
            </h2>
            <ol>
              {academicTimeline.map((edu) => (
                <li
                  key={edu.stage}
                  className="grid gap-x-6 gap-y-1 border-b border-rule py-6 md:grid-cols-[9rem_1fr]"
                >
                  <span className="text-data text-ink-3">{edu.year}</span>
                  <div>
                    <h3 className="text-h3">{edu.stage}</h3>
                    <p className="mt-1 text-sm text-ink-2">{edu.institution}</p>
                    <p className="mt-3 measure text-ink-2">{edu.details}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <Figure
          number={2}
          caption="Potret ASCII. Arahkan kursor untuk melihat foto asli, atau pakai tombol."
          className="col-span-4 md:col-span-4 lg:col-span-5 lg:col-start-8"
        >
          <AsciiPortrait
            src="/hero-profile.webp"
            alt={`Foto ${personalInfo.name}`}
            width={375}
            height={409}
          />
        </Figure>
      </div>

      <section aria-labelledby="teach-title" id="mengajar" className="section-y pb-0">
        <SectionHead
          index={3}
          kicker="Mengajar"
          id="teach-title"
          title="Asisten dosen"
          meta={
            <span>
              {teachingSummary.courses} mata kuliah · {teachingSummary.sks} SKS
            </span>
          }
        />
        <ol className="mt-12 border-t border-rule md:mt-16">
          {teachingExperiences.map((t) => (
            <li
              key={t.id}
              className="reveal grid grid-cols-[3rem_1fr] gap-x-4 gap-y-3 border-b border-rule py-8 md:grid-cols-[4rem_1fr_14rem] lg:grid-cols-[4rem_7fr_5fr_14rem]"
            >
              <span className="grid size-12 place-items-center border border-ink font-mono text-sm">
                {t.code}
              </span>
              <div>
                <h3 className="text-h3">{t.role}</h3>
                <p className="mt-1 text-sm text-ink-2">{t.company}</p>
              </div>
              <div className="col-start-2 md:col-span-2 lg:col-span-1 lg:col-start-3">
                <p className="text-ink-2">{t.description}</p>
                {t.details.length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm text-ink-2">
                    {t.details.map((d) => (
                      <li key={d} className="flex gap-3">
                        <span aria-hidden className="text-ink-3">—</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="col-start-2 row-start-2 text-label text-ink-3 md:col-start-3 md:row-start-1 md:text-right lg:col-start-4">
                {t.period}
                <br />
                {t.sks} SKS
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="prize-title" id="prestasi" className="section-y pb-0">
        <SectionHead index={4} kicker="Prestasi" id="prize-title" title="Kompetisi & pengakuan" />
        <ol className="mt-12 border-t border-rule md:mt-16">
          {achievements.map((a) => (
            <li
              key={a.id}
              className="reveal grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-2 border-b border-rule py-8 md:grid-cols-[5rem_1fr_10rem]"
            >
              <span className="text-data text-ink-3">{a.year}</span>
              <div>
                <h3 className="text-h3">{a.title}</h3>
                <p className="mt-1 text-sm text-ink-2">{a.organizer}</p>
                <p className="mt-3 measure text-ink-2">{a.description}</p>
              </div>
              <span className="col-start-2 text-label text-signal md:col-start-3 md:text-right">
                {a.rank}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {photos.length > 0 && (
        <section aria-labelledby="photo-title" className="section-y">
          <SectionHead index={5} kicker="Foto" id="photo-title" title="Di kampus" />
          <div className="mt-12 grid-page gap-y-10 md:mt-16">
            {photos.map((src, n) => (
              <Figure
                key={src}
                number={3 + n}
                caption="Di kampus ITS, Surabaya."
                className="col-span-4 md:col-span-6 lg:col-span-8"
              >
                <Image
                  src={src}
                  alt={`${personalInfo.name} mengenakan jaket Informatika ITS di depan gedung departemen`}
                  width={1500}
                  height={1500}
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="h-auto w-full"
                />
              </Figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
