import { useMemo } from "react";
import type { Inquiry } from "@/types";

interface Props {
  inquiries: Inquiry[];
  /** Number of days to show, ending today. */
  days?: number;
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

/** Simple, dependency-free bar chart of enquiries per day for the last N days. */
export function InquiriesChart({ inquiries, days = 30 }: Props) {
  const { bars, max, total } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const inq of inquiries) {
      const t = inq.createdAt ? new Date(inq.createdAt) : null;
      if (!t || isNaN(t.getTime())) continue;
      const k = dayKey(t);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const out: { key: string; label: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const k = dayKey(d);
      out.push({
        key: k,
        label: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
        count: counts.get(k) ?? 0,
      });
    }
    const m = Math.max(1, ...out.map((o) => o.count));
    return { bars: out, max: m, total: out.reduce((n, o) => n + o.count, 0) };
  }, [inquiries, days]);

  if (total === 0) {
    return (
      <div className="mt-5 flex h-48 items-center justify-center rounded-xl border border-dashed border-line text-sm text-muted">
        No enquiries yet — the chart will fill in as customers send their carts.
      </div>
    );
  }

  // Label every ~Nth bar to avoid crowding.
  const step = Math.ceil(bars.length / 10);

  return (
    <div className="mt-5">
      <div className="flex items-end gap-[3px] h-48" role="img" aria-label={`Enquiries per day for the last ${days} days`}>
        {bars.map((b, i) => (
          <div key={b.key} className="group relative flex h-full flex-1 flex-col justify-end" title={`${b.label}: ${b.count} enquir${b.count === 1 ? "y" : "ies"}`}>
            <div
              className="w-full rounded-t-sm bg-gradient-to-t from-accent to-accent-dark transition-all duration-300 group-hover:opacity-80"
              style={{ height: `${Math.max(b.count === 0 ? 0 : 4, (b.count / max) * 100)}%` }}
            />
            {/* hover count */}
            {b.count > 0 && (
              <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                {b.count}
              </span>
            )}
            {i % step === 0 && (
              <span className="mt-1 hidden text-[9px] leading-none text-muted sm:block absolute -bottom-4 left-0 whitespace-nowrap">
                {b.label}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between text-xs text-muted">
        <span>{bars[0].label}</span>
        <span className="font-medium text-ink-soft">Peak: {max}/day</span>
        <span>{bars[bars.length - 1].label}</span>
      </div>
    </div>
  );
}
