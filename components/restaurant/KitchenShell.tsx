import type { ReactNode } from "react";

/** NAMA 🌱 header bar for the restaurant demo. */
export function KitchenHeader({ restaurant }: { restaurant: string }) {
  return (
    <header className="flex items-center justify-between gap-3 px-1">
      <div className="flex items-center gap-1.5 text-[22px] font-extrabold tracking-[0.06em] text-k-forest">
        NAMA <span aria-hidden="true">🌱</span>
      </div>
      <span className="truncate rounded-full bg-k-mint px-3 py-1 text-[13px] font-semibold text-k-forest">{restaurant}</span>
    </header>
  );
}

/** Page title with an optional line under it. */
export function KitchenTitle({ title, sub }: { title: string; sub?: ReactNode }) {
  return (
    <div className="px-1">
      <h1 className="text-[28px] font-bold leading-tight tracking-[-0.3px] text-k-ink">{title}</h1>
      {sub ? <p className="mt-0.5 text-[15px] text-k-muted">{sub}</p> : null}
    </div>
  );
}

/** White rounded card with an optional small heading. */
export function KCard({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[18px] bg-white p-4 shadow-[0_1px_2px_rgba(23,37,31,0.06)] ${className}`}>
      {title ? <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-k-muted">{title}</h2> : null}
      {children}
    </section>
  );
}

/** Message box for load errors. */
export function KNotice({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="rounded-[18px] bg-white px-4 py-6 text-center text-[15px] text-k-orange">
      {children}
    </div>
  );
}
