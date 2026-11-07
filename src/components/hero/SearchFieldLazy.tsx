"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SearchField = dynamic(() => import("./SearchField"), { ssr: false });

/**
 * Loads the canvas chunk only once the browser is idle, so it never competes
 * with the hero text (the LCP element) for the main thread.
 */
export default function SearchFieldLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(id);
  }, []);

  return ready ? <SearchField /> : null;
}
