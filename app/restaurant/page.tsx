import { KitchenHeader, KNotice } from "@/components/restaurant/KitchenShell";
import { LogBinForm } from "@/components/restaurant/LogBinForm";
import { ScannedBanner } from "@/components/restaurant/ScannedBanner";
import { ScreenHeader } from "@/components/ui/Bits";
import { getKitchenDashboard } from "@/lib/data/kitchen";

type Props = { searchParams: Promise<{ branch?: string }> };

/** Screen 1: kitchen staff log a bin. Opened from a bin's QR sticker, the branch is already picked. */
export default async function LogBinPage({ searchParams }: Props) {
  const [res, { branch }] = await Promise.all([getKitchenDashboard(), searchParams]);
  if (!res.ok) return <KNotice>{res.error}</KNotice>;
  const d = res.data;
  const scanned = d.branches.find((b) => String(b.id) === branch) ?? null;

  return (
    <>
      <KitchenHeader restaurant={d.restaurant} />
      <ScreenHeader title="Log a bin" subtitle="Weigh the bin, pick the type, save." />
      {scanned ? <ScannedBanner branch={scanned.name} /> : null}
      <LogBinForm
        key={scanned?.id ?? "none"}
        branches={d.branches.map((b) => ({ id: b.id, name: b.name }))}
        initialBranchId={scanned?.id ?? null}
        recentLogs={d.recentLogs}
      />
    </>
  );
}
