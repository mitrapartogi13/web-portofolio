import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Enables React's <ViewTransition> for route-change morphs.
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Temporary: old ProjectCard/ProfileCardStack still render Unsplash
    // placeholders. Removed once those components are replaced.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
