import { Notice } from "@/components/ui/Bits";
import { Icon } from "@/components/ui/Icon";
import { GroupLabel, ListGroup, ListRow, RowIcon } from "@/components/ui/List";
import { relativeDay } from "@/lib/format";
import { clockTime, WASTE, type BinLog } from "@/lib/kitchen";

/** The last few bins logged across all branches. */
export function RecentLogs({ logs }: { logs: BinLog[] }) {
  return (
    <>
      <GroupLabel>Latest bins</GroupLabel>
      <ListGroup>
        {logs.length === 0 ? (
          <Notice>No bins logged this month yet.</Notice>
        ) : (
          logs.map((l) => (
            <ListRow
              key={l.id}
              leading={
                <RowIcon tone={WASTE[l.wasteType].tone}>
                  <Icon name={WASTE[l.wasteType].icon} size={16} strokeWidth={2.1} />
                </RowIcon>
              }
              title={`${l.weightKg} kg ${WASTE[l.wasteType].label.toLowerCase()}`}
              note={`${l.branch} · ${relativeDay(l.loggedAt)}, ${clockTime(l.loggedAt)}`}
            />
          ))
        )}
      </ListGroup>
    </>
  );
}
