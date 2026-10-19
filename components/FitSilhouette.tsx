"use client";

import { m } from "framer-motion";
import type { Fit } from "@/lib/products";

// Outline en detaillijnen hebben een vaste structuur per pasvorm, zodat Framer ze vloeiend morpht.
// s = schouder, a = mouw buiten, c = lichaam ter hoogte van de manchet, h = zoom van de hem.
const FIT = {
  slim: { s: 34, a: 42, h: 50 },
  broad: { s: 42, a: 56, h: 68 },
};
const R = (n: number) => 100 + n;
const L = (n: number) => 100 - n;

const outline = ({ s, a, h }: (typeof FIT)["slim"]) =>
  `M88 22 Q100 34 112 22 L${R(s)} 38 L${R(a)} 150 L${R(a - 4)} 262 L${R(h)} 392 L${L(h)} 392 L${L(a - 4)} 262 L${L(a)} 150 L${L(s)} 38 Z`;
// Mouwnaden en manchetten: tonen de arm langs het lichaam.
const seams = ({ a }: (typeof FIT)["slim"]) =>
  `M${R(a - 13)} 92 L${R(a - 15)} 262 M${L(a - 13)} 92 L${L(a - 15)} 262 M${R(a - 4)} 262 L${R(a - 15)} 262 M${L(a - 4)} 262 L${L(a - 15)} 262`;
const pocket = ({ a }: (typeof FIT)["slim"]) => `M${R(a - 40)} 112 h20 v24 h-20 Z`;

export function FitSilhouette({ fit, detailed = false, className }: { fit: Fit; detailed?: boolean; className?: string }) {
  const f = FIT[fit];
  const move = { type: "spring", stiffness: 400, damping: 30 } as const;
  return (
    <svg viewBox="0 0 200 400" aria-hidden className={className}>
      {detailed && (
        <defs>
          <linearGradient id="satin" x1="0" x2="1">
            <stop offset="0" stopColor="#d9d2c3" />
            <stop offset="0.5" stopColor="#faf9f6" />
            <stop offset="1" stopColor="#cfc8b6" />
          </linearGradient>
        </defs>
      )}
      <m.path initial={false} animate={{ d: outline(f) }} transition={move} fill={detailed ? "url(#satin)" : "currentColor"} fillOpacity={detailed ? 1 : 0.12}
        stroke={detailed ? "#c5a880" : "currentColor"} strokeWidth={detailed ? 1.2 : 9} strokeLinejoin="round" />
      {detailed && (
        <g stroke="#9a8a6c" strokeWidth="1" fill="none">
          <line x1="100" y1="36" x2="100" y2="214" />
          {[66, 100, 134, 168, 202].map((y) => <circle key={y} cx="100" cy={y} r="2.2" fill="#9a8a6c" stroke="none" />)}
          <m.path initial={false} animate={{ d: seams(f) }} transition={move} strokeLinecap="round" />
          <m.path initial={false} animate={{ d: pocket(f) }} transition={move} />
        </g>
      )}
    </svg>
  );
}
