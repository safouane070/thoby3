import type { CSSProperties, ReactNode } from "react";

// Scroll-reveals in pure CSS (animation-timeline: view(), zie globals.css). Ze draaien op de compositor en wachten
// nooit op JavaScript: zonder ondersteuning of met "minder beweging" staat alles er gewoon, zichtbaar.

/** Komt in beeld: omhoog en van transparant naar zichtbaar. `delay` (s) verschuift het startpunt voor een stagger. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return <div className={`reveal ${className}`} style={{ "--d": Math.round(delay * 100) } as CSSProperties}>{children}</div>;
}

/** Kop die woord voor woord uit een masker omhoog komt. De tweede regel is grijs. */
export function SplitTitle({ first, second }: { first: string; second?: string }) {
  const lines = [first, second].filter(Boolean) as string[];
  let n = 0;
  return (
    <span className="split block">
      {lines.map((line, l) => (
        <span key={l} className={`block ${l ? "text-muted [.on-dark_&]:text-muted-dark" : ""}`}>
          {line.split(" ").map((word, i) => (
            <span key={i}>
              {i > 0 && " "}
              <span className="mask-word"><span className="split-word" style={{ "--i": n++ } as CSSProperties}>{word}</span></span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
