import type { Metadata } from "next";
import { projects } from "@/data/portfolio";
import SectionHead from "@/components/ui/SectionHead";
import ProjectCatalog from "@/components/projects/ProjectCatalog";

export const metadata: Metadata = {
  title: "Karya",
  description:
    "Katalog proyek Mitra Partogi: perancangan soal kompetisi pemrograman, sistem visual & kontrol roboboat, dan inisiatif efisiensi energi.",
};

export default function ProjectsPage() {
  return (
    <div className="container-page pt-6 pb-[var(--section-y)] md:pt-10">
      <SectionHead
        as="h1"
        index={1}
        kicker="Karya"
        title="Katalog karya"
        meta={<span>Klik untuk membaca studi kasus</span>}
      />
      <p className="mt-6 measure text-body-lg text-ink-2">
        Setiap proyek ditulis sebagai studi kasus: masalahnya, batasannya,
        pendekatan yang saya ambil, dan hasilnya.
      </p>
      <ProjectCatalog projects={projects} />
    </div>
  );
}
