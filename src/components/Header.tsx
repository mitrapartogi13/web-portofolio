"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { subscribeScroll } from "@/lib/scroll";
import { site } from "@/data/site";
import CtaButton from "./CtaButton";
import Logo from "./Logo";

/** Fixed header that slides away on scroll down and returns on scroll up. */
export default function Header() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let prev = window.scrollY;
    return subscribeScroll((y) => {
      const el = ref.current;
      if (!el) return;
      const hide = y > prev && y > 80 && !el.contains(document.activeElement);
      el.style.transform = hide ? "translateY(-100%)" : "translateY(0)";
      prev = y;
    });
  }, []);

  return (
    <header
      ref={ref}
      id="header"
      className="fixed inset-x-0 top-0 z-[99] flex items-center justify-between px-[5vw] py-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-[5vw] md:py-[3vw] lg:px-[4vw] lg:py-[1.5vw]"
    >
      {/* Inner wrapper takes the intro drop-in so it never fights the
          hide-on-scroll transform on <header>. */}
      <div className="intro-header flex w-full items-center justify-between" style={{ "--d": "1.4s" } as CSSProperties}>
        <a href="#hero">
          <Logo />
        </a>
        <CtaButton label={site.cta} />
      </div>
    </header>
  );
}
