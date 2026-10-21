import type { Metadata } from "next";
import { OrderStatus } from "@/components/OrderStatus";

export const metadata: Metadata = { title: "Bedankt", robots: { index: false, follow: false } };

export default function ThanksPage() {
  return (
    <div className="mx-auto min-h-[70vh] max-w-[1200px] px-5 pb-24 pt-32 lg:px-10 lg:pb-32 lg:pt-40">
      <OrderStatus />
    </div>
  );
}
