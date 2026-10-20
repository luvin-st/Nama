import { Notice } from "@/components/ui/Bits";
import { GroupLabel, ListGroup } from "@/components/ui/List";
import type { Neighbour } from "@/lib/data/impact";
import { formatKg } from "@/lib/format";
import { RankBadge } from "./RankBadge";

function Row({ n, gap }: { n: Neighbour; gap: boolean }) {
  return (
    <div className={`flex min-h-[52px] items-center gap-3 px-4 py-2.5 ${n.isMe ? "bg-chip" : ""} ${gap ? "border-t-2 border-dashed border-sep" : ""}`}>
      <RankBadge rank={n.rank} />
      <div className="min-w-0 flex-1">
        <div className={`text-[17px] ${n.isMe ? "font-semibold" : ""}`}>
          {n.name}
          {n.isMe ? <span className="font-normal text-muted"> (you)</span> : null}
        </div>
        {n.isMe && n.hidden ? <div className="text-[13px] text-muted">Only you can see this</div> : null}
      </div>
      <span className="text-[15px] text-muted tabular-nums">{formatKg(n.monthKg)}</span>
    </div>
  );
}

/** Top neighbours in your building this month, plus your own place. */
export function NeighbourBoard({ neighbours, building }: { neighbours: Neighbour[]; building: string | null }) {
  const others = neighbours.filter((n) => !n.isMe && n.monthKg > 0);
  return (
    <>
      <GroupLabel>Neighbours{building ? ` in ${building}` : ""} · this month</GroupLabel>
      <ListGroup>
        {others.length === 0 && neighbours.every((n) => n.monthKg === 0) ? (
          <Notice>No verified drops in your building yet this month. Be the first!</Notice>
        ) : (
          neighbours.map((n, i) => <Row key={`${n.rank}-${n.name}-${i}`} n={n} gap={n.isMe && i >= 10} />)
        )}
      </ListGroup>
      <p className="-mt-2 px-4 text-[13px] text-muted">
        Shown as first name and last initial. You can hide yourself in Profile.
      </p>
    </>
  );
}
