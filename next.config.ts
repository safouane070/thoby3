import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AVIF eerst (kleiner), WebP als terugval.
  images: { qualities: [75, 90], formats: ["image/avif", "image/webp"] },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
