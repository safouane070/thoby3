import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "@/components/ProductDetail";
import { getProduct, products } from "@/lib/products";
import { baseOpenGraph } from "@/lib/seo";

// Statische export: alleen de producten uit content/products.json bestaan; andere slugs geven de 404-pagina.
export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const title = p.kind === "thobe" ? `Thobe ${p.name}` : p.name;
  const url = `/product/${p.slug}`;
  return {
    title, // via de template: "Thobe White Desert | THOBY3"
    description: p.tagline,
    alternates: { canonical: url },
    openGraph: { ...baseOpenGraph, url, title: `${title} | THOBY3`, description: p.tagline, images: [{ url: p.images.primary, alt: title }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.kind === "thobe" ? `Thobe ${product.name}` : product.name,
    description: product.tagline,
    image: product.gallery,
    brand: { "@type": "Brand", name: "THOBY3" },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: product.soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ProductDetail key={product.slug} product={product} />
    </>
  );
}
