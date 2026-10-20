import { Plus } from "lucide-react";
import home from "@/content/home.json";
import { whatsapp } from "@/lib/products";

const faq = home.faq;

// Native <details>: werkt zonder JavaScript, toetsenbord en screenreaders krijgen het gratis.
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 lg:grid-cols-[5fr_7fr] lg:gap-24 lg:px-10 lg:py-32">
      <div>
        <h2 id="faq-title" className="font-serif text-5xl leading-none md:text-7xl">{faq.title} <em>{faq.titleItalic}</em></h2>
        <p className="mt-6 max-w-sm text-taupe-strong">
          Staat je vraag er niet bij?{" "}
          <a href={whatsapp("Hoi THOBY3, ik heb een vraag.")} target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">Stuur ons een WhatsApp</a>.
        </p>
      </div>
      <div className="border-t border-line">
        {faq.items.map((item) => (
          <details key={item.q} className="group border-b border-line">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-2xl leading-tight [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus size={18} aria-hidden className="shrink-0 transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <p className="max-w-2xl pb-6 leading-relaxed text-taupe-strong">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
};
