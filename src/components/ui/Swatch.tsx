import type { Colour } from "@/types";
import { cn } from "@/lib/utils";

export function Swatch({
  colour,
  size = 18,
  className,
}: {
  colour: Colour;
  size?: number;
  className?: string;
}) {
  const style: React.CSSProperties = colour.secondaryHexCode
    ? {
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${colour.hexCode} 0 50%, ${colour.secondaryHexCode} 50% 100%)`,
      }
    : { width: size, height: size, background: colour.hexCode ?? "#ccc" };
  return (
    <span
      className={cn("inline-block rounded-full border border-black/10 shadow-sm", className)}
      style={style}
      title={colour.name}
      aria-label={colour.name}
    />
  );
}
