"use client";

import { m } from "framer-motion";
import type { Fit, ThobeSize } from "@/lib/products";

// Platte tekening van de thobe op schaal: 1 eenheid = 1 cm, op één vast raster, zodat XL echt groter is dan S
// en breed echt breder dan slank. Maten uit de maattabel (plat gemeten). Kraag, mouwhoek en manchet zijn vaste
// aannames voor de vorm, niet gemeten.
const COLLAR = 8; // halve kraagbreedte
const DROP = 4; // schouderval
const ANGLE = (25 * Math.PI) / 180; // mouw hangt 25° van het lichaam af
const CUFF = 13;
const FLARE = 4; // zoom iets wijder dan de borst
const GAP = 58; // afstand van het midden tot het hart van elke thobe: ruimte voor de verste mouw (XL-2: 53 cm)
const FILL = "#efeae0";

export type Shape = { chest: number; shoulders: number; sleeve: number; length: number };
const num = (v: string) => Number(v) || 0;
export const shapeOf = (s: ThobeSize, fit: Fit): Shape => ({ chest: num(s.chest[fit]), shoulders: num(s.shoulders[fit]), sleeve: num(s.sleeve[fit]), length: num(s.length) });

function geometry({ chest, shoulders, sleeve, length }: Shape) {
  const ch = chest / 2, sh = shoulders / 2;
  const arm = DROP + 18 + chest / 6; // okselhoogte groeit mee met de borst
  const sin = Math.sin(ANGLE), cos = Math.cos(ANGLE);
  const outer = [sh + sleeve * sin, DROP + sleeve * cos];
  const inner = [outer[0] - CUFF * cos, outer[1] + CUFF * sin];
  const hem = ch + FLARE;
  // Manchetstiksel: de manchetrand 5 cm terug langs de mouw.
  const back = (p: number[]) => [p[0] - 5 * sin, p[1] - 5 * cos];
  const cuff = [back(outer), back(inner)];
  const f = (n: number) => n.toFixed(2);
  // Rechterhelft met de klok mee, dan gespiegeld terug: elke maat heeft dezelfde puntenreeks, dus Framer morpht vloeiend.
  const right = [[COLLAR, 0], [sh, DROP], outer, inner, [ch, arm], [hem, length]];
  const left = [...right].reverse().map(([x, y]) => [-x, y]);
  const d = `M${right.map(([x, y]) => `${f(x)} ${f(y)}`).join(" L")} L${left.map(([x, y]) => `${f(x)} ${f(y)}`).join(" L")} Z`;
  return { d, ch, arm, hem, cuff };
}

const SPRING = { type: "spring", stiffness: 260, damping: 32 } as const;
const STITCH = { strokeWidth: 0.25, strokeDasharray: "0.8 0.6" } as const;

