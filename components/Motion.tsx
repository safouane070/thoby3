"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

import { afterPaint } from "@/lib/after-paint";

// De engine laadt pas na de eerste paint: tot dan staan elementen in hun begintoestand en starten animaties direct daarna.
const features = () => afterPaint().then(() => import("./motion-features")).then((mod) => mod.default);

// LazyMotion houdt de animatie-engine uit de eerste bundel; strict voorkomt dat een losse motion.* hem er weer in trekt.
// MotionConfig respecteert prefers-reduced-motion voor alle Framer-animaties.
export const Motion = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={features} strict>
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </LazyMotion>
);
