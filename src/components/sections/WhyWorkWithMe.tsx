import { Cpu, GraduationCap, Trophy } from "lucide-react";
import { site } from "@/data/site";
import SplitText from "../SplitText";
import Reveal from "../Reveal";

const icons = { trophy: Trophy, graduation: GraduationCap, cpu: Cpu } as const;

export default function WhyWorkWithMe() {
  return (
    <section
      id="why"
      className="relative bg-night pt-[65vw] pb-[10vw] lg:pt-[25vw] lg:pb-[10vw]"
    >
      <div className="mb-[10vw] text-center md:mb-[5vw] lg:mb-[5vw]">
        <SplitText
          lines={site.why.title}
          className="text-[9vw] leading-[1.5] md:text-[7vw] lg:text-[5.5vw]"
        />
        <Reveal as="p" className="rise mt-[1.5vw] text-[4.5vw] leading-[1.5] md:text-[2.5vw] lg:text-[1.25vw]">
          {site.why.subtitle}
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {site.why.cards.map((card, i) => {
          const Icon = icons[card.icon];
          return (
            <Reveal
              key={card.title}
              delay={i * 0.1}
              rise="10%"
              className="rise flex flex-col px-[5vw] py-[6vw] md:px-[5vw] md:py-[6vw] lg:min-h-[32vw] lg:px-[4vw] lg:pt-[2vw] lg:pb-[3vw]"
            >
              <div>
                <Icon aria-hidden size={50} strokeWidth={1.5} className="mb-[4vw] text-icon lg:mb-[2.5vw]" />
                <h3 className="mb-[2vw] text-[5.8vw] leading-[1.5] md:text-[4.2vw] lg:mb-[2.5vw] lg:text-[2vw]">
                  {card.title}
                </h3>
                <p className="text-[4vw] leading-[1.5] text-white/80 md:text-[2.8vw] lg:text-[1.25vw]">{card.text}</p>
              </div>
              <div aria-hidden className="mt-[3vw] h-px w-full shrink-0 bg-white/20 lg:mt-auto" />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
