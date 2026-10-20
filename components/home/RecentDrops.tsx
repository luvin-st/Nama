import { Notice, Pill } from "@/components/ui/Bits";
import { GroupLabel, ListGroup, ListRow } from "@/components/ui/List";
import type { RecentDrop } from "@/lib/data/home";
import { formatKg, relativeDay } from "@/lib/format";

const STATUS = {
  verified: { label: "Verified", tone: "ok" },
  pending: { label: "Checking", tone: "wait" },
  rejected: { label: "Not accepted", tone: "bad" },
} as const;

function DropTitle({ drop }: { drop: RecentDrop }) {
  if (drop.status === "pending") return <>Waiting to be weighed</>;
  if (drop.status === "rejected") return <>{drop.rejectReason ?? "Not accepted"} · no points</>;
  return (
    <span className="tabular-nums">
      {drop.kg !== null ? formatKg(drop.kg) : "Drop"} · <span className="text-muted">+{drop.points} pts</span>
    </span>
  );
}

export function RecentDrops({ drops }: { drops: RecentDrop[] }) {
  return (
    <>
      <GroupLabel>Recent drops</GroupLabel>
      <ListGroup>
        {drops.length === 0 ? (
          <Notice>No drops yet. Scan your building&apos;s bin to make your first one.</Notice>
        ) : (
          drops.map((d) => (
            <ListRow
              key={d.id}
              title={<DropTitle drop={d} />}
              note={`${relativeDay(d.createdAt)} · ${d.building}`}
              trailing={<Pill tone={STATUS[d.status].tone}>{STATUS[d.status].label}</Pill>}
            />
          ))
        )}
      </ListGroup>
    </>
  );
}
