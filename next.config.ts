import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [55, 75],
  },
  // Single-page layout: old routes point at their section.
  async redirects() {
    return [
      { source: "/about", destination: "/#why", permanent: false },
      { source: "/projects", destination: "/#portfolio", permanent: false },
      { source: "/projects/:slug", destination: "/#portfolio", permanent: false },
      { source: "/contact", destination: "/#contact", permanent: false },
    ];
  },
};

export default nextConfig;
