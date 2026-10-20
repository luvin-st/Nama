import type { Metadata } from "next";
import { BalanceHeader } from "@/components/rewards/BalanceHeader";
import { RewardList } from "@/components/rewards/RewardList";
import { VoucherList } from "@/components/rewards/VoucherList";
import { Notice, ScreenHeader } from "@/components/ui/Bits";
import { getRewardsPage } from "@/lib/data/rewards";

export const metadata: Metadata = { title: "Rewards · Nama'" };

export default async function RewardsPage() {
  const res = await getRewardsPage();

  return (
    <>
      <ScreenHeader title="Rewards" subtitle="From local grocers, bakeries and cafés" />
      {res.ok ? (
        <>
          <BalanceHeader balance={res.data.balance} />
          <RewardList rewards={res.data.rewards} balance={res.data.balance} />
          <VoucherList vouchers={res.data.vouchers} />
        </>
      ) : (
        <div className="rounded-[14px] bg-card">
          <Notice tone="error">{res.error}</Notice>
        </div>
      )}
    </>
  );
}
