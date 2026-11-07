import Hero from "@/components/home/Hero";
import {
  AboutSection,
  AchievementsSection,
  StackSection,
  TeachingSection,
  WorkSection,
} from "@/components/home/sections";
import ContactBand from "@/components/ContactBand";

export default function Home() {
  return (
    <>
      <Hero />
      <WorkSection />
      <AboutSection />
      <TeachingSection />
      <AchievementsSection />
      <StackSection />
      <ContactBand index={6} />
    </>
  );
}
