import type { Metadata } from "next";

// Next vervangt openGraph per pagina in zijn geheel (geen diepe merge): elke pagina spreidt deze basis.
export const baseOpenGraph = {
  type: "website",
  locale: "nl_NL",
  siteName: "THOBY3",
  images: [{ url: "/img/hero.jpg", width: 2560, height: 1880, alt: "Karavaan kamelen op een duin bij zonsondergang" }],
} satisfies Metadata["openGraph"];
