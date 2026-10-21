"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, Clock, Gift, Truck } from "lucide-react";
import site from "@/content/site.json";

const ICONS = { gift: Gift, truck: Truck, clock: Clock, exchange: ArrowLeftRight };
const items = site.announcements.map((a) => ({ icon: ICONS[a.icon as keyof typeof ICONS] ?? Gift, text: a.text }));

// Eén rustige boodschap tegelijk (wissel elke 4,5 s) in plaats van een lopende band: leesbaar, en past bij de rest van de site.
// Pauzeert bij hover/focus; met "minder beweging" blijft de eerste staan.
export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div role="region" aria-label="Aanbiedingen" className="bg-sand text-ink"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="relative mx-auto h-9 max-w-[1440px] overflow-hidden">
        {items.map(({ icon: Icon, text }, n) => (
          <p key={text} aria-hidden={n !== i}
            className={`absolute inset-0 flex items-center justify-center gap-2.5 whitespace-nowrap tag px-3 text-center !text-[0.75rem] !tracking-[0.1em] sm:px-5 sm:!tracking-[0.16em] transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] ${n === i ? "translate-y-0 opacity-100 delay-200 duration-500" : "-translate-y-1.5 opacity-0 duration-200"}`}>
            <Icon size={13} className="hidden shrink-0 text-gold-ink min-[400px]:block" aria-hidden /> {text}
          </p>
        ))}
      </div>
    </div>
  );
}
