import { Notice, Pill } from "@/components/ui/Bits";
import { ListGroup, ListRow } from "@/components/ui/List";
import type { StaffDrop } from "@/lib/data/staff";
import { relativeDay } from "@/lib/format";

function timeOf(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

/** List of drops waiting to be weighed. Tapping one opens the check screen. */
export function DropQueue({ drops, myId }: { drops: StaffDrop[]; myId: string }) {
  if (drops.length === 0) {
    return (
      <ListGroup>
        <Notice>All caught up. There are no drops waiting to be checked.</Notice>
      </ListGroup>
    );
  }

  return (
    <ListGroup>
      {drops.map((d) => (
        <ListRow
          key={d.id}
          href={`/staff/drops/${d.id}`}
          title={
            <>
              {d.resident.name}
              {d.resident.flat ? <span className="text-muted"> · Flat {d.resident.flat}</span> : null}
            </>
          }
          note={`${d.building.name} · ${d.bin.label} · ${relativeDay(d.createdAt)}, ${timeOf(d.createdAt)}`}
          trailing={d.userId === myId ? <Pill tone="wait">Yours</Pill> : null}
        />
      ))}
    </ListGroup>
  );
}
