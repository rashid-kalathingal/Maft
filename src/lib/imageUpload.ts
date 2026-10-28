/**
 * Read an image File and return a resized/compressed data URL.
 * Keeps uploads small enough for localStorage in the demo; when the backend
 * is ready these can be POSTed to the file-upload endpoint instead.
 */
export async function fileToResizedDataUrl(
  file: File,
  maxDim = 1000,
  quality = 0.82,
): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not load image"));
    el.src = dataUrl;
  });

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl; // fallback: original
  ctx.drawImage(img, 0, 0, w, h);

  // PNGs with transparency (e.g. logos) keep PNG; photos become JPEG.
  const isPng = file.type === "image/png";
  return canvas.toDataURL(isPng ? "image/png" : "image/jpeg", quality);
}

export const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB per file before resize
