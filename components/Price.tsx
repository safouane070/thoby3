"use client";

import { useStore } from "./StoreProvider";

export function Price({ price, compareAt, className = "" }: { price: number; compareAt?: number; className?: string }) {
  const { money } = useStore();
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span>{money(price)}</span>
      {compareAt && <s className="text-[0.85em] text-taupe">{money(compareAt)}</s>}
    </span>
  );
}
