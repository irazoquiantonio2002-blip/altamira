import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // `legacy/` holds the pre-migration static site; it must never be compiled.
  outputFileTracingExcludes: { "*": ["./legacy/**"] },
};

export default nextConfig;
