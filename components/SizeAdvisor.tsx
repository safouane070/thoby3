"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FITS, adviseSize, whatsapp, type Fit } from "@/lib/products";

type Props = {
  /** Productpagina: knop "Kies maat X" zet de maat. */
  onPick?: (size: string) => void;
  /** Homepage: link naar het product in de geadviseerde maat. */
  shopHref?: (size: string) => string;
  /** Getoond naast de maat ("M · Slank"), zodat het advies over de gekozen pasvorm gaat. */
  fit?: Fit;
  tone?: "light" | "dark";
  className?: string;
};

// Lengte in → maat uit, op basis van dezelfde maattabel als de rest van de site (shop.json).
// Eén rustig invulveld (onderlijn, serif-cijfers), het advies ernaast in dezelfde schaal: leest als één zin.
export function SizeAdvisor({ onPick, shopHref, fit, tone = "light", className = "" }: Props) {
  const id = useId();
  const [value, setValue] = useState("");
  const height = Number(value);
  const advice = value.length >= 3 ? adviseSize(height) : {};
  const dark = tone === "dark";
  const muted = dark ? "text-ivory/60" : "text-taupe";
  const fitLabel = fit && FITS.find((f) => f.id === fit)?.label;

  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium">Maathulp</label>
      <p className={`mt-1 text-sm ${muted}`}>Vul je lengte in, dan kiezen wij je maat.</p>

      <div className="mt-5 flex flex-wrap items-end gap-x-10 gap-y-6">
        <div className={`flex items-baseline gap-2 border-b pb-1 transition-[border-color,box-shadow] duration-200 ${dark ? "border-white/25 focus-within:border-gold focus-within:shadow-[0_1px_0_0_var(--gold)]" : "border-line-strong focus-within:border-ink focus-within:shadow-[0_1px_0_0_var(--ink)]"}`}>
          <input id={id} inputMode="numeric" pattern="[0-9]*" maxLength={3} value={value} placeholder="178" autoComplete="off"
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
            className={`field-input w-[3.2ch] bg-transparent font-serif text-4xl leading-none tabular-nums ${dark ? "placeholder:text-ivory/25" : "placeholder:text-black/20"}`} />
          <span className={`text-sm ${muted}`}>cm</span>
        </div>

        <div aria-live="polite" className="min-h-[2.75rem]">
          {advice.size && (
            <p className="flex items-baseline gap-3">
              <span className={`text-sm ${muted}`}>Jouw maat</span>
              <span className="font-serif text-4xl leading-none">{advice.size}</span>
              {fitLabel && <span className={`text-sm ${muted}`}>· {fitLabel}</span>}
            </p>
          )}
          {advice.note === "shorten" && <p className={`mt-1.5 text-xs ${muted}`}>De kleinste maat, laat hem inkorten op lengte.</p>}
          {advice.note === "contact" && (
            <p className={`max-w-xs text-sm ${muted}`}>
              Voor jouw lengte adviseren we je graag persoonlijk.{" "}
              <a href={whatsapp(`Hoi THOBY3, ik ben ${height} cm. Welke maat raden jullie aan?`)} target="_blank" rel="noopener noreferrer" className={`underline underline-offset-4 ${dark ? "text-ivory" : "text-ink"}`}>Stuur ons een WhatsApp</a>
            </p>
          )}
          {value.length >= 3 && !advice.size && !advice.note && <p className={`text-sm ${muted}`}>Vul je lengte in centimeters in, bijvoorbeeld 178.</p>}
        </div>
      </div>

      {advice.size && (onPick || shopHref) && (
        <div className="mt-6">
          {onPick ? (
            <button type="button" onClick={() => onPick(advice.size!)} className="press inline-flex min-h-12 items-center gap-2 border border-ink px-5 text-sm font-medium hover:bg-ink hover:text-ivory">
              Kies maat {advice.size} <ArrowRight size={15} aria-hidden />
            </button>
          ) : (
            <Link href={shopHref!(advice.size)} className={`press group inline-flex min-h-12 items-center gap-2 px-6 text-sm font-medium ${dark ? "btn-light" : "btn-primary"}`}>
              Shop in maat {advice.size} <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
