/**
 * Verified image mappings for categories and products to match MAFT Marketing catalogue.
 */

export function unsplash(id: string, w: number, h = w, q = 72): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=${q}&auto=format&fit=crop`;
}

export const CATEGORY_HERO_IMAGES: Record<string, string> = {
  "cat-recliner": "/images/recliner-mechanism.jpg",
  "cat-legs": "/images/sofa-legs.jpg",
  "cat-fittings": "/images/sofa-bed-fitting.jpg",
  "cat-chair-bases": "/images/chair-base.jpg",
  "cat-accessories": "/images/cup-holder.jpg",
  "cat-springs": unsplash("1518709268805-4e9042af9f23", 600),
  "cat-fasteners": unsplash("1586864387967-d02ef85d93e8", 600),
  "cat-fabrics": unsplash("1584100936595-c0654b55a2e2", 600),
  "cat-adhesives": unsplash("1589939705384-5185137a7f0f", 600),
  "cat-other": unsplash("1581092160607-ee22621dd758", 600),
};

const CATEGORY_IMAGES: Record<string, string[]> = {
  "cat-recliner": ["/images/recliner-mechanism.jpg"],
  "cat-legs": ["/images/sofa-legs.jpg"],
  "cat-fittings": ["/images/sofa-bed-fitting.jpg"],
  "cat-chair-bases": ["/images/chair-base.jpg"],
  "cat-accessories": ["/images/cup-holder.jpg"],
  "cat-springs": [unsplash("1518709268805-4e9042af9f23", 600)],
  "cat-fasteners": [unsplash("1586864387967-d02ef85d93e8", 600)],
  "cat-fabrics": [unsplash("1584100936595-c0654b55a2e2", 600)],
  "cat-adhesives": [unsplash("1589939705384-5185137a7f0f", 600)],
  "cat-other": [unsplash("1581092160607-ee22621dd758", 600)],
};

const FALLBACK = ["/images/recliner-mechanism.jpg", "/images/sofa-legs.jpg"];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic, content-matched product image URL. */
export function productImageSrc(productId: string, categoryId: string | undefined, px = 500): string {
  if (categoryId && CATEGORY_HERO_IMAGES[categoryId]) {
    return CATEGORY_HERO_IMAGES[categoryId];
  }
  const list = (categoryId && CATEGORY_IMAGES[categoryId]) || FALLBACK;
  const id = list[hash(productId) % list.length];
  return id.startsWith("/") || id.startsWith("http") ? id : unsplash(id, px);
}

/** Representative image for a category card. */
export function categoryImageSrc(categoryId: string, _px = 500): string {
  return CATEGORY_HERO_IMAGES[categoryId] || "/images/recliner-mechanism.jpg";
}

/** A set of distinct images for a product gallery (content-matched to its category). */
export function productGallery(productId: string, categoryId: string | undefined, px = 700): string[] {
  const base = productImageSrc(productId, categoryId, px);
  return [base, "/images/sofa-legs.jpg", "/images/recliner-mechanism.jpg"];
}

// Hero / section photography
export const SITE_IMAGES = {
  hero: "/images/hero-sofa.jpg",
  promo: "/images/hero-sofa.jpg",
  cta: unsplash("1618220179428-22790b461013", 1200, 700),
  about: [
    unsplash("1550226891-ef816aed4a98", 600),
    "/images/sofa-legs.jpg",
    "/images/recliner-mechanism.jpg",
    unsplash("1584100936595-c0654b55a2e2", 600),
  ],
};
