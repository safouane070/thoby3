import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { baseOpenGraph } from "@/lib/seo";
import site from "@/content/site.json";
import { USPSection } from "@/components/USPSection";
import { ProductGrid } from "@/components/ProductGrid";
import { FitShowcase } from "@/components/FitShowcase";
import { FabricSection } from "@/components/FabricSection";
import { CraftSection } from "@/components/CraftSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...baseOpenGraph, url: "/", title: site.seo.title, description: site.seo.description },
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
