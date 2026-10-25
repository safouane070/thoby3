"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import home from "@/content/home.json";
import shop from "@/content/shop.json";
import { FabricSpotlight } from "./FabricSpotlight";
import { Reveal, SplitTitle } from "./Reveal";

const steps = home.fabric.properties;
const pad = (n: number) => String(n).padStart(2, "0");

// De stof als verhaal in één donker vlak. Desktop: de foto blijft staan en wisselt (crossfade met een lichte blur,
// zodat je één beeld ziet veranderen en niet twee foto's over elkaar) zodra de volgende eigenschap in het midden staat.
// Telefoon: elke eigenschap met zijn eigen foto onder elkaar.
export function FabricStory() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="stof" aria-labelledby="stof-title" className="px-3 lg:px-5">
      <div className="board on-dark mx-auto max-w-[1480px] rounded-[2rem] px-5 py-12 lg:px-14 lg:py-28 xl:px-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-20">
          <h2 id="stof-title" className="display text-[clamp(2.25rem,4.4vw,3.75rem)]"><SplitTitle first={shop.fabric.material + "."} second="Zacht, met een lichte glans." /></h2>
          <Reveal className="lg:pb-2">
            <p className="max-w-[46ch] text-lg leading-relaxed text-muted-dark">{shop.fabric.description}</p>
            <FabricSpotlight className="press btn-light tag mt-6 inline-flex min-h-11 items-center px-5">Bekijk de stof van dichtbij</FabricSpotlight>
          </Reveal>
        </div>

        <div className="mt-10 lg:mt-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div className="sticky top-24 hidden h-[calc(100svh-8rem)] self-start max-h-[44rem] overflow-hidden rounded-2xl bg-board-raised lg:block">
            <div className="absolute inset-0">{steps.map((s, i) => (
              <Image key={s.image} src={s.image} alt={i === active ? s.alt : ""} fill sizes="45vw"
                className={`object-cover transition-[opacity,transform,filter] duration-[450ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${i === active ? "scale-100 opacity-100 blur-0" : "scale-[1.04] opacity-0 blur-[4px]"}`} />
            ))}</div>
            <p className="num absolute bottom-5 left-5 rounded-full bg-board/70 px-3.5 py-1.5 text-sm text-paper backdrop-blur-md" aria-hidden>
              {pad(active + 1)} <span className="text-muted-dark">/ {pad(steps.length)}</span>
            </p>
          </div>

          {/* Telefoon: een swipe-rij (de volgende kaart steekt uit, zodat je ziet dat er meer is). Desktop: onder elkaar naast de vaste foto. */}
          <ol aria-label="Eigenschappen van de stof" className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:block lg:overflow-visible lg:px-0 lg:pb-0">
            {steps.map((s, i) => (
              <li key={s.label} ref={(el) => { items.current[i] = el; }} data-i={i}
                className="w-[80%] max-w-[22rem] shrink-0 snap-start scroll-ml-5 lg:flex lg:w-auto lg:max-w-none lg:min-h-[70svh] lg:flex-col lg:justify-center">
                <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl lg:hidden">
                  <Image src={s.image} alt={s.alt} fill sizes="80vw" className="object-cover" />
                </div>
                {/* Niet-actief dimt met kleur in plaats van opacity: rustiger, maar nog steeds AA-leesbaar (#7a7a7a ≈ 4,6:1 op board). */}
                <h3 className={`display text-2xl transition-colors duration-300 lg:text-[clamp(1.75rem,3vw,2.75rem)] ${i === active ? "" : "lg:text-muted-dark"}`}>{s.label}</h3>
                <p className={`mt-3 max-w-[38ch] leading-relaxed text-muted-dark transition-colors duration-300 lg:mt-4 lg:text-lg ${i === active ? "" : "lg:text-[#7a7a7a]"}`}>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
