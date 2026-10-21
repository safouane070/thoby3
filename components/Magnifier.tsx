"use client";

import { useRef, useState, type PointerEvent } from "react";
import Image, { getImageProps } from "next/image";

// Loep op macrofoto's: een rond venster dat 2.6x inzoomt op de pointer. Alleen voor muis/pen;
// op touch blijft het een gewone foto zodat scrollen niet wordt geblokkeerd.
// eager: in het stofvenster staat de foto direct in beeld (anders meldt Next een lazy LCP-foto).
export function Magnifier({ src, alt, sizes, eager = false, className = "" }: { src: string; alt: string; sizes: string; eager?: boolean; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const ZOOM = 2.6;
  // Geoptimaliseerde (AVIF/WebP) versie voor de loep, pas bij de eerste beweging geladen: niet de ruwe JPG bij paginaload.
  const zoomSrc = getImageProps({ src, alt: "", width: 1200, height: 1600, quality: 75 }).props.src;

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || !box.current || !lens.current) return;
    const r = box.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    lens.current.style.backgroundImage = `url(${zoomSrc})`;
    lens.current.style.transform = `translate(${x - 80}px, ${y - 80}px)`;
    lens.current.style.backgroundSize = `${r.width * ZOOM}px ${r.height * ZOOM}px`;
    lens.current.style.backgroundPosition = `${80 - x * ZOOM}px ${80 - y * ZOOM}px`;
    setOn(true);
  };

  return (
    <div ref={box} onPointerMove={move} onPointerLeave={() => setOn(false)} className={`relative cursor-zoom-in overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} loading={eager ? "eager" : undefined} className="object-cover" />
      <div
        ref={lens}
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 h-40 w-40 rounded-full border border-white/70 bg-no-repeat shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)] transition-opacity duration-150 ${on ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
