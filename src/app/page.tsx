import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import InViewObserver from "@/components/InViewObserver";
import SmoothScroll from "@/components/SmoothScroll";
import Awards from "@/components/sections/Awards";
// import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
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
        <Experience />
        <WhyWorkWithMe />
        <Services />
        <Projects />
        <Awards />
        <Trusted />
        {/* <Testimonials /> */}
        {/* <Faq /> */}
      </main>
      <Footer />
      <InViewObserver />
      <CustomCursor />
    </>
  );
}
