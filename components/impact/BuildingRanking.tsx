import { Notice, Pill } from "@/components/ui/Bits";
import { GroupLabel, ListGroup, ListRow } from "@/components/ui/List";
import type { BuildingRank } from "@/lib/data/impact";
import { formatKg } from "@/lib/format";
import { RankBadge } from "./RankBadge";

/** Buildings ranked by kg per resident this month (fair across building sizes). */
export function BuildingRanking({ buildings }: { buildings: BuildingRank[] }) {
  return (
    <>
      <GroupLabel>Building leaderboard</GroupLabel>
      <ListGroup>
        {buildings.length === 0 ? (
          <Notice>No buildings yet.</Notice>
        ) : (
          buildings.map((b) => (
            <ListRow
              key={b.name}
              leading={<RankBadge rank={1 + buildings.filter((o) => o.kgPerResident > b.kgPerResident).length} />}
              title={<span className={b.isMine ? "font-semibold" : undefined}>{b.name}</span>}
              note={`${formatKg(b.kgPerResident)} per resident · ${b.residents} ${b.residents === 1 ? "resident" : "residents"}`}
              trailing={b.isMine ? <Pill>Yours</Pill> : <span className="text-[15px] text-muted tabular-nums">{formatKg(b.monthKg)}</span>}
            />
          ))
        )}
      </ListGroup>
      <p className="-mt-2 px-4 text-[13px] text-muted">Ranked by kg per resident this month, so smaller buildings can win too.</p>
    </>
  );
}
