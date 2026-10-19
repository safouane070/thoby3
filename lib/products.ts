// Bron: thoby3.com WooCommerce Store API (gemeten 2026-10-17). Prijzen in EUR incl. btw.
// Afwijking t.o.v. de gevraagde interface: maten zijn S–XL met lichaamslengte (zoals de echte shop),
// niet numeriek (54, 56...), en accessoires hebben geen maten of stof (optioneel).
export type ThobeFit = "slim" | "broad";
export type Fit = ThobeFit;

export interface ThobeSize {
  label: string;
  bodyHeight: string;
  availableFits: ThobeFit[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  kind: "thobe" | "accessory";
  tagline: string;
  description: string[];
  price: number;
  compareAt?: number;
  currency: "EUR";
  soldOut?: boolean;
  colors: { name: string; hex: string }[];
  sizes: ThobeSize[];
  fabric?: { material: string; description: string; textureImage: string };
  images: { primary: string; lifestyle: string; detail: string };
  gallery: string[];
  badge?: string;
}

const BOTH: ThobeFit[] = ["slim", "broad"];
export const SIZES: ThobeSize[] = [
  { label: "S", bodyHeight: "1.60 – 1.70 m", availableFits: BOTH },
  { label: "M", bodyHeight: "1.70 – 1.78 m", availableFits: BOTH },
  { label: "L", bodyHeight: "1.78 – 1.87 m", availableFits: BOTH },
  { label: "XL", bodyHeight: "1.87 – 1.95 m", availableFits: BOTH },
];

export const FITS: { id: ThobeFit; label: string; note: string }[] = [
  { id: "slim", label: "Slank", note: "Gestroomlijnd om schouders en taille. Voor een atletische of slanke bouw." },
  { id: "broad", label: "Breed", note: "Ruimer om borst en buik, zelfde lengte. Voor een volle of brede bouw." },
];

// Blur-up voor string-src foto's (Next maakt die alleen zelf voor statische imports): zand, de achtergrond van elke productfoto.
export const BLUR = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 4"><rect width="3" height="4" fill="#f3f1ec"/></svg>')}`;

export const GIFT_BOX_PRICE = 5;
// Eén drempel: vanaf €50 gratis verzending én gratis Musk & Siwak.
export const REWARD_FROM = 50;
export const GIFT_VALUE = 13.48; // waarde zoals de originele shop die communiceert (Musk 5,99 + Siwak 3,99 wijkt daar zelf van af)
export const eur = (n: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n).replace(/\s/g, "");
export const SHIPPING_COPY = `Gratis verzending vanaf ${eur(REWARD_FROM).replace(",00", "")} in Nederland en de rest van Europa.`;

const SATIN = {
  material: "Satijn geweven katoen",
  description: "De perfecte balans tussen luxe uitstraling en ademend comfort: zachte textuur op de huid en een subtiele glans die de hele dag meegaat.",
  textureImage: "/img/wd-4.jpg",
};

export const products: Product[] = [
  {
    id: "15701",
    slug: "white-desert",
    name: "White Desert",
    kind: "thobe",
    tagline: "Gebroken wit satijnkatoen, geïnspireerd door de kalksteen van de woestijn.",
    description: [
      "De White Desert weerspiegelt de serene schoonheid van het gelijknamige landschap: puurheid, rust en tijdloze elegantie.",
      "Gemaakt van hoogwaardig satijnkatoen met een luxueuze glans, zachte hand en ademend comfort, op warme dagen én bij formele gelegenheden.",
      "De gebroken witte tint is een warm alternatief voor helder wit en past bij elke gelegenheid.",
    ],
    price: 44.99,
    compareAt: 74.99,
    currency: "EUR",
    colors: [{ name: "Gebroken wit", hex: "#EFEAE0" }],
    sizes: SIZES,
    fabric: SATIN,
    images: { primary: "/img/wd-1.jpg", lifestyle: "/img/wd-3.jpg", detail: "/img/wd-4.jpg" },
    gallery: ["/img/wd-1.jpg", "/img/wd-2.jpg", "/img/wd-3.jpg", "/img/wd-4.jpg", "/img/wd-5.jpg"],
    badge: "Vanaf €50 gratis Musk & Siwak",
  },
  {
    id: "18592",
    slug: "caramel-sands",
    name: "Caramel Sands",
    kind: "thobe",
    tagline: "Warme karameltint van zonovergoten duinen.",
    description: [
      "De Caramel Sands brengt de warmte van duinen bij zonsondergang naar jouw garderobe.",
      "Dezelfde satijnkatoenen stof, dezelfde twee pasvormen per maat, in een diepe zandtint.",
    ],
    price: 44.99,
    compareAt: 79.99,
    currency: "EUR",
    soldOut: true,
    colors: [{ name: "Karamel", hex: "#C9A56C" }],
    sizes: SIZES,
    fabric: SATIN,
    images: { primary: "/img/cs-1.jpg", lifestyle: "/img/cs-2.jpg", detail: "/img/cs-3.jpg" },
    gallery: ["/img/cs-1.jpg", "/img/cs-2.jpg", "/img/cs-3.jpg"],
  },
  {
    id: "15782",
    slug: "musk",
    name: "Musk",
    kind: "accessory",
    tagline: "THOBY3 Musk, 5 ml.",
    description: ["THOBY3 Musk. Gratis bij je bestelling vanaf €50."],
    price: 5.99,
    currency: "EUR",
    colors: [],
    sizes: [],
    images: { primary: "/img/musk-1.jpg", lifestyle: "/img/musk-2.jpg", detail: "/img/musk-2.jpg" },
    gallery: ["/img/musk-1.jpg", "/img/musk-2.jpg"],
  },
  {
    id: "15785",
    slug: "siwak",
    name: "Siwak met houder",
    kind: "accessory",
    tagline: "Siwak in een handige houder.",
    description: ["THOBY3 Siwak met houder. Gratis bij je bestelling vanaf €50."],
    price: 3.99,
    currency: "EUR",
    colors: [],
    sizes: [],
    images: { primary: "/img/siwak-2.jpg", lifestyle: "/img/siwak-1.png", detail: "/img/siwak-1.png" },
    gallery: ["/img/siwak-2.jpg", "/img/siwak-1.png"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const isThobe = (p: Product) => p.kind === "thobe";
export const discountPct = (p: Product) => (p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0);

export const CURRENCIES = {
  EUR: { rate: 1, locale: "nl-NL" },
  USD: { rate: 1.08, locale: "en-US" },
  GBP: { rate: 0.85, locale: "en-GB" },
  AED: { rate: 3.97, locale: "en-AE" },
  SAR: { rate: 4.05, locale: "en-SA" },
} as const;
export type Currency = keyof typeof CURRENCIES;

export const LANGS = [
  { code: "NL", label: "Nederlands" },
  { code: "EN", label: "English" },
  { code: "FR", label: "Français" },
  { code: "DE", label: "Deutsch" },
  { code: "ES", label: "Español" },
  { code: "AR", label: "العربية" },
] as const;
