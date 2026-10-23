"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Drawer } from "vaul";
import { SIZES, sizeCode, type Fit, type Product } from "@/lib/products";
import { FitToggle } from "./FitToggle";
import { Price } from "./Price";
import { useStore } from "./StoreProvider";

/**
 * Maat kiezen op de telefoon: een sheet onderin (Vaul: veeg omlaag, Esc of de knop sluit, focus blijft binnen).
 * Grote knoppen, want in een halve productkaart passen vier maten niet onder een duim.
 */
export function SizeSheet({ product, open, onOpenChange }: { product: Product; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { add, pref } = useStore();
  const [fit, setFit] = useState<Fit>(pref.fit ?? "slim");
  // Vaul schuift alleen in als hij eerst dicht gemount is; deze component laadt pas bij de tik, dus één frame later open.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const id = setTimeout(() => setMounted(true), 0); return () => clearTimeout(id); }, []);
  const pick = (size: string) => {
    onOpenChange(false);
    add({ slug: product.slug, size, fit });
  };
  return (
    <Drawer.Root open={open && mounted} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 rounded-t-[1.5rem] bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] outline-none">
          <div aria-hidden className="mx-auto mt-3 h-1 w-10 rounded-full bg-black/15" />
          <div className="mt-4 flex items-center gap-4">
            <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-studio"><Image src={product.images.primary} alt="" fill sizes="48px" className="object-cover mix-blend-multiply" /></span>
            <div className="flex-1">
              <Drawer.Title className="font-medium">{product.name}</Drawer.Title>
              <Price price={product.price} compareAt={product.compareAt} className="num text-sm text-muted" />
            </div>
            <Drawer.Close aria-label="Sluiten" className="press -mr-2 flex h-11 w-11 items-center justify-center rounded-full bg-studio"><X size={18} /></Drawer.Close>
          </div>
          <Drawer.Description className="sr-only">Kies je pasvorm en maat; je thobe gaat meteen in de winkelwagen.</Drawer.Description>

          <p className="caption mt-6">Pasvorm</p>
          <FitToggle value={fit} onChange={setFit} id={`fit-sheet-${product.slug}`} className="mt-2" />
          <p className="caption mt-5">Maat <span className="font-normal text-muted">op lichaamslengte</span></p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {SIZES.map((s) => (
              <button key={s.label} type="button" onClick={() => pick(s.label)} aria-label={`Maat ${sizeCode(s.label, fit)}, ${s.bodyHeight}, in winkelwagen`}
                className={`press min-h-16 rounded-xl border py-2 ${pref.size === s.label ? "border-ink" : "border-line-strong"}`}>
                <span className="block text-lg font-semibold">{sizeCode(s.label, fit)}</span>
                <span className="num block text-xs text-muted">{s.bodyHeight.replace(" cm", "")}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted">Tik op je maat: hij gaat direct in je winkelwagen.</p>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
