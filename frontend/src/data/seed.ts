import type { Category, Colour, Product, Settings, Size } from "@/types";

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/*                                                                     */
/*  The catalogue is now driven by the Spring Boot + Supabase backend  */
/*  (VITE_API_URL). These seeds are intentionally EMPTY so the app     */
/*  never falls back to demo/dummy products. Only the business         */
/*  settings below are kept as sensible defaults until the backend     */
/*  settings load.                                                     */
/* ------------------------------------------------------------------ */

export const seedCategories: Category[] = [];

export const seedColours: Colour[] = [];

export function buildSeedSizes(): Size[] {
  return [];
}

export function buildSeedProducts(): Product[] {
  return [];
}

export const seedSettings: Settings = {
  businessName: "MAFT MARKETING",
  tagline: "Your Trusted Partner",
  address: "Manjeri, Malappuram, Kerala",
  phonePrimary: "+91 9495455929",
  phoneSecondary: "+91 9656764964",
  whatsappNumber: "919048687010",
  showStock: true,
  productsPerPage: 16,
};
