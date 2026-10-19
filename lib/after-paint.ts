"use client";

import { useEffect, useState } from "react";

// Resolves after the first frame is painted and the main thread is idle, so non-critical code
// (animation engine, cart drawer) never competes with the first render. Safari has no requestIdleCallback.
export function afterPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() =>
      setTimeout(() => {
        if ("requestIdleCallback" in window) requestIdleCallback(() => resolve(), { timeout: 1000 });
        else resolve();
      }, 0),
    );
    // Verborgen tabbladen draaien geen requestAnimationFrame; dan na 2s alsnog.
    setTimeout(resolve, 2000);
  });
}

/** True once afterPaint() has resolved; false during SSR and the first render. */
export function useAfterPaint() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    let alive = true;
    afterPaint().then(() => alive && setDone(true));
    return () => { alive = false; };
  }, []);
  return done;
}
