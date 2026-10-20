import type { Metadata } from "next";
import { notFound } from "next/navigation";
import legal from "@/content/legal.json";
import site from "@/content/site.json";
import { baseOpenGraph } from "@/lib/seo";

// Juridische pagina's uit content/legal.json, op dezelfde adressen als op de oude WordPress-site.
export const dynamicParams = false;
export const generateStaticParams = () => legal.map((p) => ({ page: p.slug }));

type Props = { params: Promise<{ page: string }> };
const { company } = site;
const find = (slug: string) => legal.find((p) => p.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = find((await params).page);
  if (!p) return {};
  return { title: p.title, alternates: { canonical: `/${p.slug}` }, openGraph: { ...baseOpenGraph, url: `/${p.slug}`, title: `${p.title} | THOBY3` } };
}

export default async function LegalPage({ params }: Props) {
  const p = find((await params).page);
  if (!p) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-40 lg:pb-32">
      <h1 className="font-serif text-5xl leading-none md:text-6xl">{p.title}</h1>
      {/* Inhoud uit het CMS; scripts, event-handlers en javascript:-links worden bij de build geweigerd (scripts/check-content.mjs). */}
      <div className="legal mt-12" dangerouslySetInnerHTML={{ __html: p.body }} />
      {/* Wettelijk verplichte identiteit van de verkoper (art. 3:15d BW), altijd gelijk aan de footer (CMS: Bedrijfsgegevens). */}
      {(company.kvk || company.btw || company.address) && (
        <section className="legal">
          <h2>Bedrijfsgegevens</h2>
          <ul>
            <li>{company.name || "THOBY3"}</li>
            {company.address && <li>{company.address}</li>}
            {company.kvk && <li>KvK-nummer: {company.kvk}</li>}
            {company.btw && <li>Btw-id: {company.btw}</li>}
            <li>{site.contact.email} · {site.contact.phone}</li>
          </ul>
        </section>
      )}
    </article>
  );
}
