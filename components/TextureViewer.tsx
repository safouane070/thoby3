"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { ToggleGroup } from "radix-ui";
import { products } from "@/lib/products";
import { Magnifier } from "./Magnifier";

const TEXTURES = [
  { id: "kraag", label: "Kraag", src: products[0].fabric!.textureImage, alt: "Kraag en parelmoerachtige knopen in satijnkatoen" },
  { id: "knoop", label: "Knoop", src: "/img/wd-5.jpg", alt: "Knoopsluiting en stof van de thobe" },
  { id: "manchet", label: "Manchet", src: "/img/wd-2.jpg", alt: "Manchet met THOBY3-merkteken" },
];

// Macrofoto's met loep en een toggle tussen drie details. Foto's zijn 3:4 zodat de loep exact uitlijnt.
export function TextureViewer({ id, sizes }: { id: string; sizes: string }) {
  const [tex, setTex] = useState(TEXTURES[0].id);
  const active = TEXTURES.find((t) => t.id === tex)!;
  return (
    <div>
      <div className="relative aspect-[3/4] border border-line bg-sand">
        <m.div key={active.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="absolute inset-0">
          <Magnifier src={active.src} alt={active.alt} sizes={sizes} className="h-full w-full" />
        </m.div>
      </div>
      <ToggleGroup.Root type="single" value={tex} onValueChange={(v) => v && setTex(v)} aria-label="Detail kiezen" className="mt-3 flex border border-line p-0.5">
        {TEXTURES.map((t) => (
          <ToggleGroup.Item key={t.id} value={t.id} className="press relative min-h-12 flex-1 px-3 py-2 text-xs lg:min-h-0 font-medium text-taupe-strong data-[state=on]:text-ivory">
            {tex === t.id && <m.span layoutId={`tex-${id}`} className="absolute inset-0 bg-ink" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            <span className="relative">{t.label}</span>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
      <p className="mt-2 hidden text-xs text-taupe-strong [@media(hover:hover)]:block">Beweeg over de foto om de stof te vergroten.</p>
    </div>
  );
}
