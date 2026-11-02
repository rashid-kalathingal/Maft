/**
 * Client-side image optimization.
 *
 * Images are resized to a sensible max dimension and re-encoded to WebP (with a
 * JPEG fallback for browsers that can't encode WebP). This happens in-browser on
 * a canvas — it offloads all work from the server and drastically cuts the bytes
 * that get uploaded and stored, while keeping images sharp enough for the UI.
 */

export const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/avif";
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // 12MB per file BEFORE optimization

interface OptimizeOpts {
  /** Longest-edge cap in px. */
  maxDim?: number;
  /** 0..1 encoder quality. */
  quality?: number;
}

async function loadImage(file: File): Promise<{ img: HTMLImageElement; dataUrl: string }> {
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
  return { img, dataUrl };
}

function drawScaled(img: HTMLImageElement, maxDim: number): HTMLCanvasElement {
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
  }
  return canvas;
}

/** True if this browser can actually encode WebP from a canvas. */
function canEncodeWebp(): boolean {
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    return c.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}

/**
 * Resize + re-encode to an optimized WebP (or JPEG fallback) File, ready to upload.
 * Returns the smaller of the optimized result and the original.
 */
export async function optimizeImageFile(file: File, opts: OptimizeOpts = {}): Promise<File> {
  const { maxDim = 1280, quality = 0.8 } = opts;
  try {
    const { img } = await loadImage(file);
    const canvas = drawScaled(img, maxDim);
    const webp = canEncodeWebp();
    const type = webp ? "image/webp" : "image/jpeg";
    const blob = await canvasToBlob(canvas, type, quality);
    if (!blob) return file;
    // If somehow larger than the source (e.g. tiny already-compressed file), keep the source.
    if (blob.size >= file.size && file.type !== "image/png") return file;
    const ext = webp ? "webp" : "jpg";
    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${base}.${ext}`, { type, lastModified: Date.now() });
  } catch {
    return file; // never block an upload on optimization failure
  }
}

/**
 * Read + resize + compress an image and return a data URL (used only in the
 * localStorage-only mode where there is no upload endpoint). WebP when possible.
 */
export async function fileToResizedDataUrl(file: File, maxDim = 1000, quality = 0.8): Promise<string> {
  try {
    const { img, dataUrl } = await loadImage(file);
    const canvas = drawScaled(img, maxDim);
    const type = canEncodeWebp() ? "image/webp" : "image/jpeg";
    return canvas.toDataURL(type, quality) || dataUrl;
  } catch {
    // Fall back to the raw data URL
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  }
}
