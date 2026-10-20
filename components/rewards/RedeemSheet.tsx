"use client";

import { useActionState } from "react";
import { redeemReward, type RedeemState } from "@/app/(tabs)/rewards/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/Field";
import { Sheet } from "@/components/ui/Sheet";
import type { RewardView } from "@/lib/data/rewards";
import { formatPoints, lowerFirst } from "@/lib/format";

type Props = { reward: RewardView; balance: number; onClose: () => void };

/** Confirmation sheet before points are spent. */
export function RedeemSheet({ reward, balance, onClose }: Props) {
  const [state, action] = useActionState<RedeemState, FormData>(redeemReward, null);
  const after = balance - reward.cost;

  return (
    <Sheet open onClose={onClose} title={`Redeem ${lowerFirst(reward.title)}?`}>
      <p className="text-center text-[15px] leading-snug text-muted">
        Swap <span className="font-semibold text-ink tabular-nums">{formatPoints(reward.cost)} points</span> for a{" "}
        {lowerFirst(reward.title)} at {reward.partner}. You&apos;ll have{" "}
        <span className="tabular-nums">{formatPoints(after)}</span> points left.
      </p>
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="reward" value={reward.id} />
        <FormMessage error={state?.error} />
        <SubmitButton label="Redeem" busyLabel="Making your voucher…" />
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </form>
    </Sheet>
  );
}
