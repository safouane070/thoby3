import { MessageCircle, Plus } from "lucide-react";
import { Accordion } from "radix-ui";
import home from "@/content/home.json";
import { whatsapp } from "@/lib/products";
import { SplitTitle } from "./Reveal";

const faq = home.faq;
const half = Math.ceil(faq.items.length / 2);
const columns = [faq.items.slice(0, half), faq.items.slice(half)];

// Radix Accordion: toetsenbord, aria-expanded en focusbeheer kloppen vanzelf. Hoogte animeert via
// --radix-accordion-content-height (globals.css): open 260ms, dicht sneller (180ms), allebei met een sterke ease-out.
// Kop en WhatsApp op één regel, de vragen over de volle breedte in twee kolommen: geen zijbalk met een inleiding.
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <h2 id="faq-title" className="display text-[clamp(2.25rem,4.4vw,3.75rem)]"><SplitTitle first={faq.title} second={faq.titleSecond} /></h2>
        <a href={whatsapp("Hoi THOBY3, ik heb een vraag.")} target="_blank" rel="noopener noreferrer"
          className="press btn-ghost tag inline-flex min-h-12 items-center gap-2.5 px-6">
          <MessageCircle size={16} aria-hidden /> Andere vraag? WhatsApp ons
        </a>
      </div>

      <Accordion.Root type="single" collapsible className="mt-10 grid gap-x-16 lg:mt-14 lg:grid-cols-2">
        {columns.map((items, c) => (
          <div key={c} className={`border-t border-line ${c ? "max-lg:border-t-0" : ""}`}>
            {items.map((item, i) => (
              <Accordion.Item key={item.q} value={`q${c * half + i}`} className="group border-b border-line">
                <Accordion.Header>
                  <Accordion.Trigger className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-6 py-6 text-left text-[1.0625rem] font-medium text-ink">
                    {item.q}
                    <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-studio transition-[transform,background-color,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[state=open]:rotate-45 group-data-[state=open]:bg-ink group-data-[state=open]:text-paper">
                      <Plus size={14} />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="faq-content overflow-hidden">
                  <p className="max-w-[62ch] pb-7 pr-14 leading-relaxed text-muted">{item.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </div>
        ))}
      </Accordion.Root>
    </section>
  );
}

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
};
