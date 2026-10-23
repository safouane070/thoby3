"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Drawer } from "vaul";

// Volledige foto als bottom sheet: sluit met swipe omlaag, Esc of de knop; Vaul houdt de focus binnen.
export function ImageViewer({ open, onOpenChange, src, title }: { open: boolean; onOpenChange: (open: boolean) => void; src: string; title: string }) {
  // Vaul schuift alleen in als hij eerst dicht gemount is; laadt deze component pas bij de tik, dan één frame later open.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const id = setTimeout(() => setMounted(true), 0); return () => clearTimeout(id); }, []);
  return (
    <Drawer.Root open={open && mounted} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex h-[94dvh] flex-col rounded-t-[1.5rem] bg-paper outline-none">
          <div aria-hidden className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-black/15" />
          <Drawer.Title className="sr-only">{title}</Drawer.Title>
          <Drawer.Description className="sr-only">Veeg omlaag of druk op Esc om te sluiten.</Drawer.Description>
          <Drawer.Close aria-label="Sluit foto" className="press absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-studio lg:h-10 lg:w-10"><X size={18} /></Drawer.Close>
          <div className="relative m-4 flex-1">
            <Image src={src} alt={title} fill sizes="100vw" className="object-contain" />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
