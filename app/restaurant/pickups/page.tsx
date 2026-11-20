import { KCard, KitchenHeader, KitchenTitle, KNotice } from "@/components/restaurant/KitchenShell";
import { PickupRequest } from "@/components/restaurant/PickupRequest";
import { Icon } from "@/components/ui/Icon";
import { getKitchenDashboard } from "@/lib/data/kitchen";
import { formatKg } from "@/lib/format";
import { weekdayDate } from "@/lib/kitchen";

/** Screen 2: next pickup, request a pickup, past pickups. */
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

      <PickupRequest openRequest={d.openRequest} />

      <KCard title="Past pickups">
        {d.pickups.length === 0 ? (
          <p className="py-2 text-[15px] text-k-muted">No pickups yet.</p>
        ) : (
          <ul className="divide-y divide-k-line">
            {d.pickups.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-[16px] font-semibold text-k-ink">{formatKg(p.collectedKg)} collected</p>
                  <p className="text-[13px] text-k-muted">{weekdayDate(p.collectedAt)}</p>
                </div>
                <span className="rounded-full bg-k-mint px-2.5 py-1 text-[12px] font-semibold text-k-green">Done</span>
              </li>
            ))}
          </ul>
        )}
      </KCard>
    </>
  );
}
