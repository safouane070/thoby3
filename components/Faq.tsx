import { MessageCircle, Plus } from "lucide-react";
import { Accordion } from "radix-ui";
import home from "@/content/home.json";
import { whatsapp } from "@/lib/products";

const faq = home.faq;

// Radix Accordion: toetsenbord, aria-expanded en focusbeheer kloppen vanzelf. Hoogte animeert via
// --radix-accordion-content-height (globals.css): open 260ms, dicht sneller (180ms), allebei met een sterke ease-out.
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 lg:grid-cols-[5fr_7fr] lg:gap-24 lg:px-10 lg:py-32">
      <div className="lg:sticky lg:top-40 lg:self-start">
        <h2 id="faq-title" className="font-serif text-5xl leading-none md:text-6xl">{faq.title} <em>{faq.titleItalic}</em></h2>
        <p className="mt-6 max-w-sm leading-relaxed text-taupe-strong">Staat je vraag er niet bij? We helpen je graag persoonlijk.</p>
        <a href={whatsapp("Hoi THOBY3, ik heb een vraag.")} target="_blank" rel="noopener noreferrer"
          className="press mt-8 inline-flex min-h-12 items-center gap-2.5 border border-ink px-6 text-sm font-medium hover:bg-ink hover:text-ivory">
          <MessageCircle size={16} aria-hidden /> Stel je vraag via WhatsApp
        </a>
      </div>

      <Accordion.Root type="single" collapsible className="border-t border-line">
        {faq.items.map((item, i) => (
          <Accordion.Item key={item.q} value={`q${i}`} className="group border-b border-line">
            <Accordion.Header>
              <Accordion.Trigger className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-6 py-6 text-left text-base font-medium text-ink/85 transition-colors duration-200 data-[state=open]:text-ink md:text-[1.0625rem] [@media(hover:hover)]:hover:text-ink">
                {item.q}
                <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong transition-[transform,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[state=open]:rotate-45 group-data-[state=open]:border-ink group-data-[state=open]:bg-ink group-data-[state=open]:text-ivory">
                  <Plus size={14} />
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="faq-content overflow-hidden">
              <p className="max-w-2xl pb-7 pr-14 leading-relaxed text-taupe-strong">{item.a}</p>
            </Accordion.Content>
          </Accordion.Item>
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
