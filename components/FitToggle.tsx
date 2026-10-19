"use client";

import { m } from "framer-motion";
import { ToggleGroup } from "radix-ui";
import { FITS, type Fit } from "@/lib/products";

type Props = { value: Fit; onChange: (f: Fit) => void; id: string; tone?: "light" | "dark"; className?: string };

// Radix ToggleGroup geeft pijltjestoetsen + juiste aria; de pill glijdt via layoutId.
export function FitToggle({ value, onChange, id, tone = "light", className = "" }: Props) {
  const dark = tone === "dark";
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as Fit)}
      aria-label="Pasvorm"
      className={`flex border p-0.5 ${dark ? "border-white/15" : "border-line"} ${className}`}
    >
      {FITS.map((f) => (
        <ToggleGroup.Item
          key={f.id}
          value={f.id}
          className={`press relative min-h-12 flex-1 px-2 py-2 text-xs font-medium sm:px-4 lg:min-h-0 ${dark ? "text-ivory/60 data-[state=on]:text-ink" : "text-taupe data-[state=on]:text-ivory"}`}
        >
          {value === f.id && (
            <m.span layoutId={id} className={`absolute inset-0 ${dark ? "bg-ivory" : "bg-ink"}`} transition={{ type: "spring", stiffness: 350, damping: 30 }} />
          )}
          <span className="relative">{f.label}</span>
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
