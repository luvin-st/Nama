import { createClient } from "@/lib/supabase/server";
import { fail, NETWORK_ERROR, ok, type Result } from "@/lib/result";
import type { RewardCategory } from "@/types/database";

export type RewardView = { id: string; title: string; partner: string; category: RewardCategory; cost: number };

export type VoucherView = {
  id: string;
  code: string;
  pointsSpent: number;
  createdAt: string;
  usedAt: string | null;
  reward: { title: string; partner: string };
};

export type RewardsPage = { balance: number; rewards: RewardView[]; vouchers: VoucherView[] };

const VOUCHER_SELECT = "id, code, points_spent, created_at, used_at, reward:rewards(title, partner)";

type VoucherRow = {
  id: string;
  code: string;
  points_spent: number;
  created_at: string;
  used_at: string | null;
  reward: { title: string; partner: string } | null;
};

function toVoucher(v: VoucherRow): VoucherView {
  return {
    id: v.id,
    code: v.code,
    pointsSpent: v.points_spent,
    createdAt: v.created_at,
    usedAt: v.used_at,
    reward: { title: v.reward?.title ?? "Reward", partner: v.reward?.partner ?? "Nama' partner" },
  };
}

/** Balance, active rewards (cheapest first) and your vouchers (newest first). */
export async function getRewardsPage(): Promise<Result<RewardsPage>> {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return fail("You're signed out. Log in again to continue.");

    const [summary, rewards, vouchers] = await Promise.all([
      supabase.rpc("get_my_summary"),
      supabase.from("rewards").select("id, title, partner, category, points_cost").eq("active", true).order("points_cost"),
      supabase
        .from("redemptions")
        .select(VOUCHER_SELECT)
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false })
        .limit(20)
        .overrideTypes<VoucherRow[], { merge: false }>(),
    ]);

    if (summary.error) return fail("We couldn't load your points. Please try again.");
    if (rewards.error) return fail("We couldn't load the rewards. Please try again.");
    if (vouchers.error) return fail("We couldn't load your vouchers. Please try again.");

    return ok({
      balance: summary.data[0]?.points ?? 0,
      rewards: rewards.data.map((r) => ({ id: r.id, title: r.title, partner: r.partner, category: r.category, cost: r.points_cost })),
      vouchers: vouchers.data.map(toVoucher),
    });
  } catch {
    return fail(NETWORK_ERROR);
  }
}

/** One of your vouchers. `ok(null)` means it doesn't exist (or isn't yours). */
export async function getVoucher(id: string): Promise<Result<VoucherView | null>> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return ok(null);
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return fail("You're signed out. Log in again to continue.");
    const { data, error } = await supabase
      .from("redemptions")
      .select(VOUCHER_SELECT)
      .eq("id", id)
      .eq("user_id", auth.user.id)
      .overrideTypes<VoucherRow[], { merge: false }>();
    if (error) return fail("We couldn't load this voucher. Please try again.");
    const row = data[0];
    return ok(row ? toVoucher(row) : null);
  } catch {
    return fail(NETWORK_ERROR);
  }
}
