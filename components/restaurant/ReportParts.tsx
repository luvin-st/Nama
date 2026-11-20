import { formatAed, percentages, REPORT_ORDER, WASTE, type Branch, type WasteType } from "@/lib/kitchen";
import { formatKg } from "@/lib/format";
import { KCard } from "./KitchenShell";

/** Big number at the top of the owner report. */
export function ReportHero({ totalKg, aedPerKg, branchCount, logCount }: { totalKg: number; aedPerKg: number; branchCount: number; logCount: number }) {
  return (
    <section className="rounded-[22px] bg-k-forest p-5 text-white">
      <p className="text-[46px] font-extrabold leading-none tracking-[-1px]">{formatAed(totalKg * aedPerKg)}</p>
      <p className="mt-2 text-[17px] font-semibold">of food in the bin this month</p>
      <p className="mt-3 text-[14px] text-white/75">
        {formatKg(totalKg)} from {logCount} bins across {branchCount} branches · about {formatAed(aedPerKg)} per kg
      </p>
    </section>
  );
}

/** Spoilage / prep scraps / plate leftovers as one stacked bar plus a legend. */
export function WasteTypeSplit({ byType, aedPerKg }: { byType: Record<WasteType, number>; aedPerKg: number }) {
  const pcts = percentages(REPORT_ORDER.map((t) => byType[t]));
  const rows = REPORT_ORDER.map((t, i) => ({ t, kg: byType[t], pct: pcts[i] ?? 0 }));

  return (
    <KCard title="By waste type">
      <div className="flex h-4 overflow-hidden rounded-full bg-k-line" aria-hidden="true">
        {rows.map((r) => (
          <div key={r.t} className={WASTE[r.t].bar} style={{ width: `${r.pct}%` }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-col gap-2.5">
        {rows.map((r) => (
          <li key={r.t} className="flex items-center gap-3">
            <span className={`size-3 shrink-0 rounded-full ${WASTE[r.t].dot}`} aria-hidden="true" />
            <span className="flex-1 text-[15px] font-medium text-k-ink">{WASTE[r.t].label}</span>
            <span className="text-[14px] text-k-muted">{formatAed(r.kg * aedPerKg)}</span>
            <span className="w-12 text-right text-[17px] font-bold text-k-ink">{r.pct}%</span>
          </li>
        ))}
      </ul>
    </KCard>
  );
}

/** One bar per branch, sized against the biggest branch. */
export function BranchSplit({ branches, aedPerKg }: { branches: Branch[]; aedPerKg: number }) {
  const pcts = percentages(branches.map((b) => b.monthKg));
  const max = Math.max(1, ...branches.map((b) => b.monthKg));

  return (
    <KCard title="By branch">
      <ul className="flex flex-col gap-3.5">
        {branches.map((b, i) => (
          <li key={b.id}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[15px] font-semibold text-k-ink">{b.name}</span>
              <span className="text-[14px] text-k-muted">
                {formatAed(b.monthKg * aedPerKg)} · <span className="font-bold text-k-ink">{pcts[i] ?? 0}%</span>
              </span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-k-line" aria-hidden="true">
              <div className="h-full rounded-full bg-k-green" style={{ width: `${(b.monthKg / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </KCard>
  );
}

const MEDALS = ["🥇", "🥈", "🥉"];

/** Branches ranked from least to most waste this month. */
export function BranchLeaderboard({ branches }: { branches: Branch[] }) {
  const ranked = [...branches].sort((a, b) => a.monthKg - b.monthKg);
  return (
    <KCard title="Least waste wins">
      <ol className="flex flex-col gap-1">
        {ranked.map((b, i) => (
          <li key={b.id} className={`flex items-center gap-3 rounded-[12px] px-2 py-2 ${i === 0 ? "bg-k-mint" : ""}`}>
            <span className="w-7 text-center text-[20px]" aria-hidden="true">{MEDALS[i] ?? i + 1}</span>
            <span className="sr-only">Rank {i + 1}:</span>
            <span className="flex-1 text-[15px] font-semibold text-k-ink">{b.name}</span>
            <span className="text-[15px] font-medium text-k-muted">{formatKg(b.monthKg)}</span>
          </li>
        ))}
      </ol>
    </KCard>
  );
}

/** The one tip at the bottom of the report. */
export function TipCard({ tip }: { tip: string }) {
  return (
    <section className="flex items-start gap-3 rounded-[18px] bg-k-peach p-4">
      <span aria-hidden="true" className="text-[24px] leading-none">💡</span>
      <div>
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-k-orange">Tip for this week</h2>
        <p className="mt-1 text-[18px] font-bold leading-snug text-k-ink">{tip}</p>
      </div>
    </section>
  );
}
