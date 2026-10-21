"use client";

import { ToggleGroup } from "radix-ui";
import { FITS, type Fit } from "@/lib/products";

type Props = { value: Fit; onChange: (f: Fit) => void; id: string; tone?: "light" | "dark"; className?: string };

// Radix ToggleGroup geeft pijltjestoetsen + juiste aria. Twee vlakken met de code van het nekmerk (-1 slank, -2 breed).
export function FitToggle({ value, onChange, id, tone = "light", className = "" }: Props) {
  const dark = tone === "dark";
  return (
    <ToggleGroup.Root id={id} type="single" value={value} onValueChange={(v) => v && onChange(v as Fit)} aria-label="Pasvorm"
      className={`grid grid-cols-2 gap-1.5 ${className}`}>
      {FITS.map((f) => (
        <ToggleGroup.Item key={f.id} value={f.id}
          className={`press tag min-h-12 border px-3 transition-colors duration-200 ${dark
            ? "border-line-dark text-paper data-[state=on]:border-gold data-[state=on]:text-gold data-[state=on]:shadow-[inset_0_0_0_1px_var(--gold)]"
            : "border-line-strong text-ink hover:border-ink data-[state=on]:border-ink data-[state=on]:bg-ink data-[state=on]:text-gold"}`}>
          {f.label} <span className="ml-1 opacity-60">-{f.id === "slim" ? 1 : 2}</span>
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
