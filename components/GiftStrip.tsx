"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { products } from "@/lib/products";
import { Price } from "./Price";
import { useStore } from "./StoreProvider";

const gifts = products.filter((p) => p.kind === "accessory");

/** Musk en siwak op hun ware schaal: kleine dingen in een smalle strook, niet verloren in een grote productkaart. */
export function GiftStrip({ className = "" }: { className?: string }) {
  const { add } = useStore();
  if (!gifts.length) return null;
  return (
    <section aria-labelledby="gift-title" className={`flex flex-col bg-paper p-5 sm:p-7 ${className}`}>
      <h3 id="gift-title" className="display text-[1.75rem]">Bij elke thobe gratis</h3>
      <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-muted">Musk en siwak zitten bij elke thobe in je bestelling. Los kopen kan ook.</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {gifts.map((p) => (
          <li key={p.slug} className="flex items-center gap-4 border-t border-line pt-4 sm:border-t-0 sm:pt-0">
            <Link href={`/product/${p.slug}`} className="relative h-24 w-24 shrink-0 bg-studio" tabIndex={-1} aria-hidden>
              <Image src={p.images.primary} alt="" fill sizes="96px" className="object-contain p-2 mix-blend-multiply" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/product/${p.slug}`} className="display block text-xl underline-offset-4 hover:underline">{p.name}</Link>
              <div className="mt-0.5"><Price price={p.price} compareAt={p.compareAt} className="num text-base font-semibold" /></div>
              {!p.soldOut && (
                <button type="button" onClick={() => add({ slug: p.slug })} aria-label={`${p.name} los in winkelwagen`}
                  className="press caption mt-1 flex min-h-10 items-center gap-1.5 underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                  <Plus size={14} aria-hidden /> Los erbij
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
