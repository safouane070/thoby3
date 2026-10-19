"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";

// De modal (Radix Dialog) zit niet in de eerste bundel: hij laadt bij hover/focus op de knop, of bij de klik zelf.
const FabricDialog = dynamic(() => import("./FabricDialog").then((m) => m.FabricDialog), { ssr: false });

export function FabricSpotlight({ children, className }: { children: ReactNode; className?: string }) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const warm = () => setReady(true);

  return (
    <>
      <button type="button" aria-haspopup="dialog" onPointerEnter={warm} onFocus={warm} onClick={() => { warm(); setOpen(true); }} className={className}>
        {children}
      </button>
      {ready && <FabricDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
