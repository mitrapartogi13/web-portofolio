import Link from "next/link";
import {
  achievements,
  personalInfo,
  projects,
  resolveEvidence,
  skillGroups,
  skills,
  stats,
  teachingExperiences,
  teachingSummary,
} from "@/data/portfolio";
import SectionHead from "@/components/ui/SectionHead";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/primitives";
import WorkIndex from "./WorkIndex";

/** §01 — the first of two signal fields. */
export function WorkSection() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section aria-labelledby="work-title" className="field">
      <div className="container-page section-y">
        <SectionHead
          tone="field"
          index={1}
          kicker="Karya"
          id="work-title"
          title="Masalah yang pernah saya pecahkan"
          meta={<span>{featured.length} proyek</span>}
          aside={
            <ButtonLink href="/projects" variant="inverse">
              Semua karya
            </ButtonLink>
          }
        />
        <WorkIndex projects={featured} />
      </div>
    </section>
  );
}

/** §02 */
export function AboutSection() {
  return (
    <section aria-labelledby="about-title" className="container-page section-y">
      <SectionHead
        index={2}
        kicker="Tentang"
        id="about-title"
        title="Belajar algoritma dengan mengerjakannya, lalu mengajarkannya"
      />
      <div className="grid-page mt-12 gap-y-12 md:mt-16">
        <div className="reveal col-span-4 md:col-span-6 lg:col-span-6">
          <p className="measure text-body-lg text-ink-2">{personalInfo.longBio}</p>
          <TextLink href="/about" className="mt-6 inline-block">
            Selengkapnya tentang saya
          </TextLink>
        </div>
        <dl className="col-span-4 grid grid-cols-2 self-start border-t border-rule md:col-span-6 lg:col-span-5 lg:col-start-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="reveal flex flex-col-reverse gap-3 border-b border-rule py-6 odd:border-r odd:pr-4 even:pl-4"
            >
              <dt className="text-label text-ink-3">{stat.label}</dt>
              <dd className="font-mono text-[clamp(2rem,1.5rem+2vw,3rem)] leading-none tabular-nums">
                {stat.value.toFixed(stat.decimals ?? 0)}
                {stat.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** §03 — sticky summary on the left, course table on the right. */
export function TeachingSection() {
  const mentored = stats.find((s) => s.label === "Mahasiswa Dibimbing");
  return (
    <section aria-labelledby="teaching-title" className="container-page section-y pt-0">
      <SectionHead
        index={3}
        kicker="Mengajar"
        id="teaching-title"
        title={`Asisten dosen di ${teachingSummary.courses} mata kuliah inti`}
      />
      <div className="grid-page mt-12 gap-y-10 md:mt-16">
        <div className="col-span-4 md:col-span-6 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <p className="measure text-ink-2">
              Dari Dasar Pemrograman sampai Sistem Operasi — membimbing praktikum,
              asistensi, dan evaluasi di Departemen Teknik Informatika ITS.
            </p>
            <dl className="mt-8 flex gap-8 text-data">
              <div>
                <dt className="text-label text-ink-3">Mata kuliah</dt>
                <dd className="mt-1">{teachingSummary.courses}</dd>
              </div>
              <div>
                <dt className="text-label text-ink-3">Total SKS</dt>
                <dd className="mt-1">{teachingSummary.sks}</dd>
              </div>
              {mentored && (
                <div>
                  <dt className="text-label text-ink-3">Mahasiswa</dt>
                  <dd className="mt-1">
                    {mentored.value}
                    {mentored.suffix}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <ol className="col-span-4 border-t border-rule md:col-span-6 lg:col-span-8">
          {teachingExperiences.map((t) => (
            <li
              key={t.id}
              className="reveal grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2 border-b border-rule py-6 md:grid-cols-[4rem_1fr_auto]"
            >
              <span className="grid size-12 place-items-center border border-ink font-mono text-sm">
                {t.code}
              </span>
              <div>
                <h3 className="text-h3">{t.role.replace(/^Asisten Dosen - /, "")}</h3>
                <p className="mt-1 text-sm text-ink-2">{t.description}</p>
              </div>
              <p className="col-start-2 text-label text-ink-3 md:col-start-3 md:text-right">
                {t.period}
                <br />
                {t.sks} SKS
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** §04 — ledger, no trophies. */
export function AchievementsSection() {
  return (
    <section aria-labelledby="ach-title" className="container-page section-y pt-0">
      <SectionHead
        index={4}
        kicker="Prestasi"
        id="ach-title"
        title="Kompetisi & pengakuan"
        aside={<TextLink href="/about#prestasi">Detail prestasi</TextLink>}
      />
      <ol className="mt-12 border-t border-rule md:mt-16">
        {achievements.map((a) => (
          <li
            key={a.id}
            className="reveal grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-1 border-b border-rule py-5 md:grid-cols-[5rem_1fr_16rem_9rem] md:items-baseline"
          >
            <span className="text-data text-ink-3">{a.year}</span>
            <span className="text-body-lg">{a.title}</span>
            <span className="col-start-2 text-sm text-ink-2 md:col-start-3">{a.organizer}</span>
            <span className="col-start-2 text-label text-signal md:col-start-4 md:text-right">
              {a.rank}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** §05 — each skill points at where it was actually used. */
export function StackSection() {
  return (
    <section aria-labelledby="stack-title" className="container-page section-y pt-0">
      <SectionHead
        index={5}
        kicker="Stack"
        id="stack-title"
        title="Keahlian, dengan buktinya"
        meta={<span>Keahlian → dipakai di</span>}
      />
      <div className="mt-12 grid-page gap-y-12 md:mt-16">
        {skillGroups.map((group) => (
          <div key={group.key} className="col-span-4 md:col-span-6 lg:col-span-4">
            <h3 className="border-b border-ink pb-3 text-label">{group.label}</h3>
            <ul>
              {skills
                .filter((s) => s.category === group.key)
                .map((skill) => {
                  const refs = (skill.evidence ?? [])
                    .map(resolveEvidence)
                    .filter((r) => r !== null);
                  return (
                    <li key={skill.name} className="border-b border-rule py-3">
                      <p className="font-medium">{skill.name}</p>
                      {refs.length > 0 && (
                        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                          {refs.map((r) => (
                            <Link
                              key={r.label}
                              href={r.href}
                              className="text-signal underline decoration-1 underline-offset-[0.2em] hover:decoration-2"
                            >
                              {r.label}
                            </Link>
                          ))}
                        </p>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
