"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { clamp, docTop, easeInOutCubic, prefersReducedMotion, subscribeScroll } from "@/lib/scroll";
import SplitText from "../SplitText";

const work = site.work.items;
// Same arrangement as the reference: column 1 = items 1,3; column 2 = items 2,4.
const columns = [
  { images: [work[0].image, work[2].image], dur: "10s", delay: "-6.1s" },
  { images: [work[1].image, work[3].image], dur: "18s", delay: "-6.1s" },
];

// Photo box, same geometry as the reference (desktop shifted right so the
// face sits beside the headline). Shared by the photo and its light layers.
const GEO =
  "absolute top-[calc(50vh_-_30vw)] left-[58vw] h-[250vw] w-[200vw] -translate-x-1/2 md:top-[calc(50vh_-_28vw)] md:left-[62vw] md:h-[190vw] md:w-[160vw] lg:top-[-16vh] lg:left-[57vw] lg:h-[180vh] lg:w-[180vw]";

// Alpha mask of the cut-out (public/hero-mask.png, 15 KB) so lights only
// touch the subject. Sized/positioned like the object-contain photo.
const SILHOUETTE: CSSProperties = {
  maskImage: "url(/hero-mask.png)",
  WebkitMaskImage: "url(/hero-mask.png)",
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskPosition: "center",
  WebkitMaskPosition: "center",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
};

