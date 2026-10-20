import type { ReactNode } from "react";

/** Large page title with an optional subtitle and trailing control. */
export function ScreenHeader({ title, subtitle, trailing }: { title: string; subtitle?: ReactNode; trailing?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 px-1 pt-2">
      <div className="min-w-0">
        <h1 className="text-balance text-[34px] font-bold leading-tight tracking-[-0.4px]">{title}</h1>
        {subtitle ? <div className="mt-1 text-[15px] text-muted">{subtitle}</div> : null}
      </div>
      {trailing}
    </header>
  );
}

type PillTone = "ok" | "wait" | "bad";
const PILL: Record<PillTone, string> = {
  ok: "bg-lime text-lime-ink",
  wait: "bg-chip text-ink",
  bad: "bg-chip text-danger",
};

export function Pill({ tone = "ok", children }: { tone?: PillTone; children: ReactNode }) {
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] font-semibold ${PILL[tone]}`}>{children}</span>;
}

/** Horizontal progress bar; `value` is 0–100. */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className="h-2 overflow-hidden rounded bg-hero-2"
    >
      <div className="h-full rounded bg-lime transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Centered message for empty, loading or error states. */
export function Notice({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "error" }) {
  return (
    <div role={tone === "error" ? "alert" : undefined} className={`px-4 py-5 text-center text-[15px] ${tone === "error" ? "text-danger" : "text-muted"}`}>
      {children}
    </div>
  );
}
