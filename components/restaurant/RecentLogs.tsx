import { Notice } from "@/components/ui/Bits";
import { GroupLabel, ListGroup, RowIcon, StaticRow } from "@/components/ui/Group";
import { Icon } from "@/components/ui/Icon";
import { relativeDay } from "@/lib/format";
import { clockTime, WASTE, type BinLog } from "@/lib/kitchen";

/** The last few bins logged across all branches. Used inside the Log a bin form, so it has no links. */
export function RecentLogs({ logs }: { logs: BinLog[] }) {
  return (
    <>
      <GroupLabel>Latest bins</GroupLabel>
      <ListGroup>
        {logs.length === 0 ? (
          <Notice>No bins logged this month yet.</Notice>
        ) : (
          logs.map((l) => (
            <StaticRow
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
