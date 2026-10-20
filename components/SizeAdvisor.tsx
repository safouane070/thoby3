"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { adviseSize, whatsapp } from "@/lib/products";

type Props = {
  /** Productpagina: knop "Kies maat X" zet de maat. Zonder: alleen het advies tonen. */
  onPick?: (size: string) => void;
  /** Homepage: link naar het product in de geadviseerde maat. */
  shopHref?: (size: string) => string;
  tone?: "light" | "dark";
  className?: string;
};

// Lengte in → maat uit, op basis van dezelfde maattabel als de rest van de site (shop.json).
export function SizeAdvisor({ onPick, shopHref, tone = "light", className = "" }: Props) {
  const id = useId();
  const [value, setValue] = useState("");
  const height = Number(value);
  const advice = value ? adviseSize(height) : {};
  const dark = tone === "dark";
  const muted = dark ? "text-ivory/70" : "text-taupe-strong";

  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium">Maathulp: hoe lang ben je?</label>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <div className={`flex items-center border ${dark ? "border-white/25 focus-within:border-gold" : "border-line-strong focus-within:border-ink"}`}>
          <input id={id} inputMode="numeric" pattern="[0-9]*" maxLength={3} value={value} placeholder="178"
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
            className={`w-20 bg-transparent px-3 py-3 text-base focus:outline-none ${dark ? "placeholder:text-ivory/40" : "placeholder:text-taupe"}`} />
          <span className={`pr-3 text-sm ${muted}`}>cm</span>
        </div>
        <p className="min-h-6 text-sm" aria-live="polite">
          {advice.size && (
            <>Advies: <strong className="font-medium">maat {advice.size}</strong>{advice.note === "shorten" && <span className={muted}> en laat hem inkorten</span>}</>
          )}
          {advice.note === "contact" && (
            <a href={whatsapp(`Hoi THOBY3, ik ben ${height} cm. Welke maat raden jullie aan?`)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Vraag ons via WhatsApp</a>
          )}
          {value.length >= 3 && !advice.size && !advice.note && <span className={muted}>Vul je lengte in centimeters in.</span>}
        </p>
        {onPick && advice.size && (
          <button type="button" onClick={() => onPick(advice.size!)} className="press min-h-12 border border-ink px-4 text-sm font-medium hover:bg-ink hover:text-ivory lg:min-h-10">Kies maat {advice.size}</button>
        )}
        {shopHref && advice.size && (
          <Link href={shopHref(advice.size)} className={`press inline-flex min-h-12 items-center px-4 text-sm font-medium lg:min-h-10 ${dark ? "btn-light" : "btn-primary"}`}>Shop in maat {advice.size}</Link>
        )}
      </div>
    </div>
  );
}
