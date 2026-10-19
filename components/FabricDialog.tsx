"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { products } from "@/lib/products";
import { TextureViewer } from "./TextureViewer";

const fabric = products[0].fabric!;
const props = [
  ["Uitstraling", "Luxe, met een subtiele glans die de hele dag elegant blijft."],
  ["Comfort", "Ademend katoen, aangenaam op warme dagen én bij formele gelegenheden."],
  ["Gevoel", "Een zachte textuur die heerlijk op de huid ligt."],
  ["Productie", "Onze stoffen zijn ethisch geproduceerd en elke thobe is tot in detail afgewerkt."],
];

// Modal blijft midden in beeld (geen trigger-origin); alleen fade + lichte scale.
export function FabricDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-obsidian/50 data-[state=open]:animate-[fade_200ms_ease-out] data-[state=closed]:animate-[fade_120ms_ease-in_reverse]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92svh] w-[calc(100%-24px)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-line bg-ivory outline-none data-[state=open]:animate-[pop-center_220ms_var(--ease-out)] data-[state=closed]:animate-[pop-center_120ms_ease-in_reverse]">
          <Dialog.Close aria-label="Sluiten" className="press absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ivory/90 lg:h-10 lg:w-10"><X size={18} /></Dialog.Close>
          <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,5fr)_6fr] md:gap-12 md:p-10">
            <div className="mx-auto w-full max-w-sm md:max-w-none"><TextureViewer id="modal" sizes="(min-width:768px) 40vw, 90vw" /></div>
            <div className="md:pt-8">
              <Dialog.Title className="font-serif text-4xl leading-none md:text-5xl">{fabric.material}</Dialog.Title>
              <Dialog.Description className="mt-5 leading-relaxed text-taupe-strong">{fabric.description}</Dialog.Description>
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {props.map(([t, d]) => (
                  <div key={t} className="grid grid-cols-[6.5rem_1fr] gap-4 py-4">
                    <dt className="font-serif text-xl">{t}</dt>
                    <dd className="text-sm leading-relaxed text-taupe-strong">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
