// Lijniconen in de stijl van de witte tekeningen in het deksel: kraan met water, thobe, masjid. 1.5px, rechte hoeken.
const PATHS = {
  wudu: (
    <>
      <path d="M6 9h14a4 4 0 0 1 4 4v2" />
      <path d="M10 9V6h6v3" />
      <path d="M8 5h10" />
      <path d="M22 15v2" />
      <path d="M23 20.5c0 1-.6 1.8-1.5 1.8S20 21.5 20 20.5c0-.9 1.5-2.6 1.5-2.6s1.5 1.7 1.5 2.6Z" />
      <path d="M8 26c2-3 5-4 8-4h4c1.7 0 3 1.3 3 3" />
      <path d="M11 29h12" />
    </>
  ),
  thobe: (
    <>
      <path d="M13 4h6v3h-6z" />
      <path d="M13 6 7 9l-2 13 3 .5L10 13v16h12V13l2 9.5 3-.5-2-13-6-3" />
      <path d="M16 7v9" />
      <path d="M18.5 11h2.5v3h-2.5z" />
    </>
  ),
  masjid: (
    <>
      <path d="M5 29h22" />
      <path d="M8 29V18h14v11" />
      <path d="M8 18c0-4.5 3.4-8 7-8s7 3.5 7 8" />
      <path d="M15 10V7" />
      <path d="M13 29v-5a2 2 0 0 1 4 0v5" />
      <path d="M25 29V11" />
      <path d="M23.5 11h3" />
      <path d="M25 11V8l-1-1.5h2L25 8" />
    </>
  ),
} as const;

export type Ritual = keyof typeof PATHS;

export function RitualIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      {PATHS[name as Ritual] ?? PATHS.thobe}
    </svg>
  );
}
