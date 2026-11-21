import { KitchenHeader, KNotice } from "@/components/restaurant/KitchenShell";
import { RouteHero } from "@/components/staff-demo/RouteHero";
import { Pill, ScreenHeader } from "@/components/ui/Bits";
import { Icon } from "@/components/ui/Icon";
import { GroupLabel, ListGroup, ListRow, RowIcon } from "@/components/ui/List";
import { getStaffRoute } from "@/lib/data/nama-staff";
import { formatKg } from "@/lib/format";
import { clockTime } from "@/lib/kitchen";
import { loggedToday } from "@/lib/nama-staff";

/** Staff screen 1: today's stops, one per branch, with what each kitchen logged. */
export default async function RoutePage() {
  const res = await getStaffRoute();
  if (!res.ok) return <KNotice>{res.error}</KNotice>;
  const r = res.data;

  return (
    <>
      <KitchenHeader restaurant="Nama staff" />
      <ScreenHeader title="Today's route" subtitle={r.restaurant} />
      <RouteHero route={r} />

      <GroupLabel>Stops</GroupLabel>
      <ListGroup>
        {r.stops.map((s, i) => (
          <ListRow
            key={s.branchId}
            href={s.collected ? undefined : `/nama-staff/collect?branch=${s.branchId}`}
            leading={
              <RowIcon tone={s.collected ? "lime" : "forest"}>
                {s.collected ? <Icon name="check" size={16} strokeWidth={2.8} /> : <span className="text-[14px] font-bold">{i + 1}</span>}
              </RowIcon>
            }
            title={s.name}
            note={
              s.collected
                ? `Collected ${formatKg(s.collected.kg)} at ${clockTime(s.collected.at)}${s.collected.grade ? `, grade ${s.collected.grade}` : ""}`
                : `${s.location} · ${loggedToday(s)}`
            }
            trailing={s.collected ? <Pill>Done</Pill> : r.booking ? <Pill tone="wait">Booked</Pill> : r.openRequest ? <Pill tone="wait">Requested</Pill> : null}
          />
        ))}
      </ListGroup>
      <p className="-mt-2 px-4 text-[13px] text-muted">Tap a stop to record its collection.</p>
    </>
  );
}
