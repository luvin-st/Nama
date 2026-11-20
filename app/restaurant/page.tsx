import { KitchenHeader, KitchenTitle, KNotice } from "@/components/restaurant/KitchenShell";
import { LogBinForm } from "@/components/restaurant/LogBinForm";
import { RecentLogs } from "@/components/restaurant/RecentLogs";
import { getKitchenDashboard } from "@/lib/data/kitchen";

/** Screen 1: kitchen staff log a bin. */
export default async function LogBinPage() {
  const res = await getKitchenDashboard();
  if (!res.ok) return <KNotice>{res.error}</KNotice>;
  const d = res.data;

  return (
    <>
      <KitchenHeader restaurant={d.restaurant} />
      <KitchenTitle title="Log a bin" sub="Weigh the bin, pick the type, save." />
      <LogBinForm branches={d.branches.map((b) => ({ id: b.id, name: b.name }))} />
      <RecentLogs logs={d.recentLogs} />
    </>
  );
}
