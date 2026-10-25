"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Bij het afrekenen geen uitgangen naar Instagram of de winkel: daar alleen de korte footer (zelfde check als de Header).
export function FooterGate({ full, checkout }: { full: ReactNode; checkout: ReactNode }) {
  return usePathname().replace(/\/$/, "") === "/afrekenen" ? checkout : full;
}
