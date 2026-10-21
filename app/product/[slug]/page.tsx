import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "@/components/ProductDetail";
import { getProduct, products } from "@/lib/products";
import { SITE_URL, baseOpenGraph } from "@/lib/seo";
import { average, reviewsFor } from "@/lib/reviews";
import { Reviews } from "@/components/Reviews";
import { ProductCard } from "@/components/ProductCard";

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

  const url = `${SITE_URL}/product/${product.slug}`;
  const own = reviewsFor(product.slug);
  // Google wil absolute URL's; sterren alleen op basis van reviews over dít product.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.kind === "thobe" ? `Thobe ${product.name}` : product.name,
    description: product.tagline,
    image: product.gallery.map((src) => SITE_URL + src),
    url,
    sku: product.slug,
    brand: { "@type": "Brand", name: "THOBY3" },
    ...(own.length > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: average(own), reviewCount: own.length, bestRating: 5, worstRating: 1 },
      review: own.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
        reviewBody: r.text,
        ...(r.date && { datePublished: r.date }),
      })),
    }),
    offers: {
      "@type": "Offer",
      url,
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "NL",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ProductDetail key={product.slug} product={product} />
      <Reviews items={own} className="mx-auto max-w-[1440px] px-5 pb-24 lg:px-10" />
      <section aria-labelledby="meer-title" className="mx-auto max-w-[1440px] border-t border-line px-5 pb-24 pt-16 lg:px-10 lg:pb-28">
        <h2 id="meer-title" className="display text-[clamp(2rem,3.2vw,2.75rem)]">Meer van THOBY3</h2>
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {/* Leverbaar eerst (sort is stabiel), zodat een uitverkochte thobe nooit de eerste suggestie is. */}
          {products.filter((p) => p.slug !== product.slug).sort((a, b) => Number(!!a.soldOut) - Number(!!b.soldOut)).map((p) => (
            <li key={p.slug}><ProductCard product={p} /></li>
          ))}
        </ul>
      </section>
    </>
  );
}
