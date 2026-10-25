import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  seed: string;
  /** Explicit image URL (content-matched). Falls back to a branded tile if it fails. */
  src?: string;
  icon?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ProductImage({ label, seed, src, icon, className, size = "md" }: Props) {
  const [failed, setFailed] = useState(false);

  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  const bg = `linear-gradient(135deg, hsl(${h} 30% 93%), hsl(${(h + 45) % 360} 26% 86%))`;
  const fg = `hsl(${h} 45% 34%)`;
  const textSize = size === "lg" ? "text-5xl" : size === "sm" ? "text-lg" : "text-2xl";
  const px = size === "lg" ? 700 : size === "sm" ? 220 : 500;
  const resolved = src ?? `https://picsum.photos/seed/maft-${encodeURIComponent(seed)}/${px}/${px}`;

  return (
    <div
      className={cn("relative aspect-square w-full overflow-hidden bg-surface", className)}
      style={failed ? { background: bg } : undefined}
    >
      {!failed && (
        <img
          src={resolved}
          alt={label}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.07]"
        />
      )}

      {failed && (
        <div className="flex h-full w-full items-center justify-center" aria-hidden>
          <span className={cn("font-extrabold tracking-tight", textSize)} style={{ color: fg }}>
            {label}
          </span>
        </div>
      )}

      {icon && (
        <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/85 text-base shadow-sm backdrop-blur">
          {icon}
        </span>
      )}
    </div>
  );
}
