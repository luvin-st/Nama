import { Icon } from "@/components/ui/Icon";
import { GroupLabel, ListGroup, ListRow, RowIcon } from "@/components/ui/List";
import type { ProfileView } from "@/lib/data/profile";
import { formatKg } from "@/lib/format";

type OverviewProps = { building: ProfileView["building"]; monthKg: number };

export function OverviewList({ building, monthKg }: OverviewProps) {
  const value = (v: string) => <span className="text-[17px] text-muted tabular-nums">{v}</span>;

  return (
    <>
      <GroupLabel>Overview</GroupLabel>
      <ListGroup>
        <ListRow
          leading={
            <RowIcon tone="forest">
              <Icon name="calendar" size={17} strokeWidth={2.2} />
            </RowIcon>
          }
          title="Next pickup"
          note={building ? `${building.name}, ${building.bin_spot.toLowerCase()}` : "Set your building in your profile"}
          trailing={value(building?.pickup_day ?? "—")}
        />
        <ListRow
          leading={
            <RowIcon tone="leaf">
              <Icon name="leaf" size={17} strokeWidth={2.2} />
            </RowIcon>
          }
          title="This month"
          note="Kept out of landfill"
          trailing={value(formatKg(monthKg))}
        />
        <ListRow
          href="/guide"
          leading={
            <RowIcon tone="lime">
              <Icon name="book" size={17} strokeWidth={2.2} />
            </RowIcon>
          }
          title="What goes in the bin?"
        />
      </ListGroup>
    </>
  );
}
