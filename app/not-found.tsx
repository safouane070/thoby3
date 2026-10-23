import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Pagina niet gevonden", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-5 pt-40 text-center">
      <h1 className="display text-4xl md:text-5xl">Deze pagina bestaat niet</h1>
      <p className="mt-5 text-taupe">De link is verlopen of verkeerd getypt. De collectie is wel gewoon open.</p>
      <Link href="/#collectie" className="press btn-primary mt-8 px-8 py-4 text-sm font-medium">Naar de collectie</Link>
    </div>
  );
}
