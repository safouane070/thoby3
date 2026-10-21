"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useAfterPaint } from "@/lib/after-paint";
import { Emblem } from "./Brand";

/**
 * De open doos onder het deksel. Bij het scrollen schuift het deksel (zwart karton, goudfolie) kantelend omhoog uit beeld.
 * Het deksel verschijnt pas na de eerste paint en nooit bij "minder beweging": zonder JS staat de foto er gewoon.
 */
export function LidReveal({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const ready = useAfterPaint();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "center 0.4"] });
  const y = useTransform(scrollYProgress, [0.15, 1], ["0%", "-104%"]);
  const rotateX = useTransform(scrollYProgress, [0.15, 1], [0, 32]);
  const shade = useTransform(scrollYProgress, [0.15, 0.8, 1], [0.55, 0.2, 0]);

  return (
    <div ref={ref} className="relative aspect-square w-full overflow-hidden [perspective:1400px]">
      <div className="absolute inset-0 overflow-hidden bg-[#e9eaea]">
        <Image src={src} alt={alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        {ready && !reduce && <m.div aria-hidden style={{ opacity: shade }} className="absolute inset-0 bg-board" />}
      </div>
      {ready && !reduce && (
        <m.div aria-hidden style={{ y, rotateX, transformOrigin: "50% 0%" }}
          className="board absolute inset-0 flex items-center justify-center shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">
          <Emblem className="h-[30%] text-gold" />
        </m.div>
      )}
    </div>
  );
}
