import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = { title: "Afrekenen", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-32 lg:px-10 lg:pb-32 lg:pt-40">
      <h1 className="display mb-10 text-4xl md:text-5xl">Afrekenen</h1>
      <Checkout />
    </div>
  );
}
