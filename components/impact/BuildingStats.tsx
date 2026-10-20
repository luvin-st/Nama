import { Notice } from "@/components/ui/Bits";
import { GroupLabel, ListGroup } from "@/components/ui/List";
import type { BuildingImpact } from "@/lib/data/impact";
import { formatKg } from "@/lib/format";
import { co2ForKg } from "@/lib/impact";

function Tile({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center px-2 py-3.5 text-center">
      <div className="text-[20px] font-bold leading-tight tabular-nums">{value}</div>
      <div className="mt-0.5 text-[13px] text-muted">{label}</div>
    </div>
  );
}

/** Your building's totals for this month. */
export function BuildingStats({ building }: { building: BuildingImpact | null }) {
  const month = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", month: "long" }).format(new Date());
  if (!building) {
    return (
      <ListGroup>
        <Notice>Add your building in Profile to see its impact.</Notice>
      </ListGroup>
    );
  }
  return (
    <>
      <GroupLabel>
        {building.name} · {month}
      </GroupLabel>
      <div className="flex divide-x-[0.5px] divide-sep rounded-[14px] bg-card">
        <Tile value={formatKg(building.monthKg)} label="collected" />
        <Tile value={`${building.activeThisMonth} of ${building.residents}`} label="neighbours joined in" />
        <Tile value={`≈ ${formatKg(co2ForKg(building.monthKg))}`} label="CO₂ avoided*" />
      </div>
      <p className="-mt-2 px-4 text-[13px] text-muted tabular-nums">{formatKg(building.totalKg)} collected since the pilot began</p>
    </>
  );
}
