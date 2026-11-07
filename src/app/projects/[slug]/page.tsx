import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, hasLink, projects } from "@/data/portfolio";
import PipelineFigure from "@/components/ui/PipelineFigure";
import { Figure, Tag } from "@/components/ui/primitives";
import { pad } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.shortTitle, description: project.description };
}

/** "Schematics NPC 2025 - Problem Setter Core" → "Problem Setter Core". */
function subtitleOf(title: string, shortTitle: string) {
  if (title.includes(" - ")) return title.split(" - ").slice(1).join(" - ");
  return title.replace(shortTitle, "").trim() || null;
}

function CaseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="reveal grid gap-x-8 gap-y-3 border-t border-rule py-8 md:grid-cols-[9rem_1fr]">
      <h2 className="text-label text-ink-3">{title}</h2>
      <div className="measure">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = projects.indexOf(project);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const subtitle = subtitleOf(project.title, project.shortTitle);
  const links = [
    hasLink(project.demoUrl) && { label: "Demo", href: project.demoUrl },
    hasLink(project.githubUrl) && { label: "Kode sumber", href: project.githubUrl },
  ].filter((l): l is { label: string; href: string } => Boolean(l));

  return (
    <article className="container-page pt-6 pb-[var(--section-y)] md:pt-10">
      <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-3 text-label text-ink-3">
        <Link href="/projects" className="inline-flex items-center gap-2 hover:text-ink">
          <ArrowLeft aria-hidden className="size-3.5" strokeWidth={1.75} />
          Katalog karya
        </Link>
        <span>
          Studi kasus {pad(i + 1)} / {pad(projects.length)}
        </span>
      </div>

      <header className="mt-10 md:mt-16">
        <p className="text-label text-ink-3">{project.category}</p>
        <ViewTransition name={`project-${project.slug}`} share="morph">
          <h1 className="mt-4 max-w-[16ch] text-h1">{project.shortTitle}</h1>
        </ViewTransition>
        {subtitle && <p className="mt-4 text-h3 text-ink-2">{subtitle}</p>}
        <p className="mt-8 measure text-body-lg text-ink-2">{project.description}</p>
      </header>

      <div className="grid-page mt-12 gap-y-12 md:mt-16">
        <div className="col-span-4 md:col-span-6 lg:col-span-8">
          <Figure number={1} caption={`Alur kerja ${project.shortTitle}`}>
            <div className="border border-rule p-6 md:p-8">
              <PipelineFigure steps={project.pipeline} />
            </div>
          </Figure>

          <div className="mt-12">
            <CaseSection title="Ringkasan">
              <p>{project.longDescription}</p>
            </CaseSection>
            {project.problem && (
              <CaseSection title="Masalah">
                <p>{project.problem}</p>
              </CaseSection>
            )}
            {project.constraints && project.constraints.length > 0 && (
              <CaseSection title="Batasan">
                <ul className="space-y-2">
                  {project.constraints.map((c) => (
                    <li key={c} className="flex gap-3">
                      <span aria-hidden className="text-ink-3">—</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </CaseSection>
            )}
            {project.approach && project.approach.length > 0 && (
              <CaseSection title="Pendekatan">
                <ol className="space-y-2">
                  {project.approach.map((a, n) => (
                    <li key={a} className="flex gap-3">
                      <span className="text-data text-ink-3">{pad(n + 1)}</span>
                      {a}
                    </li>
                  ))}
                </ol>
              </CaseSection>
            )}
            {project.outcome && (
              <CaseSection title="Hasil">
                {project.metric && (
                  <p className="mb-4">
                    <span className="block font-mono text-[clamp(2rem,1.5rem+2vw,3rem)] leading-none text-signal tabular-nums">
                      {project.metric.value}
                    </span>
                    <span className="mt-2 block text-label text-ink-3">{project.metric.label}</span>
                  </p>
                )}
                <p>{project.outcome}</p>
              </CaseSection>
            )}
          </div>
        </div>

        <aside className="col-span-4 -order-1 md:col-span-6 lg:order-none lg:col-span-3 lg:col-start-10">
          <dl className="border-t border-ink lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            {project.role && (
              <div className="border-b border-rule py-4">
                <dt className="text-label text-ink-3">Peran</dt>
                <dd className="mt-1">{project.role}</dd>
              </div>
            )}
            {project.year && (
              <div className="border-b border-rule py-4">
                <dt className="text-label text-ink-3">Tahun</dt>
                <dd className="mt-1 text-data">{project.year}</dd>
              </div>
            )}
            <div className="border-b border-rule py-4">
              <dt className="text-label text-ink-3">Stack & topik</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {project.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </dd>
            </div>
            <div className="border-b border-rule py-4">
              <dt className="text-label text-ink-3">Tautan</dt>
              <dd className="mt-1">
                {links.length > 0 ? (
                  <ul className="space-y-1">
                    {links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-signal underline underline-offset-[0.2em] hover:decoration-2"
                        >
                          {l.label}
                          <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.75} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-ink-2">Belum dipublikasikan</span>
                )}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <nav
        aria-label="Studi kasus lain"
        className="mt-16 grid grid-cols-1 border-t border-ink md:mt-24 md:grid-cols-2"
      >
        <Link
          href={`/projects/${prev.slug}`}
          className="group border-b border-rule py-6 transition-colors duration-[var(--dur-1)] hover:bg-paper-2 md:border-r md:border-b-0 md:pr-6"
        >
          <span className="flex items-center gap-2 text-label text-ink-3">
            <ArrowLeft aria-hidden className="size-3.5" strokeWidth={1.75} />
            Sebelumnya
          </span>
          <span className="mt-2 block text-h3">{prev.shortTitle}</span>
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="group py-6 text-right transition-colors duration-[var(--dur-1)] hover:bg-paper-2 md:pl-6"
        >
          <span className="flex items-center justify-end gap-2 text-label text-ink-3">
            Berikutnya
            <ArrowRight aria-hidden className="size-3.5" strokeWidth={1.75} />
          </span>
          <span className="mt-2 block text-h3">{next.shortTitle}</span>
        </Link>
      </nav>
    </article>
  );
}
