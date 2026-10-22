import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { SITE_URL, baseOpenGraph } from "@/lib/seo";
import site from "@/content/site.json";
import { reviews } from "@/lib/reviews";
import { ProductGrid } from "@/components/ProductGrid";
import { BoxSection } from "@/components/BoxSection";
import { Reviews } from "@/components/Reviews";
import { FitShowcase } from "@/components/FitShowcase";
import { Faq, faqJsonLd } from "@/components/Faq";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...baseOpenGraph, url: "/", title: site.seo.title, description: site.seo.description },
};

const { company, contact } = site;
// Bedrijfsgegevens voor Google (Organization + WebSite); lege CMS-velden laten we weg.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "OnlineStore",
      "@id": `${SITE_URL}/#organisatie`,
      name: company.name || "THOBY3",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      email: contact.email,
      telephone: contact.phone.replace(/\s/g, ""),
      sameAs: [contact.instagram],
      ...(company.address && { address: company.address }),
      ...(company.btw && { vatID: company.btw }),
      ...(company.kvk && { identifier: { "@type": "PropertyValue", propertyID: "KvK", value: company.kvk } }),
    },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: "THOBY3", inLanguage: "nl-NL", publisher: { "@id": `${SITE_URL}/#organisatie` } },
  ],
};
const ld = (data: object) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;

export default function Home() {
  return (
    <>
      {ld(orgJsonLd)}
      {ld(faqJsonLd)}
      <Hero />
      <ProductGrid />
      <Reviews items={reviews} className="mx-auto max-w-[1440px] px-5 py-24 lg:px-10 lg:py-36" />
      <BoxSection />
      <FitShowcase />
      <Faq />
    </>
  );
}
