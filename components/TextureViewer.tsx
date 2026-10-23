"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { ToggleGroup } from "radix-ui";
import home from "@/content/home.json";
import { Magnifier } from "./Magnifier";

const TEXTURES = home.fabric.details.map((d) => ({ id: d.label.toLowerCase(), label: d.label, src: d.image, alt: d.alt }));

// Macrofoto's met loep en een toggle tussen drie details. Foto's zijn 3:4 zodat de loep exact uitlijnt.
export function TextureViewer({ id, sizes, tone = "light" }: { id: string; sizes: string; tone?: "light" | "dark" }) {
  const [tex, setTex] = useState(TEXTURES[0].id);
  const active = TEXTURES.find((t) => t.id === tex)!;
  const dark = tone === "dark";
  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-studio">
        <m.div key={active.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="absolute inset-0">
          <Magnifier src={active.src} alt={active.alt} sizes={sizes} eager={id === "modal"} className="h-full w-full" />
        </m.div>
      </div>
      <ToggleGroup.Root type="single" value={tex} onValueChange={(v) => v && setTex(v)} aria-label="Detail kiezen" className={`mt-3 grid grid-cols-3 gap-1 rounded-full p-1 ${dark ? "bg-paper/10" : "bg-studio"}`}>
        {TEXTURES.map((t) => (
          <ToggleGroup.Item key={t.id} value={t.id}
            className={`press tag min-h-10 rounded-full ${dark
              ? "text-paper/70 data-[state=on]:bg-paper data-[state=on]:text-ink"
              : "text-muted data-[state=on]:bg-paper data-[state=on]:text-ink data-[state=on]:shadow-[0_1px_3px_rgba(11,11,11,0.12)]"}`}>
            {t.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
      <p className={`mt-2 hidden text-xs [@media(hover:hover)]:block ${dark ? "text-muted-dark" : "text-muted"}`}>Beweeg over de foto om de stof te vergroten.</p>
    </div>
  );
}
