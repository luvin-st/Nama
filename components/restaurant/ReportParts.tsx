import { RankBadge } from "@/components/impact/RankBadge";
import { Pill } from "@/components/ui/Bits";
import { Icon } from "@/components/ui/Icon";
import { GroupLabel, ListGroup, ListRow, RowIcon } from "@/components/ui/List";
import { formatKg } from "@/lib/format";
import { formatAed, percentages, REPORT_ORDER, WASTE, type Branch, type WasteType } from "@/lib/kitchen";

type HeroProps = { totalKg: number; todayKg: number; aedPerKg: number; branchCount: number; logCount: number };

/** Dark green card at the top of the owner report: food wasted this month, in dirhams. */
export function ReportHero({ totalKg, todayKg, aedPerKg, branchCount, logCount }: HeroProps) {
  return (
    <section aria-label="Food in the bin this month" className="rounded-[22px] bg-hero p-5 text-on-hero">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[15px] font-medium text-on-hero-muted">Food in the bin this month</span>
        {todayKg > 0 ? <Pill>+ {formatAed(todayKg * aedPerKg)} today</Pill> : null}
      </div>
      <div className="mt-2 text-[48px] font-bold leading-none tracking-[-1px] tabular-nums">{formatAed(totalKg * aedPerKg)}</div>
      <p className="mt-3 text-[13px] text-on-hero-muted">
        {formatKg(totalKg)} from {logCount} bins across {branchCount} branches · about {formatAed(aedPerKg)} per kg
        {todayKg > 0 ? ` · ${formatKg(todayKg)} logged today` : ""}
      </p>
    </section>
  );
}

/** Spoilage / prep scraps / plate leftovers: one stacked bar, then a row per type. */
export function WasteTypeSplit({ byType, aedPerKg }: { byType: Record<WasteType, number>; aedPerKg: number }) {
  const pcts = percentages(REPORT_ORDER.map((t) => byType[t]));
  const rows = REPORT_ORDER.map((t, i) => ({ t, kg: byType[t], pct: pcts[i] ?? 0 }));

  return (
    <>
      <GroupLabel>By waste type</GroupLabel>
      <ListGroup>
        <div className="px-4 py-3.5">
          <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-track" aria-hidden="true">
            {rows.map((r) => (
              <div key={r.t} className={WASTE[r.t].bar} style={{ width: `${r.pct}%` }} />
            ))}
          </div>
        </div>
        {rows.map((r) => (
          <ListRow
            key={r.t}
            leading={
              <RowIcon tone={WASTE[r.t].tone}>
                <Icon name={WASTE[r.t].icon} size={16} strokeWidth={2.1} />
              </RowIcon>
            }
            title={WASTE[r.t].label}
            note={formatAed(r.kg * aedPerKg)}
            trailing={<span className="text-[17px] font-semibold tabular-nums">{r.pct}%</span>}
          />
        ))}
      </ListGroup>
    </>
  );
}

/** One bar per branch, sized against the biggest branch. */
export function BranchSplit({ branches, aedPerKg }: { branches: Branch[]; aedPerKg: number }) {
  const pcts = percentages(branches.map((b) => b.monthKg));
  const max = Math.max(1, ...branches.map((b) => b.monthKg));

  return (
    <>
      <GroupLabel>By branch</GroupLabel>
      <ListGroup>
        {branches.map((b, i) => (
          <div key={b.id} className="px-4 py-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[17px] text-ink">{b.name}</span>
              <span className="text-[15px] text-muted tabular-nums">
                {formatAed(b.monthKg * aedPerKg)} · <span className="font-semibold text-ink">{pcts[i] ?? 0}%</span>
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-track" aria-hidden="true">
              <div className="h-full rounded bg-leaf" style={{ width: `${(b.monthKg / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </ListGroup>
    </>
  );
}

/** Branches ranked from least to most waste this month. */
export function BranchLeaderboard({ branches }: { branches: Branch[] }) {
  const ranked = [...branches].sort((a, b) => a.monthKg - b.monthKg);
  return (
    <>
      <GroupLabel>Least waste wins</GroupLabel>
      <ListGroup>
        {ranked.map((b, i) => (
          <ListRow
            key={b.id}
            leading={<RankBadge rank={i + 1} />}
            title={<span className={i === 0 ? "font-semibold" : undefined}>{b.name}</span>}
            trailing={<span className="text-[15px] text-muted tabular-nums">{formatKg(b.monthKg)}</span>}
          />
        ))}
      </ListGroup>
    </>
  );
}

/** The one tip at the bottom of the report. */
export function TipCard({ tip }: { tip: string }) {
  return (
    <>
      <GroupLabel>Tip for this week</GroupLabel>
      <ListGroup>
        <ListRow
          leading={
            <RowIcon tone="lime">
              <Icon name="bulb" size={17} strokeWidth={2.1} />
            </RowIcon>
          }
          title={<span className="font-semibold">{tip}</span>}
        />
      </ListGroup>
    </>
  );
}
