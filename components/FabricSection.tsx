import home from "@/content/home.json";
import { FabricSpotlight } from "./FabricSpotlight";
import { TextureViewer } from "./TextureViewer";

const fabric = home.fabric;

export function FabricSection() {
  return (
    <section id="stof" className="board on-dark" aria-labelledby="fabric-title">
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 py-20 lg:grid-cols-[5fr_6fr] lg:gap-20 lg:px-10 lg:py-28">
        <div className="lg:order-2">
          <h2 id="fabric-title" className="display text-[clamp(2.75rem,6vw,5.25rem)] text-paper">{fabric.title}{fabric.titleSecond && <><br />{fabric.titleSecond}</>}</h2>
          <p className="mt-6 max-w-[48ch] leading-relaxed text-muted-dark">{fabric.text}</p>
          <dl className="mt-10 grid grid-cols-2 border-t border-line-dark">
            {fabric.properties.map((p, i) => (
              <div key={p.label} className={`border-b border-line-dark py-5 pr-4 ${i % 2 ? "border-l pl-5" : ""}`}>
                <dt className="tag text-paper">{p.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-dark">{p.text}</dd>
              </div>
            ))}
          </dl>
          <FabricSpotlight className="press tag mt-10 min-h-12 border border-paper/40 px-6 text-paper hover:border-gold hover:text-gold">{fabric.button}</FabricSpotlight>
        </div>
        <div className="lg:order-1"><TextureViewer id="section" tone="dark" sizes="(min-width:1024px) 40vw, 100vw" /></div>
      </div>
    </section>
  );
}
