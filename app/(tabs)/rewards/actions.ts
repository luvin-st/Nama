"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formatPoints } from "@/lib/format";
import { NETWORK_ERROR } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";

export type RedeemState = { error?: string } | null;

function friendly(message: string): string {
  const short = /NOT_ENOUGH:(\d+)/.exec(message);
  if (short?.[1]) return `You need ${formatPoints(Number(short[1]))} more points for this reward.`;
  if (message.includes("NO_REWARD")) return "This reward isn't available any more.";
  if (message.includes("NOT_SIGNED_IN")) return "You're signed out. Log in again to continue.";
  return "We couldn't redeem this reward. Please try again.";
}

/** Swaps points for a reward. The database checks the balance and makes the voucher code. */
export async function redeemReward(_prev: RedeemState, fd: FormData): Promise<RedeemState> {
  const rewardId = String(fd.get("reward") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(rewardId)) return { error: "This reward isn't available any more." };

  let voucherId: string;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("redeem_reward", { p_reward: rewardId });
    if (error) return { error: friendly(error.message) };
    voucherId = data;
  } catch {
    return { error: NETWORK_ERROR };
  }

  revalidatePath("/rewards");
  revalidatePath("/home");
  redirect(`/rewards/vouchers/${voucherId}?new=1`);
}
