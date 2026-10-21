"use client";

import { m } from "framer-motion";
import type { Fit, ThobeSize } from "@/lib/products";

// Platte tekening van de thobe op schaal: 1 eenheid = 1 cm, met vaste viewBox zodat XL echt groter is dan S.
// Maten uit de maattabel (plat gemeten). Kraag, mouwhoek en manchet zijn vaste aannames voor de vorm, niet gemeten.
const COLLAR = 8; // halve kraagbreedte
const DROP = 4; // schouderval
const ANGLE = (25 * Math.PI) / 180; // mouw hangt 25° van het lichaam af
const CUFF = 13;
const FLARE = 4; // zoom iets wijder dan de borst
const VIEW = "-62 -17 138 180";

type Shape = { chest: number; shoulders: number; sleeve: number; length: number };
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
  return { d, ch, sh, arm, outer, inner, hem, cuff };
}

const SPRING = { type: "spring", stiffness: 260, damping: 32 } as const;

/** Maatlijn met eindstreepjes en label; animeert mee met de vorm. */
function Dim({ x1, y1, x2, y2, label, lx, ly, anchor = "middle" }: { x1: number; y1: number; x2: number; y2: number; label: string; lx: number; ly: number; anchor?: "start" | "middle" | "end" }) {
  return (
    <g>
      <m.line initial={false} animate={{ x1, y1, x2, y2 }} transition={SPRING} stroke="var(--gold-ink)" strokeWidth="0.35" />
      <m.text initial={false} animate={{ x: lx, y: ly }} transition={SPRING} textAnchor={anchor}
        className="num" fill="var(--gold-ink)" fontSize="4.2" fontWeight="700" letterSpacing="0.02em">{label}</m.text>
    </g>
  );
}

export function ThobeDiagram({ shape, ghost, className = "" }: { shape: Shape; ghost?: Shape; className?: string }) {
  const g = geometry(shape);
  const o = ghost && geometry(ghost);
  const tick = 1.6;
  const lenX = 62; // buiten de verste mouw (XL-2), zodat de lengtelijn nooit door de mouw loopt

  return (
    <svg viewBox={VIEW} className={className} role="img" aria-label={`Thobe op schaal: borst ${shape.chest} cm, schouders ${shape.shoulders} cm, mouw ${shape.sleeve} cm, lengte ${shape.length} cm`}>
      {/* Raster van 10 cm, zoals op patroonpapier. */}
      <g stroke="var(--line)" strokeWidth="0.2">
        {Array.from({ length: 14 }, (_, i) => -60 + i * 10).map((x) => <line key={`x${x}`} x1={x} y1={-17} x2={x} y2={163} />)}
        {Array.from({ length: 17 }, (_, i) => i * 10).map((y) => <line key={`y${y}`} x1={-62} y1={y} x2={76} y2={y} />)}
      </g>

      {o && <m.path initial={false} animate={{ d: o.d }} transition={SPRING} fill="none" stroke="var(--ink)" strokeOpacity="0.35" strokeWidth="0.4" strokeDasharray="1.4 1.2" />}
      <m.path initial={false} animate={{ d: g.d }} transition={SPRING} fill="#efeae0" stroke="var(--ink)" strokeWidth="0.55" strokeLinejoin="miter" />

      {/* Kraag, knoopsluiting, borstzak, manchetten en zoom: stiksels als dunne stippellijn, zoals op een patroon. */}
      <g stroke="var(--ink)" strokeWidth="0.4" fill="none">
        <path d={`M${-COLLAR} 0 V-3.6 Q0 -4.8 ${COLLAR} -3.6 V0`} fill="#efeae0" />
        <path d={`M${-COLLAR + 0.9} -0.9 Q0 -1.9 ${COLLAR - 0.9} -0.9`} strokeWidth="0.25" strokeDasharray="0.8 0.6" />
        <line x1="0" y1="-1" x2="0" y2="34" />
        <line x1="2.6" y1="0" x2="2.6" y2="34" strokeWidth="0.25" strokeDasharray="0.8 0.6" />
        {[4, 11, 18, 25, 32].map((y) => <circle key={y} cx="1.3" cy={y} r="0.75" fill="var(--paper)" />)}
        <m.g initial={false} animate={{ x: g.ch * 0.42 }} transition={SPRING}>
          <path d="M0 14 H8.5 V22.6 Q8.5 23.8 7.3 23.8 H1.2 Q0 23.8 0 22.6 Z" fill="#efeae0" />
          <line x1="0" y1="15.4" x2="8.5" y2="15.4" strokeWidth="0.25" strokeDasharray="0.8 0.6" />
        </m.g>
        {[1, -1].map((side) => (
          <m.line key={side} initial={false} transition={SPRING} strokeWidth="0.25" strokeDasharray="0.8 0.6"
            animate={{ x1: side * g.cuff[0][0], y1: g.cuff[0][1], x2: side * g.cuff[1][0], y2: g.cuff[1][1] }} />
        ))}
        <m.line initial={false} transition={SPRING} strokeWidth="0.25" strokeDasharray="0.8 0.6"
          animate={{ x1: -g.hem + 0.6, y1: shape.length - 3, x2: g.hem - 0.6, y2: shape.length - 3 }} />
      </g>

      <Dim x1={-g.sh} y1={-9} x2={g.sh} y2={-9} label={`${shape.shoulders} cm schouders`} lx={0} ly={-11} />
      {/* Label onder de borstlijn en midden op de thobe: zo loopt het nooit door de mouw of de zijnaad. */}
      <m.g initial={false} animate={{ y: g.arm }} transition={SPRING}>
        <Dim x1={-g.ch} y1={0} x2={g.ch} y2={0} label={`${shape.chest} cm borst`} lx={0} ly={5.2} />
      </m.g>
      <Dim x1={lenX} y1={0} x2={lenX} y2={shape.length} label={`${shape.length}`} lx={lenX + tick + 0.8} ly={shape.length / 2} anchor="start" />
      <m.text initial={false} animate={{ x: lenX + tick + 0.8, y: shape.length / 2 + 5 }} transition={SPRING} className="num" fill="var(--gold-ink)" fontSize="3.2" fontWeight="600">cm</m.text>
      <Dim x1={-g.sh} y1={DROP} x2={-g.outer[0]} y2={g.outer[1]} label={`${shape.sleeve} cm mouw`} lx={-g.inner[0] + 1} ly={g.inner[1] + 6.5} anchor="end" />
    </svg>
  );
}
