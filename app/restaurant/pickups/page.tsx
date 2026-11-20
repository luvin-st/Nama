import { BinsToday } from "@/components/restaurant/BinsToday";
import { KCard, KitchenHeader, KitchenTitle, KNotice } from "@/components/restaurant/KitchenShell";
import { PickupRequest } from "@/components/restaurant/PickupRequest";
import { Icon } from "@/components/ui/Icon";
import { getKitchenDashboard } from "@/lib/data/kitchen";
import { formatKg } from "@/lib/format";
import { GRADE_LABEL, weekdayDate, type Pickup } from "@/lib/kitchen";

function PickupRow({ p }: { p: Pickup }) {
  const details = [weekdayDate(p.collectedAt), p.collectedBy].filter(Boolean);
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-[16px] font-semibold text-k-ink">{formatKg(p.collectedKg)} collected</p>
        <p className="text-[13px] text-k-muted">{details.join(" · ")}</p>
      </div>
      {p.grade ? (
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${p.grade === "A" ? "bg-k-mint text-k-green" : "bg-k-peach text-k-orange"}`}
        >
          Grade {p.grade} ({GRADE_LABEL[p.grade]})
        </span>
      ) : (
        <span className="shrink-0 rounded-full bg-k-mint px-2.5 py-1 text-[12px] font-semibold text-k-green">Done</span>
      )}
    </li>
  );
}

/** Screen 2: next pickup, today's bins, request a pickup, past pickups. */
export default async function PickupsPage() {
  const res = await getKitchenDashboard();
  if (!res.ok) return <KNotice>{res.error}</KNotice>;
  const d = res.data;

  return (
    <>
      <KitchenHeader restaurant={d.restaurant} />
      <KitchenTitle title="Pickups" />

      <section className="rounded-[20px] bg-k-forest p-5 text-white">
        <div className="flex items-center gap-2 text-[14px] font-medium text-white/75">
          <Icon name="calendar" size={18} /> Next pickup
        </div>
        <p className="mt-1 text-[26px] font-bold leading-tight">{d.nextPickup}</p>
        <p className="mt-1 text-[14px] text-white/75">All {d.branches.length} branches, one route</p>
      </section>

      <BinsToday branches={d.branches} />

      <PickupRequest openRequest={d.openRequest} />

      <KCard title="Past pickups">
        {d.pickups.length === 0 ? (
          <p className="py-2 text-[15px] text-k-muted">No pickups yet.</p>
        ) : (
          <ul className="divide-y divide-k-line">
            {d.pickups.map((p) => (
              <PickupRow key={p.id} p={p} />
            ))}
          </ul>
        )}
      </KCard>
    </>
  );
}
