"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole page. Elements opt in with
 * `data-reveal` (adds `in`) or `data-split` (adds `split-in`); the value
 * "mount" reveals immediately. Keeps SplitText/Reveal as server components,
 * so headings cost no hydration.
 */
export default function InViewObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal], [data-split]");
    const show = (el: HTMLElement) => el.classList.add(el.hasAttribute("data-split") ? "split-in" : "in");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    els.forEach((el) => {
      const mode = el.dataset.reveal ?? el.dataset.split;
      if (mode === "mount") requestAnimationFrame(() => show(el));
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
