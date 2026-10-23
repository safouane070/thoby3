import type { CSSProperties, ReactNode } from "react";

/**
 * Oneindige band in pure CSS: twee identieke kopieën, de tweede verborgen voor schermlezers.
 * Pauzeert bij hover en bij focus: op een telefoon zet één tik de band stil (de band is focusbaar), tik ernaast en hij loopt weer.
 * touch="scroll": op touch-schermen geen beweging maar een gewone swipe-rij (voor tekst die je wilt lezen, zoals reviews).
 * Bij "minder beweging" wordt het altijd een gewone horizontale scroll.
 */
export function Marquee({ children, seconds = 40, reverse = false, touch = "move", label, className = "" }: {
  children: ReactNode; seconds?: number; reverse?: boolean; touch?: "move" | "scroll"; label?: string; className?: string;
}) {
  return (
    <div data-reverse={reverse || undefined} data-touch={touch} role="region" aria-label={label} tabIndex={0}
      className={`marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] ${className}`}>
      <div className="marquee-track flex w-max" style={{ "--marquee-duration": `${seconds}s` } as CSSProperties}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden inert>{children}</div>
      </div>
    </div>
  );
}
