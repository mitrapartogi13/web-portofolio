import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main id="main">
        <Hero />
      </main>
    </>
  );
}
