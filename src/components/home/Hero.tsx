import { academicTimeline, personalInfo, stats } from "@/data/portfolio";
import { ButtonLink } from "@/components/ui/Button";
import { Figure } from "@/components/ui/primitives";
import SearchFieldLazy from "@/components/hero/SearchFieldLazy";

export default function Hero() {
  const [first, ...rest] = personalInfo.name.split(" ");
  const campus = academicTimeline[0];
  const gpa = stats.find((s) => s.label.startsWith("IPK"));
  const wins = stats.find((s) => s.label === "Juara 1");

  return (
    <section aria-labelledby="hero-title" className="container-page pt-6 pb-20 md:pt-10 md:pb-28">
      <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-3 text-label text-ink-3">
        <span>§00 — Portofolio</span>
        <span>{personalInfo.location}</span>
      </div>

      {/* LCP element: plain text, rendered on the server, no animation. */}
      <h1 id="hero-title" className="mt-10 text-display md:mt-14">
        <span className="block">{first}</span>
        <span className="block lg:pl-[calc((100%-11*var(--gutter))/12*2+2*var(--gutter))]">
          {rest.join(" ")}
        </span>
      </h1>

      <div className="grid-page mt-12 gap-y-12 md:mt-16">
        <div className="col-span-4 md:col-span-6 lg:col-span-5">
          <p className="text-label text-ink-3">{personalInfo.roles.join(" · ")}</p>
          <p className="mt-4 measure text-body-lg text-ink-2">{personalInfo.bio}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/projects">Lihat karya</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Hubungi saya
            </ButtonLink>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-rule pt-4">
            <div>
              <dt className="text-label text-ink-3">Kampus</dt>
              <dd className="mt-1 text-data">
                {campus.institution.match(/\(([^)]+)\)/)?.[1] ?? campus.institution}
              </dd>
            </div>
            {gpa && (
              <div>
                <dt className="text-label text-ink-3">{gpa.label}</dt>
                <dd className="mt-1 text-data">{gpa.value.toFixed(gpa.decimals ?? 0)}</dd>
              </div>
            )}
            {wins && (
              <div>
                <dt className="text-label text-ink-3">Juara 1</dt>
                <dd className="mt-1 text-data">
                  {wins.value}
                  {wins.suffix}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <Figure
          number={0}
          caption="Pencarian A* dari kursor menuju ◎. Gerakkan kursor atau ketuk grid."
          className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-6"
        >
          <div className="relative aspect-[4/3] border border-rule md:aspect-[16/10]">
            <SearchFieldLazy />
          </div>
        </Figure>
      </div>
    </section>
  );
}
