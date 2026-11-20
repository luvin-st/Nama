import { BinsToday } from "@/components/restaurant/BinsToday";
import { KitchenHeader, KNotice } from "@/components/restaurant/KitchenShell";
import { PickupRequest } from "@/components/restaurant/PickupRequest";
import { Notice, Pill, ScreenHeader } from "@/components/ui/Bits";
import { Icon } from "@/components/ui/Icon";
import { GroupLabel, ListGroup, ListRow } from "@/components/ui/List";
import { getKitchenDashboard } from "@/lib/data/kitchen";
import { formatKg } from "@/lib/format";
import { GRADE_LABEL, weekdayDate } from "@/lib/kitchen";

/** Screen 2: next pickup, today's bins, request a pickup, past pickups. */
export default async function PickupsPage() {
  const res = await getKitchenDashboard();
  if (!res.ok) return <KNotice>{res.error}</KNotice>;
  const d = res.data;

  return (
    <>
      <KitchenHeader restaurant={d.restaurant} />
      <ScreenHeader title="Pickups" />

      <section aria-label="Next pickup" className="rounded-[22px] bg-hero p-5 text-on-hero">
        <div className="flex items-center gap-2 text-[15px] font-medium text-on-hero-muted">
          <Icon name="calendar" size={18} /> Next pickup
        </div>
        <p className="mt-2 text-[30px] font-bold leading-tight tracking-[-0.4px]">{d.nextPickup}</p>
        <p className="mt-2 text-[13px] text-on-hero-muted">All {d.branches.length} branches, one route</p>
      </section>

      <BinsToday branches={d.branches} />

      <PickupRequest openRequest={d.openRequest} />

      <GroupLabel>Past pickups</GroupLabel>
      <ListGroup>
        {d.pickups.length === 0 ? (
          <Notice>No pickups yet.</Notice>
        ) : (
          d.pickups.map((p) => (
            <ListRow
              key={p.id}
              title={`${formatKg(p.collectedKg)} collected`}
              note={[weekdayDate(p.collectedAt), p.collectedBy].filter(Boolean).join(" · ")}
              trailing={
                p.grade ? (
                  <Pill tone={p.grade === "A" ? "ok" : "wait"}>
                    Grade {p.grade} ({GRADE_LABEL[p.grade]})
                  </Pill>
                ) : (
                  <Pill tone="wait">Done</Pill>
                )
              }
            />
          ))
        )}
      </ListGroup>
    </>
  );
}
