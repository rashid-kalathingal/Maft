import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToast } from "@/stores/useToast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-lg border bg-white px-4 py-3 shadow-card",
            t.type === "success" && "border-success/30",
            t.type === "error" && "border-danger/30",
            t.type === "info" && "border-line",
          )}
        >
          {t.type === "success" && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />}
          {t.type === "error" && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />}
          {t.type === "info" && <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />}
          <p className="flex-1 text-sm text-ink">{t.message}</p>
          <button onClick={() => dismiss(t.id)} className="text-muted hover:text-ink" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
