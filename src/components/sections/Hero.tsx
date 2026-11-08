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
  "absolute top-[calc(50vh_-_30vw)] left-[58vw] h-[250vw] w-[200vw] -translate-x-1/2 md:top-[calc(50vh_-_28vw)] md:left-[62vw] md:h-[190vw] md:w-[160vw] lg:top-[-16vh] lg:left-[54vw] lg:h-[180vh] lg:w-[180vw]";

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
 * 300vh section. The gradient card is sticky and shrinks from scale 1 to 0.5
 * over the first 2 viewport heights (easeInOutCubic, measured on the
 * reference), uncovering a wall of project shots drifting upwards.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

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
      <div aria-hidden className="absolute inset-0 bg-night">
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
        className="bg-hero sticky top-0 z-[2] flex h-screen origin-center flex-col overflow-hidden px-[5vw] pt-[30vw] will-change-transform lg:flex-row lg:items-center lg:px-[4vw] lg:pt-0"
      >
        {/* Backlight: blurred orange silhouette behind the subject. */}
        <div aria-hidden className={`${GEO} opacity-60 blur-[48px]`}>
          <div data-depth="30" className="absolute inset-0 scale-[1.04] will-change-transform">
            <div className="hero-light absolute inset-0 bg-[#ff5a0a]" style={SILHOUETTE} />
          </div>
        </div>

        {/* Portrait. The blend lives on this positioned wrapper (its transform
            makes a stacking context), so it blends with the card gradient and
            the subject takes the gradient's hues. */}
        <div aria-hidden className={`${GEO} mix-blend-luminosity`}>
          <div ref={imgRef} data-depth="30" className="absolute inset-0 will-change-transform">
            <Image
              src={site.hero.image}
              alt=""
              fill
              priority
              quality={60}
              sizes="(min-width: 1025px) 64vw, (min-width: 768px) 80vw, 110vw"
              className="object-contain brightness-[0.72] contrast-[1.45]"
            />
            {/* Shade the lower body so it sinks into the dark base. */}
            <div
              className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgb(0_0_0/0.8)_100%),linear-gradient(to_right,transparent_48%,rgb(0_0_0/0.5)_72%)]"
              style={SILHOUETTE}
            />
          </div>
        </div>

        {/* Stage lights: red key light from the left, orange rim from the
            top right, screened on top of the subject only. */}
        <div aria-hidden className={`${GEO} mix-blend-screen`}>
          <div data-depth="30" className="absolute inset-0 will-change-transform">
            <div
              className="hero-light absolute inset-0 bg-[radial-gradient(26%_20%_at_38%_30%,rgb(255_30_10/0.9)_0%,transparent_70%),radial-gradient(22%_26%_at_64%_24%,rgb(255_140_40/0.55)_0%,transparent_70%),radial-gradient(40%_18%_at_45%_52%,rgb(255_70_20/0.35)_0%,transparent_70%)]"
              style={SILHOUETTE}
            />
          </div>
        </div>

        <div ref={textRef} className="relative z-10 flex w-full flex-col will-change-transform lg:flex-row lg:justify-between">
          <SplitText
            as="h1"
            onMount
            delay={0.2}
            lines={[site.hero.title.join(" ")]}
            className="text-[15vw] leading-[1.1] md:w-[56vw] md:text-[12vw] lg:w-[41.4vw] lg:text-[7.5vw]"
          />
          <div className="mt-[6vw] flex flex-col-reverse gap-[7vw] text-[4.5vw] leading-[1.15] md:mt-[4vw] md:gap-[10.4vw] md:py-[2vw] md:text-[3.5vw] lg:mt-0 lg:flex-col lg:justify-between lg:gap-0 lg:text-right lg:text-[1.25vw]">
            <p>
              {site.hero.sideTop[0]}
              <br />
              {site.hero.sideTop[1]}
            </p>
            <p>
              {site.hero.sideBottom[0]}
              <br />
              {site.hero.sideBottom[1]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