/** Eén thobe rond x = 0: omtrek plus kraag, knoopsluiting, borstzak, manchetten en zoom als stiksels, zoals op een patroon. */
function Figure({ shape }: { shape: Shape }) {
  const g = geometry(shape);
  return (
    <g>
      <m.path initial={false} animate={{ d: g.d }} transition={SPRING} fill={FILL} stroke="var(--ink)" strokeWidth="0.55" strokeLinejoin="miter" />
      <g stroke="var(--ink)" strokeWidth="0.4" fill="none">
        <path d={`M${-COLLAR} 0 V-3.6 Q0 -4.8 ${COLLAR} -3.6 V0`} fill={FILL} />
        <path d={`M${-COLLAR + 0.9} -0.9 Q0 -1.9 ${COLLAR - 0.9} -0.9`} {...STITCH} />
        <line x1="0" y1="-1" x2="0" y2="34" />
        <line x1="2.6" y1="0" x2="2.6" y2="34" {...STITCH} />
        {[4, 11, 18, 25, 32].map((y) => <circle key={y} cx="1.3" cy={y} r="0.75" fill="var(--paper)" />)}
        <m.g initial={false} animate={{ x: g.ch * 0.42 }} transition={SPRING}>
          <path d="M0 14 H8.5 V22.6 Q8.5 23.8 7.3 23.8 H1.2 Q0 23.8 0 22.6 Z" fill={FILL} />
          <line x1="0" y1="15.4" x2="8.5" y2="15.4" {...STITCH} />
        </m.g>
        {[1, -1].map((side) => (
          <m.line key={side} initial={false} transition={SPRING} {...STITCH}
            animate={{ x1: side * g.cuff[0][0], y1: g.cuff[0][1], x2: side * g.cuff[1][0], y2: g.cuff[1][1] }} />
        ))}
        <m.line initial={false} transition={SPRING} {...STITCH} animate={{ x1: -g.hem + 0.6, y1: shape.length - 3, x2: g.hem - 0.6, y2: shape.length - 3 }} />
      </g>
      {/* Borstbreedte, het enige dat tussen slank en breed verschilt: getekend als maatlijn van oksel tot oksel. */}
      <g stroke="var(--gold-ink)" strokeWidth="0.45">
        <m.line initial={false} transition={SPRING} animate={{ x1: -g.ch, x2: g.ch, y1: g.arm + 4, y2: g.arm + 4 }} />
        {[-1, 1].map((side) => (
          <m.line key={side} initial={false} transition={SPRING} animate={{ x1: side * g.ch, x2: side * g.ch, y1: g.arm + 2.2, y2: g.arm + 5.8 }} />
        ))}
      </g>
    </g>
  );
}

/**
 * Slank (-1) en breed (-2) van één maat naast elkaar op hetzelfde raster. Tussen de twee loopt één lengtelijn
 * met stippellijnen naar kraag en zoom: dat ze even lang zijn, zie je in plaats van dat je het leest.
 */
export function ThobePair({ slim, broad, className = "" }: { slim: Shape; broad: Shape; className?: string }) {
  const len = slim.length;
  const sHem = geometry(slim).hem, bHem = geometry(broad).hem;
  return (
    <svg viewBox="-118 -12 236 172" className={className} role="img"
      aria-label={`Twee thobes op schaal, allebei ${len} cm lang. Slank: borst ${slim.chest} cm, schouders ${slim.shoulders} cm. Breed: borst ${broad.chest} cm, schouders ${broad.shoulders} cm.`}>
      {/* Raster van 10 cm, zoals op patroonpapier. */}
      <g stroke="var(--line)" strokeWidth="0.2">
        {Array.from({ length: 24 }, (_, i) => -115 + i * 10).map((x) => <line key={`x${x}`} x1={x} y1={-12} x2={x} y2={160} />)}
        {Array.from({ length: 17 }, (_, i) => i * 10).map((y) => <line key={`y${y}`} x1={-118} y1={y} x2={118} y2={y} />)}
      </g>

      <g transform={`translate(${-GAP} 0)`}><Figure shape={slim} /></g>
      <g transform={`translate(${GAP} 0)`}><Figure shape={broad} /></g>

      {/* Zelfde lengte: verticale maatlijn in het midden, stippellijnen naar de kraag- en de zoomhoogte van allebei. */}
      <g stroke="var(--gold-ink)" fill="none">
        <line x1={-GAP + COLLAR + 1} y1="-6" x2={GAP - COLLAR - 1} y2="-6" strokeWidth="0.3" strokeDasharray="1.2 1" />
        <m.line initial={false} transition={SPRING} strokeWidth="0.3" strokeDasharray="1.2 1"
          animate={{ x1: -GAP + sHem + 1, y1: len, x2: GAP - bHem - 1, y2: len }} />
        <m.line initial={false} transition={SPRING} x1="0" x2="0" y1="-6" animate={{ y2: len }} strokeWidth="0.45" />
        <line x1="-2" y1="-6" x2="2" y2="-6" strokeWidth="0.45" />
        <m.line initial={false} transition={SPRING} x1="-2" x2="2" animate={{ y1: len, y2: len }} strokeWidth="0.45" />
      </g>
    </svg>
  );
}
