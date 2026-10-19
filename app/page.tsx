import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { baseOpenGraph } from "@/lib/seo";
import { USPSection } from "@/components/USPSection";
import { ProductGrid } from "@/components/ProductGrid";
import { FitShowcase } from "@/components/FitShowcase";
import { FabricSection } from "@/components/FabricSection";
import { CraftSection } from "@/components/CraftSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...baseOpenGraph, url: "/", title: "THOBY3 | Premium thobes in satijnkatoen", description: "Luxe thobes in satijn geweven katoen, elke maat in twee pasvormen." },
};

export default function Home() {
  return (
    <>
      <Hero />
      <USPSection />
      <ProductGrid />
      <FitShowcase />
      <FabricSection />
      <CraftSection />
    </>
  );
}
