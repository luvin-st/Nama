import { createClient } from "@/lib/supabase/server";
import { fail, NETWORK_ERROR, ok, type Result } from "@/lib/result";
import type { DepositStatus } from "@/types/database";

export type Summary = { points: number; streakWeeks: number; monthKg: number; pendingCount: number };
export type NextReward = { title: string; cost: number } | null;
export type RecentDrop = {
  id: string;
  kg: number | null;
  points: number;
  status: DepositStatus;
  createdAt: string;
  building: string;
};
export type HomeData = { summary: Summary; nextReward: NextReward; drops: RecentDrop[] };

/** Everything the Home screen needs, loaded in parallel. */
export async function getHomeData(): Promise<Result<HomeData>> {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return fail("You're signed out. Log in again to continue.");

    const [summaryRes, rewardsRes, dropsRes] = await Promise.all([
      supabase.rpc("get_my_summary"),
      supabase.from("rewards").select("title, points_cost").eq("active", true).order("points_cost"),
      supabase
        .from("deposits")
        .select("id, weight_kg, points, status, created_at, bin:bins(building:buildings(name))")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    if (summaryRes.error) return fail("We couldn't load your points. Please try again.");
    if (rewardsRes.error || dropsRes.error) return fail("We couldn't load your latest activity. Please try again.");

    const row = summaryRes.data[0];
    const summary: Summary = {
      points: row?.points ?? 0,
      streakWeeks: row?.streak_weeks ?? 0,
      monthKg: Number(row?.month_kg ?? 0),
      pendingCount: row?.pending_count ?? 0,
    };

    const next = rewardsRes.data.find((r) => r.points_cost > summary.points);
    const drops: RecentDrop[] = dropsRes.data.map((d) => ({
      id: d.id,
      kg: d.weight_kg === null ? null : Number(d.weight_kg),
      points: d.points,
      status: d.status,
      createdAt: d.created_at,
      building: d.bin?.building?.name ?? "Your building",
    }));

    return ok({ summary, nextReward: next ? { title: next.title, cost: next.points_cost } : null, drops });
  } catch {
    return fail(NETWORK_ERROR);
  }
}
