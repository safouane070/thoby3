import type { NextConfig } from "next";
import imageSizes from "./lib/image-sizes.json";

const nextConfig: NextConfig = {
  // Statische site voor Cloudflare Pages: `npm run build` schrijft alles naar out/.
  output: "export",
  // Foto's worden bij de build voorgegenereerd (scripts/images.mjs); de loader wijst ernaar.
  images: { loader: "custom", loaderFile: "./lib/image-loader.ts", ...imageSizes },
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
