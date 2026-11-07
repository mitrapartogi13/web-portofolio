import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import Awards from "@/components/sections/Awards";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Portfolio from "@/components/sections/Portfolio";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Trusted from "@/components/sections/Trusted";
import WhyWorkWithMe from "@/components/sections/WhyWorkWithMe";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main id="main">
        <Hero />
        <Portfolio />
        <WhyWorkWithMe />
        <Services />
        <Awards />
        <Trusted />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
