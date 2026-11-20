import { KitchenHeader, KNotice } from "@/components/restaurant/KitchenShell";
import { CollectForm } from "@/components/staff-demo/CollectForm";
import { ScreenHeader } from "@/components/ui/Bits";
import { getStaffRoute } from "@/lib/data/nama-staff";

type Props = { searchParams: Promise<{ branch?: string }> };

/** Staff screen 2: record a collection at one branch (opened from a stop on the route). */
export default async function CollectPage({ searchParams }: Props) {
  const [res, { branch }] = await Promise.all([getStaffRoute(), searchParams]);
  if (!res.ok) return <KNotice>{res.error}</KNotice>;
  const stops = res.data.stops;
  const start = stops.find((s) => String(s.branchId) === branch) ?? stops.find((s) => !s.collected) ?? stops[0];

  return (
    <>
      <KitchenHeader restaurant="Nama staff" />
      <ScreenHeader title="Collect" subtitle="Weigh on the truck scale, grade the load, save." />
      {start ? <CollectForm key={start.branchId} stops={stops} initialBranchId={start.branchId} /> : <KNotice>No branches on the route.</KNotice>}
    </>
  );
}
