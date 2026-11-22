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

    // Elements added later (client re-renders, hot reload) are picked up too;
    // otherwise a heading mounted after this effect would stay hidden.
    const seen = new WeakSet<Element>();
    const scan = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-split]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        const mode = el.dataset.reveal ?? el.dataset.split;
        if (mode === "mount") requestAnimationFrame(() => show(el));
        else if (mode !== "manual") io.observe(el);
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
