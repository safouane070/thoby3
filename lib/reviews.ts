// Echte klantreviews uit content/reviews.json (CMS). Leeg = de reviewblokken en sterren in Google verschijnen niet.
import data from "@/content/reviews.json";

export type Review = { name: string; place?: string; rating: number; text: string; product?: string; date?: string };

export const reviews = data as Review[];
export const reviewsFor = (slug: string) => reviews.filter((r) => r.product === slug);
export const average = (rs: Review[]) => (rs.length ? Math.round((rs.reduce((n, r) => n + r.rating, 0) / rs.length) * 10) / 10 : 0);