/**
 * 300vh section. The backdrop card is sticky and shrinks from scale 1 to 0.5
 * over the first 2 viewport heights (easeInOutCubic, measured on the
 * reference), uncovering a wall of project shots drifting upwards.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // Load sequence, timed on the reference: once the portrait has loaded it
  // fades in (1.4s); 1.1s later the title letters start rising one by one,
  // followed by the side lines and the header (delays in the markup / CSS).
  useEffect(() => {
    const root = document.documentElement;
    const title = textRef.current?.querySelector("h1");
    const showText = () => {
      root.dataset.intro = "text";
      title?.classList.add("split-in");
    };
    if (prefersReducedMotion()) {
      showText();
      return;
    }

    let started = false;
    let textTimer = 0;
    const start = () => {
      if (started) return;
      started = true;
      requestAnimationFrame(() => {
        root.dataset.intro = "photo";
        textTimer = window.setTimeout(showText, 1100);
      });
    };

    const img = imgRef.current?.querySelector("img");
    if (img?.complete && img.naturalWidth > 0) start();
    else {
      img?.addEventListener("load", start, { once: true });
      img?.addEventListener("error", start, { once: true });
    }
    // Never leave the hero blank on a very slow connection.
    const fallback = window.setTimeout(start, 2500);

    return () => {
      window.clearTimeout(textTimer);
      window.clearTimeout(fallback);
      img?.removeEventListener("load", start);
      img?.removeEventListener("error", start);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let top = 0;
    let measuredAt = -1;
    return subscribeScroll((y) => {
      const section = sectionRef.current;
      const card = cardRef.current;
      if (!section || !card) return;
      if (measuredAt !== window.innerWidth) {
        top = docTop(section);
        measuredAt = window.innerWidth;
      }
      const p = clamp((y - top) / (2 * window.innerHeight));
      card.style.transform = `scale(${1 - 0.5 * easeInOutCubic(p)})`;
    });
  }, []);

  // Mouse parallax, measured on the reference: the text row drifts up to
  // 12px and the portrait up to 30px against the pointer (offset normalised
  // to the viewport half-size), eased exponentially with τ = 660ms. It keeps
  // its last position when the pointer leaves, like the reference.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const TAU = 660;
    const depthEls = cardRef.current?.querySelectorAll<HTMLElement>('[data-depth="30"]') ?? [];
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let last = 0;

    const step = (now: number) => {
      const dt = last ? now - last : 16;
      last = now;
      const k = 1 - Math.exp(-dt / TAU);
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      if (textRef.current) textRef.current.style.transform = `translate3d(${-12 * cx}px, ${-12 * cy}px, 0)`;
      depthEls.forEach((el) => {
        el.style.transform = `translate3d(${-30 * cx}px, ${-30 * cy}px, 0)`;
      });
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.0005) raf = requestAnimationFrame(step);
      else raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const hw = window.innerWidth / 2;
      const hh = window.innerHeight / 2;
      tx = (e.clientX - hw) / hw;
      ty = (e.clientY - hh) / hh;
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(step);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative h-[300vh]">
      {/* Work wall, revealed as the card shrinks */}
      <div aria-hidden className="absolute inset-0 bg-wall">
        <div className="sticky top-0 flex h-screen gap-[2.5vw] overflow-hidden px-[5vw] lg:px-[4vw]">
          {columns.map((col, c) => (
            <div
              key={c}
              className="wall-col flex flex-1 flex-col gap-[2.5vw]"
              style={{ "--wall-gap": "2.5vw", "--wall-dur": col.dur, "--wall-delay": col.delay } as CSSProperties}
            >
              {[...col.images, ...col.images].map((src, i) => (
                <div key={i} className="relative aspect-[644/389] w-full shrink-0 overflow-hidden">
                  <Image src={src} alt="" fill sizes="50vw" className="object-cover" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hero card */}
      <div
        ref={cardRef}
        className="bg-hero sticky top-0 z-[2] flex h-screen origin-center flex-col overflow-hidden px-[5vw] pt-[30vw] shadow-[0_40px_120px_rgb(0_0_0/0.14)] will-change-transform lg:flex-row lg:items-center lg:px-[4vw] lg:pt-0"
      >
        {/* Contact shadow: a blurred, slightly offset silhouette behind the
            subject so the cut-out sits on the light backdrop. */}
        <div aria-hidden className={`${GEO} intro-photo`}>
          <div data-depth="30" className="absolute inset-0 will-change-transform">
            <div
              className="absolute inset-0 translate-x-[1.2vw] translate-y-[0.8vw] scale-[1.03] bg-fg opacity-[0.16] blur-[36px]"
              style={SILHOUETTE}
            />
          </div>
        </div>

        {/* Portrait. The lower body dissolves into the backdrop. */}
        <div aria-hidden className={`${GEO} intro-photo`}>
          <div ref={imgRef} data-depth="30" className="absolute inset-0 will-change-transform">
            <Image
              src={site.hero.image}
              alt=""
              fill
              priority
              quality={60}
              sizes="(min-width: 1025px) 64vw, (min-width: 768px) 80vw, 110vw"
              className="object-contain saturate-[0.9] contrast-[1.06] [mask-image:linear-gradient(to_bottom,black_62%,transparent_97%)]"
            />
          </div>
        </div>

        {/* Studio lights: a soft white key from the left and a rim from the
            top right, screened onto the subject only. */}
        <div aria-hidden className={`${GEO} intro-photo mix-blend-screen`}>
          <div data-depth="30" className="absolute inset-0 will-change-transform">
            <div
              className="hero-light absolute inset-0 bg-[radial-gradient(28%_22%_at_36%_30%,rgb(255_255_255/0.32)_0%,transparent_70%),radial-gradient(22%_26%_at_64%_24%,rgb(255_255_255/0.22)_0%,transparent_70%),radial-gradient(40%_18%_at_45%_52%,rgb(255_255_255/0.12)_0%,transparent_70%)]"
              style={SILHOUETTE}
            />
          </div>
        </div>

        <div ref={textRef} className="relative z-10 flex w-full flex-col will-change-transform lg:flex-row lg:justify-between">
          <SplitText
            as="h1"
            trigger="manual"
            stagger={0.045}
            lines={[site.hero.title.join(" ")]}
            className="hero-title text-[15vw] leading-[1.1] md:w-[56vw] md:text-[12vw] lg:w-[41.4vw] lg:text-[7.5vw]"
          />
          <div className="mt-[6vw] flex flex-col-reverse gap-[7vw] text-[4.5vw] leading-[1.15] md:mt-[4vw] md:gap-[10.4vw] md:py-[2vw] md:text-[3.5vw] lg:mt-0 lg:flex-col lg:justify-between lg:gap-0 lg:text-right lg:text-[1.25vw]">
            {[site.hero.sideTop, site.hero.sideBottom].map((lines, b) => (
              <p key={b}>
                {lines.map((line, l) => (
                  <span key={l} className="intro-line">
                    <span style={{ "--d": `${1.05 + b * 0.12 + l * 0.08}s` } as CSSProperties}>{line}</span>
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
