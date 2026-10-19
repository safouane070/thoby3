"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "./ProductCard";

const filters = [
  { id: "all", label: "Alles" },
  { id: "thobe", label: "Thobes" },
  { id: "accessory", label: "Accessoires" },
] as const;

export function ProductGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const shown = products.filter((p) => filter === "all" || p.kind === filter);

  return (
    <section id="collectie" className="mx-auto max-w-[1440px] px-5 py-24 lg:px-10 lg:py-32">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div>
          <h2 className="font-serif text-5xl leading-none md:text-7xl">Betaalbare <em>luxe</em></h2>
          <p className="mt-5 max-w-md text-taupe">Luxe uitstraling en kwaliteit, voor iedereen toegankelijk.</p>
        </div>
        <div role="group" aria-label="Filter collectie" className="flex border border-line p-0.5">
          {filters.map((f) => (
            <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}
              className={`press min-h-12 px-4 py-2 text-xs font-medium lg:min-h-0 ${filter === f.id ? "bg-ink text-ivory" : "text-taupe hover:text-ink"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
        {shown.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </section>
  );
}
