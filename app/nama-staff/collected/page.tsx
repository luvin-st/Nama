import { KitchenHeader, KNotice } from "@/components/restaurant/KitchenShell";
import { Notice, Pill, ScreenHeader } from "@/components/ui/Bits";
import { GroupLabel, ListGroup, ListRow } from "@/components/ui/List";
import { getStaffRoute } from "@/lib/data/nama-staff";
import { formatKg } from "@/lib/format";
import { clockTime, GRADE_LABEL, weekdayDate } from "@/lib/kitchen";

/** Staff screen 3: the latest collections, newest first. */
export default async function CollectedPage() {
  const res = await getStaffRoute();
  if (!res.ok) return <KNotice>{res.error}</KNotice>;
  const list = res.data.collected;
  const total = list.reduce((sum, c) => sum + c.collectedKg, 0);

  return (
    <>
      <KitchenHeader restaurant="Nama staff" />
      <ScreenHeader title="Collected" subtitle={`${list.length} pickups · ${formatKg(total)}`} />
      <GroupLabel>{res.data.restaurant}</GroupLabel>
      <ListGroup>
        {list.length === 0 ? (
          <Notice>No collections yet.</Notice>
        ) : (
          list.map((c) => (
            <ListRow
              key={c.id}
              title={`${formatKg(c.collectedKg)} · ${c.branch ?? "All branches"}`}
              note={[`${weekdayDate(c.collectedAt)}, ${clockTime(c.collectedAt)}`, c.collectedBy, c.reason].filter(Boolean).join(" · ")}
              trailing={
                c.grade ? (
                  <Pill tone={c.grade === "A" ? "ok" : c.grade === "C" ? "bad" : "wait"}>
                    Grade {c.grade} ({GRADE_LABEL[c.grade]})
                  </Pill>
                ) : null
              }
            />
          ))
        )}
      </ListGroup>
    </>
  );
}
