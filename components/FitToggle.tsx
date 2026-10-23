"use client";

import { ToggleGroup } from "radix-ui";
import { FITS, type Fit } from "@/lib/products";

type Props = { value: Fit; onChange: (f: Fit) => void; id: string; tone?: "light" | "dark"; className?: string };

// Radix ToggleGroup geeft pijltjestoetsen + juiste aria. Gesegmenteerde pil met de code van het nekmerk (-1 slank, -2 breed).
export function FitToggle({ value, onChange, id, tone = "light", className = "" }: Props) {
  const dark = tone === "dark";
  return (
    <ToggleGroup.Root id={id} type="single" value={value} onValueChange={(v) => v && onChange(v as Fit)} aria-label="Pasvorm"
      className={`grid grid-cols-2 gap-1 rounded-full p-1 ${dark ? "bg-paper/10" : "bg-studio"} ${className}`}>
      {FITS.map((f) => (
        <ToggleGroup.Item key={f.id} value={f.id}
          className={`press tag min-h-11 rounded-full px-3 ${dark
            ? "text-paper/70 data-[state=on]:bg-paper data-[state=on]:text-ink"
            : "text-muted hover:text-ink data-[state=on]:bg-paper data-[state=on]:text-ink data-[state=on]:shadow-[0_1px_3px_rgba(11,11,11,0.12)]"}`}>
          {f.label} <span className="ml-1 opacity-60">-{f.id === "slim" ? 1 : 2}</span>
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
