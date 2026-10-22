"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FITS, adviseSize, sizeCode, whatsapp, type Fit } from "@/lib/products";

type Props = {
  /** Kies de geadviseerde maat (productpagina, maatkaart). */
  onPick?: (size: string) => void;
  /** Tekst van de kies-knop; standaard "Kies maat M". */
  pickLabel?: (size: string) => string;
  /** Link naar het product in de geadviseerde maat. */
  shopHref?: (size: string) => string;
  /** Getoond naast de maat ("M-1 · Slank"), zodat het advies over de gekozen pasvorm gaat. */
  fit?: Fit;
  tone?: "light" | "dark";
  /** Productpagina: dicht als één regel tekst; pas open als je twijfelt (de meeste mensen kennen hun maat). */
  collapsible?: boolean;
  className?: string;
};

// Lengte in → maat uit, op basis van dezelfde maattabel als de rest van de site (shop.json).
// Eén invulveld met onderlijn en grote smalle cijfers; het advies ernaast in dezelfde schaal: leest als één zin.
export function SizeAdvisor({ onPick, pickLabel, shopHref, fit, tone = "light", collapsible = false, className = "" }: Props) {
  const id = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(!collapsible);
  const height = Number(value);
  const advice = value.length >= 3 ? adviseSize(height) : {};
  const dark = tone === "dark";
  const muted = dark ? "text-muted-dark" : "text-muted";
  const fitLabel = fit && FITS.find((f) => f.id === fit)?.label;

  if (!open) {
    return (
      <div className={className}>
        <button type="button" onClick={() => { setOpen(true); requestAnimationFrame(() => document.getElementById(id)?.focus()); }}
          className="press flex min-h-12 items-center gap-2 text-sm underline decoration-line-strong underline-offset-4 hover:decoration-ink">
          Twijfel je over je maat? Vul je lengte in
        </button>
      </div>
    );
  }

  return (
    <div className={`sheet-enter ${className}`}>
      <label htmlFor={id} className="caption block">Twijfel je? Vul je lengte in</label>
      <p className={`mt-1 text-sm ${muted}`}>In centimeters. Dan kiezen wij je maat.</p>

      <div className="mt-4 flex flex-wrap items-end gap-x-10 gap-y-5">
        <div className={`flex items-baseline gap-2 border-b-2 pb-1 transition-colors duration-200 ${dark ? "border-paper/30 focus-within:border-gold" : "border-line-strong focus-within:border-ink"}`}>
          <input id={id} inputMode="numeric" pattern="[0-9]*" maxLength={3} value={value} placeholder="178" autoComplete="off"
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
            className={`field-input num w-[3ch] bg-transparent text-5xl font-bold leading-none ${dark ? "placeholder:text-paper/55" : "placeholder:text-[#6e6860]"}`} />
          <span className={`caption ${muted}`}>cm</span>
        </div>

        <div aria-live="polite" className="min-h-[3rem]">
          {advice.size && (
            <p className="flex items-baseline gap-3">
              <span className={`caption ${muted}`}>Jouw maat</span>
              <span className="display text-5xl">{fit ? sizeCode(advice.size, fit) : advice.size}</span>
              {fitLabel && <span className={`text-sm ${muted}`}>{fitLabel}</span>}
            </p>
          )}
          {advice.note === "shorten" && <p className={`mt-1.5 text-xs ${muted}`}>De kleinste maat, laat hem inkorten op lengte.</p>}
          {advice.note === "contact" && (
            <p className={`max-w-xs text-sm ${muted}`}>
              Voor jouw lengte adviseren we je graag persoonlijk.{" "}
              <a href={whatsapp(`Hoi THOBY3, ik ben ${height} cm. Welke maat raden jullie aan?`)} target="_blank" rel="noopener noreferrer" className={`underline underline-offset-4 ${dark ? "text-paper" : "text-ink"}`}>Stuur ons een WhatsApp</a>
            </p>
          )}
          {value.length >= 3 && !advice.size && !advice.note && <p className={`text-sm ${muted}`}>Vul je lengte in centimeters in, bijvoorbeeld 178.</p>}
        </div>
      </div>

      {advice.size && (onPick || shopHref) && (
        <div className="mt-5">
          {onPick ? (
            <button type="button" onClick={() => onPick(advice.size!)} className={`press tag inline-flex min-h-12 items-center gap-2 border px-5 ${dark ? "border-gold text-gold hover:bg-gold hover:text-ink" : "border-ink hover:bg-ink hover:text-paper"}`}>
              {pickLabel ? pickLabel(advice.size) : `Kies maat ${advice.size}`} <ArrowRight size={15} aria-hidden />
            </button>
          ) : (
            <Link href={shopHref!(advice.size)} className={`press tag group inline-flex min-h-12 items-center gap-2 px-6 ${dark ? "btn-gold" : "btn-primary"}`}>
              Shop in maat {advice.size} <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
