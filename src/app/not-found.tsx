import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page pt-6 pb-[var(--section-y)] md:pt-10">
      <div className="flex justify-between border-t border-rule pt-3 text-label text-ink-3">
        <span>404</span>
        <span>Tidak ada jalur</span>
      </div>
      <h1 className="mt-10 max-w-[14ch] text-h1 md:mt-16">Halaman ini tidak ditemukan.</h1>
      <p className="mt-6 measure text-body-lg text-ink-2">
        Pencarian selesai tanpa menemukan tujuan. Mungkin tautannya sudah berubah.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/">Ke beranda</ButtonLink>
        <ButtonLink href="/projects" variant="secondary">
          Lihat karya
        </ButtonLink>
      </div>
    </div>
  );
}
