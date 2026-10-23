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
    <section aria-labelledby="gift-title" className={`@container flex flex-col rounded-2xl bg-studio p-5 sm:p-7 ${className}`}>
      <h3 id="gift-title" className="display text-xl">Bij elke thobe gratis</h3>
      <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-muted">Musk en siwak zitten bij elke thobe in je bestelling. Los kopen kan ook.</p>
      <ul className="mt-auto grid gap-3 pt-5 @lg:grid-cols-2">
        {gifts.map((p) => (
          <li key={p.slug} className="flex items-center gap-4">
            <Link href={`/product/${p.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-paper" tabIndex={-1} aria-hidden>
              <Image src={p.images.primary} alt="" fill sizes="96px" className="object-contain p-2 mix-blend-multiply" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/product/${p.slug}`} className="block font-medium underline-offset-4 hover:underline">{p.name}</Link>
              <div className="mt-0.5"><Price price={p.price} compareAt={p.compareAt} className="num text-sm text-muted" /></div>
              {!p.soldOut && (
                <button type="button" onClick={() => add({ slug: p.slug })} aria-label={`${p.name} los in winkelwagen`}
                  className="press btn-light tag mt-2 flex min-h-9 items-center gap-1.5 px-3.5 !text-[0.8125rem]">
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
