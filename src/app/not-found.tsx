import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-hero flex min-h-screen flex-col items-start justify-center px-[5vw] lg:px-[4vw]">
      <p className="text-[4.5vw] md:text-[3.5vw] lg:text-[1.25vw]">404</p>
      <h1 className="mt-4 text-[15vw] leading-[1.1] md:text-[12vw] lg:text-[7.5vw]">Page not found</h1>
      <Link href="/" className="mt-8 rounded-full bg-white px-6 py-3 text-[#111]">
        Back home
      </Link>
    </main>
  );
}
