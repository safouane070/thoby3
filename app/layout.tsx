import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { Motion } from "@/components/Motion";
import { Header } from "@/components/Header";
import { CartDrawerLazy } from "@/components/CartDrawerLazy";
import { Footer } from "@/components/Footer";
import { SITE_LIVE, baseOpenGraph } from "@/lib/seo";
import site from "@/content/site.json";

// Alleen de gebruikte snedes: recht 400/500 (koppen, font-medium) en cursief 400 (<em>). Scheelt ~15 KB op het kritieke pad.
// Beide calls leveren @font-face onder dezelfde familienaam, dus <em> krijgt de echte cursief (geen faux italic).
const serif = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500"], style: "normal" });
const serifItalic = Cormorant_Garamond({ variable: "--font-cormorant-italic", subsets: ["latin"], weight: "400", style: "italic" });
const sans = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  // Zonder dit wijzen OG-/deelafbeeldingen naar localhost.
  metadataBase: new URL("https://thoby3.com"),
  title: { default: site.seo.title, template: "%s | THOBY3" },
  description: site.seo.description,
  applicationName: "THOBY3",
  openGraph: baseOpenGraph,
  twitter: { card: "summary_large_image" },
  robots: SITE_LIVE ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#faf9f6", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${serif.variable} ${serifItalic.variable} ${sans.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col">
        <a href="#inhoud" className="sr-only z-[70] bg-ink px-4 py-3 text-sm text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Naar de inhoud</a>
        <StoreProvider>
          <Motion>
            <Header />
            <main id="inhoud" className="flex-1">{children}</main>
            <Footer />
            <CartDrawerLazy />
          </Motion>
        </StoreProvider>
      </body>
    </html>
  );
}
