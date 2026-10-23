import type { Metadata, Viewport } from "next";
import { Geist, Reem_Kufi } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { Motion } from "@/components/Motion";
import { Header } from "@/components/Header";
import { CartDrawerLazy } from "@/components/CartDrawerLazy";
import { Footer } from "@/components/Footer";
import { SITE_LIVE, baseOpenGraph } from "@/lib/seo";
import site from "@/content/site.json";

// Geist voor alles: koppen, tekst, labels en cijfers. Eén letter houdt het rustig.
// Reem Kufi alleen voor de Arabische groet (kufi, net als het logo); niet voorgeladen, want hij staat niet bovenaan.
const text = Geist({ variable: "--face-text", subsets: ["latin"] });
const kufi = Reem_Kufi({ variable: "--face-kufi", subsets: ["arabic"], weight: "500", preload: false });

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

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${text.variable} ${kufi.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col">
        <a href="#inhoud" className="sr-only z-[70] bg-ink px-4 py-3 text-sm text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Naar de inhoud</a>
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
