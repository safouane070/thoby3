"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { afterPaint } from "@/lib/after-paint";
import { useStore } from "./StoreProvider";

const CartDrawer = dynamic(() => import("./CartDrawer").then((m) => m.CartDrawer), { ssr: false });

// Vaul + lade-code zitten niet in de eerste bundel: ze laden na de eerste paint (idle), of meteen bij de eerste keer openen.
export function CartDrawerLazy() {
  const { drawerOpen } = useStore();
  const [ready, setReady] = useState(false);
  if (drawerOpen && !ready) setReady(true);

  useEffect(() => {
    let alive = true;
    afterPaint().then(() => alive && setReady(true));
    return () => { alive = false; };
  }, []);

  return ready ? <CartDrawer /> : null;
}
