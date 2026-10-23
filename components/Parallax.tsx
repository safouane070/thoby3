"use client";

import { useRef, type ReactNode } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Schuift de inhoud langzamer of sneller dan de pagina mee (decoratief, dus mag). `distance` in px over de hele doorloop.
 * Eén transform-string: draait op de compositor, ook terwijl de pagina nog laadt.
 */
export function Parallax({ children, distance = 80, scale = 1, className = "" }: { children: ReactNode; distance?: number; scale?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const transform = useTransform(scrollYProgress, (p) => `translateY(${(p - 0.5) * distance}px) scale(${scale})`);
  return (
    <div ref={ref} className={className}>
      <m.div style={reduce ? undefined : { transform }} className="relative h-full w-full will-change-transform">{children}</m.div>
    </div>
  );
}
