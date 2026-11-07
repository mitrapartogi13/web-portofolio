import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Enables React's <ViewTransition> for route-change morphs.
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
