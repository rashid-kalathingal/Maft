import { Minus, Plus } from "lucide-react";
import type { VariantSelection } from "@/lib/useVariantSelection";
import { Swatch } from "@/components/ui/Swatch";
import { cn } from "@/lib/utils";

export function VariantControls({
  sel,
  quantity,
  setQuantity,
  showStock,
}: {
  sel: VariantSelection;
  quantity: number;
  setQuantity: (n: number) => void;
  showStock: boolean;
}) {
  return (
    <div className="space-y-5">
      {sel.availableColours.length > 0 && (
        <div>
          <p className="label">
            Colour {sel.needsColour && !sel.colourId && <span className="text-danger">*</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {sel.availableColours.map((c) => {
              const enabled = sel.colourEnabled(c.id);
              const active = sel.colourId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => sel.setColour(active ? undefined : c.id)}
                  disabled={!enabled && !active}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition",
                    active ? "border-accent bg-accent/5 text-primary" : "border-line text-ink-soft hover:border-accent/50",
                    !enabled && !active && "cursor-not-allowed opacity-40",
                  )}
                >
                  <Swatch colour={c} size={16} />
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sel.availableSizes.length > 0 && (
        <div>
          <p className="label">
            Size {sel.needsSize && !sel.sizeId && <span className="text-danger">*</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {sel.availableSizes.map((s) => {
              const enabled = sel.sizeEnabled(s.id);
              const active = sel.sizeId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => sel.setSize(active ? undefined : s.id)}
                  disabled={!enabled && !active}
                  className={cn(
                    "rounded-lg border px-3.5 py-1.5 text-sm font-medium transition",
                    active ? "border-accent bg-accent/5 text-primary" : "border-line text-ink-soft hover:border-accent/50",
                    !enabled && !active && "cursor-not-allowed opacity-40 line-through",
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="label">Quantity</p>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-lg border border-line">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="grid h-10 w-10 place-items-center text-ink-soft hover:bg-surface"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10);
                setQuantity(Number.isNaN(n) ? 1 : Math.max(1, n));
              }}
              className="h-10 w-16 border-x border-line text-center text-sm font-semibold focus:outline-none"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="grid h-10 w-10 place-items-center text-ink-soft hover:bg-surface"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {showStock && sel.ready && (
            <span className="text-sm text-muted">{sel.maxQty} in stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
