import { formatPoints } from "@/lib/format";

/** Dark green card with the points you can spend. */
export function BalanceHeader({ balance }: { balance: number }) {
  return (
    <section aria-label="Your points" className="flex items-end justify-between rounded-[22px] bg-hero px-5 py-4 text-on-hero">
      <div>
        <div className="text-[15px] font-medium text-on-hero-muted">You have</div>
        <div className="text-[40px] font-bold leading-tight tracking-[-0.8px] tabular-nums">{formatPoints(balance)}</div>
      </div>
      <div className="pb-2 text-[15px] text-on-hero-muted">points to spend</div>
    </section>
  );
}
