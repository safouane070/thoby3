import type { NextConfig } from "next";
import imageSizes from "./lib/image-sizes.json";

const nextConfig: NextConfig = {
  // Statische site voor Cloudflare Pages: `npm run build` schrijft alles naar out/.
  output: "export",
  // Foto's worden bij de build voorgegenereerd (scripts/images.mjs); de loader wijst ernaar.
  images: { loader: "custom", loaderFile: "./lib/image-loader.ts", ...imageSizes },
  // De CSS (Tailwind, ~15 KB) staat in de HTML zelf: geen render-blokkerende request vóór de eerste paint.
  // De meeste bezoekers komen één keer via Instagram, dus cachen als los bestand levert weinig op.
  experimental: { inlineCss: true },
  turbopack: {
    // Next voegt altijd polyfills toe voor o.a. Array.at en Object.hasOwn; alle browsers die Next 16 ondersteunt
    // (Chrome/Edge/Firefox 111+, Safari 16.4+) hebben die al. Een lege module bespaart de download.
    resolveAlias: {
      "next/dist/build/polyfills/polyfill-module": "./lib/empty.js",
      "../build/polyfills/polyfill-module": "./lib/empty.js",
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
