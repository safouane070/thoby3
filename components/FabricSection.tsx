import home from "@/content/home.json";
import { FabricSpotlight } from "./FabricSpotlight";
import { TextureViewer } from "./TextureViewer";

export function FabricSection() {
  return (
    <section className="bg-sand" aria-labelledby="fabric-title">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-24 lg:grid-cols-[6fr_5fr] lg:gap-24 lg:px-10 lg:py-32">
        <div>
          <h2 id="fabric-title" className="max-w-xl font-serif text-5xl leading-[1] md:text-7xl">{home.fabric.title} <em>{home.fabric.titleItalic}</em></h2>
          <p className="mt-8 max-w-md leading-relaxed text-taupe-strong">
            {home.fabric.text}
          </p>
          <FabricSpotlight className="press mt-10 min-h-12 border border-ink px-6 py-3 text-sm font-medium hover:bg-ink hover:text-ivory">{home.fabric.button}</FabricSpotlight>
        </div>
        <TextureViewer id="section" sizes="(min-width:1024px) 40vw, 100vw" />
      </div>
    </section>
  );
}
