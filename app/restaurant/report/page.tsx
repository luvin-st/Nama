import { KitchenHeader, KitchenTitle, KNotice } from "@/components/restaurant/KitchenShell";
import { BranchLeaderboard, BranchSplit, ReportHero, TipCard, WasteTypeSplit } from "@/components/restaurant/ReportParts";
import { ResetDemo } from "@/components/restaurant/ResetDemo";
import { getKitchenDashboard } from "@/lib/data/kitchen";

/** Screen 3: what the owner sees. */
export default async function OwnerReportPage() {
  const res = await getKitchenDashboard();
  if (!res.ok) return <KNotice>{res.error}</KNotice>;
  const d = res.data;
  const totalKg = d.branches.reduce((sum, b) => sum + b.monthKg, 0);
  const month = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", month: "long", year: "numeric" }).format(new Date());

  return (
    <>
      <KitchenHeader restaurant={d.restaurant} />
      <KitchenTitle title="Owner report" sub={month} />
      <ReportHero totalKg={totalKg} aedPerKg={d.aedPerKg} branchCount={d.branches.length} logCount={d.logCount} />
      <WasteTypeSplit byType={d.byType} aedPerKg={d.aedPerKg} />
      <BranchSplit branches={d.branches} aedPerKg={d.aedPerKg} />
      <BranchLeaderboard branches={d.branches} />
      <TipCard tip={d.tip} />
      <ResetDemo />
    </>
  );
}
