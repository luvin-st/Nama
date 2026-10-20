import type { Metadata } from "next";
import { BackBar } from "@/components/auth/BackBar";
import { VoucherCard } from "@/components/rewards/VoucherCard";
import { Notice } from "@/components/ui/Bits";
import { LinkButton } from "@/components/ui/Button";
import { getVoucher } from "@/lib/data/rewards";

export const metadata: Metadata = { title: "Voucher · Nama'" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ new?: string }> };

export default async function VoucherPage({ params, searchParams }: Props) {
  const [{ id }, search] = await Promise.all([params, searchParams]);
  const res = await getVoucher(id);

  return (
    <>
      <BackBar href="/rewards" title="Voucher" />
      {!res.ok || !res.data ? (
        <div className="rounded-[14px] bg-card">
          <Notice tone="error">{res.ok ? "We couldn't find this voucher." : res.error}</Notice>
        </div>
      ) : (
        <>
          {search.new ? (
            <p role="status" className="rounded-[14px] bg-lime px-4 py-3 text-center text-[15px] font-semibold text-lime-ink">
              Reward redeemed · {res.data.pointsSpent} points spent
            </p>
          ) : null}
          <VoucherCard voucher={res.data} />
          <LinkButton href="/rewards" variant="tint">
            Back to Rewards
          </LinkButton>
        </>
      )}
    </>
  );
}
