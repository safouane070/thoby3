import Image from "next/image";
import { Headset, Leaf, ShieldCheck, Truck } from "lucide-react";
import home from "@/content/home.json";
import site from "@/content/site.json";
import { SHIPPING_COPY } from "@/lib/products";

const ICONS = { shield: ShieldCheck, leaf: Leaf, headset: Headset, truck: Truck };
const usp = home.usp;

// Korte beloftes uit de originele shop; geen kaarten, geen herhaling van de ticker.
export function USPSection() {
  return (
    <section aria-labelledby="usp-title" className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-24 lg:grid-cols-[5fr_6fr] lg:gap-24 lg:px-10 lg:py-32">
      <div className="relative order-last aspect-[4/5] overflow-hidden border border-line bg-sand lg:order-first">
        <Image src={usp.image} alt={usp.imageAlt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
      </div>

      <div>
        <h2 id="usp-title" className="max-w-xl font-serif text-5xl leading-[1] md:text-6xl">{usp.title}</h2>
        <p className="mt-6 flex max-w-md items-start gap-3 text-taupe-strong">
          <Truck size={20} className="mt-0.5 shrink-0 text-ink" aria-hidden />
          {SHIPPING_COPY}
        </p>

        <ul className="mt-12 border-t border-line">
          {usp.items.map((item) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS] ?? ShieldCheck;
            return (
              <li key={item.title} className="grid grid-cols-[2rem_1fr] gap-x-4 border-b border-line py-6">
                <Icon size={22} className="mt-0.5 text-ink" aria-hidden />
                <p>
                  <span className="font-medium">{item.title}</span>
                  {item.text && " "}
                  {item.text && ("whatsapp" in item && item.whatsapp ? (
                    <a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-taupe-strong underline decoration-line-strong underline-offset-4 hover:text-ink">{item.text}</a>
                  ) : (
                    <span className="text-taupe-strong">{item.text}</span>
                  ))}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
