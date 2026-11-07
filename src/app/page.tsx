import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/sections/Hero";
import Portfolio from "@/components/sections/Portfolio";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main id="main">
        <Hero />
        <Portfolio />
        <div className="h-[200vh] bg-night" />
      </main>
    </>
  );
}
