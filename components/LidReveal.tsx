"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useAfterPaint } from "@/lib/after-paint";
import { Emblem } from "./Brand";

/**
 * De open doos onder het deksel. Bij het scrollen kantelt het deksel (zwart karton, goudfolie) omhoog weg.
 * Het deksel verschijnt pas na de eerste paint en nooit bij "minder beweging": zonder JS staat de foto er gewoon.
 */
export function LidReveal({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const ready = useAfterPaint();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "center 0.4"] });
  // Eén transform-string (geen x/y/rotate-shorthands): die draait op de compositor en blijft vloeiend tijdens het laden.
  const transform = useTransform(scrollYProgress, (p) => {
    const t = Math.min(1, Math.max(0, (p - 0.15) / 0.85));
    return `translateY(${-118 * t}%) rotateX(${26 * t}deg)`;
  });
  // Kantelend komt de onderrand naar je toe; in het laatste stuk vervaagt het deksel, zodat er nooit een zwarte rand blijft.
  const lid = useTransform(scrollYProgress, [0.85, 1], [1, 0]);
  const shade = useTransform(scrollYProgress, [0.15, 0.8, 1], [0.55, 0.15, 0]);

  return (
    <div ref={ref} className="relative aspect-square w-full overflow-hidden [perspective:1400px]">
      <div className="absolute inset-0 overflow-hidden bg-[#e9eaea]">
        <Image src={src} alt={alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        {ready && !reduce && <m.div aria-hidden style={{ opacity: shade }} className="absolute inset-0 bg-board" />}
      </div>
      {ready && !reduce && (
        <m.div aria-hidden style={{ transform, opacity: lid, transformOrigin: "50% 0%" }}
          className="board absolute inset-0 flex items-center justify-center shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] will-change-transform">
          <Emblem className="h-[30%] text-gold" />
        </m.div>
      )}
    </div>
  );
}
