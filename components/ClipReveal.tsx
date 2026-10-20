"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Beeld onthult van onder naar boven zodra het in beeld komt (eenmalig). Met "minder beweging" staat het er gewoon.
export function ClipReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
    >
      {children}
    </m.div>
  );
}
